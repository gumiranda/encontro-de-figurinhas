import { ConvexError, v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation, query } from "./_generated/server";
import { rescheduleIfMore } from "./_helpers/pagination";
import { checkAuth } from "./lib/auth";
import {
  arraysEqual,
  buildCheckinDenormFields,
  getActiveCheckin,
  normalizeCheckinDenorm,
} from "./lib/checkinHelpers";
import { getBrazilHour, haversine, isInBrazil } from "./lib/geo";
import {
  CHECKIN_DURATION_MS,
  MAX_CHECKIN_DISTANCE_KM,
  PEAK_HOURS_DECAY_FACTOR,
  PEAK_HOURS_FLOOR_AFTER_ACTIVITY,
  SCORE_BUMP_AMOUNT,
  SCORE_BUMP_COOLDOWN_MS,
} from "./lib/limits";

export const create = mutation({
  args: {
    tradePointId: v.id("tradePoints"),
    lat: v.float64(),
    lng: v.float64(),
  },
  handler: async (ctx, { tradePointId, lat, lng }) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { ok: false as const, error: auth.state };
    }
    const user = auth.user;

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      throw new Error("Invalid location");
    }
    if (!isInBrazil(lat, lng)) {
      throw new Error("Invalid location");
    }

    const point = await ctx.db.get(tradePointId);
    if (!point || point.status !== "approved") {
      return { ok: false as const, error: "point-unavailable" as const };
    }

    const isMember = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", tradePointId)
      )
      .unique();
    if (!isMember) {
      return { ok: false as const, error: "not-member" as const };
    }

    const distanceKm = haversine(lat, lng, point.lat, point.lng);
    if (distanceKm > MAX_CHECKIN_DISTANCE_KM) {
      return {
        ok: false as const,
        error: "too-far" as const,
        distanceMeters: Math.round(distanceKm * 1000),
      };
    }

    const now = Date.now();
    const expiresAt = now + CHECKIN_DURATION_MS;

    const previous = await getActiveCheckin(ctx, user._id);

    // Renewal no MESMO ponto: só estende expiresAt. Sem flicker UI, sem bump.
    if (previous && previous.tradePointId === tradePointId) {
      await ctx.db.patch(previous._id, {
        expiresAt,
        lat,
        lng,
        distanceMeters: Math.round(distanceKm * 1000),
      });
      return {
        ok: true as const,
        expiresAt,
        replacedPrevious: false,
        renewed: true,
      };
    }

    // Auto-overwrite cross-point: deleta antigo, decrementa ponto antigo
    let replacedPrevious = false;
    if (previous) {
      replacedPrevious = true;
      if (previous.countedInPublic) {
        const oldPoint = await ctx.db.get(previous.tradePointId);
        if (oldPoint) {
          await ctx.db.patch(previous.tradePointId, {
            activeCheckinsCount: Math.max(
              0,
              (oldPoint.activeCheckinsCount ?? 0) - 1
            ),
          });
        }
      }
      await ctx.db.delete(previous._id);
    }

    const countedInPublic = !user.isShadowBanned;

    await ctx.db.insert("checkins", {
      userId: user._id,
      tradePointId,
      lat,
      lng,
      distanceMeters: Math.round(distanceKm * 1000),
      expiresAt,
      createdAt: now,
      countedInPublic,
      // Denormalized fields for listPresentMatchesAtPoint (avoids N+1 reads)
      ...buildCheckinDenormFields(user),
    });

    if (countedInPublic) {
      const currentHour = getBrazilHour(now);
      const peakHours = (point.peakHours ?? Array(24).fill(0)).slice();
      peakHours[currentHour] = (peakHours[currentHour] ?? 0) + 1;

      const cooldownStart = now - SCORE_BUMP_COOLDOWN_MS;
      const recentBump = await ctx.db
        .query("scoreBumps")
        .withIndex("by_user_point_time", (q) =>
          q
            .eq("userId", user._id)
            .eq("tradePointId", tradePointId)
            .gt("at", cooldownStart)
        )
        .first();
      const shouldBumpScore = !recentBump;

      const patch: Partial<Doc<"tradePoints">> = {
        activeCheckinsCount: (point.activeCheckinsCount ?? 0) + 1,
        lastActivityAt: now,
        peakHours,
      };
      if (shouldBumpScore) {
        patch.confidenceScore = Math.min(
          10,
          point.confidenceScore + SCORE_BUMP_AMOUNT
        );
      }
      await ctx.db.patch(tradePointId, patch);

      if (shouldBumpScore) {
        await ctx.db.insert("scoreBumps", {
          userId: user._id,
          tradePointId,
          at: now,
        });
      }
    }

    return {
      ok: true as const,
      expiresAt,
      replacedPrevious,
      renewed: false,
    };
  },
});

