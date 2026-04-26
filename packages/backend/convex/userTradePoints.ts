import { ConvexError, v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation, query } from "./_generated/server";
import { checkAuth } from "./lib/auth";
import {
  FREE_USER_MAX_POINTS,
  PREMIUM_USER_MAX_POINTS,
} from "./lib/limits";
import { rateLimiter } from "./lib/rateLimiter";

const FREQUENT_THRESHOLD = 5;
const NEW_WINDOW_MS = 14 * 24 * 60 * 60 * 1000;
const PRESENCE_SAMPLE_LIMIT = 5;
const TRADES_FETCH_CAP = 1000;
const CHECKINS_FETCH_CAP = 500;

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
        // Prefer denormalized snapshot from join time; fall back to city fetch
        // for memberships predating the denorm field.
        let cityName: string | null = m.cityName ?? null;
        if (cityName === null && point.cityId) {
          const city = await ctx.db.get(point.cityId);
          cityName = city?.name ?? null;
        }
        return {
          ...point,
          joinedAt: m.joinedAt,
          cityName,
        };
      })
    );

    return points.filter((p): p is NonNullable<typeof p> => p !== null);
  },
});

const emptyDashboard = {
  points: [],
  stats: { activePoints: 0, tradesCount: 0, peopleCount: 0, liveNowSum: 0 },
  cap: { current: 0, max: FREE_USER_MAX_POINTS, isPremium: false },
};

