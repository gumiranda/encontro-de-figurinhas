"use client";

import { cn } from "@workspace/ui/lib/utils";
import { memo, useCallback, type MouseEvent } from "react";

interface CompactSectionRowProps {
  sectionCode: string;
  emoji?: string;
  startNumber: number;
  relStart?: number;
  missingNumbers: number[];
  onRemove: (num: number) => void;
}

function CompactSectionRowBase({
  sectionCode,
  emoji,
  startNumber,
  relStart = 1,
  missingNumbers,
  onRemove,
}: CompactSectionRowProps) {
  const handleChipClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const num = Number(e.currentTarget.dataset.num);
      if (!Number.isNaN(num)) {
        onRemove(num);
      }
    },
    [onRemove]
  );

  if (missingNumbers.length === 0) return null;

  return (
    <div className="border-b border-outline-variant/30 py-2">
      <div className="mb-1.5 flex items-center gap-2">
        {emoji && <span className="text-sm">{emoji}</span>}
        <span className="font-headline text-xs font-bold uppercase tracking-wide text-on-surface-variant">
          {sectionCode}
        </span>
        <span className="text-xs text-muted-foreground">
          ({missingNumbers.length})
        </span>
      </div>
      <div className="flex flex-wrap gap-1">
        {missingNumbers.map((num) => {
          const relNum = num - startNumber + relStart;
          const label = relNum === 0 ? "00" : String(relNum).padStart(2, "0");
          return (
            <button
              key={num}
              type="button"
              data-num={num}
              onClick={handleChipClick}
              className={cn(
                "min-w-[32px] rounded-md border border-tertiary/40 bg-tertiary/10 px-1.5 py-0.5",
                "font-mono text-xs font-semibold text-tertiary",
                "transition-all hover:bg-tertiary/20 hover:scale-105",
                "active:scale-95 active:bg-tertiary/30"
              )}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const CompactSectionRow = memo(CompactSectionRowBase);