export const cancelMine = mutation({
  args: {},
  handler: async (ctx) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { ok: false as const, error: auth.state };
    }
    const user = auth.user;

    const active = await getActiveCheckin(ctx, user._id);

    if (!active) return { ok: true as const, cancelled: false };

    if (active.countedInPublic) {
      const point = await ctx.db.get(active.tradePointId);
      if (point) {
        await ctx.db.patch(active.tradePointId, {
          activeCheckinsCount: Math.max(
            0,
            (point.activeCheckinsCount ?? 0) - 1
          ),
        });
      }
    }
    await ctx.db.delete(active._id);
    return { ok: true as const, cancelled: true };
  },
});

/** User IDs with an active, public check-in at each of the caller's trade points (max 20 per point). */
export const listPresentAtMyPoints = query({
  args: {},
  handler: async (ctx) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") return { present: [] as Id<"users">[] };

    const now = Date.now();

    const myMemberships = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user", (q) => q.eq("userId", auth.user._id))
      .take(100);

    const checkinsByPoint = await Promise.all(
      myMemberships.map((m) =>
        ctx.db
          .query("checkins")
          .withIndex("by_tradePoint_expiresAt_countedInPublic", (q) =>
            q
              .eq("tradePointId", m.tradePointId)
              .eq("countedInPublic", true)
              .gt("expiresAt", now)
          )
          .take(20)
      )
    );

    const presentUserIds: Id<"users">[] = [];
    for (const checkins of checkinsByPoint) {
      for (const c of checkins) {
        if (c.userId !== auth.user._id) {
          presentUserIds.push(c.userId);
        }
      }
    }

    return { present: presentUserIds };
  },
});

/** Active check-in for share CTA + "estou no ponto" empty states. */
export const getMyActiveCheckinSummary = query({
  args: {},
  handler: async (ctx) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return {
        hasActiveCheckin: false as const,
        tradePointSlug: null,
        tradePointId: null,
      };
    }

    const active = await getActiveCheckin(ctx, auth.user._id);

    if (!active) {
      return {
        hasActiveCheckin: false as const,
        tradePointSlug: null,
        tradePointId: null,
      };
    }

    const point = await ctx.db.get(active.tradePointId);
    return {
      hasActiveCheckin: true as const,
      tradePointSlug: point?.slug ?? null,
      tradePointId: active.tradePointId,
    };
  },
});

const EXPIRE_BATCH_SIZE = 50;
const EXPIRE_MAX_CHUNKS = 200;

