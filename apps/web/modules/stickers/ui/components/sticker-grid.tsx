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

type ExtVariant = "base" | "bronze" | "prata" | "ouro";

const EXT_VARIANT_CONFIG: Record<ExtVariant, {
  label: string;
  subtitle: string;
  icon: string;
  gradient: string;
  border: string;
  textColor: string;
}> = {
  ouro: {
    label: "OURO",
    subtitle: "ULTRA-RARAS",
    icon: "★",
    gradient: "bg-gradient-to-br from-yellow-500/30 via-amber-600/20 to-yellow-700/30",
    border: "border-yellow-500/50",
    textColor: "text-yellow-400",
  },
  prata: {
    label: "PRATA",
    subtitle: "RARAS",
    icon: "◆",
    gradient: "bg-gradient-to-br from-slate-300/20 via-gray-400/15 to-slate-500/20",
    border: "border-slate-400/50",
    textColor: "text-slate-300",
  },
  bronze: {
    label: "BRONZE",
    subtitle: "ESPECIAIS",
    icon: "●",
    gradient: "bg-gradient-to-br from-orange-700/25 via-amber-800/20 to-orange-900/25",
    border: "border-orange-600/50",
    textColor: "text-orange-400",
  },
  base: {
    label: "ROXA",
    subtitle: "REGULARES RARAS",
    icon: "✦",
    gradient: "bg-gradient-to-br from-purple-600/25 via-violet-700/20 to-purple-800/25",
    border: "border-purple-500/50",
    textColor: "text-purple-400",
  },
};

const EXT_VARIANT_ORDER: ExtVariant[] = ["ouro", "prata", "bronze", "base"];

function getExtStickerInfo(relativeNum: number): {
  displayLabel: string;
  playerName: string;
  variant: ExtVariant;
  playerShort: string;
} | null {
  if (relativeNum < 1 || relativeNum > 80) return null;
  const playerIdx = Math.floor((relativeNum - 1) / 4);
  const variantIdx = (relativeNum - 1) % 4;
  const player = EXT_PLAYERS[playerIdx];
  const variants: ExtVariant[] = ["base", "bronze", "prata", "ouro"];
  const variant = variants[variantIdx];
  if (!player || !variant) return null;
  return {
    displayLabel: player.short,
    playerName: `${player.name} (${variant.charAt(0).toUpperCase() + variant.slice(1)})`,
    variant,
    playerShort: player.short,
  };
}

function groupExtByVariant(
  sectionStart: number,
  sectionEnd: number
): Record<ExtVariant, number[]> {
  const groups: Record<ExtVariant, number[]> = {
    ouro: [],
    prata: [],
    bronze: [],
    base: [],
  };

  for (let num = sectionStart; num <= sectionEnd; num++) {
    const relativeNum = num - sectionStart + 1;
    const info = getExtStickerInfo(relativeNum);
    if (info) {
      groups[info.variant].push(num);
    }
  }

  return groups;
}

type Props = {
  mode: ListKind;
  sectionCode: string;
  sectionStart: number;
  sectionEnd: number;
  relStart?: number;
  duplicates: Set<number>;
  missing: Set<number>;
  onToggle: (num: number, action: "add" | "remove") => void;
};

function StickerGridBase({
  mode,
  sectionCode,
  sectionStart,
  sectionEnd,
  relStart = 1,
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

  const extGroups = useMemo(() => {
    if (!isExt) return null;
    return groupExtByVariant(sectionStart, sectionEnd);
  }, [isExt, sectionStart, sectionEnd]);

  // For EXT section, render variant-grouped display
  if (isExt && extGroups) {
    return (
      <div className="space-y-4">
        {EXT_VARIANT_ORDER.map((variantKey) => {
          const nums = extGroups[variantKey];
          const config = EXT_VARIANT_CONFIG[variantKey];
          const activeInVariant = nums.filter((n) =>
            mode === "duplicates" ? duplicates.has(n) : missing.has(n)
          ).length;

          return (
            <div key={variantKey} className="space-y-2">
              {/* Variant header */}
              <div className="flex items-center gap-2">
                <span className={cn("text-sm font-bold", config.textColor)}>
                  {config.icon} {config.label} · {config.subtitle}
                </span>
                <div className="flex-1 h-px bg-outline-variant/30" />
                <span className="text-xs text-muted-foreground">
                  {activeInVariant}/{nums.length}
                </span>
              </div>

              {/* Variant grid */}
              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-2">
                {nums.map((num) => {
                  const relativeNum = num - sectionStart + 1;
                  const extInfo = getExtStickerInfo(relativeNum);
                  const state = getState(num);
                  const isActive = state === "duplicate" || state === "missing";

                  return (
                    <button
                      key={num}
                      type="button"
                      data-sticker-num={num}
                      onClick={handleStickerButtonClick}
                      title={extInfo?.playerName}
                      className={cn(
                        "relative aspect-[3/4] rounded-lg border-2 p-1.5 transition-all duration-200",
                        "flex flex-col items-start justify-between overflow-hidden",
                        config.gradient,
                        state === "blocked"
                          ? "opacity-40 cursor-not-allowed border-muted"
                          : isActive
                            ? cn(config.border, "ring-2 ring-offset-1 ring-offset-background",
                                state === "duplicate" ? "ring-emerald-500" : "ring-rose-500")
                            : cn(config.border, "hover:scale-105 hover:shadow-lg cursor-pointer")
                      )}
                    >
                      {/* Player name */}
                      <span className={cn(
                        "text-[10px] font-bold truncate w-full text-left",
                        config.textColor
                      )}>
                        {extInfo?.playerShort}
                      </span>

                      {/* Sparkle decorations */}
                      <span className="absolute top-2 right-1.5 text-[6px] opacity-60">✦</span>
                      <span className="absolute bottom-4 right-2 text-[5px] opacity-40">✦</span>

                      {/* State indicator */}
                      {isActive && (
                        <span className={cn(
                          "absolute bottom-1 left-1 text-[8px] font-bold px-1 rounded",
                          state === "duplicate"
                            ? "bg-emerald-500/80 text-white"
                            : "bg-rose-500/80 text-white"
                        )}>
                          {state === "duplicate" ? "✓" : "+"}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Regular section: flat grid
  return (
    <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
      {sectionNumbers.map((num) => {
        const relativeNum = (num - sectionStart) + relStart;
        const state = getState(num);
        const label = `${sectionCode}-${relativeNum}`;

        const buttonClasses = cn(
          "h-10 w-full rounded-lg font-bold text-sm transition-transform duration-150 active:scale-[0.96]",
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
                <button
                  type="button"
                  className={buttonClasses}
                  disabled
                  aria-label={`Figurinha ${label}, bloqueada`}
                  title={label}
                >
                  {relativeNum}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">
                  Clique para mover para {mode === "duplicates" ? "Repetidas" : "Faltantes"}.
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
            {relativeNum}
          </button>
        );
      })}
    </div>
  );
}

export const StickerGrid = memo(StickerGridBase);
