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
