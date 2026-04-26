import { ConvexError, v } from "convex/values";
import {
  internalMutation,
  mutation,
  query,
  type MutationCtx,
  type QueryCtx,
} from "./_generated/server";
import { rateLimiter } from "./lib/rateLimiter";

export const get = query({
  args: {},
  handler: async (ctx) => {
    const status = await rateLimiter.check(ctx, "publicSiteStats", {
      key: "global",
    });
    if (!status.ok) throw new ConvexError("rate-limited");
    return await ctx.db.query("siteStats").unique();
  },
});

export async function ensureSiteStats(ctx: MutationCtx) {
  const existing = await ctx.db.query("siteStats").unique();
  if (existing) return existing;
  const id = await ctx.db.insert("siteStats", {
    matchRecomputeEnabled: true,
    hardDeleteOversizedCount: 0,
    lastReconcileAt: 0,
  });
  const created = await ctx.db.get(id);
  if (!created) throw new Error("siteStats insert failed");
  return created;
}

export async function readSiteStatsOrNull(ctx: QueryCtx) {
  return await ctx.db.query("siteStats").unique();
}

export const initSiteStats = internalMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("siteStats").unique();
    if (existing) return { ok: true, created: false, id: existing._id };
    const id = await ctx.db.insert("siteStats", {
      matchRecomputeEnabled: true,
      hardDeleteOversizedCount: 0,
      lastReconcileAt: 0,
    });
    return { ok: true, created: true, id };
  },
});

async function requireAdmin(ctx: MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError("NOT_AUTHENTICATED");
  const user = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .unique();
  if (!user || (user.role !== "SUPERADMIN" && user.role !== "CEO")) {
    throw new ConvexError("FORBIDDEN");
  }
  return { identity, user };
}

export const setKillSwitch = mutation({
  args: { enabled: v.boolean() },
  handler: async (ctx, { enabled }) => {
    const { identity } = await requireAdmin(ctx);
    const stats = await ensureSiteStats(ctx);
    await ctx.db.patch(stats._id, { matchRecomputeEnabled: enabled });
    console.warn("[KILL_SWITCH_ACTIVATED]", {
      at: Date.now(),
      enabled,
      byClerkId: identity.subject,
    });
    return { ok: true, enabled };
  },
});

export async function incrementOversizedCount(ctx: MutationCtx) {
  const stats = await ensureSiteStats(ctx);
  await ctx.db.patch(stats._id, {
    hardDeleteOversizedCount: (stats.hardDeleteOversizedCount ?? 0) + 1,
  });
}
