"use client";

import { ArrowLeftRight, ArrowRight, ArrowLeft } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface StickerLanesProps {
  theyHaveINeed: number[];
  iHaveTheyNeed: number[];
  rareNumbers?: Set<number>;
  className?: string;
}

function StickerNumber({ num, isRare }: { num: number; isRare: boolean }) {
  return (
    <span
      className={cn(
        "min-w-7 rounded-lg px-2 py-1 text-center font-mono text-xs font-semibold",
        isRare
          ? "border border-tertiary/25 bg-tertiary/10 text-tertiary"
          : "bg-surface-container-high text-on-surface"
      )}
    >
      {num}
    </span>
  );
}

export function StickerLanes({
  theyHaveINeed,
  iHaveTheyNeed,
  rareNumbers = new Set(),
  className,
}: StickerLanesProps) {
  const isBidirectional = theyHaveINeed.length > 0 && iHaveTheyNeed.length > 0;
  const isGiveOnly = iHaveTheyNeed.length > 0 && theyHaveINeed.length === 0;
  const isReceiveOnly = theyHaveINeed.length > 0 && iHaveTheyNeed.length === 0;

  const SwapIcon = isBidirectional
    ? ArrowLeftRight
    : isGiveOnly
      ? ArrowRight
      : ArrowLeft;

  return (
    <div
      className={cn(
        "grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 rounded-xl border border-outline-variant/20 bg-surface-container/50 p-3",
        className
      )}
    >
      {/* You offer */}
      <div className={cn("min-w-0", isReceiveOnly && "opacity-40")}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
          Você oferece
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {iHaveTheyNeed.length > 0 ? (
            iHaveTheyNeed.map((num) => (
              <StickerNumber key={num} num={num} isRare={rareNumbers.has(num)} />
            ))
          ) : (
            <span className="text-xs text-outline">—</span>
          )}
        </div>
      </div>

      {/* Swap icon */}
      <div className="flex items-center justify-center text-outline">
        <SwapIcon className="size-5" />
      </div>

      {/* You receive */}
      <div className={cn("min-w-0", isGiveOnly && "opacity-40")}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
          Você recebe
        </p>
        <div className="mt-1.5 flex flex-wrap gap-1">
          {theyHaveINeed.length > 0 ? (
            theyHaveINeed.map((num) => (
              <StickerNumber key={num} num={num} isRare={rareNumbers.has(num)} />
            ))
          ) : (
            <span className="text-xs text-outline">—</span>
          )}
        </div>
      </div>
    </div>
  );
}
