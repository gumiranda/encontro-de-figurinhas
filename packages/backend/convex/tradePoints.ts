import { ConvexError, v } from "convex/values";
import {
  query,
  internalMutation,
  mutation,
  type MutationCtx,
} from "./_generated/server";
import { internal } from "./_generated/api";
import type { Id } from "./_generated/dataModel";
import { checkAuth, getAuthenticatedUser } from "./lib/auth";
import { isInBrazil } from "./lib/geo";
import {
  MINOR_APPROACH_EXTRA_MIN,
  REPORT_DEDUP_MS,
  SAFETY_CATEGORIES,
  countExtraStickersOwned,
  reportCategoryValidator,
  tradePointReportTargetKey,
} from "./lib/reportCategories";
import { generateTradePointSlug } from "./lib/slug";
import { evaluateWhatsappAccess } from "./lib/whatsapp";

const NON_PUBLIC_TRADE_POINT_STATUSES = new Set<string>([
  "cancelled",
  "suspended",
  "inactive",
]);

const getByIdWhatsappValidator = v.union(
  v.object({ state: v.literal("ok"), link: v.string() }),
  v.object({ state: v.literal("blocked-link-invalid") }),
  v.object({ state: v.literal("blocked-minor") }),
  v.object({ state: v.literal("blocked-not-participant") })
);

const getByIdReadyPointValidator = v.object({
  _id: v.id("tradePoints"),
  name: v.string(),
  slug: v.string(),
  address: v.string(),
  lat: v.float64(),
  lng: v.float64(),
  latitude: v.float64(),
  longitude: v.float64(),
  suggestedHours: v.optional(v.string()),
  description: v.optional(v.string()),
  confidenceScore: v.float64(),
  lastActivityAt: v.number(),
  confirmedTradesCount: v.number(),
  peakHours: v.optional(v.array(v.number())),
});

const getByIdReturnsValidator = v.union(
  v.object({ state: v.literal("needs-auth") }),
  v.object({ state: v.literal("banned") }),
  v.object({ state: v.literal("needs-onboarding") }),
  v.object({ state: v.literal("not-found") }),
  v.object({
    state: v.literal("pending-owner"),
    point: v.object({
      name: v.string(),
      createdAt: v.number(),
    }),
  }),
  v.object({
    state: v.literal("expired-owner"),
    point: v.object({
      name: v.string(),
    }),
  }),
  v.object({
    state: v.literal("ready"),
    point: getByIdReadyPointValidator,
    city: v.union(
      v.null(),
      v.object({ name: v.string(), slug: v.string() })
    ),
    participantCount: v.number(),
    isParticipant: v.boolean(),
    activeCheckinsCount: v.number(),
    hasActiveCheckin: v.boolean(),
    whatsapp: getByIdWhatsappValidator,
  })
);

const RELIABILITY_UNLIMITED_THRESHOLD = 5;
const MAX_PENDING_SUBMISSIONS = 2;

async function decrementPendingCount(
  ctx: MutationCtx,
  userId: Id<"users">
): Promise<void> {
  const u = await ctx.db.get(userId);
  if (!u || u.pendingSubmissionsCount <= 0) return;
  await ctx.db.patch(userId, {
    pendingSubmissionsCount: u.pendingSubmissionsCount - 1,
  });
}

export const getMapView = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return { state: "needs-bootstrap" as const };

    const cityId = user.cityId;
    if (!cityId) return { state: "needs-city" as const };

    const city = await ctx.db.get(cityId);
    if (!city) {
      console.warn(`User ${user._id} has dangling cityId ${cityId}`);
      return { state: "needs-city" as const };
    }

    const rawPoints = await ctx.db
      .query("tradePoints")
      .withIndex("by_city_status", (q) =>
        q.eq("cityId", cityId).eq("status", "approved")
      )
      .take(50);

    const points = rawPoints.map((p) => ({
      _id: p._id,
      slug: p.slug,
      name: p.name,
      address: p.address,
      lat: p.lat,
      lng: p.lng,
      suggestedHours: p.suggestedHours,
      description: p.description,
      confidenceScore: p.confidenceScore,
      lastActivityAt: p.lastActivityAt,
      confirmedTradesCount: p.confirmedTradesCount,
      activeCheckinsCount: p.activeCheckinsCount ?? 0,
      participantCount: p.participantCount ?? 0,
      acceptsMail: p.acceptsMail === true,
      pointType: p.pointType ?? ("fixed" as const),
    }));

    return {
      state: "ready" as const,
      userLocation:
        user.lat != null && user.lng != null
          ? { lat: user.lat, lng: user.lng }
          : null,
      city: { lat: city.lat, lng: city.lng, name: city.name },
      points,
    };
  },
});

