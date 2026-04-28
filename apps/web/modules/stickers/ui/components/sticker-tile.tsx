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
  sectionCode: string;
  state: TileState;
  dupCount?: number;
  blockedReason?: string;
  displayLabel?: string; // Override for EXT stickers: "LM", "JD", etc.
  playerName?: string;   // For tooltip
  shortName?: string;    // Short name to display inside card
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void;
}

const STATE_CLASSES: Record<TileState, string> = {
  none:
    "bg-surface-container border-outline-variant text-outline hover:border-outline",
  have:
    "sticker-have-gradient border-secondary text-secondary",
  need:
    "sticker-need-gradient border-tertiary text-tertiary",
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
  sectionCode,
  state,
  dupCount,
  blockedReason = "Já está na outra lista. Remova de lá primeiro.",
  displayLabel,
  playerName,
  shortName,
  onClick,
}: StickerTileProps) {
  const isBlocked = state === "blocked";
  const relLabel = relativeNum === 0 ? "00" : String(relativeNum);
  const label = displayLabel ?? relLabel;

  const stateLabel = STATE_LABELS[state];
  const button = (
    <button
      type="button"
      data-sticker-num={num}
      data-state={state}
      onClick={onClick}
      disabled={isBlocked}
      aria-disabled={isBlocked || undefined}
      aria-pressed={state === "have" || state === "need" || undefined}
      aria-label={`Figurinha ${playerName ?? `${sectionCode}-${relLabel}`}, ${stateLabel}${dupCount && dupCount > 1 ? `, ${dupCount} repetidas` : ""}`}
      title={playerName}
      className={cn(
        "sticker-spring relative flex aspect-[3/4] w-full flex-col items-center justify-center rounded-lg border font-mono text-[10px] font-bold",
        STATE_CLASSES[state]
      )}
    >
      <span>{label}</span>
      {shortName && (
        <span className="mt-0.5 max-w-full truncate px-0.5 text-[9px] font-medium opacity-80">
          {shortName}
        </span>
      )}

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

  if (isBlocked) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p className="max-w-[200px] text-xs">{blockedReason}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (playerName) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent>
          <p className="text-xs font-medium">{playerName}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return button;
}

export const StickerTile = memo(StickerTileBase);
