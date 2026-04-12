import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Sector, Role, UserStatus } from "./lib/types";
import { getAuthenticatedUser, isAdmin } from "./lib/auth";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return getAuthenticatedUser(ctx);
  },
});

export const hasSuperadmin = query({
  args: {},
  handler: async (ctx) => {
    const superadmin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", Role.SUPERADMIN))
      .first();
    return superadmin !== null;
  },
});

export const hasAnyUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    return user !== null;
  },
});

export const add = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (identity === null) {
      throw new Error("Not authenticated");
    }

    const clerkId = identity.subject;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existingUser) {
      return existingUser._id;
    }

    const userId = await ctx.db.insert("users", {
      name: identity.name ?? "Unknown",
      clerkId: clerkId,
      role: Role.USER,
      status: UserStatus.PENDING,
    });

    return userId;
  },
});

export const bootstrap = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingSuperadmin = await ctx.db
      .query("users")
      .withIndex("by_role", (q) => q.eq("role", Role.SUPERADMIN))
      .first();

    if (existingSuperadmin) {
      throw new Error("Superadmin already exists");
    }

    const clerkId = identity.subject;

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existingUser) {
      throw new Error("User already exists");
    }
    return await ctx.db.insert("users", {
      name: identity.name ?? "Superadmin",
      clerkId: clerkId,
      role: Role.SUPERADMIN,
      status: UserStatus.APPROVED,
      approvedAt: Date.now(),
    });
  },
});

export const getAllUsers = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser || !isAdmin(currentUser.role)) return [];

    // Limite padrão de 100, máximo 500
    const limit = Math.min(args.limit ?? 100, 500);
    return await ctx.db.query("users").take(limit);
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser || currentUser.role !== Role.SUPERADMIN) {
      throw new Error("Only superadmin can change user roles");
    }

    const validRoles = Object.values(Role) as string[];
    if (!validRoles.includes(args.role)) {
      throw new Error("Invalid role");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    if (targetUser._id === currentUser._id) {
      throw new Error("Cannot change your own role");
    }

    const updateData: { role: string; sector?: string } = { role: args.role };

    if (args.role === Role.SUPERADMIN || args.role === Role.CEO) {
      updateData.sector = undefined;
    }

    await ctx.db.patch(args.userId, updateData);
    return true;
  },
});

export const updateUserSector = mutation({
  args: {
    userId: v.id("users"),
    sector: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    if (!isAdmin(currentUser.role)) {
      throw new Error("Only superadmin or CEO can change user sectors");
    }

    const validSectors = Object.values(Sector) as string[];
    if (!validSectors.includes(args.sector)) {
      throw new Error("Invalid sector");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("User not found");
    }

    if (currentUser.role === Role.CEO && isAdmin(targetUser.role)) {
      throw new Error("CEO cannot modify superadmin or other CEO users");
    }

    if (isAdmin(targetUser.role)) {
      throw new Error("Cannot assign sector to superadmin or CEO");
    }

    await ctx.db.patch(args.userId, { sector: args.sector });
    return true;
  },
});

export const getPendingUsers = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser || !isAdmin(currentUser.role)) return [];

    const pendingUsers = await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", UserStatus.PENDING))
      .collect();
    const noStatusUsers = await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", undefined))
      .collect();
    return [...pendingUsers, ...noStatusUsers];
  },
});

export const getPendingUsersCount = query({
  args: {},
  handler: async (ctx) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser || !isAdmin(currentUser.role)) return 0;

    const pendingUsers = await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", UserStatus.PENDING))
      .collect();
    const noStatusUsers = await ctx.db
      .query("users")
      .withIndex("by_status", (q) => q.eq("status", undefined))
      .collect();
    return pendingUsers.length + noStatusUsers.length;
  },
});

export const approveUser = mutation({
  args: {
    userId: v.id("users"),
    sector: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    if (!isAdmin(currentUser.role)) {
      throw new Error("Not authorized to approve users");
    }

    const validSectors = Object.values(Sector) as string[];
    if (!validSectors.includes(args.sector)) {
      throw new Error("Invalid sector");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    const isPending = targetUser.status === UserStatus.PENDING || targetUser.status === undefined;
    if (!isPending) {
      throw new Error("User is not pending approval");
    }

    await ctx.db.patch(args.userId, {
      status: UserStatus.APPROVED,
      sector: args.sector,
      approvedBy: currentUser._id,
      approvedAt: Date.now(),
    });

    return true;
  },
});

export const rejectUser = mutation({
  args: {
    userId: v.id("users"),
    reason: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticatedUser(ctx);
    if (!currentUser) {
      throw new Error("Not authenticated");
    }

    if (!isAdmin(currentUser.role)) {
      throw new Error("Not authorized to reject users");
    }

    const targetUser = await ctx.db.get(args.userId);
    if (!targetUser) {
      throw new Error("Target user not found");
    }

    const isPending = targetUser.status === UserStatus.PENDING || targetUser.status === undefined;
    if (!isPending) {
      throw new Error("User is not pending approval");
    }

    await ctx.db.patch(args.userId, {
      status: UserStatus.REJECTED,
      rejectedBy: currentUser._id,
      rejectedAt: Date.now(),
      rejectionReason: args.reason,
    });

    return true;
  },
});

// Helper to normalize nickname (remove accents + lowercase)
function normalizeNickname(nickname: string): string {
  return nickname
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export const checkNicknameAvailable = query({
  args: { nickname: v.string() },
  handler: async (ctx, { nickname }) => {
    const normalized = normalizeNickname(nickname);
    if (normalized.length < 3) return { available: false };

    const existing = await ctx.db
      .query("users")
      .withIndex("by_nickname", (q) => q.eq("nickname", normalized))
      .first();
    return { available: !existing };
  },
});

export const completeProfile = mutation({
  args: {
    nickname: v.string(),
    birthDate: v.number(),
    cityId: v.id("cities"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");
    if (user.hasCompletedOnboarding) throw new Error("Profile already completed");

    // Validate birthDate (server-side)
    const birthDate = new Date(args.birthDate);
    const today = new Date();
    const minDate = new Date("1900-01-01");
    if (birthDate > today) throw new Error("Birth date cannot be in the future");
    if (birthDate < minDate) throw new Error("Birth date cannot be before 1900");

    // Validate nickname uniqueness (normalized to avoid collisions)
    const nicknameLower = normalizeNickname(args.nickname);
    if (nicknameLower.length < 3) throw new Error("Nickname must be at least 3 characters");
    if (nicknameLower.length > 20) throw new Error("Nickname must be at most 20 characters");

    const existingNickname = await ctx.db
      .query("users")
      .withIndex("by_nickname", (q) => q.eq("nickname", nicknameLower))
      .first();
    if (existingNickname && existingNickname._id !== user._id) {
      throw new Error("Nickname already taken");
    }

    // Validate city exists
    const city = await ctx.db.get(args.cityId);
    if (!city) throw new Error("City not found");

    const now = Date.now();

    await ctx.db.patch(user._id, {
      nickname: nicknameLower,
      displayNickname: args.nickname,
      birthDate: args.birthDate,
      cityId: args.cityId,
      hasCompletedOnboarding: true,
      reliabilityScore: 3,
      totalTrades: 0,
      isShadowBanned: false,
      duplicates: [],
      missing: [],
      hasSeenSafetyTips: false,
      isPremium: false,
      lastActiveAt: now,
      createdAt: user.createdAt ?? now,
    });

    return { success: true };
  },
});
