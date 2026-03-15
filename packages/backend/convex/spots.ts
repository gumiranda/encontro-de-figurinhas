import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { getAuthenticatedUser, isAdmin } from "./lib/auth";
import { UserStatus, TWENTY_FOUR_HOURS } from "./lib/types";
const MAX_SPOTS_PER_DAY = 10;

export const listActive = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    return await ctx.db
      .query("spots")
      .withIndex("by_active_expiresAt", (q) =>
        q.eq("isActive", true).gt("expiresAt", now)
      )
      .collect();
  },
});

export const getById = query({
  args: { id: v.string() },
  handler: async (ctx, args) => {
    const normalizedId = ctx.db.normalizeId("spots", args.id);
    if (!normalizedId) return null;

    const spot = await ctx.db.get(normalizedId);
    if (!spot) return null;
    if (!spot.isActive || spot.expiresAt <= Date.now()) return null;

    return spot;
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    latitude: v.float64(),
    longitude: v.float64(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Não autenticado");
    if (user.status !== UserStatus.APPROVED) {
      throw new Error("Sua conta precisa ser aprovada para criar pontos");
    }

    // String length validation
    if (args.title.length > 100) {
      throw new Error("Título deve ter no máximo 100 caracteres");
    }
    if (args.description && args.description.length > 500) {
      throw new Error("Descrição deve ter no máximo 500 caracteres");
    }

    // Rate limit: max 10 spots per 24h
    const oneDayAgo = Date.now() - TWENTY_FOUR_HOURS;
    const recentSpots = await ctx.db
      .query("spots")
      .withIndex("by_created_by", (q) => q.eq("createdBy", user._id))
      .filter((q) => q.gt(q.field("createdAt"), oneDayAgo))
      .collect();
    const spotsInLast24h = recentSpots.length;
    if (spotsInLast24h >= MAX_SPOTS_PER_DAY) {
      throw new Error(
        "Limite de pontos atingido. Você pode criar no máximo 10 pontos por dia."
      );
    }

    const now = Date.now();
    return await ctx.db.insert("spots", {
      title: args.title,
      description: args.description,
      latitude: args.latitude,
      longitude: args.longitude,
      createdBy: user._id,
      createdByName: user.name,
      createdAt: now,
      expiresAt: now + TWENTY_FOUR_HOURS,
      upvotes: 0,
      downvotes: 0,
      isActive: true,
    });
  },
});

export const remove = mutation({
  args: { spotId: v.id("spots") },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Não autenticado");

    const spot = await ctx.db.get(args.spotId);
    if (!spot) throw new Error("Ponto não encontrado");

    if (spot.createdBy !== user._id && !isAdmin(user.role)) {
      throw new Error("Sem permissão para remover este ponto");
    }

    await ctx.db.patch(args.spotId, { isActive: false });
  },
});

export const expireStale = internalMutation({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const expiredSpots = await ctx.db
      .query("spots")
      .withIndex("by_active_expiresAt", (q) =>
        q.eq("isActive", true).lt("expiresAt", now)
      )
      .collect();

    for (const spot of expiredSpots) {
      await ctx.db.patch(spot._id, { isActive: false });
    }
    return { expiredCount: expiredSpots.length };
  },
});

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user || !isAdmin(user.role)) return null;

    const now = Date.now();
    const oneDayAgo = now - TWENTY_FOUR_HOURS;

    const activeSpots = await ctx.db
      .query("spots")
      .withIndex("by_active_expiresAt", (q) =>
        q.eq("isActive", true).gt("expiresAt", now)
      )
      .collect();

    const allSpots = await ctx.db.query("spots").collect();
    const spotsCreatedToday = allSpots.filter(
      (s) => s.createdAt > oneDayAgo
    );

    const totalVotes = await ctx.db.query("votes").collect();

    return {
      activeSpots: activeSpots.length,
      totalSpots: allSpots.length,
      totalVotes: totalVotes.length,
      spotsCreatedToday: spotsCreatedToday.length,
    };
  },
});
