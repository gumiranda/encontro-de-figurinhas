"use client";

import { StickerCard } from "./sticker-card";

export interface MiniStickerFigureProps {
  code: string;
  flag: string;
  num: string;
  rare?: boolean;
  variant?: "default" | "dupe" | "rare";
  selected?: boolean;
  onClick?: () => void;
}

export function MiniStickerFigure({
  code,
  flag,
  rare,
  variant = "default",
  selected,
  onClick,
}: MiniStickerFigureProps) {
  return (
    <StickerCard
      sticker={{
        displayCode: code,
        flagEmoji: flag,
        isGolden: rare || variant === "rare",
      }}
      variant={variant === "dupe" ? "duplicate" : "neutral"}
      compact
      selected={selected}
      onClick={onClick}
    />
  );
}
