import { mutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { makeFunctionReference, type FunctionReference } from "convex/server";
import { isAdmin } from "./lib/auth";
import albumData from "../data/album-2026.json";
import { seedBlogPostsHandler } from "./seedBlog";

const seedStickerDetails = makeFunctionReference(
  "seedAlbumConfig:seedStickerDetails"
) as unknown as FunctionReference<
  "mutation",
  "internal",
  { startIdx: number; retryCount?: number },
  unknown
>;

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    // Admin auth check
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const results: Record<string, unknown> = {};

    // 1. Seed cities
    try {
      await ctx.scheduler.runAfter(0, internal.seeds.seedCities.seedCities, {});
      results.cities = "scheduled";
    } catch (e) {
      results.cities = { error: String(e) };
    }

    // 2. Seed trade points
    try {
      await ctx.scheduler.runAfter(100, internal.seeds.seedTradePoints.seedTradePoints, {});
      results.tradePoints = "scheduled";
    } catch (e) {
      results.tradePoints = { error: String(e) };
    }

    // 3. Seed album config (runs inline since it schedules its own chunked work)
    try {
      const albumConfig = await ctx.db.query("albumConfig").first();
      if (albumConfig) {
        results.albumConfig = "already exists";
      } else {
        await ctx.scheduler.runAfter(200, seedStickerDetails, { startIdx: 0 });
        results.albumConfig = "scheduled";
      }
    } catch (e) {
      results.albumConfig = { error: String(e) };
    }

    // 4. Seed boring game
    try {
      await ctx.scheduler.runAfter(300, internal.seedBoringGame.seedBoringGame, {});
      results.boringGame = "scheduled";
    } catch (e) {
      results.boringGame = { error: String(e) };
    }

    // 5. Seed blog posts (inline — lightweight)
    try {
      const blogResult = await seedBlogPostsHandler(ctx);
      results.blog = blogResult;
    } catch (e) {
      results.blog = { error: String(e) };
    }

    return { ok: true, results };
  },
});

export const seedAlbum = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const existing = await ctx.db.query("albumConfig").first();

    // Process sections
    const sections = albumData.sections.map((s: { code: string; name: string; startNumber: number; endNumber: number; flagEmoji?: string; isExtra?: boolean; stickers?: Array<{ rel: number; name: string; type?: string; variant?: string }> }) => ({
      name: s.name,
      code: s.code,
      startNumber: s.startNumber,
      endNumber: s.endNumber,
      isExtra: s.isExtra ?? false,
      flagEmoji: s.flagEmoji ?? "",
      goldenNumbers: s.isExtra ? [] : [s.startNumber + 9, s.endNumber],
      legendNumbers: [] as { number: number; name: string }[],
      stickerDetails: (s.stickers ?? []).map((st) => ({
        rel: st.rel,
        name: st.name.slice(0, 100),
        type: st.type as "escudo" | "player" | "team_photo" | "special" | undefined,
        variant: st.variant as "base" | "bronze" | "prata" | "ouro" | undefined,
      })),
    }));

    if (existing) {
      await ctx.db.patch(existing._id, {
        totalStickers: albumData.totalStickers,
        version: albumData.version,
        year: albumData.year,
        sections,
      });
    } else {
      await ctx.db.insert("albumConfig", {
        totalStickers: albumData.totalStickers,
        version: albumData.version,
        year: albumData.year,
        sections,
      });
    }

    // Schedule sticker details population
    await ctx.scheduler.runAfter(0, seedStickerDetails, { startIdx: 0 });

    return { ok: true, action: existing ? "updated" : "created", version: albumData.version };
  },
});

export const seedBlog = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    if (!user || !isAdmin(user.role)) throw new Error("Admin required");

    const result = await seedBlogPostsHandler(ctx);
    return { ok: true, result };
  },
});
