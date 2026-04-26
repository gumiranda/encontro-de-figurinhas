import { COVER_REMOTE_PATTERNS } from "../next.config.mjs";

export type CoverImageValidation =
  | { ok: true }
  | {
      ok: false;
      reason: "PARSE" | "SCHEME" | "HOSTNAME" | "HOST_NOT_ALLOWED";
      hostname?: string;
    };

function hostMatches(actual: string, pattern: string): boolean {
  if (pattern === actual) return true;
  // next/image-style "*.foo.com" wildcard: matches any single subdomain layer.
  if (pattern.startsWith("*.")) {
    const suffix = pattern.slice(1); // ".foo.com"
    return actual.endsWith(suffix) && actual.length > suffix.length;
  }
  return false;
}

/**
 * Frontend gate for the admin cover-image field.
 *
 * Parses the URL (rejects malformed input + non-http(s) schemes), requires a
 * hostname with at least one dot (TLD), and asserts the host matches one of
 * the patterns in `next.config.mjs:COVER_REMOTE_PATTERNS` — the same list
 * `next/image` enforces at runtime. Adding a CDN to next.config flows here
 * automatically; no second source of truth.
 */
export function validateCoverImageUrl(url: string): CoverImageValidation {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { ok: false, reason: "PARSE" };
  }
  if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
    return { ok: false, reason: "SCHEME" };
  }
  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    return { ok: false, reason: "HOSTNAME" };
  }
  const matched = COVER_REMOTE_PATTERNS.some((p) =>
    hostMatches(parsed.hostname, p.hostname)
  );
  if (!matched) {
    return { ok: false, reason: "HOST_NOT_ALLOWED", hostname: parsed.hostname };
  }
  return { ok: true };
}

export { COVER_REMOTE_PATTERNS };