export const getById = query({
  args: { id: v.id("tradePoints") },
  returns: getByIdReturnsValidator,
  handler: async (ctx, { id }) => {
    const auth = await checkAuth(ctx);
    if (auth.state === "needs-auth") return { state: "needs-auth" as const };
    if (auth.state === "banned") return { state: "banned" as const };
    if (auth.state === "needs-onboarding") {
      return { state: "needs-onboarding" as const };
    }

    const user = auth.user;
    const point = await ctx.db.get(id);
    if (!point) {
      return { state: "not-found" as const };
    }

    if (NON_PUBLIC_TRADE_POINT_STATUSES.has(point.status)) {
      return { state: "not-found" as const };
    }

    const isOwner = point.requestedBy === user._id;

    if (point.status === "pending") {
      if (isOwner) {
        return {
          state: "pending-owner" as const,
          point: { name: point.name, createdAt: point.createdAt },
        };
      }
      return { state: "not-found" as const };
    }

    if (point.status === "expired") {
      if (isOwner) {
        return {
          state: "expired-owner" as const,
          point: { name: point.name },
        };
      }
      return { state: "not-found" as const };
    }

    if (point.status !== "approved") {
      return { state: "not-found" as const };
    }

    const city = await ctx.db.get(point.cityId);
    const now = Date.now();

    const isParticipant = !!(await ctx.db
      .query("userTradePoints")
      .withIndex("by_user_point", (q) =>
        q.eq("userId", user._id).eq("tradePointId", id)
      )
      .unique());

    const hasActiveCheckin = !!(await ctx.db
      .query("checkins")
      .withIndex("by_user_tradePoint_active", (q) =>
        q.eq("userId", user._id).eq("tradePointId", id).gt("expiresAt", now)
      )
      .first());

    const whatsapp = isParticipant
      ? evaluateWhatsappAccess(user, point)
      : ({ state: "blocked-not-participant" as const });

    return {
      state: "ready" as const,
      point: {
        _id: point._id,
        name: point.name,
        slug: point.slug,
        address: point.address,
        lat: point.lat,
        lng: point.lng,
        latitude: point.lat,
        longitude: point.lng,
        suggestedHours: point.suggestedHours,
        description: point.description,
        confidenceScore: point.confidenceScore,
        lastActivityAt: point.lastActivityAt,
        confirmedTradesCount: point.confirmedTradesCount,
        peakHours: point.peakHours,
      },
      city: city ? { name: city.name, slug: city.slug } : null,
      participantCount: point.participantCount ?? 0,
      isParticipant,
      activeCheckinsCount: point.activeCheckinsCount ?? 0,
      hasActiveCheckin,
      whatsapp,
    };
  },
});

export const cancelPendingPoint = mutation({
  args: { tradePointId: v.id("tradePoints") },
  returns: v.object({ ok: v.boolean() }),
  handler: async (ctx, { tradePointId }) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      throw new ConvexError(auth.state);
    }
    const user = auth.user;

    const point = await ctx.db.get(tradePointId);
    if (!point || point.requestedBy !== user._id) {
      throw new ConvexError("forbidden");
    }
    if (point.status !== "pending") {
      throw new ConvexError("invalid-status");
    }

    const now = Date.now();
    await ctx.db.patch(tradePointId, {
      status: "cancelled",
      cancelledAt: now,
    });
    await decrementPendingCount(ctx, user._id);

    return { ok: true as const };
  },
});

