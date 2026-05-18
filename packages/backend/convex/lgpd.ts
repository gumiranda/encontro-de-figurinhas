import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { rescheduleIfMore } from "./_helpers/pagination";
import { requireAuth } from "./lib/auth";
import { rateLimiter } from "./lib/rateLimiter";

const CLEANUP_BATCH = 100;
const CLEANUP_MAX_CHUNKS = 50;
const CLEANUP_LEASE_MS = 5 * 60 * 1000;
const GRACE_PERIOD_MS = 7 * 24 * 60 * 60 * 1000;

type CleanupPhase =
  | "trades_initiator"
  | "trades_counterparty"
  | "posts"
  | "comments"
  | "reactions"
  | "checkins"
  | "scoreBumps"
  | "tradePoints"
  | "matches"
  | "matchInteractions"
  | "storage"
  | "final";

export const exportMyData = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    const { ok } = await rateLimiter.check(ctx, "lgpdExport", { key: user._id });
    if (!ok) throw new ConvexError("rate-limited");

    const city = user.cityId ? await ctx.db.get(user.cityId) : null;

    const tradesAsInitiator = await ctx.db
      .query("trades")
      .withIndex("by_initiator_created", (q) => q.eq("initiatorId", user._id))
      .collect();

    const tradesAsCounterparty = await ctx.db
      .query("trades")
      .withIndex("by_counterparty_status", (q) =>
        q.eq("counterpartyId", user._id)
      )
      .collect();

    const posts = await ctx.db
      .query("communityPosts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const comments = await ctx.db
      .query("postComments")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const reactions = await ctx.db
      .query("postReactions")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const checkins = await ctx.db
      .query("checkins")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const tradePointMemberships = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return {
      exportedAt: Date.now(),
      user: {
        nickname: user.nickname,
        displayNickname: user.displayNickname,
        birthDate: user.birthDate,
        ageGroup: user.ageGroup,
        city: city ? { name: city.name, state: city.state } : null,
        location: user.lat && user.lng ? { lat: user.lat, lng: user.lng } : null,
        albumProgress: user.albumProgress,
        totalStickersOwned: user.totalStickersOwned,
        totalTrades: user.totalTrades,
        reliabilityScore: user.reliabilityScore,
        ratingAvg: user.ratingAvg,
        ratingCount: user.ratingCount,
        duplicates: user.duplicates,
        missing: user.missing,
        acceptsMail: user.acceptsMail,
        isProfilePublic: user.isProfilePublic,
        isPremium: user.isPremium,
        createdAt: user.createdAt,
        lastActiveAt: user.lastActiveAt,
      },
      trades: [...tradesAsInitiator, ...tradesAsCounterparty].map((t) => ({
        id: t._id,
        role: t.initiatorId === user._id ? "initiator" : "counterparty",
        stickersGave:
          t.initiatorId === user._id
            ? t.stickersInitiatorGave
            : t.stickersInitiatorReceived,
        stickersReceived:
          t.initiatorId === user._id
            ? t.stickersInitiatorReceived
            : t.stickersInitiatorGave,
        status: t.status,
        createdAt: t.createdAt,
        confirmedAt: t.confirmedAt,
      })),
      posts: posts.map((p) => ({
        id: p._id,
        type: p.type,
        stickers: p.stickers,
        message: p.message,
        createdAt: p.createdAt,
      })),
      comments: comments.map((c) => ({
        id: c._id,
        postId: c.postId,
        message: c.message,
        createdAt: c.createdAt,
      })),
      reactions: reactions.map((r) => ({
        id: r._id,
        postId: r.postId,
        type: r.type,
        createdAt: r.createdAt,
      })),
      checkins: checkins.map((c) => ({
        id: c._id,
        tradePointId: c.tradePointId,
        lat: c.lat,
        lng: c.lng,
        createdAt: c.createdAt,
        expiresAt: c.expiresAt,
      })),
      tradePointMemberships: tradePointMemberships.map((m) => ({
        id: m._id,
        tradePointId: m.tradePointId,
        cityName: m.cityName,
        joinedAt: m.joinedAt,
      })),
    };
  },
});

