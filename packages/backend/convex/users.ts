import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Role, isValidRole, isValidSector } from "./lib/types";
import { getAuthenticatedUser, isAdmin, requireAuth } from "./lib/auth";
import { haversine, isInBrazil } from "./lib/geo";
import { verifyIpLocationToken } from "./lib/ipLocationToken";
import {
  GEO_VALIDATION,
  LOCATION_RATE_LIMIT,
  checkRateLimit,
  getLocationUpdateTimestampsForWindow,
} from "./lib/locationRateLimit";
import { rateLimiter } from "./lib/rateLimiter";
import { throwSetLocationError } from "./lib/setLocationErrors";
import { getPendingProposalsForUserCount } from "./lib/tradeHelpers";
import { readSiteStatsOrNull } from "./siteStats";
import { DEFAULT_TOTAL_STICKERS } from "./lib/constants";

export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return getAuthenticatedUser(ctx);
  },
});

export const getNavContext = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;
    const pendingProposalsCount = await getPendingProposalsForUserCount(
      ctx,
      user._id
    );
    return {
      role: user.role,
      hasCompletedOnboarding: user.hasCompletedOnboarding ?? false,
      hasCompletedStickerSetup: user.hasCompletedStickerSetup ?? false,
      pendingProposalsCount,
    };
  },
});

export const hasAnyUsers = query({
  args: {},
  handler: async (ctx) => {
    const user = await ctx.db.query("users").first();
    return user !== null;
  },
});

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
      reliabilityScore: 3,
      pendingSubmissionsCount: 0,
    });

    return await ctx.db.get(userId);
  },
});

export const createUser = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const clerkId = identity.subject;

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
      reliabilityScore: 3,
      pendingSubmissionsCount: 0,
    });

    return await ctx.db.get(userId);
  },
});

export const getAllUsers = query({
  args: {
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { paginationOpts }) => {
    const currentUser = await requireAuth(ctx);
    if (!isAdmin(currentUser.role)) {
      throw new Error("Admin access required");
    }

    const usersPage = await ctx.db.query("users").paginate(paginationOpts);
    const page = await Promise.all(
      usersPage.page.map(async (user) => {
        const city = user.cityId ? await ctx.db.get(user.cityId) : null;
        const duplicatesCount = user.duplicates?.length ?? 0;
        const missingCount = user.missing?.length ?? 0;

        return {
          ...user,
          city: city
            ? {
                name: city.name,
                state: city.state,
              }
            : null,
          duplicatesCount,
          missingCount,
        };
      })
    );

    return {
      ...usersPage,
      page,
    };
  },
});

