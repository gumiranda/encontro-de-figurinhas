import type { QueryCtx, MutationCtx } from "../_generated/server";
import { Role } from "./types";

export async function getAuthenticatedUser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;
  return ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
}

export const isAdmin = (role?: string) =>
  role === Role.SUPERADMIN || role === Role.CEO;

/**
 * Require authenticated user. Throws if not authenticated.
 * Returns user with isShadowBanned for downstream filtering.
 *
 * Note: This is for queries/mutations only. Actions (ActionCtx) must use
 * ctx.runQuery(api.users.getCurrentUser) pattern.
 *
 * TODO: Add isBanned check when ban feature is implemented in schema.
 */
export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await getAuthenticatedUser(ctx);
  if (!user) throw new Error("Not authenticated");
  return user;
}

/**
 * Require admin user (superadmin or ceo).
 */
export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireAuth(ctx);
  if (user.role !== Role.SUPERADMIN && user.role !== Role.CEO) {
    throw new Error("Not authorized");
  }
  return user;
}
