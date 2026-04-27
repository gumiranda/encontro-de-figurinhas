import type { Doc } from "../_generated/dataModel";

export const LOCATION_RATE_LIMIT = {
  COOLDOWN_MS: 30_000,
  MAX_PER_HOUR: 10,
  WINDOW_MS: 60 * 60 * 1000,
} as const;

export const GEO_VALIDATION = {
  MAX_DISTANCE_FROM_CITY_KM: 200,
} as const;

/** Drop timestamps outside the rolling window (sliding 1h from `now`). */
export function pruneLocationUpdateTimestamps(
  timestamps: number[],
  now: number,
  windowMs: number = LOCATION_RATE_LIMIT.WINDOW_MS
): number[] {
  const cutoff = now - windowMs;
  return timestamps.filter((t) => t > cutoff);
}

export function getLocationUpdateTimestampsForWindow(
  user: Pick<Doc<"users">, "locationUpdateTimestamps">,
  now: number,
  windowMs: number = LOCATION_RATE_LIMIT.WINDOW_MS
): number[] {
  const raw = user.locationUpdateTimestamps ?? [];
  return pruneLocationUpdateTimestamps([...raw], now, windowMs);
}

export type RateLimitConfig = {
  cooldownMs: number;
  maxPerHour: number;
  windowMs: number;
};

export type RateLimitResult =
  | { allowed: true; newCount: number }
  | { allowed: false; reason: "cooldown" | "limit_exceeded" };

export function checkRateLimit(
  lastUpdate: number,
  callCount: number,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  const windowStart = now - config.windowMs;
  const shouldReset = lastUpdate <= windowStart;
  const effectiveCount = shouldReset ? 0 : callCount;

  if (lastUpdate > 0 && now - lastUpdate < config.cooldownMs) {
    return { allowed: false, reason: "cooldown" };
  }

  if (effectiveCount >= config.maxPerHour) {
    return { allowed: false, reason: "limit_exceeded" };
  }

  return { allowed: true, newCount: effectiveCount + 1 };
}
