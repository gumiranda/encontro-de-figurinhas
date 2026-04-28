export type StickerOverlap = {
  theyHaveINeed: number[];
  iHaveTheyNeed: number[];
};

/**
 * Compute bidirectional sticker overlap between two users.
 * @param myDuplicates - Stickers I have duplicates of (can give away)
 * @param myMissing - Stickers I'm missing (need to get)
 * @param theirDuplicates - Stickers they have duplicates of
 * @param theirMissing - Stickers they're missing
 */
export function computeStickerOverlap(
  myDuplicates: number[],
  myMissing: number[],
  theirDuplicates: number[],
  theirMissing: number[]
): StickerOverlap {
  const theirDup = new Set(theirDuplicates);
  const theirMiss = new Set(theirMissing);
  return {
    theyHaveINeed: myMissing.filter((n) => theirDup.has(n)),
    iHaveTheyNeed: myDuplicates.filter((n) => theirMiss.has(n)),
  };
}
