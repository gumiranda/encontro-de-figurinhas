import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthenticatedUser } from "./lib/auth";
import { UserStatus, TWENTY_FOUR_HOURS, MAX_SPOT_LIFETIME } from "./lib/types";
const DOWNVOTE_THRESHOLD = 3;
const MAX_VOTES_PER_MINUTE = 30;
const ONE_MINUTE = 60_000;

// Custo por chamada:
// - Melhor caso (novo voto): 2R (auth + spot) + 1R (existing vote) + 1W (insert vote) + 1W (patch spot) = 3R + 2W
// - Pior caso (trocar voto up→down): 2R (auth + spot) + 1R (existing vote) + 1W (patch vote) + 1R (fresh spot) + 1W (patch spot counters + expiresAt) = 3R + 2W
// - Pior caso com deactivation: mesmo + isActive=false no patch = 3R + 2W
// TODO: Rate limit futuro mais granular (por IP ou sliding window)

export const castVote = mutation({
  args: {
    spotId: v.id("spots"),
    value: v.union(v.literal(1), v.literal(-1)),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Não autenticado");

    if (user.status !== UserStatus.APPROVED) {
      throw new Error("Sua conta precisa ser aprovada para votar");
    }

    if (args.value !== 1 && args.value !== -1) {
      throw new Error("Voto inválido");
    }

    // Rate limit: max 30 votes per minute per user
    const oneMinuteAgo = Date.now() - ONE_MINUTE;
    const recentVotes = await ctx.db
      .query("votes")
      .withIndex("by_user_spot", (q) => q.eq("userId", user._id))
      .filter((q) => q.gt(q.field("createdAt"), oneMinuteAgo))
      .collect();
    if (recentVotes.length >= MAX_VOTES_PER_MINUTE) {
      throw new Error("Muitos votos em pouco tempo. Aguarde um momento.");
    }

    const spot = await ctx.db.get(args.spotId);
    if (!spot) throw new Error("Ponto não encontrado");

    if (!spot.isActive || spot.expiresAt <= Date.now()) {
      throw new Error("Este ponto já expirou");
    }

    if (spot.createdBy === user._id) {
      throw new Error("Você não pode votar no seu próprio ponto");
    }

    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_user_spot", (q) =>
        q.eq("userId", user._id).eq("spotId", args.spotId)
      )
      .unique();

    let upvoteDelta = 0;
    let downvoteDelta = 0;

    if (existingVote) {
      if (existingVote.value === args.value) {
        // Same vote -> toggle off (remove)
        await ctx.db.delete(existingVote._id);
        if (args.value === 1) upvoteDelta = -1;
        else downvoteDelta = -1;
      } else {
        // Different vote -> switch
        await ctx.db.patch(existingVote._id, {
          value: args.value,
          createdAt: Date.now(),
        });
        if (args.value === 1) {
          upvoteDelta = 1;
          downvoteDelta = -1;
        } else {
          upvoteDelta = -1;
          downvoteDelta = 1;
        }
      }
    } else {
      // New vote
      await ctx.db.insert("votes", {
        spotId: args.spotId,
        userId: user._id,
        value: args.value,
        createdAt: Date.now(),
      });
      if (args.value === 1) upvoteDelta = 1;
      else downvoteDelta = 1;
    }

    // Read fresh counters from DB
    const freshSpot = await ctx.db.get(args.spotId);
    if (!freshSpot) throw new Error("Spot not found after vote");
    const newUpvotes = freshSpot.upvotes + upvoteDelta;
    const newDownvotes = freshSpot.downvotes + downvoteDelta;

    const patchData: {
      upvotes: number;
      downvotes: number;
      isActive?: boolean;
      expiresAt?: number;
    } = {
      upvotes: newUpvotes,
      downvotes: newDownvotes,
    };

    // Upvote extends life by 24h, capped at 72h from creation
    if (args.value === 1 && upvoteDelta > 0) {
      const maxExpiry = freshSpot.createdAt + MAX_SPOT_LIFETIME;
      patchData.expiresAt = Math.min(Date.now() + TWENTY_FOUR_HOURS, maxExpiry);
    }

    // 3+ downvotes deactivates spot
    if (newDownvotes >= DOWNVOTE_THRESHOLD) {
      patchData.isActive = false;
    }

    await ctx.db.patch(args.spotId, patchData);
  },
});

const MAX_SPOT_IDS_PER_QUERY = 50;

// N individual index lookups (O(1) each), capped at MAX_SPOT_IDS_PER_QUERY (50).
// Convex doesn't support batch/IN queries, so sequential indexed reads are the
// standard pattern. At 50 spots this is well within Convex's query budget.
export const getMyVotes = query({
  args: { spotIds: v.array(v.id("spots")) },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    const spotIds = args.spotIds.slice(0, MAX_SPOT_IDS_PER_QUERY);

    const votes = [];
    for (const spotId of spotIds) {
      const vote = await ctx.db
        .query("votes")
        .withIndex("by_user_spot", (q) =>
          q.eq("userId", user._id).eq("spotId", spotId)
        )
        .unique();
      if (vote) {
        votes.push({ spotId: vote.spotId, value: vote.value });
      }
    }
    return votes;
  },
});