export const submitRequest = mutation({
  args: {
    name: v.string(),
    address: v.string(),
    cityId: v.id("cities"),
    lat: v.float64(),
    lng: v.float64(),
    suggestedHours: v.optional(v.string()),
    description: v.optional(v.string()),
    whatsappLink: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await checkAuth(ctx);
    if (auth.state === "needs-auth") {
      return { ok: false as const, error: "needs-auth" as const };
    }
    if (auth.state === "banned") {
      return { ok: false as const, error: "banned" as const };
    }
    if (auth.state === "needs-onboarding") {
      return { ok: false as const, error: "needs-onboarding" as const };
    }
    const user = auth.user;

    if (user.isShadowBanned) {
      return { ok: true as const, tradePointId: null };
    }

    if (
      user.reliabilityScore < RELIABILITY_UNLIMITED_THRESHOLD &&
      user.pendingSubmissionsCount >= MAX_PENDING_SUBMISSIONS
    ) {
      return { ok: false as const, error: "rate-limited" as const };
    }

    if (!user.cityId || user.cityId !== args.cityId) {
      return { ok: false as const, error: "city-mismatch" as const };
    }

    const city = await ctx.db.get(args.cityId);
    if (!city || city.isActive === false) {
      return { ok: false as const, error: "city-mismatch" as const };
    }

    if (!isInBrazil(args.lat, args.lng)) {
      return { ok: false as const, error: "invalid-coordinates" as const };
    }

    const trimmedName = args.name.trim();
    const trimmedAddress = args.address.trim();
    if (
      trimmedName.length < 2 ||
      trimmedName.length > 120 ||
      trimmedAddress.length < 5 ||
      trimmedAddress.length > 300
    ) {
      return { ok: false as const, error: "invalid-fields" as const };
    }

    const suggestedHours = args.suggestedHours?.trim();
    const description = args.description?.trim();
    let whatsappLink = args.whatsappLink?.trim();
    if (whatsappLink === "") whatsappLink = undefined;
    if (
      (suggestedHours && suggestedHours.length > 120) ||
      (description && description.length > 600) ||
      (whatsappLink && whatsappLink.length > 200)
    ) {
      return { ok: false as const, error: "invalid-fields" as const };
    }
    if (
      whatsappLink &&
      !/^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,24}$/.test(whatsappLink)
    ) {
      return { ok: false as const, error: "invalid-fields" as const };
    }

    const slug = await generateTradePointSlug(ctx, trimmedName, city.slug);
    const now = Date.now();
    const tradePointId = await ctx.db.insert("tradePoints", {
      name: trimmedName,
      slug,
      address: trimmedAddress,
      cityId: args.cityId,
      lat: args.lat,
      lng: args.lng,
      whatsappLink,
      whatsappLinkStatus: whatsappLink ? "active" : "invalid",
      suggestedHours: suggestedHours || undefined,
      description: description || undefined,
      status: "pending",
      requestedBy: user._id,
      confidenceScore: 0,
      lastActivityAt: now,
      confirmedTradesCount: 0,
      createdAt: now,
      participantCount: 0,
      activeCheckinsCount: 0,
    });

    await ctx.db.patch(user._id, {
      pendingSubmissionsCount: user.pendingSubmissionsCount + 1,
      lastSubmissionAt: now,
    });

    return { ok: true as const, tradePointId };
  },
});

export const submitReport = mutation({
  args: {
    tradePointId: v.id("tradePoints"),
    category: reportCategoryValidator,
    description: v.optional(v.string()),
  },
  returns: v.object({ ok: v.boolean() }),
  handler: async (ctx, args) => {
    const auth = await checkAuth(ctx);
    if (auth.state !== "ok") {
      throw new ConvexError(auth.state);
    }
    const user = auth.user;

    if (user.isShadowBanned === true) {
      return { ok: true as const };
    }

    if (Math.floor(user.reliabilityScore) < 2) {
      throw new ConvexError("reliability-too-low");
    }

    const point = await ctx.db.get(args.tradePointId);
    if (!point || point.status !== "approved") {
      throw new ConvexError("point-not-reportable");
    }

    const targetKey = tradePointReportTargetKey(args.tradePointId);
    const cutoff = Date.now() - REPORT_DEDUP_MS;
    const recentDuplicate = await ctx.db
      .query("reports")
      .withIndex("by_reporter_target_recent", (q) =>
        q
          .eq("reporterId", user._id)
          .eq("targetKey", targetKey)
          .gte("createdAt", cutoff)
      )
      .first();
    if (recentDuplicate) {
      throw new ConvexError("already-reported");
    }

    if (args.category === "minor_approach") {
      const extraOwned = await countExtraStickersOwned(ctx, user);
      if (Math.floor(extraOwned) < MINOR_APPROACH_EXTRA_MIN) {
        throw new ConvexError("minor-approach-extra-requirement");
      }
    }

    const now = Date.now();
    const description =
      args.description === undefined
        ? undefined
        : args.description.trim() || undefined;
    await ctx.db.insert("reports", {
      reporterId: user._id,
      tradePointId: args.tradePointId,
      targetKey,
      category: args.category,
      description,
      status: "open",
      isResolved: false,
      createdAt: now,
    });

    if (args.category === "minor_approach") {
      await ctx.db.patch(args.tradePointId, { requiresAdminReview: true });
    }

    const safetyLiterals = SAFETY_CATEGORIES as readonly string[];
    if (safetyLiterals.includes(args.category)) {
      await ctx.scheduler.runAfter(0, internal.reports.evaluateAutoAction, {
        tradePointId: args.tradePointId,
      });
    }

    return { ok: true as const };
  },
});

