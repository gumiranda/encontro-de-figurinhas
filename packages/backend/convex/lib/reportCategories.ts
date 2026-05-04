import { v } from "convex/values";
import type { QueryCtx } from "../_generated/server";
import type { Doc } from "../_generated/dataModel";

export const reportCategoryValidator = v.union(
  v.literal("safety"),
  v.literal("fake_stickers"),
  v.literal("no_show"),
  v.literal("spam"),
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
export const EVALUATE_AUTO_ACTION_DEBOUNCE_MS = 5_000;
export const MINOR_APPROACH_EXTRA_MIN = 4;

/** Chave denormalizada para índices de reports contra um ponto de troca. */
export function tradePointReportTargetKey(tradePointId: string): string {
  return `tradePoint:${tradePointId}`;
}


