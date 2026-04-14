export const LOCATION_RATE_LIMIT = {
  COOLDOWN_MS: 30_000,
  MAX_PER_HOUR: 10,
  WINDOW_MS: 60 * 60 * 1000,
} as const;

export const GEO_VALIDATION = {
  MAX_DISTANCE_FROM_CITY_KM: 200,
} as const;
