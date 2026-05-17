import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireAuth, getAuthenticatedUser } from "./lib/auth";
import { rateLimiter } from "./lib/rateLimiter";

export const getReactionCounts = query({
  args: { postId: v.id("communityPosts") },
  handler: async (ctx, { postId }) => {
    const [love, fire, hand] = await Promise.all([
      ctx.db
        .query("postReactions")
        .withIndex("by_post_type", (q) => q.eq("postId", postId).eq("type", "love"))
        .collect()
        .then((r) => r.length),
      ctx.db
        .query("postReactions")
        .withIndex("by_post_type", (q) => q.eq("postId", postId).eq("type", "fire"))
        .collect()
        .then((r) => r.length),
      ctx.db
        .query("postReactions")
        .withIndex("by_post_type", (q) => q.eq("postId", postId).eq("type", "hand"))
        .collect()
        .then((r) => r.length),
    ]);
    return { love, fire, hand };
  },
});

export const getUserReaction = query({
  args: { postId: v.id("communityPosts") },
  handler: async (ctx, { postId }) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;

    const reaction = await ctx.db
      .query("postReactions")
      .withIndex("by_post_user", (q) => q.eq("postId", postId).eq("userId", user._id))
      .first();

    return reaction?.type ?? null;
  },
});

export const toggleReaction = mutation({
  args: {
    postId: v.id("communityPosts"),
    type: v.union(v.literal("love"), v.literal("fire"), v.literal("hand")),
  },
  handler: async (ctx, { postId, type }) => {
    const user = await requireAuth(ctx);

    const status = await rateLimiter.check(ctx, "communityReactions", { key: user._id });
    if (!status.ok) throw new Error("Muitas reações. Aguarde um momento.");

    const existing = await ctx.db
      .query("postReactions")
      .withIndex("by_post_user", (q) => q.eq("postId", postId).eq("userId", user._id))
      .first();

    if (existing) {
      if (existing.type === type) {
        await ctx.db.delete(existing._id);
        return { action: "removed" as const };
      } else {
        await ctx.db.patch(existing._id, { type });
        return { action: "changed" as const, type };
      }
    } else {
      await ctx.db.insert("postReactions", {
        postId,
        userId: user._id,
        type,
        createdAt: Date.now(),
      });
      return { action: "added" as const, type };
    }
  },
});