export const getDeletionStatus = query({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    if (!user.deletionPending) {
      return { pending: false as const };
    }

    const gracePeriodEnds = (user.deletionRequestedAt ?? 0) + GRACE_PERIOD_MS;
    const canCancel = user.cleanupStatus !== "running";

    return {
      pending: true as const,
      requestedAt: user.deletionRequestedAt,
      gracePeriodEnds,
      cleanupStatus: user.cleanupStatus,
      canCancel,
    };
  },
});

export const requestAccountDeletion = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    await rateLimiter.limit(ctx, "lgpdDeleteRequest", { key: user._id });

    if (user.deletionPending) {
      throw new ConvexError("already-pending");
    }

    await ctx.db.patch(user._id, {
      deletionPending: true,
      deletionRequestedAt: Date.now(),
      cleanupStatus: "pending",
    });

    return { gracePeriodEnds: Date.now() + GRACE_PERIOD_MS };
  },
});

export const cancelAccountDeletion = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);
    await rateLimiter.limit(ctx, "lgpdCancelDeletion", { key: user._id });

    if (!user.deletionPending) {
      throw new ConvexError("not-pending");
    }
    if (user.cleanupStatus === "running") {
      throw new ConvexError("cleanup-in-progress");
    }

    await ctx.db.patch(user._id, {
      deletionPending: false,
      deletionRequestedAt: undefined,
      cleanupStatus: undefined,
      cleanupInProgressAt: undefined,
    });
  },
});

export const processPendingDeletions = internalMutation({
  args: {},
  handler: async (ctx) => {
    const cutoff = Date.now() - GRACE_PERIOD_MS;

    const ready = await ctx.db
      .query("users")
      .filter((q) =>
        q.and(
          q.eq(q.field("deletionPending"), true),
          q.eq(q.field("cleanupStatus"), "pending"),
          q.lt(q.field("deletionRequestedAt"), cutoff)
        )
      )
      .take(5);

    for (const user of ready) {
      await ctx.scheduler.runAfter(0, internal.lgpd.runDeletionCleanup, {
        userId: user._id,
        phase: "trades_initiator",
        chunk: 0,
      });
    }

    return { processed: ready.length };
  },
});

