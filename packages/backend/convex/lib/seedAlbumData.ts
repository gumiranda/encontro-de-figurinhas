import type { MutationCtx } from "../_generated/server";
import albumData from "../../data/album-2026.json";
import { ensureSiteStats } from "../siteStats";

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

function defaultGolden(start: number, end: number): number[] {
  const ten = start + 9;
  const last = end;
  return [ten, last];
}

export async function seedAlbumData(ctx: MutationCtx) {
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

  // Clear and repopulate albumSections
  const existingSections = await ctx.db.query("albumSections").collect();
  for (const s of existingSections) {
    await ctx.db.delete(s._id);
  }

  for (const s of sections) {
    await ctx.db.insert("albumSections", {
      name: s.name,
      code: s.code,
      slug: s.code.toLowerCase(),
      flagEmoji: s.flagEmoji ?? "",
      startNumber: s.startNumber,
      endNumber: s.endNumber,
      isExtra: s.isExtra ?? false,
      year: albumData.year,
      relStart: s.relStart,
      goldenNumbers: s.isExtra ? [] : defaultGolden(s.startNumber, s.endNumber),
      legendNumbers: [] as { number: number; name: string }[],
    });
  }

  // Seed stickerDetails inline
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
    isGolden: boolean;
    isLegend: boolean;
    legendName?: string;
    isExtra: boolean;
  }> = [];

  for (const section of sections) {
    const stickerDetails = section.stickers ?? [];
    const minRel = stickerDetails.length > 0
      ? Math.min(...stickerDetails.map((s) => s.rel))
      : 1;

    const goldenSet = new Set(
      section.isExtra ? [] : defaultGolden(section.startNumber, section.endNumber)
    );
    const legendMap = new Map<number, string>();

    for (const st of stickerDetails) {
      const absoluteNum = section.startNumber + (st.rel - minRel);
      allStickers.push({
        sectionCode: section.code,
        sectionName: section.name,
        flagEmoji: section.flagEmoji ?? "",
        relativeNum: st.rel,
        absoluteNum,
        name: sanitizeName(st.name),
        nameNormalized: normalize(st.name),
        slug: `${slugify(st.name)}-${section.code.toLowerCase()}-${st.rel}`,
        type: (st.type as StickerType) ?? undefined,
        variant: (st.variant as Variant) ?? undefined,
        displayCode: st.displayCode,
        isGolden: goldenSet.has(absoluteNum),
        isLegend: legendMap.has(absoluteNum),
        legendName: legendMap.get(absoluteNum),
        isExtra: section.isExtra ?? false,
      });
    }
  }

  // Update siteStats
  const stats = await ensureSiteStats(ctx);
  const specialNumbers = allStickers
    .filter((s) => s.isGolden || s.isLegend || s.isExtra)
    .map((s) => s.absoluteNum);
  await ctx.db.patch(stats._id, {
    totalStickers: albumData.totalStickers,
    albumYear: albumData.year,
    specialNumbers,
  });

  for (const sticker of allStickers) {
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

  return { action: "seeded", totalStickers: allStickers.length, version: albumData.version };
}
