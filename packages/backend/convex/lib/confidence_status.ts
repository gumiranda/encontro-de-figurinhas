// Pure module — no Convex imports

export type ConfidenceStatus =
  | "unverified"
  | "low"
  | "moderate"
  | "high"
  | "verified";

export const INTENSITY_THRESHOLDS = [
  { maxExclusive: 2, intensity: 0 as const },
  { maxExclusive: 5, intensity: 1 as const },
  { maxExclusive: 7.5, intensity: 2 as const },
  { maxExclusive: 10.0001, intensity: 3 as const },
] as const;

function clampConfidence(score: number): number {
  if (!Number.isFinite(score)) return 0;
  return Math.min(10, Math.max(0, score));
}

export function resolveConfidenceStatus(score: number): ConfidenceStatus {
  const s = clampConfidence(score);
  switch (true) {
    case s < 2:
      return "unverified";
    case s < 5:
      return "low";
    case s < 7.5:
      return "moderate";
    case s < 9:
      return "high";
    default:
      return "verified";
  }
}

const SCORE_LABELS = {
  unverified: "New",
  low: "Early",
  moderate: "Growing",
  high: "Strong",
  verified: "Verified",
} satisfies Record<ConfidenceStatus, string>;

export function resolveScoreLabel(score: number): string {
  const status = resolveConfidenceStatus(score);
  return SCORE_LABELS[status];
}

export function resolveIntensity(score: number): 0 | 1 | 2 | 3 {
  const s = clampConfidence(score);
  for (const step of INTENSITY_THRESHOLDS) {
    if (s < step.maxExclusive) return step.intensity;
  }
  return 3;
}
