import { v } from "convex/values";
import {
  internalMutation,
  query,
  type MutationCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { getAuthenticatedUser } from "./lib/auth";
import { haversine } from "./lib/geo";

const PAGE_SIZE = 500;
const TOP_N = 50;
const RETURN_LIMIT = 30;
const RECOMPUTE_DEBOUNCE_MS = 30_000;
const RECOMPUTE_STUCK_MS = 5 * 60_000;
const LIVE_REFRESH_TOP = 5;

type DistanceBucket = "near" | "close" | "mid" | "far" | "unknown";

type CachedMatch = {
  otherUserId: Id<"users">;
  ihaveCount: number;
  ineedCount: number;
  distanceMeters: number | null;
  distanceBucket: DistanceBucket;
  ihaveSample: number[];
  ineedSample: number[];
  score: number;
  hasSpecial: boolean;
  otherAcceptsMail: boolean;
};

function bucketOf(meters: number | null): DistanceBucket {
  if (meters === null) return "unknown";
  if (meters < 1000) return "near";
  if (meters < 3000) return "close";
  if (meters < 8000) return "mid";
  return "far";
}

function intersectSorted(sortedA: number[], setB: Set<number>): number[] {
  const out: number[] = [];
  for (const n of sortedA) if (setB.has(n)) out.push(n);
  return out;
}

function scoreOf(ihave: number, ineed: number): number {
  return Math.min(ihave, ineed) * 2 + Math.max(ihave, ineed);
}

function buildSpecialSet(sections: Doc<"albumConfig">["sections"]): Set<number> {
  const set = new Set<number>();
  for (const s of sections) {
    for (const n of s.goldenNumbers ?? []) set.add(n);
    for (const l of s.legendNumbers ?? []) set.add(l.number);
  }
  return set;
}

async function persistCache(
  ctx: MutationCtx,
  existing: Doc<"userMatchCache"> | null,
  payload: {
    userId: Id<"users">;
    cityId: Id<"cities">;
    matches: CachedMatch[];
    partialMatches: CachedMatch[] | null;
    recomputeCursor: string | null;
    recomputedAt: number;
    recomputeStartedAt: number | null;
    stale: boolean;
  }
): Promise<void> {
  if (existing) {
    await ctx.db.patch(existing._id, {
      cityId: payload.cityId,
      matches: payload.matches,
      partialMatches: payload.partialMatches,
      recomputeCursor: payload.recomputeCursor,
      recomputedAt: payload.recomputedAt,
      recomputeStartedAt: payload.recomputeStartedAt,
      stale: payload.stale,
    });
  } else {
    await ctx.db.insert("userMatchCache", payload);
  }
}

export const recomputeMatchCache = internalMutation({
  args: {
    userId: v.id("users"),
    cursor: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, { userId, cursor }) => {
    const me = await ctx.db.get(userId);
    if (!me) return;

    const existing = await ctx.db
      .query("userMatchCache")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .unique();

    const isContinuation = cursor !== undefined && cursor !== null;

    // Start-of-run dedupe + freshness check.
    if (!isContinuation) {
      if (
        existing &&
        !existing.stale &&
        Date.now() - existing.recomputedAt < RECOMPUTE_DEBOUNCE_MS
      ) {
        return;
      }
      if (
        existing?.recomputeStartedAt != null &&
        Date.now() - existing.recomputeStartedAt < RECOMPUTE_STUCK_MS &&
        existing.recomputeCursor !== null
      ) {
        // Another chain is actively running and not stuck; skip to avoid dupe work.
        return;
      }
    } else if (
      existing?.recomputeStartedAt != null &&
      Date.now() - existing.recomputeStartedAt > RECOMPUTE_STUCK_MS
    ) {
      // Continuation is stale; abandon so a fresh run can start.
      return;
    }

    if (!me.cityId || !me.hasCompletedStickerSetup) {
      if (existing) {
        await ctx.db.delete(existing._id);
      }
      return;
    }

    const cityId = me.cityId;

    const albumConfig = await ctx.db.query("albumConfig").first();
    const specialSet = albumConfig
      ? buildSpecialSet(albumConfig.sections)
      : new Set<number>();

    const myDupSorted = [...(me.duplicates ?? [])].sort((a, b) => a - b);
    const myMissSorted = [...(me.missing ?? [])].sort((a, b) => a - b);

    const accumulator: CachedMatch[] =
      isContinuation && existing?.partialMatches
        ? [...existing.partialMatches]
        : [];

    const page = await ctx.db
      .query("users")
      .withIndex("by_city", (q) => q.eq("cityId", cityId))
      .paginate({ numItems: PAGE_SIZE, cursor: cursor ?? null });

    for (const candidate of page.page) {
      if (candidate._id === me._id) continue;
      if (!candidate.hasCompletedStickerSetup) continue;
      if (candidate.isBanned === true) continue;
      if (candidate.isShadowBanned === true) continue;

      const theirDup = new Set<number>(candidate.duplicates ?? []);
      const theirMiss = new Set<number>(candidate.missing ?? []);
      const ihave = intersectSorted(myDupSorted, theirMiss);
      const ineed = intersectSorted(myMissSorted, theirDup);
      if (ihave.length === 0 || ineed.length === 0) continue;

      let distanceMeters: number | null = null;
      if (
        me.lat != null &&
        me.lng != null &&
        candidate.lat != null &&
        candidate.lng != null
      ) {
        distanceMeters =
          haversine(me.lat, me.lng, candidate.lat, candidate.lng) * 1000;
      }

      accumulator.push({
        otherUserId: candidate._id,
        ihaveCount: ihave.length,
        ineedCount: ineed.length,
        distanceMeters,
        distanceBucket: bucketOf(distanceMeters),
        ihaveSample: ihave.slice(0, 3),
        ineedSample: ineed.slice(0, 3),
        score: scoreOf(ihave.length, ineed.length),
        hasSpecial: ihave.some((n) => specialSet.has(n)),
        otherAcceptsMail: candidate.acceptsMail === true,
      });
    }

    accumulator.sort((a, b) => b.score - a.score);
    const topPartial = accumulator.slice(0, TOP_N);

    if (!page.isDone) {
      await persistCache(ctx, existing, {
        userId,
        cityId,
        matches: existing?.matches ?? [],
        partialMatches: topPartial,
        recomputeCursor: page.continueCursor,
        recomputedAt: existing?.recomputedAt ?? 0,
        recomputeStartedAt:
          existing?.recomputeStartedAt ?? Date.now(),
        stale: true,
      });
      await ctx.scheduler.runAfter(0, internal.matches.recomputeMatchCache, {
        userId,
        cursor: page.continueCursor,
      });
      return;
    }

    await persistCache(ctx, existing, {
      userId,
      cityId,
      matches: topPartial,
      partialMatches: null,
      recomputeCursor: null,
      recomputedAt: Date.now(),
      recomputeStartedAt: null,
      stale: false,
    });
  },
});

export const findUserMatches = query({
  args: {
    radiusKm: v.optional(v.number()),
    acceptsMailOnly: v.optional(v.boolean()),
    onlySpecials: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const me = await getAuthenticatedUser(ctx);
    if (!me) {
      return {
        status: "unauth" as const,
        matches: [] as MatchView[],
        effectiveRadiusKm: args.radiusKm ?? null,
        isPremium: false,
      };
    }
    if (!me.cityId) {
      return {
        status: "needs-city" as const,
        matches: [] as MatchView[],
        effectiveRadiusKm: args.radiusKm ?? null,
        isPremium: me.isPremium === true,
      };
    }
    if (!me.hasCompletedStickerSetup) {
      return {
        status: "needs-setup" as const,
        matches: [] as MatchView[],
        effectiveRadiusKm: args.radiusKm ?? null,
        isPremium: me.isPremium === true,
      };
    }

    const cache = await ctx.db
      .query("userMatchCache")
      .withIndex("by_user", (q) => q.eq("userId", me._id))
      .unique();

    if (!cache || cache.recomputedAt === 0) {
      return {
        status: "computing" as const,
        matches: [] as MatchView[],
        effectiveRadiusKm: args.radiusKm ?? null,
        isPremium: me.isPremium === true,
      };
    }

    const requestedRadius = args.radiusKm;
    const effectiveRadiusKm =
      requestedRadius === 50 && me.isPremium !== true ? 30 : requestedRadius;
    const maxMeters =
      effectiveRadiusKm !== undefined && effectiveRadiusKm !== null
        ? effectiveRadiusKm * 1000
        : Infinity;

    const filtered = cache.matches.filter((m) => {
      if (m.distanceMeters !== null && m.distanceMeters > maxMeters) {
        return false;
      }
      if (args.acceptsMailOnly && !m.otherAcceptsMail) return false;
      if (args.onlySpecials && !m.hasSpecial) return false;
      return true;
    });

    const top = filtered.slice(0, RETURN_LIMIT);

    const myDupSet = new Set<number>(me.duplicates ?? []);
    const myMissSet = new Set<number>(me.missing ?? []);

    const enriched: MatchView[] = [];
    for (let i = 0; i < top.length; i++) {
      const m = top[i];
      if (!m) continue;
      const other = await ctx.db.get(m.otherUserId);
      if (!other) continue;

      let ihaveCount = m.ihaveCount;
      let ineedCount = m.ineedCount;
      let ihaveSample = m.ihaveSample;
      let ineedSample = m.ineedSample;

      if (i < LIVE_REFRESH_TOP) {
        const theirDup = new Set<number>(other.duplicates ?? []);
        const theirMiss = new Set<number>(other.missing ?? []);
        const ihave: number[] = [];
        const ineed: number[] = [];
        for (const n of myDupSet) if (theirMiss.has(n)) ihave.push(n);
        for (const n of myMissSet) if (theirDup.has(n)) ineed.push(n);
        ihave.sort((a, b) => a - b);
        ineed.sort((a, b) => a - b);
        ihaveCount = ihave.length;
        ineedCount = ineed.length;
        ihaveSample = ihave.slice(0, 3);
        ineedSample = ineed.slice(0, 3);
        if (ihaveCount === 0 || ineedCount === 0) continue;
      }

      enriched.push({
        otherUserId: m.otherUserId,
        displayNickname:
          other.displayNickname ?? other.nickname ?? other.name,
        reliabilityScore: other.reliabilityScore,
        totalTrades: other.totalTrades ?? 0,
        lastActiveAt: other.lastActiveAt ?? null,
        isPremium: other.isPremium === true,
        avatarUrl: other.avatarUrl ?? null,
        ihaveCount,
        ineedCount,
        ihaveSample,
        ineedSample,
        distanceBucket: m.distanceBucket,
        hasSpecial: m.hasSpecial,
      });
    }

    return {
      status: cache.stale ? ("computing" as const) : ("ready" as const),
      matches: enriched,
      effectiveRadiusKm: effectiveRadiusKm ?? null,
      isPremium: me.isPremium === true,
    };
  },
});

export type MatchView = {
  otherUserId: Id<"users">;
  displayNickname: string;
  reliabilityScore: number;
  totalTrades: number;
  lastActiveAt: number | null;
  isPremium: boolean;
  avatarUrl: string | null;
  ihaveCount: number;
  ineedCount: number;
  ihaveSample: number[];
  ineedSample: number[];
  distanceBucket: DistanceBucket;
  hasSpecial: boolean;
};

/**
 * Admin/dev: one-shot backfill of pointType + acceptsMail defaults for existing tradePoints.
 * Run with: npx convex run matches:backfillTradePointType
 */
export const backfillTradePointType = internalMutation({
  args: {},
  handler: async (ctx) => {
    const points = await ctx.db.query("tradePoints").collect();
    let touched = 0;
    for (const p of points) {
      const patch: { pointType?: "fixed"; acceptsMail?: boolean } = {};
      if (p.pointType === undefined) patch.pointType = "fixed";
      if (p.acceptsMail === undefined) patch.acceptsMail = false;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(p._id, patch);
        touched += 1;
      }
    }
    return { touched, total: points.length };
  },
});
