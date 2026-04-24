import { v, ConvexError } from "convex/values";
import { mutation, internalMutation } from "./_generated/server";
import { internal } from "./_generated/api";
import { getAuthenticatedUser } from "./lib/auth";
import {
  reportCategoryValidator,
  REPORT_DEDUP_MS,
  SAFETY_AUTO_SUSPEND_THRESHOLD,
  SAFETY_CATEGORIES,
  SAFETY_WINDOW_MS,
  tradePointReportTargetKey,
} from "./lib/reportCategories";

const DAILY_REPORT_LIMIT = 5;

export const create = mutation({
  args: {
    targetUserId: v.optional(v.id("users")),
    tradePointId: v.optional(v.id("tradePoints")),
    category: reportCategoryValidator,
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getAuthenticatedUser(ctx);
    if (!user) throw new ConvexError("AUTH_REQUIRED");

    if (!args.targetUserId && !args.tradePointId) {
      throw new ConvexError("TARGET_REQUIRED");
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const todayReports = await ctx.db
      .query("reports")
      .withIndex("by_reporter_created", (q) =>
        q.eq("reporterId", user._id).gte("createdAt", todayStart.getTime())
      )
      .collect();

    if (todayReports.length >= DAILY_REPORT_LIMIT) {
      throw new ConvexError("DAILY_LIMIT");
    }

    const targetKey = args.tradePointId
      ? tradePointReportTargetKey(args.tradePointId)
      : `user:${args.targetUserId}`;

    const dedupCutoff = Date.now() - REPORT_DEDUP_MS;
    const recentDupe = await ctx.db
      .query("reports")
      .withIndex("by_reporter_target_recent", (q) =>
        q
          .eq("reporterId", user._id)
          .eq("targetKey", targetKey)
          .gte("createdAt", dedupCutoff)
      )
      .first();

    if (recentDupe) {
      throw new ConvexError("DUPLICATE_REPORT");
    }

    const reportId = await ctx.db.insert("reports", {
      reporterId: user._id,
      targetUserId: args.targetUserId,
      tradePointId: args.tradePointId,
      targetKey,
      category: args.category,
      description: args.description,
      status: "open",
      isResolved: false,
      createdAt: Date.now(),
    });

    if (args.tradePointId) {
      await ctx.scheduler.runAfter(0, internal.reports.evaluateAutoAction, {
        tradePointId: args.tradePointId,
      });
    }

    return { reportId };
  },
});

export const evaluateAutoAction = internalMutation({
  args: { tradePointId: v.id("tradePoints") },
  handler: async (ctx, { tradePointId }) => {
    const point = await ctx.db.get(tradePointId);
    if (!point || point.status !== "approved") {
      return null;
    }

    const now = Date.now();
    const cooldownStart = point.suspendedFromReportsAt ?? 0;
    const windowStart = Math.max(now - SAFETY_WINDOW_MS, cooldownStart);
    const targetKey = tradePointReportTargetKey(tradePointId);

    let safetyCount = 0;
    for (const cat of SAFETY_CATEGORIES) {
      const rows = await ctx.db
        .query("reports")
        .withIndex("by_target_category_recent", (q) =>
          q.eq("targetKey", targetKey).eq("category", cat).gte("createdAt", windowStart)
        )
        .collect();
      safetyCount += rows.filter(
        (r) => r.resolvedAt == null && !r.isResolved
      ).length;
    }

    if (safetyCount < SAFETY_AUTO_SUSPEND_THRESHOLD) {
      return null;
    }

    await ctx.db.patch(tradePointId, {
      status: "suspended",
      suspendedFromReportsAt: now,
      lastSuspensionReason: "auto_reports_safety",
    });

    const owner = await ctx.db.get(point.requestedBy);
    if (owner) {
      await ctx.db.patch(owner._id, {
        warningCount: (owner.warningCount ?? 0) + 1,
      });
    }

    return null;
  },
});