export const getSubmissionQuota = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;
    const unlimited =
      user.reliabilityScore >= RELIABILITY_UNLIMITED_THRESHOLD;
    const remaining = unlimited
      ? MAX_PENDING_SUBMISSIONS
      : Math.max(
          0,
          MAX_PENDING_SUBMISSIONS - user.pendingSubmissionsCount
        );

    const tier =
      unlimited || remaining === MAX_PENDING_SUBMISSIONS
        ? ("available" as const)
        : remaining > 0
          ? ("limited" as const)
          : ("blocked" as const);

    return {
      tier,
      unlimited,
      lastSubmissionAt: user.lastSubmissionAt ?? null,
    };
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const point = await ctx.db
      .query("tradePoints")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!point || point.status !== "approved") return null;
    const city = await ctx.db.get(point.cityId);
    return {
      name: point.name,
      slug: point.slug,
      address: point.address,
      lat: point.lat,
      lng: point.lng,
      confirmedTradesCount: point.confirmedTradesCount,
      suggestedHours: point.suggestedHours ?? null,
      description: point.description ?? null,
      lastActivityAt: point.lastActivityAt,
      city: city
        ? { name: city.name, state: city.state, slug: city.slug }
        : null,
    };
  },
});

export const getAllApprovedSlugs = query({
  args: {},
  handler: async (ctx) => {
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .take(5000);

    return points.map((p) => p.slug);
  },
});

export const listTopForSSG = query({
  args: {},
  handler: async (ctx) => {
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .order("desc")
      .take(100);
    return points.map((p) => p.slug);
  },
});

export const listTopByCity = query({
  args: { citySlug: v.string(), limit: v.optional(v.number()) },
  handler: async (ctx, { citySlug, limit }) => {
    const city = await ctx.db
      .query("cities")
      .withIndex("by_slug", (q) => q.eq("slug", citySlug))
      .unique();
    if (!city) return [];
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_city_status", (q) =>
        q.eq("cityId", city._id).eq("status", "approved")
      )
      .order("desc")
      .take(Math.min(Math.max(limit ?? 20, 1), 50));
    return points.map((p) => ({
      slug: p.slug,
      name: p.name,
      address: p.address,
      confidenceScore: p.confidenceScore,
      confirmedTradesCount: p.confirmedTradesCount,
    }));
  },
});

export const listApprovedGroupedByCity = query({
  args: {},
  handler: async (ctx) => {
    const points = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .take(5000);

    const cityIds = [...new Set(points.map((p) => p.cityId))];
    const cities = await Promise.all(cityIds.map((id) => ctx.db.get(id)));
    const cityMap = new Map(
      cities.filter(Boolean).map((c) => [c!._id, c!])
    );

    const grouped: Record<
      string,
      {
        cityName: string;
        citySlug: string;
        state: string;
        points: Array<{ name: string; slug: string }>;
      }
    > = {};

    for (const p of points) {
      const city = cityMap.get(p.cityId);
      if (!city) continue;

      const key = city.slug;
      if (!grouped[key]) {
        grouped[key] = {
          cityName: city.name,
          citySlug: city.slug,
          state: city.state,
          points: [],
        };
      }
      grouped[key].points.push({ name: p.name, slug: p.slug });
    }

    return Object.values(grouped)
      .map((g) => ({
        ...g,
        points: g.points.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => {
        if (a.state !== b.state) return a.state.localeCompare(b.state);
        return a.cityName.localeCompare(b.cityName);
      });
  },
});

export const listApprovedForSitemapPage = query({
  args: {
    cursor: v.optional(v.union(v.string(), v.null())),
    pageSize: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, pageSize }) => {
    const size = Math.min(Math.max(pageSize ?? 5000, 1), 5000);
    const result = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .paginate({ numItems: size, cursor: cursor ?? null });

    return {
      page: result.page.map((p) => ({
        slug: p.slug,
        updatedAt: p.lastActivityAt,
      })),
      continueCursor: result.continueCursor,
      isDone: result.isDone,
    };
  },
});

const RECONCILE_BATCH = 100;
const RECONCILE_MAX_CHUNKS = 200;
const RECONCILE_CHECKIN_CAP = 1000;

export const reconcileActiveCheckinsCount = internalMutation({
  args: {
    cursor: v.optional(v.string()),
    chunk: v.optional(v.number()),
  },
  handler: async (ctx, { cursor, chunk = 0 }) => {
    const now = Date.now();
    const page = await ctx.db
      .query("tradePoints")
      .withIndex("by_status", (q) => q.eq("status", "approved"))
      .paginate({ numItems: RECONCILE_BATCH, cursor: cursor ?? null });

    let drifts = 0;
    for (const point of page.page) {
      const active = await ctx.db
        .query("checkins")
        .withIndex("by_tradePoint_active", (q) =>
          q.eq("tradePointId", point._id).gt("expiresAt", now)
        )
        .take(RECONCILE_CHECKIN_CAP);

      if (active.length === RECONCILE_CHECKIN_CAP) {
        console.warn("reconcileActiveCheckinsCount: suspicious active count", {
          tradePointId: point._id,
          slug: point.slug,
          sampledCount: active.length,
        });
        continue;
      }

      const actual = active.filter((c) => c.countedInPublic).length;
      const stored = point.activeCheckinsCount ?? 0;
      if (actual !== stored) {
        drifts++;
        console.warn("reconcileActiveCheckinsCount: drift", {
          tradePointId: point._id,
          slug: point.slug,
          stored,
          actual,
        });
        await ctx.db.patch(point._id, { activeCheckinsCount: actual });
      }
    }

    if (!page.isDone) {
      await ctx.scheduler.runAfter(
        0,
        internal.tradePoints.reconcileActiveCheckinsCount,
        {
          cursor: page.continueCursor,
          chunk: chunk + 1,
        }
      );
      if (chunk + 1 >= RECONCILE_MAX_CHUNKS) {
        console.error(
          "reconcileActiveCheckinsCount: hit MAX_CHUNKS, will still continue",
          { chunk: chunk + 1 }
        );
      }
      return { processed: page.page.length, drifts, rescheduled: true };
    }

    return { processed: page.page.length, drifts, rescheduled: false };
  },
});

export const expireStalePending = internalMutation({
  args: {},
  handler: async (ctx) => {
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const cutoff = Date.now() - THIRTY_DAYS_MS;
    const stale = await ctx.db
      .query("tradePoints")
      .withIndex("by_status_createdAt", (q) =>
        q.eq("status", "pending").lt("createdAt", cutoff)
      )
      .take(500);
    for (const p of stale) {
      await ctx.db.patch(p._id, { status: "expired" });
      await decrementPendingCount(ctx, p.requestedBy);
    }
    return null;
  },
});

export const decrementPendingOnModeration = internalMutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    await decrementPendingCount(ctx, userId);
    return null;
  },
});

