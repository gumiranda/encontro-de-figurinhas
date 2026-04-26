export const FREE_USER_MAX_POINTS = 3;
export const PREMIUM_USER_MAX_POINTS = 200;

export const MAX_CHECKIN_DISTANCE_KM = 0.5;
export const CHECKIN_DURATION_MS = 2 * 60 * 60 * 1000;

export const PEAK_HOURS_DECAY_FACTOR = 0.9;
export const PEAK_HOURS_FLOOR_AFTER_ACTIVITY = 1;

export const SCORE_BUMP_AMOUNT = 0.2;
export const SCORE_BUMP_COOLDOWN_MS = 24 * 60 * 60 * 1000;

// Batch size constants (centralized to avoid magic numbers)
export const BATCH_CITIES_SEARCH = 5000;
export const BATCH_MATCHES_DEFAULT = 500;
export const BATCH_USER_INTERACTIONS = 500;
export const BATCH_STICKERS_LOAD = 1000;
export const BATCH_SMALL = 20;
export const BATCH_CHECKINS = 50;
