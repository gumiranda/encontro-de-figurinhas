"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useSectionLookup } from "@/modules/stickers/lib/section-lookup-context";
import { formatStickerNumber } from "@/modules/stickers/lib/sticker-parser";

export type StickerChipVariant = "give" | "receive" | "neutral";

type StickerChipProps = {
  num: number;
  variant?: StickerChipVariant;
  isRare?: boolean;
  className?: string;
};

const VARIANT_CLASSES: Record<StickerChipVariant, string> = {
  give: "bg-tertiary/10 text-tertiary",
  receive: "bg-primary/10 text-primary",
  neutral: "bg-muted/50 text-foreground",
};

export function StickerChip({
  num,
  variant = "neutral",
  isRare = false,
  className,
}: StickerChipProps) {
  const lookup = useSectionLookup();
  const { display, fullName } = formatStickerNumber(num, lookup);

  return (
    <span
      role="img"
      aria-label={`Figurinha ${display} (${fullName})`}
      title={display}
      className={cn(
        "min-w-12 rounded-lg px-2 py-1 text-center font-mono text-xs font-semibold",
        isRare
          ? "border border-tertiary/25 bg-tertiary/15 text-tertiary"
          : VARIANT_CLASSES[variant],
        className
      )}
    >
      {display}
    </span>
  );
}
