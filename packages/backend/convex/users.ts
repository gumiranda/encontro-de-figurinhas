import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Sector, Role } from "./lib/types";
import { getAuthenticatedUser, isAdmin } from "./lib/auth";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return getAuthenticatedUser(ctx);
  },
});

// Check if any users exist (for bootstrap flow)
export const hasAnyUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    return user !== null;
  },
});

// Bootstrap: create first superadmin (fails if users exist)
export const bootstrapSuperadmin = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const anyUser = await ctx.db.query("users").first();
    if (anyUser) {
      throw new Error("Users already exist - bootstrap not allowed");
    }

    const userId = await ctx.db.insert("users", {
      name: identity.name ?? "Superadmin",
      clerkId: identity.subject,
      role: Role.SUPERADMIN,
    });

    return await ctx.db.get(userId);
  },
});

// Create regular user (idempotent)
export const createUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkId = identity.subject;

    // Idempotent: return existing user if found
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .unique();

    if (existingUser) {
      return existingUser;
    }

    const userId = await ctx.db.insert("users", {
      name: identity.name ?? "Unknown",
      clerkId: clerkId,
      role: Role.USER,
    });

    return await ctx.db.get(userId);
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
