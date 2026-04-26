import { internalMutation, mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import albumData from "../data/album-2026.json";
import { isAdmin } from "./lib/auth";

const CHUNK_SIZE = 100;

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function normalize(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

function sanitizeName(name: string): string {
  return name
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, 100);
}

type StickerType = "escudo" | "player" | "team_photo" | "special";
type Variant = "base" | "bronze" | "prata" | "ouro";

interface RawSticker {
  rel: number;
  name: string;
  type?: string;
  variant?: string;
  displayCode?: string;
}

interface RawSection {
  code: string;
  name: string;
  startNumber: number;
  endNumber: number;
  flagEmoji?: string;
  isExtra?: boolean;
  relStart?: number;
  stickers?: RawSticker[];
}

function defaultGolden(start: number, end: number): number[] {
  const ten = start + 9;
  const last = end;
  return [ten, last];
}

export const seedAlbumConfig = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const sections = albumData.sections as RawSection[];

    const seenKeys = new Set<string>();
    for (const section of sections) {
      for (const sticker of section.stickers ?? []) {
        const key = `${section.code}-${sticker.rel}`;
        if (seenKeys.has(key)) throw new Error(`Duplicate sticker: ${key}`);
        if (sticker.name.length > 100)
          throw new Error(`Name too long: ${key}`);
        seenKeys.add(key);
      }
    }

    const processedSections = sections.map((s) => ({
      name: s.name,
      code: s.code,
      startNumber: s.startNumber,
      endNumber: s.endNumber,
      isExtra: s.isExtra ?? false,
      flagEmoji: s.flagEmoji ?? "",
      relStart: s.relStart,
      goldenNumbers: s.isExtra ? [] : defaultGolden(s.startNumber, s.endNumber),
      legendNumbers: [] as { number: number; name: string }[],
      stickerDetails: (s.stickers ?? []).map((st) => ({
        rel: st.rel,
        name: sanitizeName(st.name),
        type: (st.type as StickerType) ?? undefined,
        variant: (st.variant as Variant) ?? undefined,
        displayCode: st.displayCode,
      })),
    }));

    const existing = await ctx.db.query("albumConfig").first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        totalStickers: albumData.totalStickers,
        version: albumData.version,
        year: albumData.year,
        sections: processedSections,
      });
    } else {
      await ctx.db.insert("albumConfig", {
        totalStickers: albumData.totalStickers,
        version: albumData.version,
        year: albumData.year,
        sections: processedSections,
      });
    }

    await ctx.scheduler.runAfter(0, internal.seedAlbumConfig.seedStickerDetails, {
      startIdx: 0,
    });

    return { action: existing ? "updated" : "created", version: albumData.version };
  },
});

export const seedStickerDetails = internalMutation({
  args: { startIdx: v.number(), retryCount: v.optional(v.number()) },
  handler: async (ctx, { startIdx, retryCount = 0 }) => {
    const albumConfig = await ctx.db.query("albumConfig").first();
    if (!albumConfig) return { done: true, error: "No albumConfig found" };

    const allStickers: Array<{
      sectionCode: string;
      sectionName: string;
      flagEmoji: string;
      relativeNum: number;
      absoluteNum: number;
      name: string;
      nameNormalized: string;
      slug: string;
      type?: StickerType;
      variant?: Variant;
      displayCode?: string;
    }> = [];

    for (const section of albumConfig.sections) {
      const stickerDetails = section.stickerDetails ?? [];
      // Find minimum rel to handle sections where rel doesn't start at 1 (e.g., champions FWC-9 to FWC-19)
      const minRel = stickerDetails.length > 0
        ? Math.min(...stickerDetails.map(s => s.rel))
        : 1;

      for (const st of stickerDetails) {
        allStickers.push({
          sectionCode: section.code,
          sectionName: section.name,
          flagEmoji: section.flagEmoji ?? "",
          relativeNum: st.rel,
          absoluteNum: section.startNumber + (st.rel - minRel),
          name: st.name,
          nameNormalized: normalize(st.name),
          slug: `${slugify(st.name)}-${section.code.toLowerCase()}-${st.rel}`,
          type: st.type as StickerType | undefined,
          variant: st.variant as Variant | undefined,
          displayCode: st.displayCode,
        });
      }
    }

    const chunk = allStickers.slice(startIdx, startIdx + CHUNK_SIZE);

    try {
      for (const sticker of chunk) {
        const existing = await ctx.db
          .query("stickerDetail")
          .withIndex("by_absolute", (q) => q.eq("absoluteNum", sticker.absoluteNum))
          .first();

        if (existing) {
          await ctx.db.patch(existing._id, sticker);
        } else {
          await ctx.db.insert("stickerDetail", sticker);
        }
      }

      if (startIdx + CHUNK_SIZE < allStickers.length) {
        await ctx.scheduler.runAfter(0, internal.seedAlbumConfig.seedStickerDetails, {
          startIdx: startIdx + CHUNK_SIZE,
          retryCount: 0,
        });
        return { done: false, processed: chunk.length, remaining: allStickers.length - startIdx - CHUNK_SIZE };
      }

      return { done: true, totalProcessed: allStickers.length };
    } catch (error) {
      // Retry with exponential backoff (max 3 retries)
      if (retryCount < 3) {
        const backoffMs = Math.pow(2, retryCount) * 1000; // 1s, 2s, 4s
        await ctx.scheduler.runAfter(backoffMs, internal.seedAlbumConfig.seedStickerDetails, {
          startIdx,
          retryCount: retryCount + 1,
        });
        return { done: false, error: `Retry ${retryCount + 1}/3 scheduled`, startIdx };
      }
      throw error; // Re-throw after max retries
    }
  },
});
