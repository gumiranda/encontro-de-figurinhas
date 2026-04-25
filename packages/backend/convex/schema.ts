import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { reportCategoryValidator } from "./lib/reportCategories";

const distanceBucketValidator = v.union(
  v.literal("near"),
  v.literal("close"),
  v.literal("mid"),
  v.literal("far"),
  v.literal("unknown")
);

const cachedMatchValidator = v.object({
  otherUserId: v.id("users"),
  ihaveCount: v.number(),
  ineedCount: v.number(),
  distanceMeters: v.union(v.number(), v.null()),
  distanceBucket: distanceBucketValidator,
  ihaveSample: v.array(v.number()),
  ineedSample: v.array(v.number()),
  score: v.number(),
  hasSpecial: v.boolean(),
  otherAcceptsMail: v.boolean(),
});

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    role: v.optional(v.string()),
    sector: v.optional(v.string()),

    // Profile completion fields
    nickname: v.optional(v.string()),
    displayNickname: v.optional(v.string()),
    birthDate: v.optional(v.number()),
    cityId: v.optional(v.id("cities")),
    hasCompletedOnboarding: v.optional(v.boolean()),
    avatarStorageId: v.optional(v.id("_storage")),
    avatarUrl: v.optional(v.string()),

    // Reputation fields (PRD §2.3)
    reliabilityScore: v.number(),
    pendingSubmissionsCount: v.number(),
    lastSubmissionAt: v.optional(v.number()),
    totalTrades: v.optional(v.number()),
    isShadowBanned: v.optional(v.boolean()),
    isBanned: v.optional(v.boolean()),

    deletionPending: v.optional(v.boolean()),
    cleanupStatus: v.optional(
      v.union(
        v.literal("pending"),
        v.literal("running"),
        v.literal("complete"),
        v.literal("partial"),
      ),
    ),
    cleanupInProgressAt: v.optional(v.number()),

    // Minor protection fields (PRD seguranca.md:23-25, arquitetura-tecnica.md:63-71)
    ageGroup: v.optional(
      v.union(
        v.literal("child"),
        v.literal("teen"),
        v.literal("young"),
        v.literal("adult")
      )
    ),
    parentalConsentAt: v.optional(v.number()),
    guardianName: v.optional(v.string()),
    guardianEmail: v.optional(v.string()),

    // Sticker fields (PRD §4.3)
    // Note: Convex has 8192 element array limit. Currently safe (album ~700 stickers).
    // stickers.ts enforces MAX_STICKER_ARRAY_SIZE = 1000. If future albums exceed this,
    // consider splitting into userStickers table with userId + stickerNumber index.
    duplicates: v.optional(v.array(v.number())),
    missing: v.optional(v.array(v.number())),
    albumProgress: v.optional(v.number()),
    albumCompletionPct: v.optional(v.number()),
    totalStickersOwned: v.optional(v.number()),
    hasCompletedStickerSetup: v.optional(v.boolean()),

    // Favoritos de pontos de troca (array no user doc — padrão de stickers)
    favoriteTradePointIds: v.optional(v.array(v.id("tradePoints"))),

    // Additional PRD fields
    hasSeenSafetyTips: v.optional(v.boolean()),
    isPremium: v.optional(v.boolean()),
    lastActiveAt: v.optional(v.number()),
    matchRecomputeScheduledAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    warningCount: v.optional(v.number()),
    pushSubscription: v.optional(v.string()),

    locationSource: v.optional(
      v.union(v.literal("gps"), v.literal("manual"), v.literal("ip"))
    ),
    lat: v.optional(v.float64()),
    lng: v.optional(v.float64()),
    locationUpdatedAt: v.optional(v.number()),
    locationUpdateTimestamps: v.optional(v.array(v.number())),

    acceptsMail: v.optional(v.boolean()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_nickname", ["nickname"])
    .index("by_city", ["cityId"])
    .index("by_sticker_setup", ["hasCompletedStickerSetup", "cityId"])
    .index("by_city_not_shadowbanned", ["cityId", "isShadowBanned"]),

  cities: defineTable({
    name: v.string(),
    state: v.string(),
    slug: v.string(),
    lat: v.number(),
    lng: v.number(),
    isActive: v.optional(v.boolean()),
  })
    .index("by_slug", ["slug"])
    .index("by_isActive", ["isActive"])
    .searchIndex("search_name", { searchField: "name" }),

  tradePoints: defineTable({
    name: v.string(),
    slug: v.string(),
    address: v.string(),
    cityId: v.id("cities"),
    lat: v.float64(),
    lng: v.float64(),
    whatsappLink: v.optional(v.string()),
    whatsappLinkStatus: v.union(
      v.literal("active"),
      v.literal("reported"),
      v.literal("invalid")
    ),
    suggestedHours: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("approved"),
      v.literal("suspended"),
      v.literal("inactive"),
      v.literal("expired"),
      v.literal("cancelled")
    ),
    cancelledAt: v.optional(v.number()),
    suspendedFromReportsAt: v.optional(v.number()),
    lastSuspensionReason: v.optional(v.string()),
    requiresAdminReview: v.optional(v.boolean()),
    rejectionReason: v.optional(v.string()),
    requestedBy: v.id("users"),
    confidenceScore: v.float64(),
    lastActivityAt: v.number(),
    peakHours: v.optional(v.array(v.number())),
    confirmedTradesCount: v.number(),
    createdAt: v.number(),
    participantCount: v.optional(v.number()),
    activeCheckinsCount: v.optional(v.number()),
    lastEvaluationAt: v.optional(v.number()),

    acceptsMail: v.optional(v.boolean()),
    pointType: v.optional(
      v.union(v.literal("fixed"), v.literal("event"), v.literal("mail"))
    ),
    coverImageStorageId: v.optional(v.id("_storage")),
    coverImageUrl: v.optional(v.string()),
  })
    .index("by_city_status", ["cityId", "status"])
    .index("by_status", ["status"])
    .index("by_status_createdAt", ["status", "createdAt"])
    .index("by_requestedBy_status", ["requestedBy", "status"])
    .index("by_slug", ["slug"]),

  userTradePoints: defineTable({
    userId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    joinedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_tradePoint", ["tradePointId"])
    .index("by_user_point", ["userId", "tradePointId"]),

  /**
   * Check-ins at trade points.
   * Denormalized fields (displayNickname, avatarSeed, duplicates) are snapshots
   * from the user at check-in time; duplicates/nickname are also refreshed when
   * the user saves figurinhas while still checked in.
   * This avoids N+1 reads and reactivity storms when querying present users.
   */
  checkins: defineTable({
    userId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    lat: v.float64(),
    lng: v.float64(),
    distanceMeters: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
    countedInPublic: v.boolean(),
    // Denormalized from user at check-in time (optional during backfill)
    displayNickname: v.optional(v.string()),
    avatarSeed: v.optional(v.string()),
    duplicates: v.optional(v.array(v.number())),
  })
    .index("by_tradePoint_active", ["tradePointId", "expiresAt"])
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "expiresAt"])
    .index("by_user_tradePoint_active", ["userId", "tradePointId", "expiresAt"])
    // eq(tradePointId) + eq(countedInPublic) + range(expiresAt) — order required by Convex
    .index("by_tradePoint_expiresAt_countedInPublic", [
      "tradePointId",
      "countedInPublic",
      "expiresAt",
    ])
    .index("by_expiresAt", ["expiresAt"]),

  scoreBumps: defineTable({
    userId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    at: v.number(),
  })
    .index("by_user_point_time", ["userId", "tradePointId", "at"])
    .index("by_at", ["at"])
    .index("by_user", ["userId"]),

  albumConfig: defineTable({
    totalStickers: v.number(),
    sections: v.array(
      v.object({
        name: v.string(),
        code: v.string(), // Código FIFA (ex: BRA, ARG, ENG)
        startNumber: v.number(),
        endNumber: v.number(),
        isExtra: v.optional(v.boolean()),
        flagEmoji: v.optional(v.string()),
        goldenNumbers: v.optional(v.array(v.number())),
        legendNumbers: v.optional(
          v.array(
            v.object({ number: v.number(), name: v.string() })
          )
        ),
      })
    ),
    version: v.number(),
    year: v.number(),
  }),

  userMatchCache: defineTable({
    userId: v.id("users"),
    cityId: v.id("cities"),
    matches: v.array(cachedMatchValidator),
    recomputeCursor: v.union(v.string(), v.null()),
    partialMatches: v.union(v.null(), v.array(cachedMatchValidator)),
    recomputedAt: v.number(),
    recomputeStartedAt: v.union(v.number(), v.null()),
    stale: v.boolean(),
  })
    .index("by_user", ["userId"])
    .index("by_city", ["cityId"]),

  precomputedMatches: defineTable({
    userId: v.id("users"),
    matchedUserId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    tradePointSlug: v.string(),
    theyHaveINeed: v.array(v.number()),
    iHaveTheyNeed: v.array(v.number()),
    isBidirectional: v.boolean(),
    distanceKm: v.float64(),
    layer: v.union(v.literal(1), v.literal(2)),
    computedAt: v.number(),
  })
    .index("by_user_layer", ["userId", "layer"])
    .index("by_user_layer_bidirectional", ["userId", "layer", "isBidirectional"])
    .index("by_user_point", ["userId", "tradePointId"])
    .index("by_matchedUser", ["matchedUserId"]),

  trades: defineTable({
    initiatorId: v.id("users"),
    counterpartyId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    pairKey: v.string(),
    stickersInitiatorGave: v.array(v.number()),
    stickersInitiatorReceived: v.array(v.number()),
    status: v.union(
      v.literal("pending_confirmation"),
      v.literal("confirmed"),
      v.literal("cancelled"),
      v.literal("disputed"),
      v.literal("expired")
    ),
    createdAt: v.number(),
    confirmedAt: v.optional(v.number()),
    disputedAt: v.optional(v.number()),
    disputeReason: v.optional(v.string()),
    expiredAt: v.optional(v.number()),
    initiatorMessage: v.optional(v.string()),
  })
    .index("by_initiator_status", ["initiatorId", "status", "createdAt"])
    .index("by_counterparty_status", ["counterpartyId", "status", "createdAt"])
    .index("by_tradePoint", ["tradePointId", "createdAt"])
    .index("by_pairKey_created", ["pairKey", "createdAt"])
    .index("by_pairKey_status_created", ["pairKey", "status", "createdAt"]),

  userMatchInteractions: defineTable({
    userId: v.id("users"),
    matchedUserId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    isHidden: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user_matched_point", ["userId", "matchedUserId", "tradePointId"])
    .index("by_user_hidden", ["userId", "isHidden", "updatedAt"]),

  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.string(),
    content: v.string(),
    coverImage: v.optional(v.string()),
    category: v.string(),
    tags: v.array(v.string()),
    readingTime: v.number(),
    status: v.union(v.literal("draft"), v.literal("published")),
    author: v.object({
      name: v.string(),
      avatar: v.optional(v.string()),
    }),
    seoTitle: v.optional(v.string()),
    seoDescription: v.optional(v.string()),
    publishedAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
    // SEO/AEO structured data fields
    products: v.optional(
      v.array(
        v.object({
          name: v.string(),
          sku: v.optional(v.string()),
          price: v.number(),
          priceCurrency: v.string(),
          image: v.optional(v.string()),
          description: v.optional(v.string()),
          url: v.optional(v.string()),
          availability: v.optional(v.string()),
        })
      )
    ),
    faqs: v.optional(
      v.array(
        v.object({
          question: v.string(),
          answer: v.string(),
        })
      )
    ),
  })
    .index("by_slug", ["slug"])
    .index("by_status_publishedAt", ["status", "publishedAt"])
    .index("by_category_status", ["category", "status"]),

  reports: defineTable({
    reporterId: v.id("users"),
    targetUserId: v.optional(v.id("users")),
    tradePointId: v.optional(v.id("tradePoints")),
    targetKey: v.string(),
    category: reportCategoryValidator,
    description: v.optional(v.string()),
    status: v.union(
      v.literal("open"),
      v.literal("reviewing"),
      v.literal("resolved"),
      v.literal("dismissed")
    ),
    isResolved: v.boolean(),
    resolvedAt: v.optional(v.number()),
    adminNotes: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_reporter_target_recent", [
      "reporterId",
      "targetKey",
      "createdAt",
    ])
    .index("by_target_category_recent", ["targetKey", "category", "createdAt"])
    .index("by_target_unresolved", ["targetKey", "isResolved", "createdAt"])
    .index("by_reporter_created", ["reporterId", "createdAt"]),

  siteStats: defineTable({
    matchRecomputeEnabled: v.optional(v.boolean()),
    hardDeleteOversizedCount: v.optional(v.number()),
    lastReconcileAt: v.optional(v.number()),
  }),

  postMetrics: defineTable({
    postId: v.id("blogPosts"),
    likes: v.number(),
    saves: v.number(),
    comments: v.number(),
  }).index("by_post", ["postId"]),

  postUserInteractions: defineTable({
    postId: v.id("blogPosts"),
    visitorId: v.string(),
    liked: v.boolean(),
    saved: v.boolean(),
  })
    .index("by_post_visitor", ["postId", "visitorId"])
    .index("by_visitor", ["visitorId"]),
});