export const expireCheckins = internalMutation({
  args: {
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { chunk = 0 }) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("checkins")
      .withIndex("by_expiresAt", (q) => q.lte("expiresAt", now))
      .take(EXPIRE_BATCH_SIZE);

    // Collect decrements per tradePoint (already consolidated)
    const decrements = new Map<Id<"tradePoints">, number>();
    for (const checkin of expired) {
      if (checkin.countedInPublic) {
        decrements.set(
          checkin.tradePointId,
          (decrements.get(checkin.tradePointId) ?? 0) + 1
        );
      }
    }

    // BARRIER 1: Delete all checkins in parallel
    await Promise.all(expired.map((c) => ctx.db.delete(c._id)));

    // BARRIER 2: Batch get+patch for each unique tradePoint (after deletes complete)
    const tradePointIds = [...decrements.keys()];
    const points = await Promise.all(tradePointIds.map((id) => ctx.db.get(id)));

    await Promise.all(
      tradePointIds.map((id, i) => {
        const point = points[i];
        if (!point) return;
        const count = decrements.get(id) ?? 0;
        return ctx.db.patch(id, {
          activeCheckinsCount: Math.max(0, (point.activeCheckinsCount ?? 0) - count),
        });
      })
    );

    const result = await rescheduleIfMore(ctx, {
      self: internal.checkins.expireCheckins,
      args: {},
      hasMore: expired.length === EXPIRE_BATCH_SIZE,
      chunk,
      maxChunks: EXPIRE_MAX_CHUNKS,
      label: "expireCheckins",
    });

    return { expired: expired.length, aborted: result.aborted ?? false };
  },
});

/**
 * Cleanup quando admin shadow-bana um usuário.
 * Duas fases (checkins → scoreBumps) em batches de CLEANUP_BATCH via scheduler.runAfter.
 *
 * Caller deve setar isShadowBanned=true ou deletionPending=true ANTES de agendar,
 * para UI esconder o conteúdo imediatamente. A precondition lança ConvexError caso
 * contrário. Idempotência via cleanupInProgressAt (lease de CLEANUP_LEASE_MS).
 *
 * cleanupStatus final: "complete" se drenou ambas fases, "partial" se hit MAX_CHUNKS.
 */
const CLEANUP_BATCH = 50;
const CLEANUP_MAX_CHUNKS = 400;
const CLEANUP_LEASE_MS = 10 * 60_000;

