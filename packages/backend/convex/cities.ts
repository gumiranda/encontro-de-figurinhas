import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, { query }) => {
    const normalized = query.trim();
    if (normalized.length < 2) return [];

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
    const cities = await ctx.db.query("cities").take(500);
    const activeCities = cities.filter((c) => c.isActive !== false);

    if (activeCities.length > 400) {
      console.warn(`cities.getAll: ${activeCities.length} `);
    }

    return activeCities.map((c) => ({
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
