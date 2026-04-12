"use client";

import { useMemo, useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

type Props = {
  mode: "duplicates" | "missing";
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
  // Gera array de números da seção
  const sectionNumbers = useMemo(() => {
    const numbers: number[] = [];
    for (let i = sectionStart; i <= sectionEnd; i++) {
      numbers.push(i);
    }
    return numbers;
  }, [sectionStart, sectionEnd]);

  const getState = useCallback(
    (num: number): "none" | "duplicate" | "missing" | "blocked" => {
      const isInDuplicates = duplicates.has(num);
      const isInMissing = missing.has(num);

      // Bloqueado se está no modo oposto
      if (mode === "duplicates" && isInMissing) return "blocked";
      if (mode === "missing" && isInDuplicates) return "blocked";

      if (isInDuplicates) return "duplicate";
      if (isInMissing) return "missing";
      return "none";
    },
    [mode, duplicates, missing]
  );

  const handleClick = useCallback(
    (num: number) => {
      const state = getState(num);
      if (state === "blocked") return;

      // Determina se está atualmente selecionado no modo ativo
      const isSelected =
        mode === "duplicates" ? duplicates.has(num) : missing.has(num);

      onToggle(num, isSelected ? "remove" : "add");
    },
    [mode, duplicates, missing, getState, onToggle]
  );

  return (
    <TooltipProvider delayDuration={300}>
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
        {sectionNumbers.map((num) => {
          const relativeNum = num - sectionStart + 1;
          const state = getState(num);

          // Classes baseadas no estado
          let buttonClasses =
            "h-10 w-full rounded-lg font-bold text-sm transition-all duration-150 active:scale-95 ";

          if (state === "duplicate") {
            buttonClasses +=
              "bg-emerald-500/20 text-emerald-600 border-2 border-emerald-500 ";
          } else if (state === "missing") {
            buttonClasses +=
              "bg-destructive/20 text-destructive border-2 border-destructive ";
          } else if (state === "blocked") {
            buttonClasses +=
              "bg-muted/50 text-muted-foreground border-2 border-dashed border-muted-foreground/50 opacity-50 cursor-not-allowed ";
          } else {
            buttonClasses +=
              "bg-surface-container text-on-surface-variant border-2 border-transparent hover:border-outline-variant ";
          }

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