async function acquireCleanupLease(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<boolean> {
  const user = await ctx.db.get(userId);
  if (!user) return false;
  if (!user.deletionPending) return false;

  const now = Date.now();
  if (
    user.cleanupInProgressAt &&
    now - user.cleanupInProgressAt < CLEANUP_LEASE_MS
  ) {
    return false;
  }

  await ctx.db.patch(userId, {
    cleanupStatus: "running",
    cleanupInProgressAt: now,
  });
  return true;
}

export const runDeletionCleanup = internalMutation({
  args: {
    userId: v.id("users"),
    phase: v.union(
      v.literal("trades_initiator"),
      v.literal("trades_counterparty"),
      v.literal("posts"),
      v.literal("comments"),
      v.literal("reactions"),
      v.literal("checkins"),
      v.literal("scoreBumps"),
      v.literal("tradePoints"),
      v.literal("matches"),
      v.literal("matchInteractions"),
      v.literal("storage"),
      v.literal("final")
    ),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { userId, phase, chunk = 0 }) => {
    if (chunk === 0 && phase === "trades_initiator") {
      const acquired = await acquireCleanupLease(ctx, userId);
      if (!acquired) {
        return { phase, deleted: 0, rescheduled: false, skipped: true };
      }
    }

    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("user-not-found");

    const nextPhase = (current: CleanupPhase): CleanupPhase | null => {
      const phases: CleanupPhase[] = [
        "trades_initiator",
        "trades_counterparty",
        "posts",
        "comments",
        "reactions",
        "checkins",
        "scoreBumps",
        "tradePoints",
        "matches",
        "matchInteractions",
        "storage",
        "final",
      ];
      const idx = phases.indexOf(current);
      const next = phases[idx + 1];
      return next ?? null;
    };

    const scheduleNext = async (currentPhase: CleanupPhase) => {
      const next = nextPhase(currentPhase);
      if (next) {
        await ctx.scheduler.runAfter(0, internal.lgpd.runDeletionCleanup, {
          userId,
          phase: next,
          chunk: 0,
        });
      }
    };

    if (phase === "trades_initiator") {
      const batch = await ctx.db
        .query("trades")
        .withIndex("by_initiator_created", (q) => q.eq("initiatorId", userId))
        .take(CLEANUP_BATCH);

      for (const trade of batch) {
        await ctx.db.patch(trade._id, {
          initiatorDisplayNickname: "[excluído]",
          initiatorAvatarUrl: undefined,
        });
      }

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:trades_initiator",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "trades_counterparty") {
      const batch = await ctx.db
        .query("trades")
        .withIndex("by_counterparty_status", (q) =>
          q.eq("counterpartyId", userId)
        )
        .take(CLEANUP_BATCH);

      for (const trade of batch) {
        await ctx.db.patch(trade._id, {
          counterpartyDisplayNickname: "[excluído]",
          counterpartyAvatarUrl: undefined,
        });
      }

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:trades_counterparty",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "posts") {
      const batch = await ctx.db
        .query("communityPosts")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      await Promise.all(batch.map((p) => ctx.db.delete(p._id)));

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:posts",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "comments") {
      const batch = await ctx.db
        .query("postComments")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      await Promise.all(batch.map((c) => ctx.db.delete(c._id)));

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:comments",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "reactions") {
      const batch = await ctx.db
        .query("postReactions")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      await Promise.all(batch.map((r) => ctx.db.delete(r._id)));

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:reactions",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "checkins") {
      const batch = await ctx.db
        .query("checkins")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      await Promise.all(batch.map((c) => ctx.db.delete(c._id)));

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:checkins",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "scoreBumps") {
      const batch = await ctx.db
        .query("scoreBumps")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      await Promise.all(batch.map((s) => ctx.db.delete(s._id)));

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:scoreBumps",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "tradePoints") {
      const batch = await ctx.db
        .query("userTradePoints")
        .withIndex("by_user", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      await Promise.all(batch.map((t) => ctx.db.delete(t._id)));

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:tradePoints",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "matches") {
      const batch = await ctx.db
        .query("precomputedMatches")
        .withIndex("by_user_layer", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      const batchAsMatched = await ctx.db
        .query("precomputedMatches")
        .withIndex("by_matchedUser", (q) => q.eq("matchedUserId", userId))
        .take(CLEANUP_BATCH);

      const allMatches = [...batch, ...batchAsMatched];
      await Promise.all(allMatches.map((m) => ctx.db.delete(m._id)));

      if (allMatches.length >= CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:matches",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return {
          phase,
          deleted: allMatches.length,
          rescheduled: result.rescheduled,
        };
      }

      await scheduleNext(phase);
      return { phase, deleted: allMatches.length, rescheduled: true };
    }

    if (phase === "matchInteractions") {
      const batch = await ctx.db
        .query("userMatchInteractions")
        .withIndex("by_user_hidden", (q) => q.eq("userId", userId))
        .take(CLEANUP_BATCH);

      await Promise.all(batch.map((m) => ctx.db.delete(m._id)));

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.lgpd.runDeletionCleanup,
          args: { userId, phase },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "lgpd:matchInteractions",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return { phase, deleted: batch.length, rescheduled: result.rescheduled };
      }

      await scheduleNext(phase);
      return { phase, deleted: batch.length, rescheduled: true };
    }

    if (phase === "storage") {
      if (user.avatarStorageId) {
        await ctx.storage.delete(user.avatarStorageId);
      }
      await scheduleNext(phase);
      return { phase, deleted: user.avatarStorageId ? 1 : 0, rescheduled: true };
    }

    if (phase === "final") {
      await ctx.db.delete(userId);
      return { phase, deleted: 1, rescheduled: false, complete: true };
    }

    return { phase, deleted: 0, rescheduled: false };
  },
});
