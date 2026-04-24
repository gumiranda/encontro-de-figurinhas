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

    const CAP_USERS_PER_CITY = 5000;
    const CAP_TRADE_POINTS_PER_CITY = 500;

    const buckets = await Promise.all(
      stateCities.map(async (c) => {
        const [usersInCity, pointsInCity] = await Promise.all([
          ctx.db
            .query("users")
            .withIndex("by_city_not_shadowbanned", (q) =>
              q.eq("cityId", c._id).eq("isShadowBanned", false)
            )
            .take(CAP_USERS_PER_CITY),
          ctx.db
            .query("tradePoints")
            .withIndex("by_city_status", (q) =>
              q.eq("cityId", c._id).eq("status", "approved")
            )
            .take(CAP_TRADE_POINTS_PER_CITY),
        ]);
        const activeCount = usersInCity.filter(
          (u) => u.hasCompletedStickerSetup === true && u.isBanned !== true
        ).length;
        return {
          city: c,
          activeCount,
          pointsCount: pointsInCity.length,
        };
      })
    );

    let collectorsCount = 0;
    let tradePointsCount = 0;
    for (const b of buckets) {
      collectorsCount += b.activeCount;
      tradePointsCount += b.pointsCount;
    }

    const topCities = buckets
      .map((b) => ({
        name: b.city.name,
        slug: b.city.slug,
        collectorsCount: b.activeCount,
      }))
      .sort((a, b) => b.collectorsCount - a.collectorsCount)
      .slice(0, 5);

    return {
      citiesCount: stateCities.length,
      collectorsCount,
      tradePointsCount,
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
