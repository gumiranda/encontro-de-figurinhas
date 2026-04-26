"use client";

import { memo, useMemo, useCallback, type MouseEvent } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";
import type { ListKind } from "../../lib/use-stickers";

// EXT section player mapping (20 players × 4 variants each)
const EXT_PLAYERS = [
  { short: "Messi", name: "Lionel Messi" },
  { short: "Doku", name: "Jérémy Doku" },
  { short: "Vini Jr", name: "Vinícius Júnior" },
  { short: "Davies", name: "Alphonso Davies" },
  { short: "L.Díaz", name: "Luis Díaz" },
  { short: "Modrić", name: "Luka Modrić" },
  { short: "Caicedo", name: "Moisés Caicedo" },
  { short: "Salah", name: "Mohamed Salah" },
  { short: "Jude", name: "Jude Bellingham" },
  { short: "Mbappé", name: "Kylian Mbappé" },
  { short: "Wirtz", name: "Florian Wirtz" },
  { short: "Jiménez", name: "Raúl Jiménez" },
  { short: "Hakimi", name: "Achraf Hakimi" },
  { short: "Haaland", name: "Erling Haaland" },
  { short: "Lewa", name: "Robert Lewandowski" },
  { short: "CR7", name: "Cristiano Ronaldo" },
  { short: "Son", name: "Heung-min Son" },
  { short: "Yamal", name: "Lamine Yamal" },
  { short: "Pulisic", name: "Christian Pulisic" },
  { short: "Valverde", name: "Federico Valverde" },
];
const EXT_VARIANTS = ["Base", "Bronze", "Prata", "Ouro"];
const EXT_VARIANT_SUFFIX = ["", "🥉", "🥈", "🥇"];

function getExtStickerInfo(relativeNum: number): { displayLabel: string; playerName: string } | null {
  if (relativeNum < 1 || relativeNum > 80) return null;
  const playerIdx = Math.floor((relativeNum - 1) / 4);
  const variantIdx = (relativeNum - 1) % 4;
  const player = EXT_PLAYERS[playerIdx];
  const variant = EXT_VARIANTS[variantIdx];
  const suffix = EXT_VARIANT_SUFFIX[variantIdx] ?? "";
  if (!player || !variant) return null;
  return {
    displayLabel: suffix ? `${player.short}${suffix}` : player.short,
    playerName: `${player.name} (${variant})`,
  };
}

type Props = {
  mode: ListKind;
  sectionCode: string;
  sectionStart: number;
  sectionEnd: number;
  duplicates: Set<number>;
  missing: Set<number>;
  onToggle: (num: number, action: "add" | "remove") => void;
};

function StickerGridBase({
  mode,
  sectionCode,
  sectionStart,
  sectionEnd,
  duplicates,
  missing,
  onToggle,
}: Props) {
  const sectionNumbers = useMemo(() => {
    const count = Math.max(0, sectionEnd - sectionStart + 1);
    return Array.from({ length: count }, (_, i) => sectionStart + i);
  }, [sectionStart, sectionEnd]);

  const getState = useCallback(
    (num: number): "none" | "duplicate" | "missing" | "blocked" => {
      const isInDuplicates = duplicates.has(num);
      const isInMissing = missing.has(num);

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

      const isSelected = state === "duplicate" || state === "missing";
      onToggle(num, isSelected ? "remove" : "add");
    },
    [getState, onToggle]
  );

  const handleStickerButtonClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const raw = e.currentTarget.dataset.stickerNum;
      const num = raw !== undefined ? Number(raw) : NaN;
      if (!Number.isFinite(num)) return;
      handleClick(num);
    },
    [handleClick]
  );

  const isExt = sectionCode === "EXT";

  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {sectionNumbers.map((num) => {
        const relativeNum = num - sectionStart + 1;
        const state = getState(num);

        // For EXT section, show player name instead of number
        const extInfo = isExt ? getExtStickerInfo(relativeNum) : null;
        const displayText = extInfo?.displayLabel ?? String(relativeNum);
        const tooltipName = extInfo?.playerName;

        const buttonClasses = cn(
          "h-10 w-full rounded-lg font-bold transition-transform duration-150 active:scale-[0.96]",
          isExt ? "text-[10px] px-0.5" : "text-sm",
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

        const label = tooltipName ?? `${sectionCode}-${relativeNum}`;

        if (state === "blocked") {
          return (
            <Tooltip key={num}>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  className={buttonClasses}
                  disabled
                  aria-label={`Figurinha ${label}, bloqueada`}
                  title={label}
                >
                  {displayText}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  {tooltipName && <span className="font-medium">{tooltipName}<br /></span>}
                  Já está em {mode === "duplicates" ? "Faltantes" : "Repetidas"}.
                  <br />
                  Remova de lá primeiro.
                </p>
              </TooltipContent>
            </Tooltip>
          );
        }

        return (
          <button
            key={num}
            type="button"
            data-sticker-num={num}
            onClick={handleStickerButtonClick}
            className={buttonClasses}
            aria-pressed={state === "duplicate" || state === "missing"}
            aria-label={`Figurinha ${label}`}
            title={label}
          >
            {displayText}
          </button>
        );
      })}
    </div>
  );
}

export const StickerGrid = memo(StickerGridBase);
