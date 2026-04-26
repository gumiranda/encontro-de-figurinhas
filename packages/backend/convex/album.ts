import { v } from "convex/values";
import { query } from "./_generated/server";
import { relativeFromAbsolute } from "./lib/stickerNumbering";

/** `totalStickers` = quantidade; números absolutos válidos: 0 .. totalStickers - 1. */
export const getPublicAlbumCount = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return { totalStickers: 0, maxAbsolute: -1 };
    const t = config.totalStickers;
    return { totalStickers: t, maxAbsolute: t - 1 };
  },
});

export const getSections = query({
  args: { includeExtras: v.optional(v.boolean()) },
  handler: async (ctx, { includeExtras }) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return [];

    return config.sections
      .filter((s) => includeExtras || !s.isExtra)
      .map((s) => ({
        name: s.name,
        code: s.code,
        slug: s.code.toLowerCase(),
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
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return null;

    const section = config.sections.find(
      (s) => s.code.toLowerCase() === slug.toLowerCase() && !s.isExtra
    );
    if (!section) return null;

    return {
      name: section.name,
      code: section.code,
      slug: section.code.toLowerCase(),
      flagEmoji: section.flagEmoji,
      startNumber: section.startNumber,
      endNumber: section.endNumber,
      stickerCount: section.endNumber - section.startNumber + 1,
      goldenNumbers: section.goldenNumbers ?? [],
      legendNumbers: section.legendNumbers ?? [],
      totalAlbumStickers: config.totalStickers,
      year: config.year,
    };
  },
});

export const getAllSectionSlugs = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return [];

    return config.sections
      .filter((s) => !s.isExtra)
      .map((s) => s.code.toLowerCase());
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return [];

    return config.sections
      .filter((s) => !s.isExtra)
      .map((s) => ({
        slug: s.code.toLowerCase(),
        name: s.name,
      }));
  },
});

export const getStickerByNumber = query({
  args: { number: v.number() },
  handler: async (ctx, { number }) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return null;

    const section = config.sections.find(
      (s) => number >= s.startNumber && number <= s.endNumber
    );
    if (!section) return null;

    const isGolden = section.goldenNumbers?.includes(number) ?? false;
    const legend = section.legendNumbers?.find((l) => l.number === number);

    return {
      number,
      teamName: section.name,
      teamCode: section.code,
      teamSlug: section.code.toLowerCase(),
      flagEmoji: section.flagEmoji,
      teamStartNumber: section.startNumber,
      teamEndNumber: section.endNumber,
      relativeNum: relativeFromAbsolute(number, section),
      isGolden,
      isLegend: !!legend,
      legendName: legend?.name,
      totalStickers: config.totalStickers,
    };
  },
});

export const getAllStickerNumbers = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return [];

    const numbers: number[] = [];
    for (let i = 0; i < config.totalStickers; i++) {
      numbers.push(i);
    }
    return numbers;
  },
});

export const listStickersForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return [];

    const stickers: Array<{
      number: number;
      teamCode: string;
      isSpecial: boolean;
    }> = [];

    for (const section of config.sections) {
      const goldenSet = new Set(section.goldenNumbers ?? []);
      const legendSet = new Set(
        (section.legendNumbers ?? []).map((l) => l.number)
      );

      for (let n = section.startNumber; n <= section.endNumber; n++) {
        stickers.push({
          number: n,
          teamCode: section.code,
          isSpecial: goldenSet.has(n) || legendSet.has(n),
        });
      }
    }

    return stickers;
  },
});

