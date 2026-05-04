import { v } from "convex/values";
import { query } from "./_generated/server";
import { readSiteStatsOrNull } from "./siteStats";
import { relativeFromAbsolute } from "./lib/stickerNumbering";

/** `totalStickers` = quantidade; números absolutos válidos: 0 .. totalStickers - 1. */
export const getPublicAlbumCount = query({
  args: {},
  handler: async (ctx) => {
    const stats = await readSiteStatsOrNull(ctx);
    const t = stats?.totalStickers ?? 0;
    return { totalStickers: t, maxAbsolute: t - 1 };
  },
});

export const getSections = query({
  args: { includeExtras: v.optional(v.boolean()) },
  handler: async (ctx, { includeExtras }) => {
    const sections = includeExtras
      ? await ctx.db.query("albumSections").collect()
      : await ctx.db
          .query("albumSections")
          .withIndex("by_isExtra", (q) => q.eq("isExtra", false))
          .collect();

    return sections.map((s) => ({
      name: s.name,
      code: s.code,
      slug: s.slug,
      flagEmoji: s.flagEmoji,
      startNumber: s.startNumber,
      endNumber: s.endNumber,
      stickerCount: s.endNumber - s.startNumber + 1,
      goldenNumbers: s.goldenNumbers ?? [],
      legendNumbers: s.legendNumbers ?? [],
    }));
  },
});

export const getSectionBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const section = await ctx.db
      .query("albumSections")
      .withIndex("by_slug", (q) => q.eq("slug", slug.toLowerCase()))
      .first();
    if (!section || section.isExtra) return null;

    const stats = await readSiteStatsOrNull(ctx);

    return {
      name: section.name,
      code: section.code,
      slug: section.slug,
      flagEmoji: section.flagEmoji,
      startNumber: section.startNumber,
      endNumber: section.endNumber,
      stickerCount: section.endNumber - section.startNumber + 1,
      goldenNumbers: section.goldenNumbers ?? [],
      legendNumbers: section.legendNumbers ?? [],
      totalAlbumStickers: stats?.totalStickers ?? 0,
      year: section.year,
    };
  },
});

export const getAllSectionSlugs = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("albumSections")
      .withIndex("by_isExtra", (q) => q.eq("isExtra", false))
      .collect();
    return sections.map((s) => s.slug);
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const sections = await ctx.db
      .query("albumSections")
      .withIndex("by_isExtra", (q) => q.eq("isExtra", false))
      .collect();
    return sections.map((s) => ({
      slug: s.slug,
      name: s.name,
    }));
  },
});

export const getStickerByNumber = query({
  args: { number: v.number() },
  handler: async (ctx, { number }) => {
    const detail = await ctx.db
      .query("stickerDetail")
      .withIndex("by_absolute", (q) => q.eq("absoluteNum", number))
      .first();
    if (!detail) return null;

    const section = await ctx.db
      .query("albumSections")
      .withIndex("by_code", (q) => q.eq("code", detail.sectionCode))
      .first();

    const stats = await readSiteStatsOrNull(ctx);

    return {
      number,
      teamName: detail.sectionName,
      teamCode: detail.sectionCode,
      teamSlug: detail.sectionCode.toLowerCase(),
      flagEmoji: detail.flagEmoji,
      teamStartNumber: section?.startNumber ?? 0,
      teamEndNumber: section?.endNumber ?? 0,
      relativeNum: detail.relativeNum,
      isGolden: detail.isGolden ?? false,
      isLegend: detail.isLegend ?? false,
      legendName: detail.legendName,
      totalStickers: stats?.totalStickers ?? 0,
    };
  },
});

export const getAllStickerNumbers = query({
  args: {},
  handler: async (ctx) => {
    const stats = await readSiteStatsOrNull(ctx);
    const total = stats?.totalStickers ?? 0;
    if (total === 0) return [];

    const numbers: number[] = [];
    for (let i = 0; i < total; i++) {
      numbers.push(i);
    }
    return numbers;
  },
});

export const getRelatedStickers = query({
  args: { number: v.number(), limit: v.optional(v.number()) },
  handler: async (ctx, { number, limit = 8 }) => {
    const current = await ctx.db
      .query("stickerDetail")
      .withIndex("by_absolute", (q) => q.eq("absoluteNum", number))
      .first();
    if (!current) return null;

    const section = await ctx.db
      .query("albumSections")
      .withIndex("by_code", (q) => q.eq("code", current.sectionCode))
      .first();
    if (!section) return null;

    const allStickers = await ctx.db
      .query("stickerDetail")
      .withIndex("by_section_rel", (q) => q.eq("sectionCode", current.sectionCode))
      .take(50);

    const others = allStickers.filter((s) => s.absoluteNum !== number);

    const isSpecial = (s: typeof others[0]) =>
      (s.isGolden ?? false) || (s.isLegend ?? false) || (s.variant ?? "base") !== "base";

    const specials = others.filter(isSpecial);
    const regulars = others.filter((s) => !isSpecial(s));

    const selected = [
      ...specials.slice(0, Math.min(3, limit)),
      ...regulars.slice(0, limit - Math.min(3, specials.length)),
    ].slice(0, limit);

    return {
      teamName: section.name,
      teamCode: section.code,
      teamSlug: section.slug,
      flagEmoji: section.flagEmoji,
      stickers: selected.map((s) => ({
        number: s.absoluteNum,
        relativeNum: s.relativeNum,
        isGolden: s.isGolden ?? false,
        isLegend: s.isLegend ?? false,
        legendName: s.legendName,
      })),
    };
  },
});