export const cleanupForShadowBannedUser = internalMutation({
  args: {
    userId: v.id("users"),
    phase: v.optional(
      v.union(v.literal("checkins"), v.literal("scoreBumps"))
    ),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { userId, phase = "checkins", chunk = 0 }) => {
    const user = await ctx.db.get(userId);
    if (!user) throw new ConvexError("cleanup-user-not-found");
    if (!user.isShadowBanned && !user.deletionPending) {
      throw new ConvexError("cleanup-precondition-not-met");
    }
    const now = Date.now();
    if (
      chunk === 0 &&
      phase === "checkins" &&
      user.cleanupInProgressAt &&
      now - user.cleanupInProgressAt < CLEANUP_LEASE_MS
    ) {
      console.warn("cleanupForShadowBannedUser: lease ativo, skip", {
        userId,
      });
      return { deleted: 0, phase, rescheduled: false };
    }
    await ctx.db.patch(userId, {
      cleanupStatus: "running",
      cleanupInProgressAt: now,
    });

    if (phase === "checkins") {
      const batch = await ctx.db
        .query("checkins")
        .withIndex("by_user_active", (q) =>
          q.eq("userId", userId).gt("expiresAt", now)
        )
        .take(CLEANUP_BATCH);

      // Collect decrements per tradePoint
      const decrements = new Map<Id<"tradePoints">, number>();
      for (const c of batch) {
        if (c.countedInPublic) {
          decrements.set(
            c.tradePointId,
            (decrements.get(c.tradePointId) ?? 0) + 1
          );
        }
      }

      // BARRIER 1: Delete all checkins in parallel
      await Promise.all(batch.map((c) => ctx.db.delete(c._id)));

      // BARRIER 2: Batch get+patch for each unique tradePoint
      const tradePointIds = [...decrements.keys()];
      const points = await Promise.all(tradePointIds.map((id) => ctx.db.get(id)));

      await Promise.all(
        tradePointIds.map((id, i) => {
          const point = points[i];
          if (!point) return;
          const count = decrements.get(id) ?? 0;
          return ctx.db.patch(id, {
            activeCheckinsCount: Math.max(0, (point.activeCheckinsCount ?? 0) - count),
          });
        })
      );

      if (batch.length === CLEANUP_BATCH) {
        const result = await rescheduleIfMore(ctx, {
          self: internal.checkins.cleanupForShadowBannedUser,
          args: { userId, phase: "checkins" },
          hasMore: true,
          chunk,
          maxChunks: CLEANUP_MAX_CHUNKS,
          label: "cleanupForShadowBannedUser:checkins",
        });
        if (result.aborted) {
          await ctx.db.patch(userId, { cleanupStatus: "partial" });
        }
        return {
          deleted: batch.length,
          phase: "checkins",
          rescheduled: result.rescheduled,
        };
      }
      await ctx.scheduler.runAfter(
        0,
        internal.checkins.cleanupForShadowBannedUser,
        { userId, phase: "scoreBumps", chunk: 0 }
      );
      return { deleted: batch.length, phase: "checkins", rescheduled: true };
    }

    const scoreBumpBatch = await ctx.db
      .query("scoreBumps")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .take(CLEANUP_BATCH);

    // Batch delete all scoreBumps in parallel
    await Promise.all(scoreBumpBatch.map((r) => ctx.db.delete(r._id)));

    if (scoreBumpBatch.length === CLEANUP_BATCH) {
      const result = await rescheduleIfMore(ctx, {
        self: internal.checkins.cleanupForShadowBannedUser,
        args: { userId, phase: "scoreBumps" },
        hasMore: true,
        chunk,
        maxChunks: CLEANUP_MAX_CHUNKS,
        label: "cleanupForShadowBannedUser:scoreBumps",
      });
      if (result.aborted) {
        await ctx.db.patch(userId, { cleanupStatus: "partial" });
      }
      return {
        deleted: scoreBumpBatch.length,
        phase: "scoreBumps",
        rescheduled: result.rescheduled,
      };
    }

    await ctx.db.patch(userId, { cleanupStatus: "complete" });
    return {
      deleted: scoreBumpBatch.length,
      phase: "scoreBumps",
      rescheduled: false,
    };
  },
});

const DECAY_BATCH = 200;
const DECAY_MAX_CHUNKS = 50;

export const decayPeakHours = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, chunk = 0 }) => {
    const page = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .paginate({ numItems: DECAY_BATCH, cursor: cursor ?? null });

    // Collect patches to apply (skip if values unchanged to reduce writes)
    const patches: { id: Id<"tradePoints">; peakHours: number[] }[] = [];
    for (const point of page.page) {
      if (!point.peakHours || point.peakHours.length === 0) continue;
      const decayed = point.peakHours.map((h) => {
        const original = h ?? 0;
        if (original === 0) return 0;
        const next = Math.floor(original * PEAK_HOURS_DECAY_FACTOR);
        return Math.max(next, PEAK_HOURS_FLOOR_AFTER_ACTIVITY);
      });
      // Skip patch if values unchanged
      if (!arraysEqual(point.peakHours, decayed)) {
        patches.push({ id: point._id, peakHours: decayed });
      }
    }

    // Batch apply all patches in parallel
    await Promise.all(
      patches.map((p) => ctx.db.patch(p.id, { peakHours: p.peakHours }))
    );
    const processed = patches.length;

    if (!page.isDone) {
      const result = await rescheduleIfMore(ctx, {
        self: internal.checkins.decayPeakHours,
        args: { cursor: page.continueCursor },
        hasMore: true,
        chunk,
        maxChunks: DECAY_MAX_CHUNKS,
        label: "decayPeakHours",
      });
      return { processed, rescheduled: result.rescheduled };
    }

    return { processed, rescheduled: false };
  },
});

