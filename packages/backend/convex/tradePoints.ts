import { v } from "convex/values";
import { query, internalMutation, mutation } from "./_generated/server";
import { authErrorValidators, checkAuth, getAuthenticatedUser } from "./lib/auth";
import { isInBrazil } from "./lib/geo";
import { evaluateWhatsappAccess } from "./lib/whatsapp";

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

const whatsappAccessValidator = v.union(
  v.object({ state: v.literal("ok"), link: v.string() }),
  v.object({ state: v.literal("blocked-link-invalid") }),
  v.object({ state: v.literal("blocked-minor") })
);

export const getById = query({
  args: { id: v.id("tradePoints") },
  returns: v.union(
    v.object({ state: v.literal("needs-auth") }),
    v.object({ state: v.literal("banned") }),
    v.object({ state: v.literal("needs-onboarding") }),
    v.object({ state: v.literal("not-found") }),
    v.object({
      state: v.literal("ready"),
      point: v.object({
        _id: v.id("tradePoints"),
        name: v.string(),
        address: v.string(),
        lat: v.float64(),
        lng: v.float64(),
        suggestedHours: v.optional(v.string()),
        description: v.optional(v.string()),
        confidenceScore: v.float64(),
        lastActivityAt: v.number(),
        confirmedTradesCount: v.number(),
        peakHours: v.optional(v.array(v.number())),
      }),
      city: v.union(
        v.object({ name: v.string(), slug: v.string() }),
        v.null()
      ),
      participantCount: v.number(),
      isParticipant: v.boolean(),
      activeCheckinsCount: v.number(),
      hasActiveCheckin: v.boolean(),
      whatsapp: whatsappAccessValidator,
    })
  ),
  handler: async (ctx, { id }) => {
    const auth = await checkAuth(ctx);
    if (auth.state === "needs-auth") return { state: "needs-auth" as const };
    if (auth.state === "banned") return { state: "banned" as const };
    if (auth.state === "needs-onboarding") {
      return { state: "needs-onboarding" as const };
    }

    const user = auth.user;
    const point = await ctx.db.get(id);
    if (!point || point.status !== "approved") {
      return { state: "not-found" as const };
    }

    const city = await ctx.db.get(point.cityId);
    const now = Date.now();

    const isParticipant = !!(await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", id)
      )
      .unique());

    const hasActiveCheckin = !!(await ctx.db
      .query("checkins")
      .withIndex("by_user_tradePoint_active", (q) =>
        q.eq("userId", user._id).eq("tradePointId", id).gt("expiresAt", now)
      )
      .first());

    return {
      state: "ready" as const,
      point: {
        _id: point._id,
        name: point.name,
        address: point.address,
        lat: point.lat,
        lng: point.lng,
        suggestedHours: point.suggestedHours,
        description: point.description,
        confidenceScore: point.confidenceScore,
        lastActivityAt: point.lastActivityAt,
        confirmedTradesCount: point.confirmedTradesCount,
        peakHours: point.peakHours,
      },
      city: city ? { name: city.name, slug: city.slug } : null,
      participantCount: point.participantCount ?? 0,
      isParticipant,
      activeCheckinsCount: point.activeCheckinsCount ?? 0,
      hasActiveCheckin,
      whatsapp: evaluateWhatsappAccess(user, point),
    };
  },
});

export const submitRequest = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    cityId: v.id("cities"),
    lat: v.float64(),
    lng: v.float64(),
    suggestedHours: v.optional(v.string()),
    description: v.optional(v.string()),
    whatsappLink: v.optional(v.string()),
  },
  returns: v.union(
    v.object({ ok: v.literal(true), tradePointId: v.id("tradePoints") }),
    ...authErrorValidators,
    v.object({ ok: v.literal(false), error: v.literal("city-mismatch") }),
    v.object({ ok: v.literal(false), error: v.literal("invalid-coordinates") }),
    v.object({ ok: v.literal(false), error: v.literal("invalid-fields") })
  ),
  handler: async (ctx, args) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { ok: false as const, error: auth.state };
    }
    const user = auth.user;
    if (!user.cityId || user.cityId !== args.cityId) {
      return { ok: false as const, error: "city-mismatch" as const };
    }

    const city = await ctx.db.get(args.cityId);
    if (!city || city.isActive === false) {
      return { ok: false as const, error: "city-mismatch" as const };
    }

    if (!isInBrazil(args.lat, args.lng)) {
      return { ok: false as const, error: "invalid-coordinates" as const };
    }

    const trimmedName = args.name.trim();
    const trimmedAddress = args.address.trim();
    if (
      trimmedName.length < 2 ||
      trimmedName.length > 120 ||
      trimmedAddress.length < 5 ||
      trimmedAddress.length > 300
    ) {
      return { ok: false as const, error: "invalid-fields" as const };
    }

    const suggestedHours = args.suggestedHours?.trim();
    const description = args.description?.trim();
    let whatsappLink = args.whatsappLink?.trim();
    if (whatsappLink === "") whatsappLink = undefined;
    if (whatsappLink && !/^https?:\/\//i.test(whatsappLink)) {
      return { ok: false as const, error: "invalid-fields" as const };
    }

    const now = Date.now();
    const tradePointId = await ctx.db.insert("tradePoints", {
      name: trimmedName,
      address: trimmedAddress,
      cityId: args.cityId,
      lat: args.lat,
      lng: args.lng,
      whatsappLink,
      whatsappLinkStatus: whatsappLink ? "active" : "invalid",
      suggestedHours: suggestedHours || undefined,
      description: description || undefined,
      status: "pending",
      requestedBy: user._id,
      confidenceScore: 0,
      lastActivityAt: now,
      confirmedTradesCount: 0,
      reportCount: 0,
      createdAt: now,
      participantCount: 0,
      activeCheckinsCount: 0,
    });

    return { ok: true as const, tradePointId };
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
        participantCount: 0,
        activeCheckinsCount: 0,
      });
    }
    return { inserted: seedNames.length };
  },
});