export const seedForCity = internalMutation({
  args: { citySlug: v.string() },
  handler: async (ctx, { citySlug }) => {
    const city = await ctx.db
      .query("cities")
      .withIndex("by_slug", (q) => q.eq("slug", citySlug))
      .unique();
    if (!city) throw new Error(`City not found: ${citySlug}`);

    const existing = await ctx.db
      .query("tradePoints")
      .withIndex("by_city_status", (q) =>
        q.eq("cityId", city._id).eq("status", "approved")
      )
      .first();
    if (existing) return { skipped: true };

    const eligibleUser = await ctx.db
      .query("users")
      .withIndex("by_city_not_shadowbanned", (q) =>
        q.eq("cityId", city._id).eq("isShadowBanned", false)
      )
      .first();
    if (!eligibleUser)
      throw new Error("No eligible user for seed in this city");

    const now = Date.now();
    const seedNames = [
      "Shopping Eldorado",
      "Parque Ibirapuera - Portão 3",
      "Praça da Sé",
      "Mercado Municipal",
      "Parque Villa-Lobos",
      "Estação da Luz",
    ];
    const jitter = () => (Math.random() - 0.5) * 0.04;
    const insertedSlugs: string[] = [];
    for (const name of seedNames) {
      const slug = await generateTradePointSlug(ctx, name, city.slug);
      await ctx.db.insert("tradePoints", {
        name,
        slug,
        address: `Endereço ${name}, ${city.name}`,
        cityId: city._id,
        lat: city.lat + jitter(),
        lng: city.lng + jitter(),
        whatsappLink: "https://chat.whatsapp.com/FAKE-DEV-ONLY",
        whatsappLinkStatus: "active",
        suggestedHours: "10h - 22h",
        status: "approved",
        requestedBy: eligibleUser._id,
        confidenceScore: 6 + Math.random() * 3.5,
        lastActivityAt: now,
        confirmedTradesCount: Math.floor(Math.random() * 20),
        createdAt: now,
        participantCount: 0,
        activeCheckinsCount: 0,
      });
      insertedSlugs.push(slug);
    }

    const tags = new Set<string>();
    for (const slug of insertedSlugs) tags.add(`ponto:${slug}`);
    tags.add(`cidade:${city.slug}`);
    tags.add("sitemap");
    await ctx.scheduler.runAfter(0, internal.revalidate.notifyBatch, {
      tags: [...tags],
    });

    return { inserted: seedNames.length };
  },
});
