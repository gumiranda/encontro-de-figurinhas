import { v } from "convex/values";
import { query, internalMutation } from "./_generated/server";
import { getAuthenticatedUser } from "./lib/auth";

export const getMapView = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return { state: "needs-bootstrap" as const };

    const cityId = user.cityId;
    if (!cityId) return { state: "needs-city" as const };

    const city = await ctx.db.get(cityId);
    if (!city) {
      console.warn(`User ${user._id} has dangling cityId ${cityId}`);
      return { state: "needs-city" as const };
    }

    const rawPoints = await ctx.db
      .query("tradePoints")
      .withIndex("by_city_status", (q) =>
        q.eq("cityId", cityId).eq("status", "approved")
      )
      .take(50);

    return {
      state: "ready" as const,
      userLocation:
        user.lat != null && user.lng != null
          ? { lat: user.lat, lng: user.lng }
          : null,
      city: { lat: city.lat, lng: city.lng, name: city.name },
      points: rawPoints.map((p) => ({
        _id: p._id,
        name: p.name,
        address: p.address,
        lat: p.lat,
        lng: p.lng,
        suggestedHours: p.suggestedHours,
        description: p.description,
        confidenceScore: p.confidenceScore,
        lastActivityAt: p.lastActivityAt,
        confirmedTradesCount: p.confirmedTradesCount,
      })),
    };
  },
});

export const seedForCity = internalMutation({
  args: { citySlug: v.string() },
  handler: async (ctx, { citySlug }) => {
    const city = await ctx.db
      .query("cities")
      .withIndex("by_slug", (q) => q.eq("slug", citySlug))
      .unique();
    if (!city) throw new Error(`City not found: ${citySlug}`);

    const existing = await ctx.db
      .query("tradePoints")
      .withIndex("by_city_status", (q) =>
        q.eq("cityId", city._id).eq("status", "approved")
      )
      .first();
    if (existing) return { skipped: true };

    const eligibleUser = await ctx.db
      .query("users")
      .withIndex("by_city", (q) => q.eq("cityId", city._id))
      .filter((q) => q.neq(q.field("isShadowBanned"), true))
      .first();
    if (!eligibleUser)
      throw new Error("No eligible user for seed in this city");

    const now = Date.now();
    const seedNames = [
      "Shopping Eldorado",
      "Parque Ibirapuera - Portão 3",
      "Praça da Sé",
      "Mercado Municipal",
      "Parque Villa-Lobos",
      "Estação da Luz",
    ];
    const jitter = () => (Math.random() - 0.5) * 0.04;
    for (const name of seedNames) {
      await ctx.db.insert("tradePoints", {
        name,
        address: `Endereço ${name}, ${city.name}`,
        cityId: city._id,
        lat: city.lat + jitter(),
        lng: city.lng + jitter(),
        whatsappLink: "https://chat.whatsapp.com/FAKE-DEV-ONLY",
        whatsappLinkStatus: "active",
        suggestedHours: "10h - 22h",
        status: "approved",
        requestedBy: eligibleUser._id,
        confidenceScore: 6 + Math.random() * 3.5,
        lastActivityAt: now,
        confirmedTradesCount: Math.floor(Math.random() * 20),
        reportCount: 0,
        createdAt: now,
      });
    }
    return { inserted: seedNames.length };
  },
});
