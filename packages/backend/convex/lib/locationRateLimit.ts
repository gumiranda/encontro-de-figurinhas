import type { Doc } from "../_generated/dataModel";
import { LOCATION_RATE_LIMIT } from "./locationConstants";

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
