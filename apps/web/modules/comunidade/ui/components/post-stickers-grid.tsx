"use client";

import { StickerCard } from "./sticker-card";

export interface PostSticker {
  absoluteNum: number;
  displayCode: string;
  flagEmoji: string;
  name?: string;
  rare?: boolean;
  isGolden?: boolean;
  isLegend?: boolean;
  quantity?: number;
}

interface PostStickersGridProps {
  stickers: PostSticker[];
  postType: "have" | "need";
}

export function PostStickersGrid({
  stickers,
  postType,
}: PostStickersGridProps) {
  if (stickers.length === 0) return null;

  const isDupe = postType === "have";

  return (
    <div className="mt-5 grid grid-cols-4 gap-3 lg:grid-cols-6 xl:grid-cols-7">
      {stickers.map((s) => (
        <StickerCard
          key={s.absoluteNum}
          sticker={{
            absoluteNum: s.absoluteNum,
            displayCode: s.displayCode,
            flagEmoji: s.flagEmoji,
            name: s.name,
            isGolden: s.rare ?? s.isGolden,
            isLegend: s.isLegend,
            quantity: s.quantity,
          }}
          variant={isDupe ? "duplicate" : "missing"}
          compact
        />
      ))}
    </div>
  );
}
