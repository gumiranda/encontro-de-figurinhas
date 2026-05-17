"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Sparkles } from "lucide-react";

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
  num,
  rare,
  variant = "default",
  selected,
  onClick,
}: MiniStickerFigureProps) {
  const effectiveVariant = rare ? "rare" : variant;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative aspect-[3/4] rounded-[10px] p-2 flex flex-col justify-between",
        "border transition-all",
        "text-left",
        effectiveVariant === "rare" && [
          "bg-gradient-to-br from-[rgba(255,201,101,0.22)] to-surface-container",
          "border-[rgba(255,201,101,0.45)]",
        ],
        effectiveVariant === "dupe" && [
          "bg-gradient-to-br from-[rgba(79,243,37,0.18)] to-surface-container",
          "border-[rgba(79,243,37,0.35)]",
        ],
        effectiveVariant === "default" && [
          "bg-gradient-to-br from-[#1c2542] to-surface-container",
          "border-white/10",
        ],
        selected && "ring-2 ring-primary ring-offset-1 ring-offset-background",
        onClick && "cursor-pointer hover:brightness-110"
      )}
    >
      <div className="flex items-start justify-between">
        <span className="text-lg leading-none">{flag}</span>
        {rare && (
          <Sparkles className="size-2.5 text-tertiary" />
        )}
      </div>

      <div>
        <div
          className={cn(
            "font-headline text-xl font-bold leading-none",
            effectiveVariant === "rare" && "text-tertiary",
            effectiveVariant === "dupe" && "text-secondary",
            effectiveVariant === "default" && "text-foreground/85"
          )}
        >
          {num}
        </div>
        <div className="font-mono text-[11px] font-semibold tracking-wide text-foreground">
          {code}
        </div>
      </div>

      {selected && (
        <div className="absolute top-1 right-1 size-3.5 rounded-full bg-primary grid place-items-center">
          <svg className="size-2 text-primary-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
      )}
    </button>
  );
}
