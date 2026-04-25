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
 */
export function buildCheckinDenormFields(user: Doc<"users">) {
  return {
    displayNickname:
      user.displayNickname ?? user.nickname ?? user.name ?? "Colecionador",
    avatarSeed: user.nickname ?? user._id,
    duplicates: user.duplicates ?? [],
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
