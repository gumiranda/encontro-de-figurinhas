"use client";

import { memo, useCallback, type MouseEvent } from "react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

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
    [onRemove],
  );

  if (missingNumbers.length === 0) return null;

  return (
    <div className="flex w-fit max-w-full items-start gap-2 border-b border-outline-variant/30 pb-1.5">
      <div className="flex h-7 shrink-0 items-center gap-1">
        {emoji && (
          <span className="shrink-0 text-sm" aria-hidden="true">
            {emoji}
          </span>
        )}
        <span className="font-headline text-xs font-bold uppercase leading-none tracking-wide text-on-surface-variant">
          {sectionCode}
        </span>
        <span className="text-[10px] leading-none text-muted-foreground">
          ({missingNumbers.length})
        </span>
      </div>
      <div className="flex min-w-0 flex-wrap gap-1">
        {missingNumbers.map((num) => {
          const relNum = num - startNumber + relStart;
          const label = relNum === 0 ? "00" : String(relNum).padStart(2, "0");
          return (
            <Button
              key={num}
              type="button"
              variant="outline"
              size="sm"
              data-num={num}
              onClick={handleChipClick}
              aria-label={`Figurinha ${sectionCode}-${label}, marcar como obtida`}
              title={`${sectionCode}-${label}`}
              className={cn(
                "h-7 w-8 min-w-8 shrink-0 rounded-md border-tertiary/40 bg-tertiary/10 px-1",
                "font-mono text-xs font-semibold text-tertiary shadow-none",
                "transition-transform duration-150 hover:scale-[1.02] hover:bg-tertiary/20 hover:text-tertiary",
                "active:scale-[0.98] active:bg-tertiary/30",
              )}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
}

export const CompactSectionRow = memo(CompactSectionRowBase);
