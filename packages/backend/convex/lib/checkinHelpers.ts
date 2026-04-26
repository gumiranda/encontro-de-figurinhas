import type { Doc, Id } from "../_generated/dataModel";
import type { QueryCtx, MutationCtx } from "../_generated/server";

/**
 * Get active checkin for user (expiresAt > now).
 * Pattern used in 7+ places — centralized here to avoid duplication.
 */
export async function getActiveCheckin(
  ctx: QueryCtx | MutationCtx,
  userId: Id<"users">
): Promise<Doc<"checkins"> | null> {
  return ctx.db
    .query("checkins")
    .withIndex("by_user_active", (q) =>
      q.eq("userId", userId).gt("expiresAt", Date.now())
    )
    .first();
}

/**
 * Build denormalized fields for checkin document.
 * Avoids N+1 reads when querying present users at a trade point.
 *
 * WRITE-side: source is a user doc. Uses richer fallback chain
 * (displayNickname → nickname → name → "Colecionador").
 * Pair with normalizeCheckinDenorm for the read-side.
 */
export function buildCheckinDenormFields(user: Doc<"users">) {
  return {
    displayNickname:
      user.displayNickname ?? user.nickname ?? user.name ?? "Colecionador",
    avatarSeed: user.nickname ?? user._id,
    duplicates: user.duplicates ?? [],
    userMissing: user.missing ?? [],
    albumCompletionPct: user.albumCompletionPct ?? 0,
    totalTrades: user.totalTrades ?? 0,
    isPremium: user.isPremium ?? false,
    isVerified: user.isVerified ?? false,
  };
}

/**
 * READ-side normalizer: returns the same denorm shape with defaults applied.
 * Source is a checkin doc (already-denormalized fields), not a user doc.
 *
 * `hasProfileData` distinguishes "denorm not yet written" (old checkin from
 * before the schema extension landed) from "user genuinely has 0% / 0 trades",
 * so the UI can render `—` vs `0%`.
 */
export function normalizeCheckinDenorm(c: Doc<"checkins">) {
  const hasProfileData = c.albumCompletionPct !== undefined;
  return {
    displayNickname: c.displayNickname ?? "Colecionador",
    avatarSeed: c.avatarSeed ?? c.userId,
    duplicates: c.duplicates ?? [],
    userMissing: c.userMissing ?? [],
    albumCompletionPct: c.albumCompletionPct ?? 0,
    totalTrades: c.totalTrades ?? 0,
    isPremium: c.isPremium ?? false,
    isVerified: c.isVerified ?? false,
    hasProfileData,
  };
}

/**
 * Check if two number arrays are equal (same elements, same order).
 */
export function arraysEqual(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
