"use client";

import { cn } from "@workspace/ui/lib/utils";

import { useOptionalSectionLookup } from "@/modules/stickers/lib/section-lookup-context";
import { formatStickerNumber } from "@/modules/stickers/lib/sticker-parser";

type Tone = "give" | "get";

export function StickerTile({
  num,
  tone,
  hint,
}: {
  num: number;
  tone: Tone;
  hint?: string;
}) {
  const lookup = useOptionalSectionLookup();
  const display = lookup
    ? formatStickerNumber(num, lookup).display
    : String(num);

  return (
    <div
      role="img"
      aria-label={`Figurinha ${display}`}
      className={cn(
        "group relative rounded-2xl border bg-surface-container p-3 transition-all hover:-translate-y-0.5",
        tone === "give"
          ? "border-tertiary/15 hover:border-tertiary/30"
          : "border-primary/15 hover:border-primary/30"
      )}
    >
      <div
        className={cn(
          "relative mb-2 grid aspect-[3/4] place-items-center overflow-hidden rounded-lg",
          tone === "give"
            ? "bg-gradient-to-br from-tertiary/20 to-tertiary/5"
            : "bg-gradient-to-br from-primary/20 to-primary/5"
        )}
      >
        <span
          aria-hidden
          className="absolute inset-x-1.5 top-1.5 h-1/5 rounded bg-gradient-to-b from-white/15 to-transparent"
        />
        <span
          className={cn(
            "font-headline text-3xl font-extrabold tracking-tight tabular-nums",
            tone === "give" ? "text-tertiary" : "text-on-surface"
          )}
        >
          {display}
        </span>
      </div>
      {hint && (
        <div className="font-mono text-[10px] text-on-surface-variant">
          {hint}
        </div>
      )}
    </div>
  );
}
