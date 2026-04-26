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
