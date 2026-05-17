"use client";

import { MiniStickerFigure } from "./mini-sticker-figure";

export interface PostSticker {
  absoluteNum: number;
  displayCode: string;
  flagEmoji: string;
  name?: string;
  rare?: boolean;
}

interface PostStickersGridProps {
  stickers: PostSticker[];
  postType: "have" | "need";
  maxVisible?: number;
}

export function PostStickersGrid({
  stickers,
  postType,
  maxVisible = 6,
}: PostStickersGridProps) {
  if (stickers.length === 0) return null;

  const visible = stickers.slice(0, maxVisible);
  const overflow = stickers.length - visible.length;
  const variant = postType === "have" ? "dupe" : "default";

  return (
    <div className="grid grid-cols-6 gap-1.5 mt-3">
      {visible.map((sticker) => (
        <MiniStickerFigure
          key={sticker.absoluteNum}
          code={sticker.displayCode}
          flag={sticker.flagEmoji}
          num={sticker.displayCode.split("-")[1] || String(sticker.absoluteNum)}
          rare={sticker.rare}
          variant={variant}
        />
      ))}

      {overflow > 0 && (
        <div className="aspect-[3/4] rounded-[10px] border border-dashed border-white/20 grid place-items-center">
          <div className="text-center">
            <div className="font-headline text-lg font-bold">+{overflow}</div>
            <div className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              mais
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
