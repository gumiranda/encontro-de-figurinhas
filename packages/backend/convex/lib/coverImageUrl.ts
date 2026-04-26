/**
 * V8-safe URL validator for blog cover images.
 *
 * Backend gate: scheme must be http/https, hostname must be present and contain
 * at least one dot (TLD-ish). Does NOT enforce a host whitelist — that lives in
 * `apps/web/lib/cover-image-validation.ts` (sourced from `next.config.ts`'s
 * `images.remotePatterns`) and runs at the admin form. The runtime authority is
 * `next/image`, which only loads images from configured remote patterns.
 */
export type CoverImageValidation =
  | { ok: true }
  | { ok: false; reason: "PARSE" | "SCHEME" | "HOSTNAME" };

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
  return { ok: true };
}
