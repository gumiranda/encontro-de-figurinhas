import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getAuthenticatedUser } from "./lib/auth";
import { TWENTY_FOUR_HOURS } from "./lib/types";
const DOWNVOTE_THRESHOLD = 3;

export const castVote = mutation({
  args: {
    spotId: v.id("spots"),
    value: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new Error("Não autenticado");

    if (args.value !== 1 && args.value !== -1) {
      throw new Error("Voto inválido");
    }

    const spot = await ctx.db.get(args.spotId);
    if (!spot) throw new Error("Ponto não encontrado");

    if (!spot.isActive || spot.expiresAt <= Date.now()) {
      throw new Error("Este ponto já expirou");
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
    const freshSpot = (await ctx.db.get(args.spotId))!;
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

    // Upvote extends life by 24h
    if (args.value === 1 && upvoteDelta > 0) {
      patchData.expiresAt = Date.now() + TWENTY_FOUR_HOURS;
    }

    // 3+ downvotes deactivates spot
    if (newDownvotes >= DOWNVOTE_THRESHOLD) {
      patchData.isActive = false;
    }

    await ctx.db.patch(args.spotId, patchData);
  },
});

export const getMyVotes = query({
  args: { spotIds: v.array(v.id("spots")) },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];

    const votes = [];
    for (const spotId of args.spotIds) {
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
