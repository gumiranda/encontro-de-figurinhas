import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
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
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(50);

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
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    return cities.map((c) => ({
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

    const [collectors, tradePoints] = await Promise.all([
      ctx.db
        .query("users")
        .withIndex("by_city", (q) => q.eq("cityId", city._id))
        .take(10000),
      ctx.db
        .query("tradePoints")
        .withIndex("by_city_status", (q) =>
          q.eq("cityId", city._id).eq("status", "approved")
        )
        .take(1000),
    ]);

    const activeCollectors = collectors.filter(
      (u) => u.hasCompletedStickerSetup && !u.isShadowBanned && !u.isBanned
    );

    return {
      collectorsCount: activeCollectors.length,
      tradePointsCount: tradePoints.length,
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
