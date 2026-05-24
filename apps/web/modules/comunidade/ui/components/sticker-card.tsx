"use client";

import { Check, Sparkles } from "lucide-react";

import { cn } from "@workspace/ui/lib/utils";

export type CommunitySticker = {
  absoluteNum?: number;
  displayCode: string;
  flagEmoji: string;
  name?: string;
  isGolden?: boolean;
  isLegend?: boolean;
  quantity?: number;
};

type StickerCardProps = {
  sticker: CommunitySticker;
  variant?: "duplicate" | "missing" | "neutral";
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
};

function displayNumber(displayCode: string, absoluteNum?: number) {
  const raw = displayCode.includes("-")
    ? displayCode.split("-").at(-1)
    : displayCode.replace(/\D/g, "");
  const parsed = Number.parseInt(raw ?? "", 10);
  if (Number.isFinite(parsed)) return String(parsed).padStart(3, "0");
  if (absoluteNum !== undefined) return String(absoluteNum).padStart(3, "0");
  return "000";
}

export function StickerCard({
  sticker,
  variant = "neutral",
  selected,
  compact,
  onClick,
}: StickerCardProps) {
  const rare = sticker.isGolden || sticker.isLegend;
  const content = (
    <>
      <div className="flex items-start justify-between gap-2">
        <span className={cn("leading-none", compact ? "text-base" : "text-xl")}>
          {sticker.flagEmoji}
        </span>
        <div className="flex items-center gap-1">
          {sticker.quantity && sticker.quantity > 1 && (
            <span className="rounded-full bg-background/50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-foreground">
              x{sticker.quantity}
            </span>
          )}
          {rare && <Sparkles className="size-3 text-tertiary" />}
        </div>
      </div>

      <div>
        <div
          className={cn(
            "font-headline font-black leading-none",
            compact ? "text-xl" : "text-4xl",
            rare && "text-tertiary",
            !rare && variant === "duplicate" && "text-secondary",
            !rare && variant === "missing" && "text-primary",
            !rare && variant === "neutral" && "text-foreground",
          )}
        >
          {displayNumber(sticker.displayCode, sticker.absoluteNum)}
        </div>
        <div
          className={cn(
            "mt-1 truncate font-mono font-bold tracking-wide text-foreground",
            compact ? "text-[11px]" : "text-sm",
          )}
        >
          {sticker.displayCode}
        </div>
      </div>

      {selected && (
        <div className="absolute right-2 top-2 grid size-5 place-items-center rounded-full bg-primary text-primary-foreground">
          <Check className="size-3" />
        </div>
      )}
    </>
  );

  const className = cn(
    "relative flex aspect-[3/4] min-h-0 flex-col justify-between overflow-hidden rounded-xl border text-left transition",
    compact ? "p-2" : "p-3",
    rare &&
      "border-tertiary/55 bg-[linear-gradient(150deg,rgba(255,201,101,0.24),rgba(25,28,43,0.95))]",
    !rare &&
      variant === "duplicate" &&
      "border-secondary/45 bg-[linear-gradient(150deg,rgba(79,243,37,0.22),rgba(12,34,31,0.96))]",
    !rare &&
      variant === "missing" &&
      "border-primary/35 bg-[linear-gradient(150deg,rgba(149,170,255,0.2),rgba(20,28,54,0.96))]",
    !rare &&
      variant === "neutral" &&
      "border-outline-variant/70 bg-[linear-gradient(150deg,rgba(255,255,255,0.08),rgba(19,23,38,0.98))]",
    selected && "ring-2 ring-primary ring-offset-2 ring-offset-background",
    onClick && "cursor-pointer hover:-translate-y-0.5 hover:brightness-110",
  );

  const title = sticker.name
    ? `${sticker.displayCode} · ${sticker.name}`
    : sticker.displayCode;

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        title={title}
        className={className}
      >
        {content}
      </button>
    );
  }

  return (
    <div title={title} className={className}>
      {content}
    </div>
  );
}
