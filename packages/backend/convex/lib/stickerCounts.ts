export type StickerCountEntry = {
  absoluteNum: number;
  quantity: number;
};

const CURSOR_PREFIX = "abs:";

export function buildStickerCountEntries(
  numbers: number[],
): StickerCountEntry[] {
  const counts = new Map<number, number>();

  for (const absoluteNum of numbers) {
    counts.set(absoluteNum, (counts.get(absoluteNum) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort(([a], [b]) => a - b)
    .map(([absoluteNum, quantity]) => ({ absoluteNum, quantity }));
}

export function normalizeStickerNumbers(numbers: number[], unique = false) {
  const normalized = unique ? [...new Set(numbers)] : [...numbers];
  return normalized.sort((a, b) => a - b);
}

export function encodeStickerCursor(absoluteNum: number): string {
  return `${CURSOR_PREFIX}${absoluteNum}`;
}

function decodeStickerCursor(cursor?: string | null): number | null {
  if (!cursor?.startsWith(CURSOR_PREFIX)) return null;
  const value = Number.parseInt(cursor.slice(CURSOR_PREFIX.length), 10);
  return Number.isFinite(value) ? value : null;
}

function firstEntryAfter(entries: StickerCountEntry[], absoluteNum: number) {
  let low = 0;
  let high = entries.length;

  while (low < high) {
    const mid = Math.floor((low + high) / 2);
    if (entries[mid]!.absoluteNum <= absoluteNum) {
      low = mid + 1;
    } else {
      high = mid;
    }
  }

  return low;
}

export function pageStickerCountEntries(
  entries: StickerCountEntry[],
  cursor: string | undefined,
  limit: number,
) {
  const afterAbsoluteNum = decodeStickerCursor(cursor);
  const start =
    afterAbsoluteNum === null ? 0 : firstEntryAfter(entries, afterAbsoluteNum);
  const pageEntries = entries.slice(start, start + limit);
  const nextEntry = entries[start + pageEntries.length];

  return {
    pageEntries,
    nextCursor: nextEntry
      ? encodeStickerCursor(pageEntries.at(-1)!.absoluteNum)
      : null,
  };
}