export const getMyPointsDashboard = query({
  args: {
    q: v.optional(v.string()),
    filter: v.optional(
      v.union(
        v.literal("all"),
        v.literal("live"),
        v.literal("frequent"),
        v.literal("favorites")
      )
    ),
    sort: v.optional(
      v.union(
        v.literal("active"),
        v.literal("recent"),
        v.literal("score"),
        v.literal("joined")
      )
    ),
  },
  handler: async (ctx, args) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") return emptyDashboard;
    const me = auth.user;

    const rl = await rateLimiter.check(ctx, "myPointsDashboard", {
      key: me._id,
    });
    if (!rl.ok) throw new ConvexError("rate-limited");

    const memberships = await ctx.db
      .query("userTradePoints")
      .withIndex("by_user", (q) => q.eq("userId", me._id))
      .take(PREMIUM_USER_MAX_POINTS + 1);

    const cap = {
      current: memberships.length,
      max: me.isPremium ? PREMIUM_USER_MAX_POINTS : FREE_USER_MAX_POINTS,
      isPremium: !!me.isPremium,
    };

    if (memberships.length === 0) {
      return { ...emptyDashboard, cap };
    }

    const membershipByPoint = new Map(
      memberships.map((m) => [m.tradePointId, m])
    );

    const pointsRaw = await Promise.all(
      memberships.map((m) => ctx.db.get(m.tradePointId))
    );
    const validPoints = pointsRaw.filter(
      (p): p is NonNullable<typeof p> => p !== null
    );

    // Collect cityIds that aren't already snapshotted on memberships (legacy rows).
    const cityNameByPoint = new Map<Id<"tradePoints">, string>();
    for (const m of memberships) {
      if (m.cityName) cityNameByPoint.set(m.tradePointId, m.cityName);
    }
    const missingCityIds = [
      ...new Set(
        validPoints
          .filter((p) => !cityNameByPoint.has(p._id))
          .map((p) => p.cityId)
      ),
    ];
    const fetchedCities = await Promise.all(
      missingCityIds.map((id) => ctx.db.get(id))
    );
    const cityById = new Map(
      fetchedCities
        .filter((c): c is NonNullable<typeof c> => c !== null)
        .map((c) => [c._id, c])
    );

    const [tradesInit, tradesCounter, myCheckins] = await Promise.all([
      ctx.db
        .query("trades")
        .withIndex("by_initiator_status", (q) => q.eq("initiatorId", me._id))
        .take(TRADES_FETCH_CAP),
      ctx.db
        .query("trades")
        .withIndex("by_counterparty_status", (q) =>
          q.eq("counterpartyId", me._id)
        )
        .take(TRADES_FETCH_CAP),
      ctx.db
        .query("checkins")
        .withIndex("by_user", (q) => q.eq("userId", me._id))
        .take(CHECKINS_FETCH_CAP),
    ]);

    if (tradesInit.length === TRADES_FETCH_CAP) {
      console.warn(
        `[getMyPointsDashboard] tradesInit cap reached for user ${me._id}`
      );
    }
    if (tradesCounter.length === TRADES_FETCH_CAP) {
      console.warn(
        `[getMyPointsDashboard] tradesCounter cap reached for user ${me._id}`
      );
    }
    if (myCheckins.length === CHECKINS_FETCH_CAP) {
      console.warn(
        `[getMyPointsDashboard] myCheckins cap reached for user ${me._id}`
      );
    }

    const tradesPerPoint = new Map<Id<"tradePoints">, number>();
    const counterpartiesGlobal = new Set<Id<"users">>();
    for (const t of tradesInit.concat(tradesCounter)) {
      if (t.status !== "confirmed") continue;
      tradesPerPoint.set(
        t.tradePointId,
        (tradesPerPoint.get(t.tradePointId) ?? 0) + 1
      );
      const other =
        t.initiatorId === me._id ? t.counterpartyId : t.initiatorId;
      counterpartiesGlobal.add(other);
    }

    const lastVisitByPoint = new Map<Id<"tradePoints">, number>();
    for (const c of myCheckins) {
      const prev = lastVisitByPoint.get(c.tradePointId) ?? 0;
      if (c.createdAt > prev) lastVisitByPoint.set(c.tradePointId, c.createdAt);
    }

    const now = Date.now();
    const presence = await Promise.all(
      validPoints.map(async (p) => {
        const checkins = await ctx.db
          .query("checkins")
          .withIndex("by_tradePoint_active", (q) =>
            q.eq("tradePointId", p._id).gt("expiresAt", now)
          )
          .take(PRESENCE_SAMPLE_LIMIT);
        return [
          p._id,
          {
            count: p.activeCheckinsCount ?? 0,
            sample: checkins.map((c) => ({
              nickname: c.displayNickname ?? null,
              avatarSeed: c.avatarSeed ?? null,
            })),
          },
        ] as const;
      })
    );
    const presenceById = new Map(presence);

    const favIds = new Set(me.favoriteTradePointIds ?? []);

    let view = validPoints.map((p) => {
      const m = membershipByPoint.get(p._id)!;
      const tradesCount = tradesPerPoint.get(p._id) ?? 0;
      const lastVisitAt = lastVisitByPoint.get(p._id);
      const isOrganizer = p.requestedBy === me._id;
      const isNew = now - m.joinedAt < NEW_WINDOW_MS;
      const badge: "organizer" | "frequent" | "new" | "visited" = isOrganizer
        ? "organizer"
        : isNew
          ? "new"
          : tradesCount >= FREQUENT_THRESHOLD
            ? "frequent"
            : "visited";

      const peakHourBuckets = Array.from({ length: 12 }, (_, i) =>
        (p.peakHours?.[i * 2] ?? 0) + (p.peakHours?.[i * 2 + 1] ?? 0)
      );

      return {
        _id: p._id,
        slug: p.slug,
        name: p.name,
        address: p.address,
        cityName: cityNameByPoint.get(p._id) ?? cityById.get(p.cityId)?.name ?? null,
        status: p.status,
        confidenceScore: p.confidenceScore,
        activeCheckinsCount: p.activeCheckinsCount ?? 0,
        peakHourBuckets,
        lastActivityAt: p.lastActivityAt,
        joinedAt: m.joinedAt,
        tradesCount,
        lastVisitAt: lastVisitAt ?? null,
        badge,
        isFavorite: favIds.has(p._id),
        presence: presenceById.get(p._id) ?? { count: 0, sample: [] },
      };
    });

    const filter = args.filter ?? "all";
    if (filter === "live") {
      view = view.filter((p) => p.activeCheckinsCount > 0);
    } else if (filter === "frequent") {
      view = view.filter(
        (p) => p.badge === "frequent" || p.badge === "organizer"
      );
    } else if (filter === "favorites") {
      view = view.filter((p) => p.isFavorite);
    }

    const q = (args.q ?? "").trim().slice(0, 100).toLowerCase();
    if (q) {
      view = view.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.address.toLowerCase().includes(q) ||
          (p.cityName ?? "").toLowerCase().includes(q)
      );
    }

    const sort = args.sort ?? "active";
    view.sort((a, b) => {
      switch (sort) {
        case "active":
          return b.activeCheckinsCount - a.activeCheckinsCount;
        case "recent":
          return b.lastActivityAt - a.lastActivityAt;
        case "score":
          return b.confidenceScore - a.confidenceScore;
        case "joined":
          return b.joinedAt - a.joinedAt;
      }
    });

    let tradesCountTotal = 0;
    for (const n of tradesPerPoint.values()) tradesCountTotal += n;

    const stats = {
      activePoints: memberships.length,
      tradesCount: tradesCountTotal,
      peopleCount: counterpartiesGlobal.size,
      liveNowSum: validPoints.reduce(
        (s, p) => s + (p.activeCheckinsCount ?? 0),
        0
      ),
    };

    return { points: view, stats, cap };
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

    const city = await ctx.db.get(point.cityId);
    await ctx.db.insert("userTradePoints", {
      userId: user._id,
      tradePointId,
      joinedAt: Date.now(),
      cityId: point.cityId,
      cityName: city?.name,
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
