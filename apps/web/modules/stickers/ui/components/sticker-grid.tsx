"use client";

import { useMemo } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import type { ListKind } from "../../lib/use-stickers";

type Props = {
  mode: ListKind;
  sectionCode: string;
  sectionStart: number;
  sectionEnd: number;
  duplicates: Set<number>;
  missing: Set<number>;
  onToggle: (num: number, action: "add" | "remove") => void;
};

export function StickerGrid({
  mode,
  sectionCode,
  sectionStart,
  sectionEnd,
  duplicates,
  missing,
  onToggle,
}: Props) {
  const sectionNumbers = useMemo(
    () => Array.from({ length: sectionEnd - sectionStart + 1 }, (_, i) => sectionStart + i),
    [sectionStart, sectionEnd]
  );

  const getState = (
    num: number
  ): "none" | "duplicate" | "missing" | "blocked" => {
    const isInDuplicates = duplicates.has(num);
    const isInMissing = missing.has(num);

    if (mode === "duplicates" && isInMissing) return "blocked";
    if (mode === "missing" && isInDuplicates) return "blocked";

    if (isInDuplicates) return "duplicate";
    if (isInMissing) return "missing";
    return "none";
  };

  const handleClick = (num: number) => {
    const state = getState(num);
    if (state === "blocked") return;

    const isSelected =
      mode === "duplicates" ? duplicates.has(num) : missing.has(num);

    onToggle(num, isSelected ? "remove" : "add");
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {sectionNumbers.map((num) => {
          const relativeNum = num - sectionStart + 1;
          const state = getState(num);

          const buttonClasses = cn(
            "h-10 w-full rounded-lg font-bold text-sm transition-all duration-150 active:scale-95",
            {
              "bg-emerald-500/20 text-emerald-600 border-2 border-emerald-500":
                state === "duplicate",
              "bg-destructive/20 text-destructive border-2 border-destructive":
                state === "missing",
              "bg-muted/50 text-muted-foreground border-2 border-dashed border-muted-foreground/50 opacity-50 cursor-not-allowed":
                state === "blocked",
              "bg-surface-container text-on-surface-variant border-2 border-transparent hover:border-outline-variant":
                state === "none",
            }
          );

          if (state === "blocked") {
            return (
              <Tooltip key={num}>
                <TooltipTrigger asChild>
                  <button type="button" className={buttonClasses} disabled>
                    {relativeNum}
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">
                    Ja esta em {mode === "duplicates" ? "Faltantes" : "Repetidas"}.
                    <br />
                    Remova de la primeiro.
                  </p>
                </TooltipContent>
              </Tooltip>
            );
          }

          return (
            <button
              key={num}
              type="button"
              onClick={() => handleClick(num)}
              className={buttonClasses}
            >
              {relativeNum}
            </button>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
