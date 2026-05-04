import { v } from "convex/values";
import { internal } from "./_generated/api";
import type { Doc, Id } from "./_generated/dataModel";
import { internalMutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import { rescheduleIfMore } from "./_helpers/pagination";
import { checkAuth, getAuthenticatedUser } from "./lib/auth";
import { getActiveCheckin } from "./lib/checkinHelpers";
import { haversine } from "./lib/geo";
import { computeStickerOverlap } from "./lib/stickerOverlap";
import { getUserDisplayName } from "./lib/userDisplay";
import { readSpecialNumbersFromSiteStats } from "./siteStats";

// In-memory cache for static albumSections (changes ~1x/year).
// Survives across queries in the same isolate; falls back to DB on cold start.
let _albumSectionsCache: Doc<"albumSections">[] | null = null;
let _albumSectionsCacheTs = 0;
const ALBUM_SECTIONS_CACHE_TTL_MS = 60_000;

async function getCachedAlbumSections(ctx: QueryCtx): Promise<Doc<"albumSections">[]> {
  const now = Date.now();
  if (_albumSectionsCache && now - _albumSectionsCacheTs < ALBUM_SECTIONS_CACHE_TTL_MS) {
    return _albumSectionsCache;
  }
  const rows = await ctx.db.query("albumSections").collect();
  _albumSectionsCache = rows;
  _albumSectionsCacheTs = now;
  return rows;
}

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

function roundDistanceKmHalf(km: number): number {
  return Math.round(km * 2) / 2;
}

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

async function buildSpecialSet(ctx: QueryCtx): Promise<Set<number>> {
  const nums = await readSpecialNumbersFromSiteStats(ctx);
  return new Set(nums);
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
    specialNumbers: v.optional(v.array(v.number())),
  },
  handler: async (ctx, { userId, cursor, specialNumbers }) => {
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

    const specialSet =
      specialNumbers !== undefined
        ? new Set(specialNumbers)
        : await buildSpecialSet(ctx);

    const myDupSorted = [...(me.duplicates ?? [])].sort((a, b) => a - b);
    const myMissSorted = [...(me.missing ?? [])].sort((a, b) => a - b);

    const accumulator: CachedMatch[] =
      isContinuation && existing?.partialMatches ? [...existing.partialMatches] : [];

    const page = await ctx.db
      .query("users")
      .withIndex("by_sticker_setup", (q) =>
        q.eq("hasCompletedStickerSetup", true).eq("cityId", cityId)
      )
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
        distanceMeters = haversine(me.lat, me.lng, candidate.lat, candidate.lng) * 1000;
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
        recomputeStartedAt: existing?.recomputeStartedAt ?? Date.now(),
        stale: true,
      });
      await ctx.scheduler.runAfter(0, internal.matches.recomputeMatchCache, {
        userId,
        cursor: page.continueCursor,
        specialNumbers: [...specialSet],
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

const MATCH_RECOMPUTE_SCHEDULE_DEBOUNCE_MS = 5000;
const MATCH_RECOMPUTE_RUN_AFTER_MS = 5000;

/**
 * Idempotent debounce: repeated sticker updates within 5s schedule at most one
 * {@link recomputeForUser} run (5s after the first qualifying patch).
 *
 * Note: Scheduled jobs aren't cancelled on logout/unmount. This is acceptable because
 * {@link recomputeMatchCache} has a freshness check (lines 107-122) that short-circuits
 * stale/orphan jobs with early returns, preventing unnecessary work.
 */
export async function scheduleDebouncedMatchRecompute(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<void> {
  const user = await ctx.db.get(userId);
  if (!user) return;
  const now = Date.now();
  const lastScheduled = user.matchRecomputeScheduledAt ?? 0;
  if (now - lastScheduled < MATCH_RECOMPUTE_SCHEDULE_DEBOUNCE_MS) {
    return;
  }
  await ctx.db.patch(userId, { matchRecomputeScheduledAt: now });
  await ctx.scheduler.runAfter(
    MATCH_RECOMPUTE_RUN_AFTER_MS,
    internal.matches.recomputeForUser,
    { userId }
  );
}

/** Scheduled after sticker-list changes (debounced). Kicks legacy cache; precomputedMatches fill lives here later. */
export const recomputeForUser = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await ctx.scheduler.runAfter(0, internal.matches.recomputeMatchCache, {
      userId,
    });
  },
});

