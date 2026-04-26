import { v, ConvexError } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getAuthenticatedUser } from "./lib/auth";
import { rateLimiter } from "./lib/rateLimiter";

export const toggleHidden = mutation({
  args: {
    matchedUserId: v.id("users"),
    tradePointId: v.id("tradePoints"),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError("AUTH_REQUIRED");

    await rateLimiter.limit(ctx, "toggleHidden", { key: user._id, throws: true });

    const existing = await ctx.db
      .query("userMatchInteractions")
      .withIndex("by_user_matched_point", (q) =>
        q
          .eq("userId", user._id)
          .eq("matchedUserId", args.matchedUserId)
          .eq("tradePointId", args.tradePointId)
      )
      .first();

    const now = Date.now();

    if (existing) {
      if (existing.isHidden) {
        await ctx.db.patch(existing._id, {
          isHidden: false,
          updatedAt: now,
        });
        return { isHidden: false };
      } else {
        await ctx.db.patch(existing._id, {
          isHidden: true,
          updatedAt: now,
        });
        return { isHidden: true };
      }
    }

    await ctx.db.insert("userMatchInteractions", {
      userId: user._id,
      matchedUserId: args.matchedUserId,
      tradePointId: args.tradePointId,
      isHidden: true,
      createdAt: now,
      updatedAt: now,
    });

    return { isHidden: true };
  },
});

export const getHiddenMatches = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return { hiddenPairs: [] };

    const hidden = await ctx.db
      .query("userMatchInteractions")
      .withIndex("by_user_hidden", (q) =>
        q.eq("userId", user._id).eq("isHidden", true)
      )
      .take(500);

    return {
      hiddenPairs: hidden.map((h) => ({
        matchedUserId: h.matchedUserId,
        tradePointId: h.tradePointId,
      })),
    };
  },
});