const SCOREBUMP_RETENTION_MS = SCORE_BUMP_COOLDOWN_MS + 24 * 60 * 60 * 1000;
const PRUNE_BATCH = 100;
const PRUNE_MAX_CHUNKS = 100;

export const pruneScoreBumps = internalMutation({
  args: { chunk: v.optional(v.number()) },
  handler: async (ctx, { chunk }) => {
    const cutoff = Date.now() - SCOREBUMP_RETENTION_MS;
    const expired = await ctx.db
      .query("scoreBumps")
      .withIndex("by_at", (q) => q.lt("at", cutoff))
      .take(PRUNE_BATCH);

    // Batch delete all expired scoreBumps in parallel
    await Promise.all(expired.map((row) => ctx.db.delete(row._id)));

    if (expired.length === PRUNE_BATCH) {
      const nextChunk = (chunk ?? 0) + 1;
      if (nextChunk >= PRUNE_MAX_CHUNKS) {
        console.error("pruneScoreBumps: hit MAX_CHUNKS guard", {
          chunk: nextChunk,
        });
        return { deleted: expired.length, aborted: true };
      }
      await ctx.scheduler.runAfter(0, internal.checkins.pruneScoreBumps, {
        chunk: nextChunk,
      });
    }
    return { deleted: expired.length };
  },
});

const BACKFILL_BATCH = 50;

/**
 * Backfill denormalized fields (displayNickname, avatarSeed, duplicates) for existing check-ins.
 * Idempotent: only patches rows missing the fields. Run once manually via dashboard.
 */
export const backfillCheckinDenormFields = internalMutation({
  args: { cursor: v.optional(v.string()) },
  handler: async (ctx, { cursor }) => {
    const now = Date.now();
    const page = await ctx.db
      .query("checkins")
      .withIndex("by_expiresAt", (q) => q.gt("expiresAt", now))
      .paginate({ numItems: BACKFILL_BATCH, cursor: cursor ?? null });

    const needsBackfill = page.page.filter(
      (c) =>
        c.displayNickname === undefined ||
        c.avatarSeed === undefined ||
        c.duplicates === undefined
    );

    if (needsBackfill.length === 0 && page.isDone) {
      return { patched: 0, done: true };
    }

    const userIds = [...new Set(needsBackfill.map((c) => c.userId))];
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
    const userMap = new Map(
      users.filter(Boolean).map((u) => [u!._id, u!])
    );

    await Promise.all(
      needsBackfill.map((c) => {
        const user = userMap.get(c.userId);
        if (!user) return;
        return ctx.db.patch(c._id, buildCheckinDenormFields(user));
      })
    );

    if (!page.isDone) {
      await ctx.scheduler.runAfter(0, internal.checkins.backfillCheckinDenormFields, {
        cursor: page.continueCursor,
      });
      return { patched: needsBackfill.length, done: false };
    }

    return { patched: needsBackfill.length, done: true };
  },
});

const PRESENT_MATCHES_CAP = 50;
const STICKER_SAMPLE_LIMIT = 20;

const matchRowValidator = v.object({
  checkinId: v.id("checkins"),
  userId: v.id("users"),
  displayNickname: v.string(),
  avatarSeed: v.string(),
  checkinAt: v.number(),
  distanceMeters: v.number(),
  matchingStickers: v.array(v.number()),
  totalMatches: v.number(),
  myMatchingStickers: v.array(v.number()),
  myMatchingTotal: v.number(),
  albumCompletionPct: v.number(),
  totalTrades: v.number(),
  isPremium: v.boolean(),
  isVerified: v.boolean(),
  hasProfileData: v.boolean(),
});

const listPresentMatchesReturn = v.union(
  v.object({ state: v.literal("needs-auth") }),
  v.object({ state: v.literal("banned") }),
  v.object({ state: v.literal("no-stickers") }),
  v.object({ state: v.literal("no-needs") }),
  v.object({ state: v.literal("not-found") }),
  v.object({
    state: v.literal("ready"),
    matches: v.array(matchRowValidator),
    truncated: v.boolean(),
    myMissingCount: v.number(),
  })
);

