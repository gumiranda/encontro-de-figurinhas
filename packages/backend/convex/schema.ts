import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    clerkId: v.string(),
    role: v.optional(v.union(v.literal("superadmin"), v.literal("ceo"), v.literal("user"))),
    sector: v.optional(v.union(v.literal("general"))),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    approvedBy: v.optional(v.id("users")),
    approvedAt: v.optional(v.number()),
    rejectedBy: v.optional(v.id("users")),
    rejectedAt: v.optional(v.number()),
    rejectionReason: v.optional(v.string()),
  })
    .index("by_clerk_id", ["clerkId"])
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  spots: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    latitude: v.float64(),
    longitude: v.float64(),
    createdBy: v.id("users"),
    createdByName: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    upvotes: v.number(),
    downvotes: v.number(),
    isActive: v.boolean(),
  })
    .index("by_active_expiresAt", ["isActive", "expiresAt"])
    .index("by_created_by", ["createdBy"])
    .index("by_createdBy_and_createdAt", ["createdBy", "createdAt"])
    .index("by_createdAt", ["createdAt"]),

  votes: defineTable({
    spotId: v.id("spots"),
    userId: v.id("users"),
    value: v.union(v.literal(1), v.literal(-1)),
    createdAt: v.number(),
  })
    .index("by_spot", ["spotId"])
    .index("by_user_spot", ["userId", "spotId"])
    .index("by_userId_and_createdAt", ["userId", "createdAt"]),
});
