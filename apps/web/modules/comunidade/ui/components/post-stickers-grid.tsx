"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Sparkles } from "lucide-react";

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

function extractNum(displayCode: string, absoluteNum: number): string {
  let num: number;
  if (displayCode.includes("-")) {
    const parts = displayCode.split("-");
    num = parseInt(parts[parts.length - 1] ?? String(absoluteNum), 10);
  } else {
    num = absoluteNum;
  }
  return String(num).padStart(3, "0");
}

export function PostStickersGrid({
  stickers,
  postType,
  maxVisible = 6,
}: PostStickersGridProps) {
  if (stickers.length === 0) return null;

  const visible = stickers.slice(0, maxVisible);
  const overflow = stickers.length - visible.length;
  const isDupe = postType === "have";

  return (
    <div
      className="grid gap-1.5 mt-3"
      style={{ gridTemplateColumns: `repeat(${Math.min(visible.length + (overflow > 0 ? 1 : 0), 6)}, minmax(0, 56px))` }}
    >
      {visible.map((s) => (
        <div
          key={s.absoluteNum}
          className={cn(
            "aspect-[3/4] rounded-[10px] p-1.5 flex flex-col justify-between",
            "border relative overflow-hidden",
            s.rare && "bg-gradient-to-br from-[rgba(255,201,101,0.22)] to-surface-container border-[rgba(255,201,101,0.45)]",
            !s.rare && isDupe && "bg-gradient-to-br from-[rgba(79,243,37,0.18)] to-surface-container border-[rgba(79,243,37,0.35)]",
            !s.rare && !isDupe && "bg-gradient-to-br from-[#1c2542] to-surface-container border-white/10"
          )}
        >
          <div className="flex items-start justify-between">
            <span className="text-sm leading-none">{s.flagEmoji}</span>
            {s.rare && <Sparkles className="size-2 text-tertiary" />}
          </div>
          <div>
            <div
              className={cn(
                "font-headline text-xl font-bold leading-none",
                s.rare && "text-tertiary",
                !s.rare && isDupe && "text-secondary",
                !s.rare && !isDupe && "text-foreground/85"
              )}
            >
              {extractNum(s.displayCode, s.absoluteNum)}
            </div>
            <div className="font-mono text-[8px] font-semibold tracking-wide text-foreground truncate">
              {s.displayCode}
            </div>
          </div>
        </div>
      ))}

      {overflow > 0 && (
        <div className="aspect-[3/4] rounded-[10px] border border-dashed border-white/20 grid place-items-center bg-transparent">
          <div className="text-center">
            <div className="font-headline text-sm font-bold text-muted-foreground">+{overflow}</div>
          </div>
        </div>
      )}
    </div>
  );
}
