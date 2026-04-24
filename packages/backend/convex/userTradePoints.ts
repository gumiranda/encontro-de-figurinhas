import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { checkAuth } from "./lib/auth";
import { FREE_USER_MAX_POINTS, PREMIUM_USER_MAX_POINTS } from "./lib/limits";

export const getMyPoints = query({
  args: {},
  handler: async (ctx) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") return [];

    const memberships = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user", (q) => q.eq("userId", auth.user._id))
      .take(50);

    const points = await Promise.all(
      memberships.map(async (m) => {
        const point = await ctx.db.get(m.tradePointId);
        if (!point) return null;
        const city = point.cityId ? await ctx.db.get(point.cityId) : null;
        return {
          ...point,
          joinedAt: m.joinedAt,
          cityName: city?.name ?? null,
        };
      })
    );

    return points.filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

export const join = mutation({
  args: { tradePointId: v.id("tradePoints") },
  handler: async (ctx, { tradePointId }) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { ok: false as const, error: auth.state };
    }
    const user = auth.user;

    const point = await ctx.db.get(tradePointId);
    if (!point || point.status !== "approved") {
      return { ok: false as const, error: "point-unavailable" as const };
    }

    const existing = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", tradePointId)
      )
      .unique();
    if (existing) return { ok: false as const, error: "already-member" as const };

    const cap = user.isPremium ? PREMIUM_USER_MAX_POINTS : FREE_USER_MAX_POINTS;
    const sample = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(cap + 1);
    if (sample.length >= cap) {
      return { ok: false as const, error: "limit-reached" as const };
    }

    await ctx.db.insert("userTradePoints", {
      userId: user._id,
      tradePointId,
      joinedAt: Date.now(),
    });
    await ctx.db.patch(tradePointId, {
      participantCount: (point.participantCount ?? 0) + 1,
    });
    return { ok: true as const };
  },
});

export const leave = mutation({
  args: { tradePointId: v.id("tradePoints") },
  handler: async (ctx, { tradePointId }) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { ok: false as const, error: auth.state };
    }
    const user = auth.user;

    const membership = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", tradePointId)
      )
      .unique();
    if (!membership) {
      return { ok: false as const, error: "not-member" as const };
    }

    // Invariante (auto-overwrite no create): no máximo 1 checkin ativo global por
    // usuário → no máximo 1 neste ponto. .first() é exato.
    const now = Date.now();
    const activeCheckin = await ctx.db
      .query("checkins")
      .withIndex("by_user_tradePoint_active", (q) =>
        q
          .eq("userId", user._id)
          .eq("tradePointId", tradePointId)
          .gt("expiresAt", now)
      )
      .first();

    let publicCheckinsToRemove = 0;
    if (activeCheckin) {
      if (activeCheckin.countedInPublic) publicCheckinsToRemove = 1;
      await ctx.db.delete(activeCheckin._id);
    }

    await ctx.db.delete(membership._id);

    const point = await ctx.db.get(tradePointId);
    if (point) {
      await ctx.db.patch(tradePointId, {
        participantCount: Math.max(0, (point.participantCount ?? 0) - 1),
        activeCheckinsCount: Math.max(
          0,
          (point.activeCheckinsCount ?? 0) - publicCheckinsToRemove
        ),
      });
    }

    return { ok: true as const };
  },
});
