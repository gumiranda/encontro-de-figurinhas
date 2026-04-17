import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, mutation } from "./_generated/server";
import { authErrorValidators, checkAuth } from "./lib/auth";
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
  returns: v.union(
    v.object({
      ok: v.literal(true),
      expiresAt: v.number(),
      replacedPrevious: v.boolean(),
      renewed: v.boolean(),
    }),
    ...authErrorValidators,
    v.object({
      ok: v.literal(false),
      error: v.literal("too-far"),
      distanceMeters: v.number(),
    }),
    v.object({ ok: v.literal(false), error: v.literal("not-member") }),
    v.object({ ok: v.literal(false), error: v.literal("point-unavailable") })
  ),
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

    const previous = await ctx.db
      .query("checkins")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", user._id).gt("expiresAt", now)
      )
      .first();

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
  returns: v.union(
    v.object({ ok: v.literal(true), cancelled: v.boolean() }),
    ...authErrorValidators
  ),
  handler: async (ctx) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { ok: false as const, error: auth.state };
    }
    const user = auth.user;

    const now = Date.now();
    const active = await ctx.db
      .query("checkins")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", user._id).gt("expiresAt", now)
      )
      .first();

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

const EXPIRE_BATCH_SIZE = 50;

export const expireCheckins = internalMutation({
  args: {},
  returns: v.object({ expired: v.number() }),
  handler: async (ctx) => {
    const now = Date.now();
    const expired = await ctx.db
      .query("checkins")
      .withIndex("by_expiresAt", (q) => q.lte("expiresAt", now))
      .take(EXPIRE_BATCH_SIZE);

    const decrements = new Map<Id<"tradePoints">, number>();
    for (const checkin of expired) {
      if (checkin.countedInPublic) {
        decrements.set(
          checkin.tradePointId,
          (decrements.get(checkin.tradePointId) ?? 0) + 1
        );
      }
      await ctx.db.delete(checkin._id);
    }

    for (const [tradePointId, count] of decrements) {
      const point = await ctx.db.get(tradePointId);
      if (point) {
        await ctx.db.patch(tradePointId, {
          activeCheckinsCount: Math.max(
            0,
            (point.activeCheckinsCount ?? 0) - count
          ),
        });
      }
    }

    if (expired.length === EXPIRE_BATCH_SIZE) {
      await ctx.scheduler.runAfter(0, internal.checkins.expireCheckins, {});
    }

    return { expired: expired.length };
  },
});

/**
 * Cleanup quando admin shadow-bana um usuário.
 * Deleta checkins ativos + decrementa contagens públicas + deleta scoreBumps do user.
 *
 * NÃO é invocada por mutations desta tela (escopo: tela admin/moderação separada).
 * Exposta como API interna para a tela de admin que setará isShadowBanned = true OU
 * isBanned = true OU para a tela de delete-account.
 */
export const cleanupForShadowBannedUser = internalMutation({
  args: { userId: v.id("users") },
  returns: v.object({
    cleanedCheckins: v.number(),
    cleanedScoreBumps: v.number(),
  }),
  handler: async (ctx, { userId }) => {
    const now = Date.now();
    const activeCheckins = await ctx.db
      .query("checkins")
      .withIndex("by_user_active", (q) =>
        q.eq("userId", userId).gt("expiresAt", now)
      )
      .collect();

    const decrements = new Map<Id<"tradePoints">, number>();
    for (const checkin of activeCheckins) {
      if (checkin.countedInPublic) {
        decrements.set(
          checkin.tradePointId,
          (decrements.get(checkin.tradePointId) ?? 0) + 1
        );
      }
      await ctx.db.delete(checkin._id);
    }

    for (const [tradePointId, count] of decrements) {
      const point = await ctx.db.get(tradePointId);
      if (point) {
        await ctx.db.patch(tradePointId, {
          activeCheckinsCount: Math.max(
            0,
            (point.activeCheckinsCount ?? 0) - count
          ),
        });
      }
    }

    const scoreBumps = await ctx.db
      .query("scoreBumps")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect();
    for (const row of scoreBumps) {
      await ctx.db.delete(row._id);
    }

    return {
      cleanedCheckins: activeCheckins.length,
      cleanedScoreBumps: scoreBumps.length,
    };
  },
});

const DECAY_RESCALE_THRESHOLD = 3000;

export const decayPeakHours = internalMutation({
  args: {},
  returns: v.object({ processed: v.number() }),
  handler: async (ctx) => {
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .collect();

    if (points.length >= DECAY_RESCALE_THRESHOLD) {
      throw new Error(
        `decayPeakHours: ${points.length} approved points >= threshold ${DECAY_RESCALE_THRESHOLD}. Re-introduzir paginação (ver git history dessa função antes do v13).`
      );
    }

    let processed = 0;
    for (const point of points) {
      if (!point.peakHours || point.peakHours.length === 0) continue;
      const decayed = point.peakHours.map((h) => {
        const original = h ?? 0;
        if (original === 0) return 0;
        const next = Math.floor(original * PEAK_HOURS_DECAY_FACTOR);
        return Math.max(next, PEAK_HOURS_FLOOR_AFTER_ACTIVITY);
      });
      await ctx.db.patch(point._id, { peakHours: decayed });
      processed++;
    }

    return { processed };
  },
});

const SCOREBUMP_RETENTION_MS = SCORE_BUMP_COOLDOWN_MS + 24 * 60 * 60 * 1000;
const PRUNE_BATCH = 100;
const PRUNE_MAX_CHUNKS = 100;

export const pruneScoreBumps = internalMutation({
  args: { chunk: v.optional(v.number()) },
  returns: v.object({
    deleted: v.number(),
    aborted: v.optional(v.boolean()),
  }),
  handler: async (ctx, { chunk }) => {
    const cutoff = Date.now() - SCOREBUMP_RETENTION_MS;
    const expired = await ctx.db
      .query("scoreBumps")
      .withIndex("by_at", (q) => q.lt("at", cutoff))
      .take(PRUNE_BATCH);

    for (const row of expired) {
      await ctx.db.delete(row._id);
    }

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