export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await requireAuth(ctx);
    if (currentUser.role !== Role.SUPERADMIN) {
      throw new Error("Only superadmin can change user roles");
    }

    if (!isValidRole(args.role)) {
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
    const currentUser = await requireAuth(ctx);

    if (!isAdmin(currentUser.role)) {
      throw new Error("Only superadmin or CEO can change user sectors");
    }

    if (!isValidSector(args.sector)) {
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


const NICKNAME_REGEX = /^[a-z0-9_]+$/;

/** Normalizes nickname (accents removed, lowercased) and enforces safe charset for storage. */
function normalizeNickname(nickname: string): string {
  const normalized = nickname
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (!NICKNAME_REGEX.test(normalized)) {
    throw new Error(
      "Nickname can only contain letters, numbers, and underscores"
    );
  }

  return normalized;
}

export const checkNicknameAvailable = query({
  args: { nickname: v.string() },
  handler: async (ctx, { nickname }) => {
    if (nickname.length > 24) return { available: false };
    let normalized: string;
    try {
      normalized = normalizeNickname(nickname);
    } catch {
      return { available: false };
    }
    if (normalized.length < 3) return { available: false };

    const status = await rateLimiter.check(ctx, "nicknameCheck", { key: "global" });
    if (!status.ok) return { available: false };

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
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Hard rate-limit por usuário: evita reserva em batch de nicknames por 1 ator
    await rateLimiter.limit(ctx, "completeProfile", {
      key: identity.subject,
      throws: true,
    });

    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");
    if (user.hasCompletedOnboarding) throw new Error("Profile already completed");

    const birthDate = new Date(args.birthDate);
    const today = new Date();
    const minDate = new Date("1900-01-01");
    if (birthDate > today) throw new Error("Birth date cannot be in the future");
    if (birthDate < minDate) throw new Error("Birth date cannot be before 1900");

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

    const now = Date.now();

    const stats = await readSiteStatsOrNull(ctx);
    const totalCount = stats?.totalStickers ?? DEFAULT_TOTAL_STICKERS;
    const allMissing = Array.from({ length: totalCount }, (_, i) => i);

    await ctx.db.patch(user._id, {
      nickname: nicknameLower,
      displayNickname: args.nickname,
      birthDate: args.birthDate,
      hasCompletedOnboarding: true,
      reliabilityScore: 3,
      totalTrades: 0,
      isShadowBanned: false,
      duplicates: [],
      missing: allMissing,
      hasCompletedStickerSetup: true,
      albumProgress: 0,
      albumCompletionPct: 0,
      totalStickersOwned: 0,
      hasSeenSafetyTips: false,
      isPremium: false,
      lastActiveAt: now,
      createdAt: user.createdAt ?? now,
    });

    return { success: true };
  },
});

export const generateAvatarUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAuth(ctx);
    return await ctx.storage.generateUploadUrl();
  },
});

export const setAvatar = mutation({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    const url = await ctx.storage.getUrl(args.storageId);
    if (!url) {
      throw new Error("Upload not found");
    }

    const previousStorageId = user.avatarStorageId;

    await ctx.db.patch(user._id, {
      avatarStorageId: args.storageId,
      avatarUrl: url,
    });

    if (previousStorageId && previousStorageId !== args.storageId) {
      await ctx.storage.delete(previousStorageId);
    }

    // Refresh denorm avatar on pending trades
    const [pendingAsCounterparty, pendingAsInitiator] = await Promise.all([
      ctx.db
        .query("trades")
        .withIndex("by_counterparty_status", (q) =>
          q.eq("counterpartyId", user._id).eq("status", "pending_confirmation")
        )
        .take(50),
      ctx.db
        .query("trades")
        .withIndex("by_initiator_status", (q) =>
          q.eq("initiatorId", user._id).eq("status", "pending_confirmation")
        )
        .take(50),
    ]);

    await Promise.all([
      ...pendingAsCounterparty.map((t) =>
        ctx.db.patch(t._id, { counterpartyAvatarUrl: url })
      ),
      ...pendingAsInitiator.map((t) =>
        ctx.db.patch(t._id, { initiatorAvatarUrl: url })
      ),
    ]);

    return { avatarUrl: url };
  },
});

export const getMyFavoriteTradePointIds = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return [];
    return user.favoriteTradePointIds ?? [];
  },
});

// Cap duro de favoritos por user. MVP: mesmo valor para todos.
// Ramp-up para 200 quando premium gating entrar (schema ganhar premiumExpiresAt).
export const MAX_FAVORITE_TRADE_POINTS = 50;

// --- Public Profile (unauthenticated) ---

const NICKNAME_PUBLIC_REGEX = /^[a-zA-Z0-9_-]{3,20}$/;

