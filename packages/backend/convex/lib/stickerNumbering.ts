/**
 * Números absolutos do álbum são 0..(totalCount - 1). Igual a `getRelativeNum` no parser web.
 */
export function relativeFromAbsolute(
  abs: number,
  section: { startNumber: number; relStart?: number }
): number {
  const relStart = section.relStart ?? 1;
  return abs - section.startNumber + relStart;
}

export function isValidAbsolute(n: number, totalCount: number): boolean {
  return Number.isInteger(n) && n >= 0 && n < totalCount;
}