export const getRelatedStickers = query({
  args: { number: v.number(), limit: v.optional(v.number()) },
  handler: async (ctx, { number, limit = 8 }) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return null;

    const section = config.sections.find(
      (s) => number >= s.startNumber && number <= s.endNumber
    );
    if (!section) return null;

    const goldenSet = new Set(section.goldenNumbers ?? []);
    const legendMap = new Map(
      (section.legendNumbers ?? []).map((l) => [l.number, l.name])
    );

    const allNumbers: number[] = [];
    for (let n = section.startNumber; n <= section.endNumber; n++) {
      if (n !== number) allNumbers.push(n);
    }

    const specialNumbers = allNumbers.filter(
      (n) => goldenSet.has(n) || legendMap.has(n)
    );
    const regularNumbers = allNumbers.filter(
      (n) => !goldenSet.has(n) && !legendMap.has(n)
    );

    const selectedNumbers = [
      ...specialNumbers.slice(0, Math.min(3, limit)),
      ...regularNumbers.slice(0, limit - Math.min(3, specialNumbers.length)),
    ].slice(0, limit);

    return {
      teamName: section.name,
      teamCode: section.code,
      teamSlug: section.code.toLowerCase(),
      flagEmoji: section.flagEmoji,
      stickers: selectedNumbers.map((n) => ({
        number: n,
        relativeNum: relativeFromAbsolute(n, section),
        isGolden: goldenSet.has(n),
        isLegend: legendMap.has(n),
        legendName: legendMap.get(n),
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

    const normalized = searchQuery
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");

    // Full scan - Convex has no LIKE/contains. For production scale, use Meilisearch.
    // ~1k docs is small enough for full scan + JS filter.
    const all = await ctx.db.query("stickerDetail").collect();

    return all
      .filter((r) => r.nameNormalized.includes(normalized))
      .slice(0, 20);
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

export const getAllStickerDetails = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("stickerDetail").collect();
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
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return null;

    const section = config.sections.find(
      (s) => s.code.toLowerCase() === code.toLowerCase()
    );
    if (!section) return null;

    return {
      name: section.name,
      code: section.code,
      slug: section.code.toLowerCase(),
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
      .collect();

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
    // Try stickerDetail first (O(1) lookup with denormalized data)
    const detail = await ctx.db
      .query("stickerDetail")
      .withIndex("by_absolute", (q) => q.eq("absoluteNum", number))
      .first();

    if (detail) {
      // Fast path: use denormalized data
      const config = await ctx.db.query("albumConfig").first();
      const section = config?.sections.find(
        (s) => number >= s.startNumber && number <= s.endNumber
      );

      return {
        number,
        teamName: detail.sectionName,
        teamCode: detail.sectionCode,
        teamSlug: detail.sectionCode.toLowerCase(),
        flagEmoji: detail.flagEmoji,
        teamStartNumber: section?.startNumber ?? 0,
        teamEndNumber: section?.endNumber ?? 0,
        relativeNum: detail.relativeNum,
        isGolden: section?.goldenNumbers?.includes(number) ?? false,
        isLegend: section?.legendNumbers?.some((l) => l.number === number) ?? false,
        legendName: section?.legendNumbers?.find((l) => l.number === number)?.name,
        totalStickers: config?.totalStickers ?? 0,
        playerName: detail.name,
        stickerType: detail.type,
        variant: detail.variant,
        slug: detail.slug,
      };
    }

    // Fallback: use albumConfig (for stickers not yet in stickerDetail table)
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return null;

    const section = config.sections.find(
      (s) => number >= s.startNumber && number <= s.endNumber
    );
    if (!section) return null;

    const isGolden = section.goldenNumbers?.includes(number) ?? false;
    const legend = section.legendNumbers?.find((l) => l.number === number);

    return {
      number,
      teamName: section.name,
      teamCode: section.code,
      teamSlug: section.code.toLowerCase(),
      flagEmoji: section.flagEmoji,
      teamStartNumber: section.startNumber,
      teamEndNumber: section.endNumber,
      relativeNum: relativeFromAbsolute(number, section),
      isGolden,
      isLegend: !!legend,
      legendName: legend?.name,
      totalStickers: config.totalStickers,
      playerName: undefined,
      stickerType: undefined,
      variant: undefined,
      slug: undefined,
    };
  },
});
