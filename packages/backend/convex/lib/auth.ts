import { v } from "convex/values";
import type { QueryCtx, MutationCtx } from "../_generated/server";
import type { Doc, Id } from "../_generated/dataModel";
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

export type AuthState =
  | { state: "needs-auth"; user: null }
  | { state: "banned"; user: null }
  | { state: "needs-onboarding"; user: Doc<"users"> }
  | { state: "ok"; user: Doc<"users"> };

export async function checkAuth(
  ctx: QueryCtx | MutationCtx
): Promise<AuthState> {
  const user = await getAuthenticatedUser(ctx);
  if (!user) return { state: "needs-auth", user: null };
  if (user.isBanned === true) return { state: "banned", user: null };
  if (!user.hasCompletedOnboarding) {
    return { state: "needs-onboarding", user };
  }
  return { state: "ok", user };
}

export const authErrorValidators = [
  v.object({ ok: v.literal(false), error: v.literal("needs-auth") }),
  v.object({ ok: v.literal(false), error: v.literal("banned") }),
  v.object({ ok: v.literal(false), error: v.literal("needs-onboarding") }),
] as const;

export type AuthError =
  | { ok: false; error: "needs-auth" }
  | { ok: false; error: "banned" }
  | { ok: false; error: "needs-onboarding" };

export function authStateAsError(auth: AuthState): AuthError | null {
  if (auth.state === "ok") return null;
  return { ok: false, error: auth.state };
}

export async function requireAuth(ctx: QueryCtx | MutationCtx) {
  const user = await getAuthenticatedUser(ctx);
  if (!user) throw new Error("Not authenticated");
  return user;
}

export async function requireApprovedPoint(
  ctx: QueryCtx | MutationCtx,
  tradePointId: Id<"tradePoints">
) {
  const point = await ctx.db.get(tradePointId);
  if (!point || point.status !== "approved") {
    throw new Error("Point unavailable");
  }
  return point;
}

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const user = await requireAuth(ctx);
  if (user.role !== Role.SUPERADMIN && user.role !== Role.CEO) {
    throw new Error("Not authorized");
  }
  return user;
}
