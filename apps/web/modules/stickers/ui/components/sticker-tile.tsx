"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import { memo, type MouseEvent } from "react";

export type TileState = "none" | "have" | "need" | "blocked";

interface StickerTileProps {
  num: number;
  relativeNum: number;
  state: TileState;
  dupCount?: number;
  blockedReason?: string;
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const STATE_CLASSES: Record<TileState, string> = {
  none:
    "bg-surface-container border-outline-variant text-outline hover:border-outline",
  have:
    "bg-gradient-to-br from-[rgba(79,243,37,0.15)] to-[rgba(23,110,0,0.25)] border-secondary text-secondary",
  need:
    "bg-gradient-to-br from-[rgba(255,201,101,0.12)] to-[rgba(254,183,0,0.2)] border-tertiary text-tertiary",
  blocked:
    "bg-surface-container-highest border-outline-variant text-muted-foreground",
};

const STATE_LABELS: Record<TileState, string> = {
  none: "não marcada",
  have: "tenho",
  need: "preciso",
  blocked: "bloqueada",
};

function StickerTileBase({
  num,
  relativeNum,
  state,
  dupCount,
  blockedReason = "Já está na outra lista. Remova de lá primeiro.",
  onClick,
}: StickerTileProps) {
  const isBlocked = state === "blocked";

  const stateLabel = STATE_LABELS[state];
  const button = (
    <button
      type="button"
      data-sticker-num={num}
      onClick={onClick}
      disabled={isBlocked}
      aria-disabled={isBlocked || undefined}
      aria-pressed={state === "have" || state === "need" || undefined}
      aria-label={`Figurinha ${num}, ${stateLabel}${dupCount && dupCount > 1 ? `, ${dupCount} repetidas` : ""}`}
      className={cn(
        "relative flex aspect-[3/4] w-full items-center justify-center rounded-lg border font-mono text-[10px] font-bold transition-all duration-150",
        STATE_CLASSES[state],
        !isBlocked && "active:scale-95"
      )}
    >
      {relativeNum}

      {state === "have" && (
        <span
          aria-hidden="true"
          className="absolute right-1 top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-secondary font-headline text-[9px] font-black text-on-secondary"
        >
          {dupCount && dupCount > 1 ? dupCount : ""}
        </span>
      )}

      {state === "need" && (
        <span
          aria-hidden="true"
          className="absolute right-1 top-0.5 font-headline text-xs font-black text-tertiary"
        >
          +
        </span>
      )}
    </button>
  );

  if (!isBlocked) return button;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{button}</TooltipTrigger>
      <TooltipContent>
        <p className="max-w-[200px] text-xs">{blockedReason}</p>
      </TooltipContent>
    </Tooltip>
  );
}

export const StickerTile = memo(StickerTileBase);
