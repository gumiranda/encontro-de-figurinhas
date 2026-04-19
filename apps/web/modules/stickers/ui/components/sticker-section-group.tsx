"use client";

import { Button } from "@workspace/ui/components/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@workspace/ui/components/popover";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import { SlidersHorizontal } from "lucide-react";
import { memo, useCallback, useMemo, type MouseEvent } from "react";
import { getFlagGradient } from "../../lib/flag-gradients";
import type { ListKind } from "../../lib/use-stickers";
import { StickerTile, type TileState } from "./sticker-tile";

export type SectionInfo = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
  emoji?: string;
};

interface StickerSectionGroupProps {
  section: SectionInfo;
  mode: ListKind;
  duplicatesSet: Set<number>;
  missingSet: Set<number>;
  variant?: "mobile" | "desktop";
  onToggle: (num: number) => void;
  onBulkAction?: (action: "all" | "none" | "invert") => void;
}

function StickerSectionGroupBase({
  section,
  mode,
  duplicatesSet,
  missingSet,
  variant = "mobile",
  onToggle,
  onBulkAction,
}: StickerSectionGroupProps) {
  const totalCount = section.endNumber - section.startNumber + 1;
  const activeSet = mode === "duplicates" ? duplicatesSet : missingSet;

  const activeInSection = useMemo(() => {
    let c = 0;
    for (let n = section.startNumber; n <= section.endNumber; n++) {
      if (activeSet.has(n)) c++;
    }
    return c;
  }, [activeSet, section.startNumber, section.endNumber]);

  const numbers = useMemo(() => {
    const arr: number[] = [];
    for (let n = section.startNumber; n <= section.endNumber; n++) arr.push(n);
    return arr;
  }, [section.startNumber, section.endNumber]);

  const handleContainerClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-sticker-num]"
      );
      if (!el) return;
      const raw = el.dataset.stickerNum;
      const num = raw !== undefined ? Number(raw) : Number.NaN;
      if (!Number.isFinite(num)) return;
      onToggle(num);
    },
    [onToggle]
  );

  const progressPercent =
    totalCount > 0 ? Math.round((activeInSection / totalCount) * 100) : 0;

  return (
    <section
      className={cn(
        variant === "desktop"
          ? "rounded-2xl border border-outline-variant/40 bg-surface-container p-4 md:p-5"
          : "space-y-2"
      )}
    >
      {variant === "desktop" ? (
        <header className="mb-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className={cn(
                "h-5 w-7 shrink-0 rounded",
                getFlagGradient(section.code)
              )}
            />
            <span className="font-headline text-sm font-bold uppercase tracking-wider">
              {section.name} · {section.startNumber} – {section.endNumber}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Progress value={progressPercent} className="w-28 h-1" />
            <span className="font-mono text-xs text-on-surface-variant">
              {activeInSection} / {totalCount}
            </span>
            {onBulkAction && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    aria-label="Ações em massa"
                    className="h-7 w-7"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-40 p-1">
                  <button
                    type="button"
                    onClick={() => onBulkAction("all")}
                    className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    Marcar todas
                  </button>
                  <button
                    type="button"
                    onClick={() => onBulkAction("none")}
                    className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    Desmarcar
                  </button>
                  <button
                    type="button"
                    onClick={() => onBulkAction("invert")}
                    className="block w-full rounded px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    Inverter
                  </button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </header>
      ) : (
        <header className="flex items-center justify-between py-2">
          <span className="font-headline text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
            {section.emoji ? `${section.emoji} ` : ""}
            {section.name} · {section.startNumber}–{section.endNumber}
          </span>
          <span className="font-mono text-[11px] text-outline">
            {activeInSection}/{totalCount}
          </span>
        </header>
      )}

      <div
        onClick={handleContainerClick}
        className={cn(
          "grid gap-1.5",
          "grid-cols-5 md:grid-cols-10 xl:grid-cols-14"
        )}
      >
        {numbers.map((num) => {
          const relativeNum = num - section.startNumber + 1;
          const isInDup = duplicatesSet.has(num);
          const isInMiss = missingSet.has(num);

          let state: TileState = "none";
          if (mode === "duplicates" && isInMiss) state = "blocked";
          else if (mode === "missing" && isInDup) state = "blocked";
          else if (isInDup) state = "have";
          else if (isInMiss) state = "need";

          return (
            <StickerTile
              key={num}
              num={num}
              relativeNum={relativeNum}
              state={state}
            />
          );
        })}
      </div>
    </section>
  );
}

export const StickerSectionGroup = memo(StickerSectionGroupBase);