/**
 * List users present at a trade point who have stickers the caller needs.
 * Uses denormalized fields on check-ins to avoid N+1 reads.
 */
export const listPresentMatchesAtPoint = query({
  args: { tradePointId: v.id("tradePoints") },
  returns: listPresentMatchesReturn,
  handler: async (ctx, { tradePointId }) => {
    const auth = await checkAuth(ctx);
    if (auth.state === "needs-auth") {
      return { state: "needs-auth" as const };
    }
    if (auth.state === "banned") {
      return { state: "banned" as const };
    }
    if (auth.state !== "ok") {
      return { state: "needs-auth" as const };
    }
    const user = auth.user;

    if (!user.hasCompletedStickerSetup) {
      return { state: "no-stickers" as const };
    }

    const myMissing = user.missing ?? [];
    if (myMissing.length === 0) {
      return { state: "no-needs" as const };
    }

    const point = await ctx.db.get(tradePointId);
    if (!point || point.status !== "approved") {
      return { state: "not-found" as const };
    }

    const myMissingSet = new Set(myMissing);
    const myDupSet = new Set(user.duplicates ?? []);
    const now = Date.now();

    const checkins = await ctx.db
      .query("checkins")
      .withIndex("by_tradePoint_expiresAt_countedInPublic", (q) =>
        q
          .eq("tradePointId", tradePointId)
          .eq("countedInPublic", true)
          .gt("expiresAt", now)
      )
      .take(PRESENT_MATCHES_CAP);

    const truncated = checkins.length === PRESENT_MATCHES_CAP;

    type MatchRow = {
      checkinId: Id<"checkins">;
      userId: Id<"users">;
      displayNickname: string;
      avatarSeed: string;
      checkinAt: number;
      distanceMeters: number;
      matchingStickers: number[];
      totalMatches: number;
      myMatchingStickers: number[];
      myMatchingTotal: number;
      albumCompletionPct: number;
      totalTrades: number;
      isPremium: boolean;
      isVerified: boolean;
      hasProfileData: boolean;
    };

    const matchRows: MatchRow[] = [];

    for (const c of checkins) {
      if (c.userId === user._id) continue;

      const norm = normalizeCheckinDenorm(c);
      const matching = norm.duplicates.filter((n) => myMissingSet.has(n));
      if (matching.length === 0) continue;

      // Reverse direction: my dups ∩ their missing.
      // Set on the smaller-iteration side (myDupSet via for-of).
      // userMissing stays server-internal — never emitted in matchRowValidator.
      const theirMissingSet = new Set(norm.userMissing);
      const myMatching: number[] = [];
      for (const n of myDupSet) {
        if (theirMissingSet.has(n)) myMatching.push(n);
      }

      matchRows.push({
        checkinId: c._id,
        userId: c.userId,
        displayNickname: norm.displayNickname,
        avatarSeed: norm.avatarSeed,
        checkinAt: c.createdAt,
        distanceMeters: c.distanceMeters,
        matchingStickers: matching.slice(0, STICKER_SAMPLE_LIMIT),
        totalMatches: matching.length,
        myMatchingStickers: myMatching.slice(0, STICKER_SAMPLE_LIMIT),
        myMatchingTotal: myMatching.length,
        albumCompletionPct: norm.albumCompletionPct,
        totalTrades: norm.totalTrades,
        isPremium: norm.isPremium,
        isVerified: norm.isVerified,
        hasProfileData: norm.hasProfileData,
      });
    }

    matchRows.sort((a, b) => {
      if (b.totalMatches !== a.totalMatches) {
        return b.totalMatches - a.totalMatches;
      }
      return b.checkinAt - a.checkinAt;
    });

    return {
      state: "ready" as const,
      matches: matchRows,
      truncated,
      myMissingCount: myMissing.length,
    };
  },
});
