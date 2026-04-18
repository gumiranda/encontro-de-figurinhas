import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
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

export const migrateSetCitiesActive = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db.query("cities").collect();
    let updated = 0;
    for (const city of cities) {
      if (city.isActive === undefined) {
        await ctx.db.patch(city._id, { isActive: true });
        updated++;
      }
    }
    return { updated };
  },
});