const BATCH_RECOMPUTE_ACTIVE_WINDOW_MS = 6 * 60 * 60 * 1000;
/**
 * When active users (last 6h) exceed this count, we only fan out per-city jobs — never one
 * mutation that schedules everyone — so we stay within mutation time/write limits.
 */
const BATCH_RECOMPUTE_PAGE_SIZE = 200;
const CITIES_SCAN_PAGE_SIZE = 100;
const CITIES_SCAN_MAX_CHUNKS = 50;

function userQualifiesForBatchRecompute(u: Doc<"users">, cutoff: number): boolean {
  return (
    u.cityId != null &&
    u.hasCompletedStickerSetup === true &&
    u.isBanned !== true &&
    u.lastActiveAt != null &&
    u.lastActiveAt >= cutoff
  );
}



/**
 * Cron: refresh match caches for users active in the last 6h.
 * Scan mode paginates cities in chunks of CITIES_SCAN_PAGE_SIZE, scheduling per-city
 * continuations and rescheduling itself until isDone (capped by CITIES_SCAN_MAX_CHUNKS).
 */
export const batchRecomputeMatches = internalMutation({
  args: {
    cityId: v.optional(v.id("cities")),
    cursor: v.optional(v.union(v.string(), v.null())),
    citiesCursor: v.optional(v.union(v.string(), v.null())),
    citiesChunk: v.optional(v.number()),
  },
  handler: async (ctx, { cityId, cursor, citiesCursor, citiesChunk = 0 }) => {
    const cutoff = Date.now() - BATCH_RECOMPUTE_ACTIVE_WINDOW_MS;

    if (cityId !== undefined) {
      const page = await ctx.db
        .query("users")
        .withIndex("by_sticker_setup", (q) =>
          q.eq("hasCompletedStickerSetup", true).eq("cityId", cityId)
        )
        .paginate({ numItems: BATCH_RECOMPUTE_PAGE_SIZE, cursor: cursor ?? null });

      let scheduled = 0;
      for (const u of page.page) {
        if (!userQualifiesForBatchRecompute(u, cutoff)) continue;
        await ctx.scheduler.runAfter(0, internal.matches.recomputeForUser, {
          userId: u._id,
        });
        scheduled += 1;
      }

      if (!page.isDone) {
        await ctx.scheduler.runAfter(0, internal.matches.batchRecomputeMatches, {
          cityId,
          cursor: page.continueCursor,
        });
      }

      return {
        mode: "city" as const,
        scheduledInPage: scheduled,
        done: page.isDone,
      };
    }

    // Scan cities - schedule all, let per-city handler filter users
    const citiesPage = await ctx.db.query("cities").paginate({
      numItems: CITIES_SCAN_PAGE_SIZE,
      cursor: citiesCursor ?? null,
    });

    let scheduled = 0;
    for (const city of citiesPage.page) {
      await ctx.scheduler.runAfter(0, internal.matches.batchRecomputeMatches, {
        cityId: city._id,
      });
      scheduled += 1;
    }

    const tail = await rescheduleIfMore(ctx, {
      self: internal.matches.batchRecomputeMatches,
      args: { citiesCursor: citiesPage.continueCursor },
      hasMore: !citiesPage.isDone,
      chunk: citiesChunk,
      maxChunks: CITIES_SCAN_MAX_CHUNKS,
      label: "batchRecomputeMatches.scan",
    });

    return {
      mode: "scan" as const,
      scheduled,
      done: citiesPage.isDone,
      aborted: tail.aborted ?? false,
    };
  },
});

