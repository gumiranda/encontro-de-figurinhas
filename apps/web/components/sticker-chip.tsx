"use client";

import { cn } from "@workspace/ui/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { useSectionLookup } from "@/modules/stickers/lib/section-lookup-context";
import { formatStickerNumber } from "@/modules/stickers/lib/sticker-parser";

export type StickerChipVariant = "give" | "receive" | "neutral";

type StickerChipProps = {
  num: number;
  variant?: StickerChipVariant;
  isRare?: boolean;
  className?: string;
  playerName?: string;
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
  playerName,
}: StickerChipProps) {
  const lookup = useSectionLookup();
  const { display, fullName } = formatStickerNumber(num, lookup);

  const tooltipText = playerName
    ? `${playerName} - ${display} (${fullName})`
    : `${display} (${fullName})`;

  const chip = (
    <span
      role="img"
      aria-label={`Figurinha ${display} (${fullName})`}
      className={cn(
        "min-w-12 rounded-lg px-2 py-1 text-center font-mono text-xs font-semibold cursor-default",
        isRare
          ? "border border-tertiary/25 bg-tertiary/15 text-tertiary"
          : VARIANT_CLASSES[variant],
        className
      )}
    >
      {display}
    </span>
  );

  // Use Tooltip when playerName is available, otherwise use native title
  if (playerName) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>{chip}</TooltipTrigger>
        <TooltipContent>
          <p className="font-medium">{playerName}</p>
          <p className="text-xs text-muted-foreground">{display} - {fullName}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return <span title={tooltipText}>{chip}</span>;
}
