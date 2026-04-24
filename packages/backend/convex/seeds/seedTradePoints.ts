import { internalMutation } from "../_generated/server";
import tradePointsData from "./trade-points-data.json";
import type { Id } from "../_generated/dataModel";

const SYSTEM_USER_CLERK_ID = "system_seed_user";

type TradePointSeed = {
  slug: string;
  name: string;
  type: string;
  category: string;
  city: string;
  state: string;
  region: string;
  address: string;
  neighborhood: string | null;
  schedule: string;
  latitude: number;
  longitude: number;
  partners: string[];
  traditionInCups: number[];
  returnProbability: string;
  active2026: boolean;
  notes: string | null;
};

function mapPointType(
  type: string,
  category: string
): "fixed" | "event" | "mail" {
  if (type === "evento") return "event";
  return "fixed";
}

function mapStatus(
  active2026: boolean,
  category: string
): "approved" | "inactive" {
  if (active2026) return "approved";
  return "inactive";
}

function buildDescription(seed: TradePointSeed): string {
  const parts: string[] = [];

  if (seed.neighborhood) {
    parts.push(`Bairro: ${seed.neighborhood}`);
  }

  if (seed.partners.length > 0) {
    parts.push(`Parceiros: ${seed.partners.join(", ")}`);
  }

  if (seed.traditionInCups.length > 0) {
    parts.push(`Copas anteriores: ${seed.traditionInCups.join(", ")}`);
  }

  if (seed.notes) {
    parts.push(seed.notes);
  }

  return parts.join(". ");
}

export const seedTradePoints = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existingPoints = await ctx.db.query("tradePoints").take(1);
    if (existingPoints.length > 0) {
      console.log("Trade points already seeded, skipping...");
      return { skipped: true, count: 0, errors: [] };
    }

    let systemUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", SYSTEM_USER_CLERK_ID))
      .first();

    if (!systemUser) {
      const userId = await ctx.db.insert("users", {
        name: "Sistema Figurinha Fácil",
        clerkId: SYSTEM_USER_CLERK_ID,
        role: "admin",
        reliabilityScore: 10,
        pendingSubmissionsCount: 0,
        hasCompletedOnboarding: true,
        createdAt: Date.now(),
      });
      systemUser = await ctx.db.get(userId);
    }

    if (!systemUser) {
      throw new Error("Failed to create/find system user");
    }

    const cities = await ctx.db.query("cities").collect();
    const cityByKey = new Map<string, Id<"cities">>();
    for (const city of cities) {
      const key = `${city.name.toLowerCase()}-${city.state.toLowerCase()}`;
      cityByKey.set(key, city._id);
    }

    let count = 0;
    const errors: string[] = [];
    const now = Date.now();

    for (const seed of tradePointsData as TradePointSeed[]) {
      const cityKey = `${seed.city.toLowerCase()}-${seed.state.toLowerCase()}`;
      const cityId = cityByKey.get(cityKey);

      if (!cityId) {
        errors.push(`City not found: ${seed.city}-${seed.state} for ${seed.slug}`);
        continue;
      }

      const existing = await ctx.db
        .query("tradePoints")
        .withIndex("by_slug", (q) => q.eq("slug", seed.slug))
        .first();

      if (existing) {
        continue;
      }

      const confidenceScore = seed.active2026 ? 0.9 : 0.5;
      const traditionBonus = seed.traditionInCups.length * 0.02;

      await ctx.db.insert("tradePoints", {
        name: seed.name,
        slug: seed.slug,
        address: seed.address,
        cityId,
        lat: seed.latitude,
        lng: seed.longitude,
        whatsappLinkStatus: "active",
        suggestedHours: seed.schedule,
        description: buildDescription(seed) || undefined,
        status: mapStatus(seed.active2026, seed.category),
        requestedBy: systemUser._id,
        confidenceScore: Math.min(confidenceScore + traditionBonus, 1.0),
        lastActivityAt: now,
        confirmedTradesCount: 0,
        createdAt: now,
        participantCount: 0,
        activeCheckinsCount: 0,
        pointType: mapPointType(seed.type, seed.category),
      });

      count++;
    }

    console.log(`Seeded ${count} trade points`);
    if (errors.length > 0) {
      console.warn("Errors:", errors);
    }

    return { skipped: false, count, errors };
  },
});