export type ListMyMatchRow = {
  matchedUserId: Id<"users">;
  displayNickname: string;
  /** Stable, non-sensitive seed for generated avatars (e.g. Kibo). */
  avatarSeed: string;
  albumCompletionPct: number;
  confirmedTradesCount: number;
  theyHaveINeed: number[];
  iHaveTheyNeed: number[];
  isBidirectional: boolean;
  distanceKm: number;
  layer: 1 | 2;
  tradePointId: Id<"tradePoints">;
  tradePointSlug: string;
  /** User has reliabilityScore >= 4.0 OR totalTrades >= 5 */
  isVerified: boolean;
  /** Any sticker in overlap is golden/legend */
  hasRareStickers: boolean;
};

export type ListMyMatchesResult = {
  matches: ListMyMatchRow[];
  meta: {
    /** Total stickers current user needs (for match % calc) */
    userMissingCount: number;
  };
};

const VERIFIED_RELIABILITY_THRESHOLD = 4.0;
const VERIFIED_TRADES_THRESHOLD = 5;

const MATCH_STICKER_SAMPLE = 5;

/**
 * Precomputed matches for the "Encontrar trocas" UI. Filters on the server only.
 * Never returns whatsappLink, clerkId, reliabilityScore, reportCount, or pushSubscription.
 */
export const listMyMatches = query({
  args: {
    layer: v.union(v.literal(1), v.literal(2), v.null()),
    bidirectionalOnly: v.boolean(),
    verifiedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<ListMyMatchesResult> => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { matches: [], meta: { userMissingCount: 0 } };
    }

    const me = auth.user;
    const userId = me._id;
    const userMissingCount = me.missing?.length ?? 0;
    const layers: (1 | 2)[] = args.layer === null ? [1, 2] : [args.layer];

    const specialSet = await buildSpecialSet(ctx);

    const rows: Doc<"precomputedMatches">[] = [];
    for (const layer of layers) {
      const chunk = args.bidirectionalOnly
        ? await ctx.db
            .query("precomputedMatches")
            .withIndex("by_user_layer_bidirectional", (q) =>
              q.eq("userId", userId).eq("layer", layer).eq("isBidirectional", true)
            )
            .take(100)
        : await ctx.db
            .query("precomputedMatches")
            .withIndex("by_user_layer", (q) => q.eq("userId", userId).eq("layer", layer))
            .take(100);
      rows.push(...chunk);
    }

    const hiddenInteractions = await ctx.db
      .query("userMatchInteractions")
      .withIndex("by_user_hidden", (q) => q.eq("userId", userId).eq("isHidden", true))
      .take(100);
    const hiddenSet = new Set(
      hiddenInteractions.map((h) => `${h.matchedUserId}_${h.tradePointId}`)
    );

    const filteredRows = rows.filter(
      (r) => !hiddenSet.has(`${r.matchedUserId}_${r.tradePointId}`)
    );

    filteredRows.sort((a, b) => {
      const aScore =
        Math.min(a.theyHaveINeed.length, a.iHaveTheyNeed.length) * 2 +
        Math.max(a.theyHaveINeed.length, a.iHaveTheyNeed.length);
      const bScore =
        Math.min(b.theyHaveINeed.length, b.iHaveTheyNeed.length) * 2 +
        Math.max(b.theyHaveINeed.length, b.iHaveTheyNeed.length);
      if (bScore !== aScore) return bScore - aScore;
      return b.computedAt - a.computedAt;
    });

    // Prefer denormalized fields to eliminate N+1 db.get; fallback only when absent.
    const needsFallback = filteredRows.some(
      (r) => r.matchedDisplayNickname == null
    );

    let otherById = new Map<Id<"users">, Doc<"users">>();
    if (needsFallback) {
      const matchedIds = [...new Set(filteredRows.map((r) => r.matchedUserId))];
      const others = await Promise.all(matchedIds.map((id) => ctx.db.get(id)));
      otherById = new Map(
        others.filter((u): u is Doc<"users"> => u !== null).map((u) => [u._id, u])
      );
    }

    const matches: ListMyMatchRow[] = [];
    for (const r of filteredRows) {
      if (matches.length >= 50) break;

      const displayNickname =
        r.matchedDisplayNickname ??
        (otherById.get(r.matchedUserId)
          ? getUserDisplayName(otherById.get(r.matchedUserId)!)
          : "");
      if (!displayNickname) continue;

      const albumProgress = r.matchedAlbumProgress ?? otherById.get(r.matchedUserId)?.albumProgress ?? 0;
      const totalTrades = r.matchedTotalTrades ?? otherById.get(r.matchedUserId)?.totalTrades ?? 0;
      const reliabilityScore = r.matchedReliabilityScore ?? otherById.get(r.matchedUserId)?.reliabilityScore ?? 0;

      const isVerified =
        reliabilityScore >= VERIFIED_RELIABILITY_THRESHOLD ||
        totalTrades >= VERIFIED_TRADES_THRESHOLD;

      if (args.verifiedOnly && !isVerified) continue;

      const hasRareStickers =
        r.theyHaveINeed.some((n) => specialSet.has(n)) ||
        r.iHaveTheyNeed.some((n) => specialSet.has(n));

      matches.push({
        matchedUserId: r.matchedUserId,
        displayNickname,
        avatarSeed: r.matchedAvatarSeed ?? r.matchedUserId,
        albumCompletionPct: albumProgress,
        confirmedTradesCount: totalTrades,
        theyHaveINeed: r.theyHaveINeed.slice(0, MATCH_STICKER_SAMPLE),
        iHaveTheyNeed: r.iHaveTheyNeed.slice(0, MATCH_STICKER_SAMPLE),
        isBidirectional: r.isBidirectional,
        distanceKm: roundDistanceKmHalf(r.distanceKm),
        layer: r.layer,
        tradePointId: r.tradePointId,
        tradePointSlug: r.tradePointSlug,
        isVerified,
        hasRareStickers,
      });
    }

    return { matches, meta: { userMissingCount } };
  },
});

