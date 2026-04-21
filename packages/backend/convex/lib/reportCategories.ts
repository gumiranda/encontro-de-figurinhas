import { v } from "convex/values";
import type { QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export const reportCategoryValidator = v.union(
  v.literal("suspicious_behavior"),
  v.literal("private_contact_attempt"),
  v.literal("minor_approach"),
  v.literal("inappropriate_content"),
  v.literal("broken_whatsapp_link"),
  v.literal("inactive_point"),
  v.literal("other")
);

export {
  ADMIN_REVIEW_CATEGORIES,
  OPERATIONAL_CATEGORIES,
  SAFETY_AUTO_SUSPEND_THRESHOLD,
  SAFETY_CATEGORIES,
  SAFETY_WINDOW_MS,
} from "./report_severity";
export const REPORT_DEDUP_MS = 24 * 60 * 60 * 1000;
export const MINOR_APPROACH_EXTRA_MIN = 4;

/** Chave denormalizada para índices de reports contra um ponto de troca. */
export function tradePointReportTargetKey(tradePointId: string): string {
  return `tradePoint:${tradePointId}`;
}

export async function countExtraStickersOwned(
  ctx: { db: QueryCtx["db"] },
  user: Doc<"users">
): Promise<number> {
  const config = await ctx.db.query("albumConfig").first();
  if (!config) return 0;
  const missing = new Set(user.missing ?? []);
  let count = 0;
  for (const section of config.sections) {
    if (!section.isExtra) continue;
    for (let n = section.startNumber; n <= section.endNumber; n++) {
      if (!missing.has(n)) count++;
    }
  }
  return count;
}
