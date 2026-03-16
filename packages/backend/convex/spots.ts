import { v } from "convex/values";
import { query, mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthenticatedUser, isAdmin } from "./lib/auth";
import { UserStatus, TWENTY_FOUR_HOURS, sanitizeText } from "./lib/types";
const MAX_SPOTS_PER_DAY = 10;
const MAX_TITLE_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 500;

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

export const getActiveCount = query({
  args: {},
  handler: async (ctx) => {
    const now = Date.now();
    const activeSpots = await ctx.db
      .query("spots")
      .withIndex("by_active_expiresAt", (q) =>
        q.eq("isActive", true).gt("expiresAt", now)
      )
      .collect();
    return activeSpots.length;
  },
});

export const getById = query({
  // v.string() instead of v.id("spots") because this is called from URL path params
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
    if (args.title.length > MAX_TITLE_LENGTH) {
      throw new Error("Título deve ter no máximo 100 caracteres");
    }
    if (args.description && args.description.length > MAX_DESCRIPTION_LENGTH) {
      throw new Error("Descrição deve ter no máximo 500 caracteres");
    }

    // Coordinate validation
    if (args.latitude < -90 || args.latitude > 90) {
      throw new Error("Latitude inválida");
    }
    if (args.longitude < -180 || args.longitude > 180) {
      throw new Error("Longitude inválida");
    }

    // Rate limit: max 10 spots per 24h
    const oneDayAgo = Date.now() - TWENTY_FOUR_HOURS;
    const recentSpots = await ctx.db
      .query("spots")
      .withIndex("by_createdBy_and_createdAt", (q) =>
        q.eq("createdBy", user._id).gt("createdAt", oneDayAgo)
      )
      .collect();
    if (recentSpots.length >= MAX_SPOTS_PER_DAY) {
      throw new Error(
        "Limite de pontos atingido. Você pode criar no máximo 10 pontos por dia."
      );
    }

    const title = sanitizeText(args.title);
    const description = args.description ? sanitizeText(args.description) : undefined;

    const now = Date.now();
    return await ctx.db.insert("spots", {
      title,
      description,
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

    if (!isAdmin(user.role) && user.status !== UserStatus.APPROVED) {
      throw new Error("Sua conta precisa ser aprovada para remover pontos");
    }

    if (spot.createdBy !== user._id && !isAdmin(user.role)) {
      throw new Error("Sem permissão para remover este ponto");
    }

    await ctx.db.patch(args.spotId, { isActive: false });

    // Cleanup orphaned votes (partial — cron picks up the rest if > VOTES_CLEANUP_LIMIT)
    const orphanedVotes = await ctx.db
      .query("votes")
      .withIndex("by_spot", (q) => q.eq("spotId", args.spotId))
      .take(VOTES_CLEANUP_LIMIT);
    for (const vote of orphanedVotes) {
      await ctx.db.delete(vote._id);
    }
  },
});

const VOTES_CLEANUP_LIMIT = 100;

export const expireStale = internalMutation({
  args: {},
  handler: async (ctx) => {
    const BATCH_SIZE = 50;
    const now = Date.now();
    const expiredSpots = await ctx.db
      .query("spots")
      .withIndex("by_active_expiresAt", (q) =>
        q.eq("isActive", true).lt("expiresAt", now)
      )
      .take(BATCH_SIZE);

    for (const spot of expiredSpots) {
      await ctx.db.patch(spot._id, { isActive: false });

      // Cleanup orphaned votes for this spot
      const orphanedVotes = await ctx.db
        .query("votes")
        .withIndex("by_spot", (q) => q.eq("spotId", spot._id))
        .take(VOTES_CLEANUP_LIMIT);
      for (const vote of orphanedVotes) {
        await ctx.db.delete(vote._id);
      }
    }
    // Self-reschedule if there's a backlog, avoiding 15-min wait for next cron tick
    if (expiredSpots.length === BATCH_SIZE) {
      await ctx.scheduler.runAfter(10_000, internal.spots.expireStale);
    }

    return {
      expiredCount: expiredSpots.length,
      hasMore: expiredSpots.length === BATCH_SIZE,
    };
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

    const spotsCreatedToday = await ctx.db
      .query("spots")
      .withIndex("by_createdAt", (q) => q.gt("createdAt", oneDayAgo))
      .collect();

    // Full scan still needed for totalSpots + totalVotes.
    // Acceptable at current scale (spots table capped by expiration + deactivation).
    // Revisit if approaching 10K spots.
    const allSpots = await ctx.db.query("spots").collect();
    const totalVotes = allSpots.reduce(
      (sum, s) => sum + s.upvotes + s.downvotes,
      0
    );

    return {
      activeSpots: activeSpots.length,
      totalSpots: allSpots.length,
      totalVotes,
      spotsCreatedToday: spotsCreatedToday.length, // indexed query, not from allSpots
    };
  },
});
