import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

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

    // Reputation fields (PRD §2.3)
    reliabilityScore: v.number(),
    pendingSubmissionsCount: v.number(),
    lastSubmissionAt: v.optional(v.number()),
    totalTrades: v.optional(v.number()),
    isShadowBanned: v.optional(v.boolean()),
    isBanned: v.optional(v.boolean()),

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
    duplicates: v.optional(v.array(v.number())),
    missing: v.optional(v.array(v.number())),
    albumProgress: v.optional(v.number()),
    totalStickersOwned: v.optional(v.number()),
    hasCompletedStickerSetup: v.optional(v.boolean()),

    // Additional PRD fields
    hasSeenSafetyTips: v.optional(v.boolean()),
    isPremium: v.optional(v.boolean()),
    lastActiveAt: v.optional(v.number()),
    createdAt: v.optional(v.number()),
    pushSubscription: v.optional(v.string()),

    locationSource: v.optional(
      v.union(v.literal("gps"), v.literal("manual"), v.literal("ip"))
    ),
    lat: v.optional(v.float64()),
    lng: v.optional(v.float64()),
    locationUpdatedAt: v.optional(v.number()),
    locationUpdateTimestamps: v.optional(v.array(v.number())),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_nickname", ["nickname"])
    .index("by_city", ["cityId"])
    .index("by_sticker_setup", ["hasCompletedStickerSetup", "cityId"]),

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
      v.literal("expired")
    ),
    rejectionReason: v.optional(v.string()),
    requestedBy: v.id("users"),
    confidenceScore: v.float64(),
    lastActivityAt: v.number(),
    peakHours: v.optional(v.array(v.number())),
    confirmedTradesCount: v.number(),
    reportCount: v.number(),
    createdAt: v.number(),
    participantCount: v.optional(v.number()),
    activeCheckinsCount: v.optional(v.number()),
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

  checkins: defineTable({
    userId: v.id("users"),
    tradePointId: v.id("tradePoints"),
    lat: v.float64(),
    lng: v.float64(),
    distanceMeters: v.number(),
    expiresAt: v.number(),
    createdAt: v.number(),
    countedInPublic: v.boolean(),
  })
    .index("by_tradePoint_active", ["tradePointId", "expiresAt"])
    .index("by_user", ["userId"])
    .index("by_user_active", ["userId", "expiresAt"])
    .index("by_user_tradePoint_active", ["userId", "tradePointId", "expiresAt"])
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
      })
    ),
    version: v.number(),
    year: v.number(),
  }),
});
