/**
 * Create URL-safe slug from name.
 * "Casemiro" → "casemiro"
 * "São Paulo" → "sao-paulo"
 * "Vinícius Júnior" → "vinicius-junior"
 */
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // Remove diacritics
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * Normalize name for search (lowercase, no accents).
 * "Malagón" → "malagon"
 * "Vinícius Júnior" → "vinicius junior"
 */
export function normalizeForSearch(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * Sanitize name for XSS protection.
 * Escapes < > and truncates to max length.
 */
export function sanitizeName(name: string, maxLength = 100): string {
  return name
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .slice(0, maxLength);
}

/**
 * Escape name for JSON-LD (handles quotes).
 * "João "O Rei"" → valid JSON string
 */
export function escapeForJsonLd(name: string): string {
  return JSON.stringify(name).slice(1, -1); // Remove surrounding quotes
}
