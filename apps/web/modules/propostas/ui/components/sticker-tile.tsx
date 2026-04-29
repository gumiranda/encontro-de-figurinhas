"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";

import { useOptionalSectionLookup } from "@/modules/stickers/lib/section-lookup-context";
import { formatStickerNumber } from "@/modules/stickers/lib/sticker-parser";

type Tone = "give" | "get";

export function StickerTile({
  num,
  tone,
  hint,
  playerName,
}: {
  num: number;
  tone: Tone;
  hint?: string;
  playerName?: string;
}) {
  const lookup = useOptionalSectionLookup();
  const parsed = lookup ? formatStickerNumber(num, lookup) : null;
  const display = parsed?.display ?? String(num);
  const code = parsed?.code ?? null;
  const relativeNum = parsed?.relativeNum ?? num;
  const fullName = parsed?.fullName ?? null;
  const displayName = playerName ?? fullName;
  const tooltipText =
    playerName && fullName
      ? `${playerName} — ${fullName}`
      : (fullName ?? display);

  return (
    <TooltipProvider>
      <Tooltip>
      <TooltipTrigger asChild>
        <div
          role="img"
          aria-label={
            displayName
              ? `Figurinha ${display} — ${displayName}`
              : `Figurinha ${display}`
          }
          className={cn(
            "group relative rounded-2xl border bg-surface-container p-3 transition-all hover:-translate-y-0.5",
            tone === "give"
              ? "border-tertiary/15 hover:border-tertiary/30"
              : "border-primary/15 hover:border-primary/30"
          )}
        >
          <div
            className={cn(
              "relative mb-2 grid aspect-[3/4] place-items-center overflow-hidden rounded-lg p-2",
              tone === "give"
                ? "bg-gradient-to-br from-tertiary/20 to-tertiary/5"
                : "bg-gradient-to-br from-primary/20 to-primary/5"
            )}
          >
            <span
              aria-hidden
              className="absolute inset-x-1.5 top-1.5 h-1/5 rounded bg-gradient-to-b from-white/15 to-transparent"
            />
            {code ? (
              <div className="flex flex-col items-center gap-0.5">
                <span
                  className={cn(
                    "font-mono text-[10px] font-bold uppercase tracking-[0.12em]",
                    tone === "give" ? "text-tertiary" : "text-primary"
                  )}
                >
                  {code}
                </span>
                <span
                  className={cn(
                    "font-headline text-3xl font-extrabold leading-none tracking-tight tabular-nums",
                    tone === "give" ? "text-tertiary" : "text-on-surface"
                  )}
                >
                  {relativeNum}
                </span>
              </div>
            ) : (
              <span
                className={cn(
                  "font-headline text-3xl font-extrabold tracking-tight tabular-nums",
                  tone === "give" ? "text-tertiary" : "text-on-surface"
                )}
              >
                {display}
              </span>
            )}
          </div>
          {displayName ? (
            <div className="truncate text-center text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
              {displayName}
            </div>
          ) : (
            hint && (
              <div className="font-mono text-[10px] text-on-surface-variant">
                {hint}
              </div>
            )
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="font-medium">{tooltipText}</p>
      </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
