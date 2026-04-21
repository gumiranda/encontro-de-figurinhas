import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import {
  SAFETY_AUTO_SUSPEND_THRESHOLD,
  SAFETY_CATEGORIES,
  SAFETY_WINDOW_MS,
  tradePointReportTargetKey,
} from "./lib/reportCategories";

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
