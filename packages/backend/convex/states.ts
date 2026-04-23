import { v } from "convex/values";
import { query } from "./_generated/server";

const STATE_NAMES: Record<string, string> = {
  AC: "Acre",
  AL: "Alagoas",
  AP: "Amapá",
  AM: "Amazonas",
  BA: "Bahia",
  CE: "Ceará",
  DF: "Distrito Federal",
  ES: "Espírito Santo",
  GO: "Goiás",
  MA: "Maranhão",
  MT: "Mato Grosso",
  MS: "Mato Grosso do Sul",
  MG: "Minas Gerais",
  PA: "Pará",
  PB: "Paraíba",
  PR: "Paraná",
  PE: "Pernambuco",
  PI: "Piauí",
  RJ: "Rio de Janeiro",
  RN: "Rio Grande do Norte",
  RS: "Rio Grande do Sul",
  RO: "Rondônia",
  RR: "Roraima",
  SC: "Santa Catarina",
  SP: "São Paulo",
  SE: "Sergipe",
  TO: "Tocantins",
};

function stateToSlug(state: string): string {
  return state.toLowerCase().replace(/\s+/g, "-");
}

function slugToState(slug: string): string | null {
  const normalized = slug.toLowerCase().replace(/-/g, " ");
  for (const [code, name] of Object.entries(STATE_NAMES)) {
    if (
      name.toLowerCase() === normalized ||
      code.toLowerCase() === normalized
    ) {
      return code;
    }
  }
  return null;
}

export const getAllStates = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    const statesSet = new Set(cities.map((c) => c.state));
    const states = Array.from(statesSet)
      .filter((s) => STATE_NAMES[s])
      .map((code) => ({
        code,
        name: STATE_NAMES[code]!,
        slug: stateToSlug(STATE_NAMES[code]!),
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));

    return states;
  },
});

export const getAllStateSlugs = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    const statesSet = new Set(cities.map((c) => c.state));
    return Array.from(statesSet)
      .filter((s) => STATE_NAMES[s])
      .map((code) => stateToSlug(STATE_NAMES[code]!));
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const stateCode = slugToState(slug);
    if (!stateCode || !STATE_NAMES[stateCode]) return null;

    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(1);

    const hasState = cities.some((c) => c.state === stateCode);
    if (!hasState) {
      const allCities = await ctx.db
        .query("cities")
        .withIndex("by_isActive", (q) => q.eq("isActive", true))
        .take(5000);
      if (!allCities.some((c) => c.state === stateCode)) return null;
    }

    return {
      code: stateCode,
      name: STATE_NAMES[stateCode]!,
      slug: stateToSlug(STATE_NAMES[stateCode]!),
    };
  },
});

export const getStatsBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const stateCode = slugToState(slug);
    if (!stateCode) return null;

    const allCities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    const stateCities = allCities.filter((c) => c.state === stateCode);
    if (stateCities.length === 0) return null;

    const cityIds = new Set(stateCities.map((c) => c._id));

    const [allUsers, allTradePoints] = await Promise.all([
      ctx.db.query("users").take(50000),
      ctx.db
        .query("tradePoints")
        .withIndex("by_status", (q) => q.eq("status", "approved"))
        .take(5000),
    ]);

    const stateUsers = allUsers.filter(
      (u) =>
        u.cityId &&
        cityIds.has(u.cityId) &&
        u.hasCompletedStickerSetup &&
        !u.isShadowBanned &&
        !u.isBanned
    );

    const stateTradePoints = allTradePoints.filter((p) =>
      cityIds.has(p.cityId)
    );

    const collectorsByCity = new Map<string, number>();
    for (const user of stateUsers) {
      if (user.cityId) {
        collectorsByCity.set(
          user.cityId,
          (collectorsByCity.get(user.cityId) ?? 0) + 1
        );
      }
    }

    const topCities = stateCities
      .map((c) => ({
        name: c.name,
        slug: c.slug,
        collectorsCount: collectorsByCity.get(c._id) ?? 0,
      }))
      .sort((a, b) => b.collectorsCount - a.collectorsCount)
      .slice(0, 5);

    return {
      citiesCount: stateCities.length,
      collectorsCount: stateUsers.length,
      tradePointsCount: stateTradePoints.length,
      topCities,
    };
  },
});

export const listForSitemap = query({
  args: {},
  handler: async (ctx) => {
    const cities = await ctx.db
      .query("cities")
      .withIndex("by_isActive", (q) => q.eq("isActive", true))
      .take(5000);

    const statesSet = new Set(cities.map((c) => c.state));
    return Array.from(statesSet)
      .filter((s) => STATE_NAMES[s])
      .map((code) => ({
        slug: stateToSlug(STATE_NAMES[code]!),
        name: STATE_NAMES[code]!,
      }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  },
});
