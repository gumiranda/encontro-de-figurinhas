import { internalMutation } from "../_generated/server";
import citiesExtraData from "./cities-extra-data.json";

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
