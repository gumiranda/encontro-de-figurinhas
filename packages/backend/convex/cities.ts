import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { rateLimiter } from "./lib/rateLimiter";

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const normalized = query.trim();
    if (normalized.length < 2 || normalized.length > 40) return [];

    // Soft rate-limit: queries não consomem tokens (read-only); .check() só verifica
    // se o bucket global ainda tem capacidade. Se não, retorna vazio para
    // reduzir carga em cenário de DoS.
    const status = await rateLimiter.check(ctx, "citiesSearch", { key: "global" });
    if (!status.ok) return [];

    const cities = await ctx.db
      .query("cities")
      .withSearchIndex("search_name", (q) => q.search("name", normalized))
      .take(15);

    return cities
      .filter((c) => c.isActive !== false)
      .slice(0, 10)
      .map((c) => ({
        _id: c._id,
        name: c.name,
        state: c.state,
      }));
  },
});

export const getById = query({
  args: { cityId: v.id("cities") },
  handler: async (ctx, { cityId }) => {
    return await ctx.db.get(cityId);
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("cities")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    // Use index for active cities; rows with omitted isActive are not returned.
    // If your seed sets isActive on all rows, this is exact. Otherwise, consider a backfill.
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);
    return cities.map((c) => ({
      _id: c._id,
      name: c.name,
      state: c.state,
      lat: c.lat,
      lng: c.lng,
    }));
  },
});

export const getAllSlugs = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    return cities.map((c) => c.slug);
  },
});

export const listTopActiveForSSG = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .order("desc")
      .take(500);
    return cities.map((c) => c.slug);
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    // Derive active cities from approved tradePoints instead of scanning 10k users.
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .take(2000);

    const activeCityIds = new Set<Id<"cities">>();
    for (const p of points) {
      activeCityIds.add(p.cityId);
    }

    if (activeCityIds.size === 0) return [];

    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    return cities
      .filter((c) => activeCityIds.has(c._id))
      .map((c) => ({
        slug: c.slug,
        updatedAt: c._creationTime,
      }));
  },
});

export const listAllGroupedByState = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    const grouped: Record<string, Array<{ name: string; slug: string }>> = {};
    for (const c of cities) {
      if (!grouped[c.state]) grouped[c.state] = [];
      grouped[c.state]!.push({ name: c.name, slug: c.slug });
    }

    return Object.entries(grouped)
      .map(([state, cities]) => ({
        state,
        cities: cities.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.state.localeCompare(b.state));
  },
});

export const getStatsBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const city = await ctx.db
      .query("cities")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();

    if (!city) return null;

    const [collectors, tradePoints, sections] = await Promise.all([
      ctx.db
        .query("users")
        .withIndex("by_city_not_shadowbanned", (q) =>
          q.eq("cityId", city._id).eq("isShadowBanned", false)
        )
        .take(5000),
      ctx.db
        .query("tradePoints")
        .withIndex("by_city_status", (q) =>
          q.eq("cityId", city._id).eq("status", "approved")
        )
        .take(1000),
      ctx.db.query("albumSections").collect(),
    ]);

    const activeCollectors = collectors.filter(
      (u) => u.hasCompletedStickerSetup === true && u.isBanned !== true
    );

    const offeredCount = new Map<number, number>();
    const wantedCount = new Map<number, number>();
    for (const u of activeCollectors) {
      for (const n of u.duplicates ?? []) {
        offeredCount.set(n, (offeredCount.get(n) ?? 0) + 1);
      }
      for (const n of u.missing ?? []) {
        wantedCount.set(n, (wantedCount.get(n) ?? 0) + 1);
      }
    }

    const formatSticker = (n: number) => {
      const section = sections.find(
        (s) => n >= s.startNumber && n <= s.endNumber
      );
      if (!section) {
        return {
          number: n,
          code: `#${n}`,
          teamName: "",
          flagEmoji: "",
        };
      }
      return {
        number: n,
        code: `${section.code}-${n - section.startNumber + 1}`,
        teamName: section.name,
        flagEmoji: section.flagEmoji ?? "",
      };
    };

    const topN = (map: Map<number, number>, limit: number) =>
      Array.from(map.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([n, count]) => ({ ...formatSticker(n), count }));

    return {
      collectorsCount: activeCollectors.length,
      tradePointsCount: tradePoints.length,
      topOffered: topN(offeredCount, 5),
      topWanted: topN(wantedCount, 5),
    };
  },
});

const MIGRATE_BATCH_SIZE = 500;

export const migrateSetCitiesActive = internalMutation({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { cursor }) => {
    const page = await ctx.db
      .query("cities")
      .paginate({ numItems: MIGRATE_BATCH_SIZE, cursor: cursor ?? null });

    let updated = 0;
    for (const city of page.page) {
      if (city.isActive === undefined) {
        await ctx.db.patch(city._id, { isActive: true });
        updated++;
      }
    }

    if (!page.isDone) {
      await ctx.scheduler.runAfter(
        0,
        internal.cities.migrateSetCitiesActive,
        { cursor: page.continueCursor }
      );
    }

    return { updated, isDone: page.isDone };
  },
});
