import { v } from "convex/values";
import { query } from "./_generated/server";

export const getSections = query({
  args: {},
  handler: async (ctx) => {
    const config = await ctx.db.query("albumConfig").first();
    if (!config) return [];

    return config.sections
      .filter((s) => !s.isExtra)
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
    for (let i = 1; i <= config.totalStickers; i++) {
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
