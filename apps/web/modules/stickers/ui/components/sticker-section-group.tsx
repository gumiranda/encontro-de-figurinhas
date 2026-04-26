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

const EXT_VARIANT_CONFIG: Record<
  ExtVariant,
  {
    label: string;
    subtitle: string;
    icon: string;
    gradient: string;
    border: string;
    textColor: string;
  }
> = {
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

// Order for display: ouro first (most rare), then prata, bronze, base
const EXT_VARIANT_ORDER: ExtVariant[] = ["ouro", "prata", "bronze", "base"];

/** Coca-Cola América Latina — mesmo “card” das raras (EXT), tema vermelho + preto */
const CC_LAM_CARD = {
  label: "COCA-COLA",
  subtitle: "AMÉRICA LATINA",
  icon: "🎫",
  gradient:
    "bg-gradient-to-br from-red-600/25 via-zinc-950/95 to-red-950/35",
  border: "border-red-500/50",
  textColor: "text-red-100",
  subtext: "text-zinc-400",
};

/** Sincronizar com `packages/backend/data/album-2026.json` (CC-LAM, rel 1–14) */
const CC_LAM_STICKERS: { full: string; short: string }[] = [
  { full: "Lamine Yamal", short: "Yamal" },
  { full: "Joshua Kimmich", short: "Kimmich" },
  { full: "Harry Kane", short: "Kane" },
  { full: "Santiago Giménez", short: "Giménez" },
  { full: "Joško Gvardiol", short: "Gvardiol" },
  { full: "Federico Valverde", short: "Valverde" },
  { full: "Jefferson Lerma", short: "Lerma" },
  { full: "Enner Valencia", short: "Valencia" },
  { full: "Gabriel Magalhães", short: "Gabriel" },
  { full: "Virgil van Dijk", short: "Van Dijk" },
  { full: "Alphonso Davies", short: "Davies" },
  { full: "Emiliano Martínez", short: "E. Martínez" },
  { full: "Raúl Jiménez", short: "Jiménez" },
  { full: "Lautaro Martínez", short: "L. Martínez" },
];

function getCcLamInfo(rel: number): { full: string; short: string } | null {
  if (!Number.isInteger(rel) || rel < 1 || rel > 14) return null;
  return CC_LAM_STICKERS[rel - 1] ?? null;
}

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

// Group EXT stickers by variant
function groupExtByVariant(
  startNumber: number,
  endNumber: number
): Record<ExtVariant, number[]> {
  const groups: Record<ExtVariant, number[]> = {
    ouro: [],
    prata: [],
    bronze: [],
    base: [],
  };

  for (let num = startNumber; num <= endNumber; num++) {
    const relativeNum = num - startNumber + 1;
    const info = getExtStickerInfo(relativeNum);
    if (info) {
      groups[info.variant].push(num);
    }
  }

  return groups;
}

export type SectionInfo = {
  name: string;
  code: string;
  startNumber: number;
  endNumber: number;
  isExtra?: boolean;
  emoji?: string;
  relStart?: number;
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
  const relStart = section.relStart ?? 1;
  const relEnd = relStart + totalCount - 1;
  const relRangeLabel =
    relStart === 0 && relEnd === 0 ? "00" : `${relStart}–${relEnd}`;
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

  const isExt = section.code === "EXT";
  const isCcLam = section.code === "CC-LAM";
  const extGroups = useMemo(() => {
    if (!isExt) return null;
    return groupExtByVariant(section.startNumber, section.endNumber);
  }, [isExt, section.startNumber, section.endNumber]);

  const handleTileClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      const raw = e.currentTarget.dataset.stickerNum;
      const num = Number(raw);
      if (!raw || Number.isNaN(num)) return;
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
              className={cn("h-5 w-7 shrink-0 rounded", getFlagGradient(section.code))}
            />
            <span className="font-headline text-md font-bold uppercase tracking-wider">
              {section.name} · {relRangeLabel}
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
                    className="block w-full cursor-pointer rounded px-3 py-2 text-left text-md hover:bg-muted"
                  >
                    Marcar todas
                  </button>
                  <button
                    type="button"
                    onClick={() => onBulkAction("none")}
                    className="block w-full cursor-pointer rounded px-3 py-2 text-left text-md hover:bg-muted"
                  >
                    Desmarcar
                  </button>
                  <button
                    type="button"
                    onClick={() => onBulkAction("invert")}
                    className="block w-full cursor-pointer rounded px-3 py-2 text-left text-md hover:bg-muted"
                  >
                    Inverter
                  </button>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </header>
      ) : (
        <header className="space-y-2 py-2">
          <div className="flex items-center justify-between">
            <span className="font-headline text-md font-bold uppercase tracking-widest text-on-surface-variant">
              {section.emoji ? `${section.emoji} ` : ""}
              {section.name} ({section.code}) · {relRangeLabel}
            </span>
            <span className="font-mono text-md text-outline">
              {activeInSection}/{totalCount}
            </span>
          </div>
          {onBulkAction && (
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => onBulkAction("all")}
                className="cursor-pointer text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
              >
                Marcar todas
              </button>
              <button
                type="button"
                onClick={() => onBulkAction("none")}
                className="cursor-pointer text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
              >
                Desmarcar
              </button>
              <button
                type="button"
                onClick={() => onBulkAction("invert")}
                className="cursor-pointer text-xs px-3 py-1.5 rounded-full bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
              >
                Inverter
              </button>
            </div>
          )}
        </header>
      )}

      {/* EXT section: grouped by variant with special styling */}
      {isExt && extGroups ? (
        <div className="space-y-4">
          {EXT_VARIANT_ORDER.map((variantKey) => {
            const nums = extGroups[variantKey];
            const config = EXT_VARIANT_CONFIG[variantKey];
            const activeInVariant = nums.filter((n) => activeSet.has(n)).length;

            return (
              <div key={variantKey} className="space-y-2">
                {/* Variant header */}
                <div className="flex items-center gap-2">
                  <span className={cn("text-md font-bold", config.textColor)}>
                    {config.icon} {config.label} · {config.subtitle}
                  </span>
                  <div className="flex-1 h-px bg-outline-variant/30" />
                  <span className="text-xs text-muted-foreground">
                    {activeInVariant}/{nums.length} figurinhas
                  </span>
                </div>

                {/* Variant grid */}
                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
                  {nums.map((num) => {
                    const relativeNum = num - section.startNumber + 1;
                    const extInfo = getExtStickerInfo(relativeNum);
                    const isInDup = duplicatesSet.has(num);
                    const isInMiss = missingSet.has(num);

                    let state: TileState = "none";
                    if (mode === "duplicates" && isInMiss) state = "blocked";
                    else if (mode === "missing" && isInDup) state = "blocked";
                    else if (isInDup) state = "have";
                    else if (isInMiss) state = "need";

                    const isActive = state === "have" || state === "need";

                    return (
                      <button
                        key={num}
                        type="button"
                        data-sticker-num={num}
                        onClick={handleTileClick}
                        disabled={state === "blocked"}
                        title={extInfo?.playerName}
                        className={cn(
                          "relative aspect-[3/4] rounded-lg border-2 p-1.5 transition-all duration-200",
                          "flex flex-col items-start justify-between overflow-hidden",
                          config.gradient,
                          state === "blocked"
                            ? "opacity-40 cursor-not-allowed border-muted"
                            : isActive
                              ? cn(
                                  config.border,
                                  "ring-2 ring-offset-1 ring-offset-background",
                                  state === "have" ? "ring-emerald-500" : "ring-rose-500"
                                )
                              : cn(
                                  config.border,
                                  "hover:scale-105 hover:shadow-lg cursor-pointer"
                                )
                        )}
                      >
                        {/* Player name */}
                        <span
                          className={cn(
                            "text-md font-bold truncate w-full text-left",
                            config.textColor
                          )}
                        >
                          {extInfo?.playerShort}
                        </span>

                        {/* Sparkle decorations */}
                        <span className="absolute top-2 right-1.5 text-[6px] opacity-60">
                          ✦
                        </span>
                        <span className="absolute bottom-4 right-2 text-[5px] opacity-40">
                          ✦
                        </span>

                        {/* State indicator */}
                        {isActive && (
                          <span
                            className={cn(
                              "absolute bottom-1 left-1 text-md font-bold px-1 rounded",
                              state === "have"
                                ? "bg-emerald-500/80 text-white"
                                : "bg-rose-500/80 text-white"
                            )}
                          >
                            {state === "have" ? "✓" : "+"}
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
      ) : isCcLam ? (
        <div
          className={cn(
            "rounded-xl border border-red-500/25 bg-gradient-to-b from-red-950/30 via-black/40 to-zinc-950/60 p-3 shadow-sm",
            "ring-1 ring-red-500/10"
          )}
        >
          <div className="mb-3 flex items-center gap-2">
            <span className={cn("text-md font-bold tracking-wide", CC_LAM_CARD.textColor)}>
              {CC_LAM_CARD.icon} {CC_LAM_CARD.label} · {CC_LAM_CARD.subtitle}
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
            <span className={cn("text-xs", CC_LAM_CARD.subtext)}>
              {activeInSection}/{totalCount} figurinhas
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7">
            {numbers.map((num) => {
              const relativeNum = (num - section.startNumber) + relStart;
              const isInDup = duplicatesSet.has(num);
              const isInMiss = missingSet.has(num);

              let state: TileState = "none";
              if (mode === "duplicates" && isInMiss) state = "blocked";
              else if (mode === "missing" && isInDup) state = "blocked";
              else if (isInDup) state = "have";
              else if (isInMiss) state = "need";

              const isActive = state === "have" || state === "need";
              const relLabel =
                relativeNum === 0 ? "00" : String(relativeNum);
              const cc = getCcLamInfo(relativeNum);
              const labelTitle = cc
                ? `${cc.full} — ${section.code}-${relLabel}`
                : `${section.code}-${relLabel}`;

              return (
                <button
                  key={num}
                  type="button"
                  data-sticker-num={num}
                  onClick={handleTileClick}
                  disabled={state === "blocked"}
                  title={labelTitle}
                  aria-label={
                    cc
                      ? `Figurinha ${section.code}-${relLabel} ${cc.full}`
                      : `Figurinha ${section.code}-${relLabel}`
                  }
                  className={cn(
                    "relative aspect-[3/4] rounded-lg border-2 p-1.5 transition-all duration-200",
                    "flex flex-col items-stretch justify-between overflow-hidden",
                    CC_LAM_CARD.gradient,
                    state === "blocked"
                      ? "cursor-not-allowed border-zinc-700/50 opacity-40"
                      : isActive
                        ? cn(
                            CC_LAM_CARD.border,
                            "ring-2 ring-offset-1 ring-offset-background",
                            state === "have" ? "ring-emerald-500" : "ring-rose-500"
                          )
                        : cn(
                            CC_LAM_CARD.border,
                            "cursor-pointer hover:scale-105 hover:shadow-lg"
                          )
                  )}
                >
                  <span
                    className="pointer-events-none absolute right-1.5 top-1 text-[5px] text-red-500/50"
                    aria-hidden
                  >
                    ✦
                  </span>
                  <span
                    className={cn(
                      "w-full text-left font-mono text-[7px] font-bold tabular-nums sm:text-[8px]",
                      CC_LAM_CARD.subtext
                    )}
                  >
                    #{relLabel}
                  </span>
                  <div className="flex min-h-0 flex-1 flex-col justify-center">
                    {cc ? (
                      <span
                        className={cn(
                          "w-full break-words text-left text-[10px] font-bold leading-snug",
                          "line-clamp-3 text-white drop-shadow sm:text-xs",
                          CC_LAM_CARD.textColor
                        )}
                      >
                        {cc.short}
                      </span>
                    ) : (
                      <span
                        className={cn(
                          "w-full text-center font-mono text-base font-black tabular-nums text-white"
                        )}
                      >
                        {relLabel}
                      </span>
                    )}
                  </div>
                  {isActive && (
                    <span
                      className={cn(
                        "self-end rounded px-1 text-[10px] font-bold",
                        state === "have"
                          ? "bg-emerald-500/90 text-white"
                          : "bg-rose-500/90 text-white"
                      )}
                    >
                      {state === "have" ? "✓" : "+"}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        /* Regular section grid */
        <div
          className={cn("grid gap-1.5", "grid-cols-5 md:grid-cols-10 xl:grid-cols-14")}
        >
          {numbers.map((num) => {
            const relativeNum = (num - section.startNumber) + relStart;
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
                sectionCode={section.code}
                state={state}
                onClick={handleTileClick}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

export const StickerSectionGroup = memo(StickerSectionGroupBase);