export const getPublicProfile = query({
  args: { nickname: v.string() },
  handler: async (ctx, { nickname }) => {
    // Rate limit global (não por nickname = evita user enumeration)
    const status = await rateLimiter.check(ctx, "publicProfile", { key: "global" });
    if (!status.ok) return null;

    // Validação regex antes de query
    const normalized = nickname.toLowerCase().replace(/^@/, "");
    if (!NICKNAME_PUBLIC_REGEX.test(normalized)) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_nickname", (q) => q.eq("nickname", normalized))
      .first();

    // Checagens de segurança
    if (!user) return null;
    if (user.isBanned || user.isShadowBanned) return null;
    if (!user.hasCompletedStickerSetup) return null;
    if (user.isProfilePublic !== true) return null;

    // Parallel queries (index by_absolute existe em schema.ts)
    const dupSample = (user.duplicates ?? []).slice(0, 12);
    const dupDetails = await Promise.all(
      dupSample.map((n) =>
        ctx.db
          .query("stickerDetail")
          .withIndex("by_absolute", (q) => q.eq("absoluteNum", n))
          .first()
      )
    );

    const duplicatesSample = dupDetails
      .filter(Boolean)
      .map((d) => ({
        displayCode: d!.displayCode ?? `${d!.sectionCode}-${d!.relativeNum}`,
        flagEmoji: d!.flagEmoji,
      }));

    return {
      nickname: user.nickname,
      displayNickname: (user.displayNickname ?? user.nickname ?? "?").slice(0, 12) || "?",
      avatarSeed: user._id,
      albumCompletionPct: user.albumCompletionPct ?? 0,
      albumProgress: user.albumProgress ?? 0,
      totalTrades: user.totalTrades ?? 0,
      ratingAvg: user.ratingAvg,
      ratingCount: user.ratingCount ?? 0,
      duplicatesCount: (user.duplicates ?? []).length,
      missingCount: (user.missing ?? []).length,
      duplicatesSample,
    };
  },
});

export const updateProfileSettings = mutation({
  args: {
    isProfilePublic: v.optional(v.boolean()),
    acceptsMail: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    const updates: Partial<{
      isProfilePublic: boolean;
      acceptsMail: boolean;
    }> = {};

    if (args.isProfilePublic !== undefined) {
      updates.isProfilePublic = args.isProfilePublic;
    }
    if (args.acceptsMail !== undefined) {
      updates.acceptsMail = args.acceptsMail;
    }

    if (Object.keys(updates).length === 0) {
      return { success: true };
    }

    await ctx.db.patch(user._id, updates);
    return { success: true };
  },
});

export const getProfileSettings = query({
  args: {},
  handler: async (ctx) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) return null;

    return {
      nickname: user.nickname,
      displayNickname: user.displayNickname,
      avatarUrl: user.avatarUrl,
      isProfilePublic: user.isProfilePublic ?? false,
      acceptsMail: user.acceptsMail ?? false,
      hasCompletedStickerSetup: user.hasCompletedStickerSetup ?? false,
      albumCompletionPct: user.albumCompletionPct ?? 0,
      totalTrades: user.totalTrades ?? 0,
      ratingAvg: user.ratingAvg,
      ratingCount: user.ratingCount ?? 0,
      duplicatesCount: (user.duplicates ?? []).length,
    };
  },
});

export const toggleFavoriteTradePoint = mutation({
  args: { tradePointId: v.id("tradePoints") },
  handler: async (ctx, { tradePointId }) => {
    const user = await requireAuth(ctx);
    const point = await ctx.db.get(tradePointId);
    if (!point || point.status !== "approved") {
      throw new Error("Point unavailable");
    }
    const current = user.favoriteTradePointIds ?? [];
    const has = current.includes(tradePointId);
    if (!has && current.length >= MAX_FAVORITE_TRADE_POINTS) {
      throw new Error("FAVORITE_LIMIT_REACHED");
    }
    const next = has
      ? current.filter((id) => id !== tradePointId)
      : [...current, tradePointId];
    await ctx.db.patch(user._id, { favoriteTradePointIds: next });
    return { isFavorite: !has };
  },
});