const PRESENT_FALLBACK_CHECKIN_CAP = 50;

/**
 * Live rows for /matches when `precomputedMatches` is empty: overlap with people
 * checked in at the caller's active point. Unlike intersecting `findUserMatches` with
 * `listPresentAtMyPoints`, this does not miss someone who is physically present but
 * outside the city cache top-N.
 */
export const listPresentMatchRowsAtActivePoint = query({
  args: {
    bidirectionalOnly: v.boolean(),
    verifiedOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<ListMyMatchesResult> => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      return { matches: [], meta: { userMissingCount: 0 } };
    }
    const me = auth.user;
    const userMissingCount = me.missing?.length ?? 0;
    if (!me.hasCompletedStickerSetup) {
      return { matches: [], meta: { userMissingCount } };
    }

    const active = await getActiveCheckin(ctx, me._id);

    if (!active) {
      return { matches: [], meta: { userMissingCount } };
    }

    const point = await ctx.db.get(active.tradePointId);
    if (!point || point.status !== "approved") {
      return { matches: [], meta: { userMissingCount } };
    }

    const specialSet = await buildSpecialSet(ctx);

    const myDupSorted = [...(me.duplicates ?? [])].sort((a, b) => a - b);
    const myMissSorted = [...(me.missing ?? [])].sort((a, b) => a - b);

    const now = Date.now();
    const checkins = await ctx.db
      .query("checkins")
      .withIndex("by_tradePoint_expiresAt_countedInPublic", (q) =>
        q
          .eq("tradePointId", active.tradePointId)
          .eq("countedInPublic", true)
          .gt("expiresAt", now)
      )
      .take(PRESENT_FALLBACK_CHECKIN_CAP);

    // Bounded: otherIds ≤ PRESENT_FALLBACK_CHECKIN_CAP (50)
    const otherIds = [
      ...new Set(
        checkins.filter((c) => c.userId !== me._id).map((c) => c.userId)
      ),
    ];
    const others = await Promise.all(otherIds.map((id) => ctx.db.get(id)));
    const otherById = new Map(
      others.filter((u): u is Doc<"users"> => u !== null).map((u) => [u._id, u])
    );

    const matches: ListMyMatchRow[] = [];

    for (const c of checkins) {
      if (c.userId === me._id) continue;

      const other = otherById.get(c.userId);
      if (!other || !other.hasCompletedStickerSetup) continue;
      if (other.isBanned === true || other.isShadowBanned === true) continue;

      const { theyHaveINeed, iHaveTheyNeed } = computeStickerOverlap(
        myDupSorted,
        myMissSorted,
        other.duplicates ?? [],
        other.missing ?? []
      );

      const okBoth = theyHaveINeed.length >= 1 && iHaveTheyNeed.length >= 1;
      const okOneWay = theyHaveINeed.length >= 1 || iHaveTheyNeed.length >= 1;
      if (args.bidirectionalOnly ? !okBoth : !okOneWay) continue;

      const isVerified =
        other.reliabilityScore >= VERIFIED_RELIABILITY_THRESHOLD ||
        (other.totalTrades ?? 0) >= VERIFIED_TRADES_THRESHOLD;

      if (args.verifiedOnly && !isVerified) continue;

      const hasRareStickers =
        theyHaveINeed.some((n) => specialSet.has(n)) ||
        iHaveTheyNeed.some((n) => specialSet.has(n));

      matches.push({
        matchedUserId: other._id,
        displayNickname: getUserDisplayName(other),
        avatarSeed: other._id,
        albumCompletionPct: other.albumProgress ?? 0,
        confirmedTradesCount: other.totalTrades ?? 0,
        theyHaveINeed: theyHaveINeed.slice(0, MATCH_STICKER_SAMPLE),
        iHaveTheyNeed: iHaveTheyNeed.slice(0, MATCH_STICKER_SAMPLE),
        isBidirectional: okBoth,
        distanceKm: roundDistanceKmHalf(0),
        layer: 1,
        tradePointId: active.tradePointId,
        tradePointSlug: point.slug ?? "",
        isVerified,
        hasRareStickers,
      });
    }

    matches.sort((a, b) => {
      const score = (r: ListMyMatchRow) =>
        r.theyHaveINeed.length + r.iHaveTheyNeed.length;
      const sa = score(a);
      const sb = score(b);
      if (sb !== sa) return sb - sa;
      if (b.confirmedTradesCount !== a.confirmedTradesCount) {
        return b.confirmedTradesCount - a.confirmedTradesCount;
      }
      return a.displayNickname.localeCompare(b.displayNickname);
    });

    return { matches, meta: { userMissingCount } };
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

    // Batch fetch all users upfront to avoid N+1 queries (bounded: ≤ RETURN_LIMIT = 30)
    const userIds = top.map((m) => m.otherUserId);
    const users = await Promise.all(userIds.map((id) => ctx.db.get(id)));
    const userMap = new Map(
      users.filter((u): u is NonNullable<typeof u> => u !== null).map((u) => [u._id, u])
    );

    const enriched: MatchView[] = [];
    for (let i = 0; i < top.length; i++) {
      const m = top[i];
      if (!m) continue;
      const other = userMap.get(m.otherUserId);
      if (!other) continue;

      let ihaveCount = m.ihaveCount;
      let ineedCount = m.ineedCount;
      let ihaveSample = m.ihaveSample;
      let ineedSample = m.ineedSample;

      if (i < LIVE_REFRESH_TOP) {
        const overlap = computeStickerOverlap(
          [...myDupSet],
          [...myMissSet],
          other.duplicates ?? [],
          other.missing ?? []
        );
        const ihave = overlap.iHaveTheyNeed.sort((a, b) => a - b);
        const ineed = overlap.theyHaveINeed.sort((a, b) => a - b);
        ihaveCount = ihave.length;
        ineedCount = ineed.length;
        ihaveSample = ihave.slice(0, 3);
        ineedSample = ineed.slice(0, 3);
        if (ihaveCount === 0 || ineedCount === 0) continue;
      }

      enriched.push({
        otherUserId: m.otherUserId,
        displayNickname: getUserDisplayName(other),
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

const BACKFILL_BATCH = 200;
const BACKFILL_MAX_CHUNKS = 100;

/**
 * Admin/dev: one-shot backfill of pointType + acceptsMail defaults for existing tradePoints.
 * Run with: npx convex run matches:backfillTradePointType
 */
export const backfillTradePointType = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, chunk = 0 }) => {
    const page = await ctx.db
      .query("tradePoints")
      .paginate({ numItems: BACKFILL_BATCH, cursor: cursor ?? null });

    let touched = 0;
    for (const p of page.page) {
      const patch: { pointType?: "fixed"; acceptsMail?: boolean } = {};
      if (p.pointType === undefined) patch.pointType = "fixed";
      if (p.acceptsMail === undefined) patch.acceptsMail = false;
      if (Object.keys(patch).length > 0) {
        await ctx.db.patch(p._id, patch);
        touched += 1;
      }
    }

    if (!page.isDone) {
      const nextChunk = chunk + 1;
      if (nextChunk >= BACKFILL_MAX_CHUNKS) {
        console.error("backfillTradePointType: hit MAX_CHUNKS guard", {
          chunk: nextChunk,
        });
        return { touched, aborted: true };
      }
      await ctx.scheduler.runAfter(0, internal.matches.backfillTradePointType, {
        cursor: page.continueCursor,
        chunk: nextChunk,
      });
    }

    return { touched, done: page.isDone };
  },
});

const MAX_STICKERS_OVERLAP = 60;

function countBy(arr: number[]): Map<number, number> {
  const map = new Map<number, number>();
  for (const n of arr) map.set(n, (map.get(n) ?? 0) + 1);
  return map;
}

export type StickerWithQty = { num: number; qty: number };

export type FullStickerOverlapResult = {
  theyHaveINeed: StickerWithQty[];
  iHaveTheyNeed: StickerWithQty[];
  sections: {
    code: string;
    name: string;
    startNumber: number;
    endNumber: number;
    goldenNumbers: number[];
    legendNumbers: number[];
  }[];
  matchedUser: {
    displayNickname: string;
    avatarSeed: string;
    albumCompletionPct: number;
    confirmedTradesCount: number;
    distanceKm: number;
  };
  tradePointName: string;
};

export const getFullStickerOverlap = query({
  args: {
    matchedUserId: v.id("users"),
    tradePointId: v.id("tradePoints"),
  },
  returns: v.union(
    v.null(),
    v.object({
      theyHaveINeed: v.array(v.object({ num: v.number(), qty: v.number() })),
      iHaveTheyNeed: v.array(v.object({ num: v.number(), qty: v.number() })),
      sections: v.array(
        v.object({
          code: v.string(),
          name: v.string(),
          startNumber: v.number(),
          endNumber: v.number(),
          goldenNumbers: v.array(v.number()),
          legendNumbers: v.array(v.number()),
        })
      ),
      matchedUser: v.object({
        displayNickname: v.string(),
        avatarSeed: v.string(),
        albumCompletionPct: v.number(),
        confirmedTradesCount: v.number(),
        distanceKm: v.number(),
      }),
      tradePointName: v.string(),
    })
  ),
  handler: async (
    ctx,
    { matchedUserId, tradePointId }
  ): Promise<FullStickerOverlapResult | null> => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") return null;
    const me = auth.user;
    if (me.isShadowBanned === true) return null;

    const matchedUser = await ctx.db.get(matchedUserId);
    if (!matchedUser) return null;
    if (matchedUser.isBanned === true) return null;
    if (matchedUser.isShadowBanned === true) return null;
    if (matchedUser.deletionPending === true) return null;

    const tradePoint = await ctx.db.get(tradePointId);
    if (!tradePoint || tradePoint.status !== "approved") return null;

    const precomputed = await ctx.db
      .query("precomputedMatches")
      .withIndex("by_user_matched_point", (q) =>
        q
          .eq("userId", me._id)
          .eq("matchedUserId", matchedUserId)
          .eq("tradePointId", tradePointId)
      )
      .unique();

    let theyHaveINeedNums: number[];
    let iHaveTheyNeedNums: number[];
    let distanceKm: number;

    if (precomputed) {
      theyHaveINeedNums = precomputed.theyHaveINeed;
      iHaveTheyNeedNums = precomputed.iHaveTheyNeed;
      distanceKm = precomputed.distanceKm;
    } else {
      if (!matchedUser.hasCompletedStickerSetup) return null;
      const overlap = computeStickerOverlap(
        me.duplicates ?? [],
        me.missing ?? [],
        matchedUser.duplicates ?? [],
        matchedUser.missing ?? []
      );
      theyHaveINeedNums = overlap.theyHaveINeed.sort((a, b) => a - b);
      iHaveTheyNeedNums = overlap.iHaveTheyNeed.sort((a, b) => a - b);

      distanceKm = 0;
      if (
        me.lat != null &&
        me.lng != null &&
        matchedUser.lat != null &&
        matchedUser.lng != null
      ) {
        distanceKm = roundDistanceKmHalf(
          haversine(me.lat, me.lng, matchedUser.lat, matchedUser.lng)
        );
      }
    }

    const theirDupCounts = countBy(matchedUser.duplicates ?? []);
    const myDupCounts = countBy(me.duplicates ?? []);

    const theyHaveINeed: StickerWithQty[] = theyHaveINeedNums
      .slice(0, MAX_STICKERS_OVERLAP)
      .map((num) => ({ num, qty: theirDupCounts.get(num) ?? 1 }));

    const iHaveTheyNeed: StickerWithQty[] = iHaveTheyNeedNums
      .slice(0, MAX_STICKERS_OVERLAP)
      .map((num) => ({ num, qty: myDupCounts.get(num) ?? 1 }));

    const allSections = await getCachedAlbumSections(ctx);
    const sections = allSections.map((s) => ({
      code: s.code,
      name: s.name,
      startNumber: s.startNumber,
      endNumber: s.endNumber,
      goldenNumbers: s.goldenNumbers ?? [],
      legendNumbers: (s.legendNumbers ?? []).map((l) => l.number),
    }));

    return {
      theyHaveINeed,
      iHaveTheyNeed,
      sections,
      matchedUser: {
        displayNickname:
          getUserDisplayName(matchedUser),
        avatarSeed: matchedUserId,
        albumCompletionPct: matchedUser.albumProgress ?? 0,
        confirmedTradesCount: matchedUser.totalTrades ?? 0,
        distanceKm,
      },
      tradePointName: tradePoint.name,
    };
  },
});

/**
 * Internal: backfill denormalized user fields into precomputedMatches rows.
 * Run periodically (e.g. nightly cron) or after user profile changes.
 */
export const syncPrecomputedMatchesDenorm = internalMutation({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user || user.isBanned || user.isShadowBanned) return { updated: 0 };

    const isVerified =
      user.reliabilityScore >= VERIFIED_RELIABILITY_THRESHOLD ||
      (user.totalTrades ?? 0) >= VERIFIED_TRADES_THRESHOLD;

    const rows = await ctx.db
      .query("precomputedMatches")
      .withIndex("by_matchedUser", (q) => q.eq("matchedUserId", userId))
      .take(200);

    for (const row of rows) {
      await ctx.db.patch(row._id, {
        matchedDisplayNickname: getUserDisplayName(user),
        matchedAvatarSeed: userId,
        matchedAlbumProgress: user.albumProgress ?? 0,
        matchedTotalTrades: user.totalTrades ?? 0,
        matchedReliabilityScore: user.reliabilityScore,
        matchedIsVerified: isVerified,
      });
    }

    return { updated: rows.length };
  },
});
