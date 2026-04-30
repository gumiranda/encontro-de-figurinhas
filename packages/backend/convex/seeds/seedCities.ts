import { internalMutation } from "../_generated/server";
import citiesData from "./cities-data.json";
import citiesExtraData from "./cities-extra-data.json";

export const seedCities = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("cities").first();
    if (existing) {
      console.log("Cities already seeded, skipping...");
      return { skipped: true, count: 0 };
    }

    let count = 0;
    for (const city of citiesData) {
      await ctx.db.insert("cities", {
        name: city.name,
        state: city.state,
        slug: city.slug,
        lat: city.lat,
        lng: city.lng,
      });
      count++;
    }

    console.log(`Seeded ${count} cities`);
    return { skipped: false, count };
  },
});

export const seedCitiesExtra = internalMutation({
  args: {},
  handler: async (ctx) => {
    let count = 0;
    let skipped = 0;

    for (const city of citiesExtraData) {
      const existing = await ctx.db
        .query("cities")
        .withIndex("by_slug", (q) => q.eq("slug", city.slug))
        .first();

      if (existing) {
        skipped++;
        continue;
      }

      await ctx.db.insert("cities", {
        name: city.name,
        state: city.state,
        slug: city.slug,
        lat: city.lat,
        lng: city.lng,
      });
      count++;
    }

    console.log(`Seeded ${count} extra cities, skipped ${skipped} existing`);
    return { added: count, skipped };
  },
});