// --- Sticker Detail Queries (O(1) lookup from stickerDetail table) ---

export const getStickerDetail = query({
  args: { absoluteNum: v.number() },
  handler: async (ctx, { absoluteNum }) => {
    return await ctx.db
      .query("stickerDetail")
      .withIndex("by_absolute", (q) => q.eq("absoluteNum", absoluteNum))
      .first();
  },
});

export const getStickerDetailBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("stickerDetail")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const searchStickersByName = query({
  args: { searchQuery: v.string() },
  handler: async (ctx, { searchQuery }) => {
    if (searchQuery.length < 2) return [];

    const results = await ctx.db
      .query("stickerDetail")
      .withSearchIndex("search_name", (q) => q.search("name", searchQuery))
      .take(20);

    return results;
  },
});

export const searchStickersByVariant = query({
  args: { variant: v.union(v.literal("base"), v.literal("bronze"), v.literal("prata"), v.literal("ouro")) },
  handler: async (ctx, { variant }) => {
    return await ctx.db
      .query("stickerDetail")
      .withIndex("by_variant", (q) => q.eq("variant", variant))
      .take(100);
  },
});

export const getAllStickerDetailsForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const details = await ctx.db.query("stickerDetail").collect();
    return details.map((d) => ({
      slug: d.slug,
      absoluteNum: d.absoluteNum,
      sectionCode: d.sectionCode,
      sectionName: d.sectionName,
      relativeNum: d.relativeNum,
      name: d.name,
    }));
  },
});

export const getSectionByCode = query({
  args: { code: v.string() },
  handler: async (ctx, { code }) => {
    const section = await ctx.db
      .query("albumSections")
      .withIndex("by_code", (q) => q.eq("code", code.toUpperCase()))
      .first();
    if (!section) return null;

    return {
      name: section.name,
      code: section.code,
      slug: section.slug,
      flagEmoji: section.flagEmoji,
      startNumber: section.startNumber,
      endNumber: section.endNumber,
      stickerCount: section.endNumber - section.startNumber + 1,
      goldenNumbers: section.goldenNumbers ?? [],
      legendNumbers: section.legendNumbers ?? [],
      isExtra: section.isExtra ?? false,
    };
  },
});

export const getTeamStickers = query({
  args: { sectionCode: v.string() },
  handler: async (ctx, { sectionCode }) => {
    const stickers = await ctx.db
      .query("stickerDetail")
      .withIndex("by_section_rel", (q) => q.eq("sectionCode", sectionCode.toUpperCase()))
      .take(50);

    return stickers
      .sort((a, b) => a.relativeNum - b.relativeNum)
      .map((s) => ({
        absoluteNum: s.absoluteNum,
        relativeNum: s.relativeNum,
        name: s.name,
        slug: s.slug,
        type: s.type,
        variant: s.variant,
      }));
  },
});

export const getStickerWithDetail = query({
  args: { number: v.number() },
  handler: async (ctx, { number }) => {
    const detail = await ctx.db
      .query("stickerDetail")
      .withIndex("by_absolute", (q) => q.eq("absoluteNum", number))
      .first();

    if (!detail) return null;

    const section = await ctx.db
      .query("albumSections")
      .withIndex("by_code", (q) => q.eq("code", detail.sectionCode))
      .first();

    const stats = await readSiteStatsOrNull(ctx);

    return {
      number,
      teamName: detail.sectionName,
      teamCode: detail.sectionCode,
      teamSlug: detail.sectionCode.toLowerCase(),
      flagEmoji: detail.flagEmoji,
      teamStartNumber: section?.startNumber ?? 0,
      teamEndNumber: section?.endNumber ?? 0,
      relativeNum: detail.relativeNum,
      isGolden: detail.isGolden ?? false,
      isLegend: detail.isLegend ?? false,
      legendName: detail.legendName,
      totalStickers: stats?.totalStickers ?? 0,
      playerName: detail.name,
      stickerType: detail.type,
      variant: detail.variant,
      slug: detail.slug,
    };
  },
});
