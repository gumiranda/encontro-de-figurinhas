// Pure module — no Convex imports

export const SAFETY_CATEGORIES = [
  "suspicious_behavior",
  "private_contact_attempt",
  "minor_approach",
  "inappropriate_content",
] as const;

export const OPERATIONAL_CATEGORIES = [
  "broken_whatsapp_link",
  "inactive_point",
  "other",
] as const;

export const ADMIN_REVIEW_CATEGORIES = [
  ...SAFETY_CATEGORIES,
  "other",
] as const;

export const SAFETY_AUTO_SUSPEND_THRESHOLD = 3;

export const SAFETY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

export type SafetyCategory = (typeof SAFETY_CATEGORIES)[number];
export type OperationalCategory = (typeof OPERATIONAL_CATEGORIES)[number];
export type AdminReviewCategory = (typeof ADMIN_REVIEW_CATEGORIES)[number];