export const setLocation = mutation({
  args: {
    cityId: v.id("cities"),
    locationSource: v.union(
      v.literal("gps"),
      v.literal("manual"),
      v.literal("ip")
    ),
    lat: v.optional(v.float64()),
    lng: v.optional(v.float64()),
    /** Token HMAC emitido por GET em `/api/ip-location` (obrigatório quando locationSource é ip). */
    ipLocationToken: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await requireAuth(ctx);

    const now = Date.now();
    const lastUpdate = user.locationUpdatedAt ?? 0;

    const timestampsInWindow = getLocationUpdateTimestampsForWindow(user, now);

    const rateLimit = checkRateLimit(
      lastUpdate,
      timestampsInWindow.length,
      {
        cooldownMs: LOCATION_RATE_LIMIT.COOLDOWN_MS,
        maxPerHour: LOCATION_RATE_LIMIT.MAX_PER_HOUR,
        windowMs: LOCATION_RATE_LIMIT.WINDOW_MS,
      }
    );

    if (!rateLimit.allowed) {
      throwSetLocationError(
        rateLimit.reason === "cooldown"
          ? "LOCATION_RATE_LIMIT_COOLDOWN"
          : "LOCATION_RATE_LIMIT_HOURLY"
      );
    }

    const nextTimestamps = [...timestampsInWindow, now];

    const city = await ctx.db.get(args.cityId);
    if (!city) throwSetLocationError("LOCATION_CITY_NOT_FOUND");
    if (city.isActive === false) throwSetLocationError("LOCATION_CITY_INACTIVE");

    if ((args.lat !== undefined) !== (args.lng !== undefined)) {
      throwSetLocationError("LOCATION_COORDS_PAIR_INVALID");
    }

    const hasCoords = args.lat !== undefined && args.lng !== undefined;

    if (hasCoords && args.locationSource === "ip") {
      throwSetLocationError("LOCATION_IP_WITH_CLIENT_COORDS");
    }

    let effectiveSource: "gps" | "manual" | "ip";
    let saveCoords = false;

    // GPS do cliente pode ser spoofado; aqui só exigimos coerência com a cidade escolhida
    // (Brasil + distância ao centro). Longe demais → trata como manual e não persiste coords.
    if (hasCoords) {
      if (!isInBrazil(args.lat!, args.lng!)) {
        throwSetLocationError("LOCATION_OUTSIDE_BRAZIL");
      }

      const distance = haversine(city.lat, city.lng, args.lat!, args.lng!);
      if (distance > GEO_VALIDATION.MAX_DISTANCE_FROM_CITY_KM) {
        effectiveSource = "manual";
      } else {
        saveCoords = true;
        effectiveSource = "gps";
      }
    } else if (args.locationSource === "gps") {
      throwSetLocationError("LOCATION_GPS_COORDS_REQUIRED");
    } else if (args.locationSource === "ip") {
      const secret = process.env.IP_LOCATION_ATTESTATION_SECRET;
      if (!secret) {
        throwSetLocationError("LOCATION_IP_SERVER_CONFIG");
      }
      if (!args.ipLocationToken) {
        throwSetLocationError("LOCATION_IP_TOKEN_REQUIRED");
      }
      const payload = await verifyIpLocationToken(
        args.ipLocationToken,
        user.clerkId,
        secret
      );
      if (!payload) {
        throwSetLocationError("LOCATION_IP_TOKEN_INVALID");
      }
      if (!isInBrazil(payload.lat, payload.lng)) {
        throwSetLocationError("LOCATION_OUTSIDE_BRAZIL");
      }
      const distance = haversine(city.lat, city.lng, payload.lat, payload.lng);
      if (distance > GEO_VALIDATION.MAX_DISTANCE_FROM_CITY_KM) {
        throwSetLocationError("LOCATION_IP_CITY_MISMATCH");
      }
      effectiveSource = "ip";
    } else if (args.locationSource === "manual") {
      effectiveSource = "manual";
    } else {
      throwSetLocationError("LOCATION_INVALID_SOURCE");
    }

    await ctx.db.patch(user._id, {
      cityId: args.cityId,
      locationSource: effectiveSource,
      ...(saveCoords ? { lat: args.lat, lng: args.lng } : {}),
      locationUpdatedAt: now,
      locationUpdateTimestamps: nextTimestamps,
    });
    return { success: true };
  },
});

export const skipLocation = mutation({
  args: {},
  handler: async (ctx) => {
    const user = await requireAuth(ctx);

    await ctx.db.patch(user._id, {
      locationSource: "skipped",
      cityId: undefined,
    });

    return { success: true };
  },
});
