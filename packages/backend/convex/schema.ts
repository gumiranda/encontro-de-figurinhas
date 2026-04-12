import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    role: v.optional(v.string()),
    sector: v.optional(v.string()),
    status: v.optional(v.string()),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),

    // Profile completion fields
    nickname: v.optional(v.string()),
    displayNickname: v.optional(v.string()),
    birthDate: v.optional(v.number()),
    cityId: v.optional(v.id("cities")),
    hasCompletedOnboarding: v.optional(v.boolean()),

    // Reputation fields (PRD §2.3)
    reliabilityScore: v.optional(v.number()),
    totalTrades: v.optional(v.number()),
    isShadowBanned: v.optional(v.boolean()),

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
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_status", ["status"])
    .index("by_nickname", ["nickname"])
    .index("by_city", ["cityId"]),

  cities: defineTable({
    name: v.string(),
    state: v.string(),
    slug: v.string(),
    lat: v.number(),
    lng: v.number(),
  })
    .index("by_slug", ["slug"])
    .searchIndex("search_name", { searchField: "name" }),

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
