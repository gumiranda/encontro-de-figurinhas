"use client";

import { cn } from "@workspace/ui/lib/utils";
import { useOptionalSectionLookup } from "@/modules/stickers/lib/section-lookup-context";
import { formatStickerNumber } from "@/modules/stickers/lib/sticker-parser";

type Variant = "default" | "rare" | "legend" | "more";

const VARIANT_CLASS: Record<Variant, string> = {
  default:
    "bg-surface-container border-outline-variant/20 text-on-surface",
  rare:
    "bg-tertiary/10 border-tertiary/30 text-tertiary",
  legend:
    "bg-gradient-to-br from-tertiary/15 to-secondary/8 border-tertiary/40 text-tertiary",
  more:
    "border-dashed border-outline-variant/30 bg-transparent text-on-surface-variant",
};

type StickerChipProps =
  | { num: number; label?: never; variant?: Variant; className?: string }
  | { label: string; num?: never; variant?: Variant; className?: string };

export function StickerChip(props: StickerChipProps) {
  const { variant = "default", className } = props;
  const lookup = useOptionalSectionLookup();
  const text =
    "num" in props && props.num !== undefined
      ? lookup
        ? formatStickerNumber(props.num, lookup).display
        : String(props.num)
      : props.label;
  const ariaLabel =
    "num" in props && props.num !== undefined && lookup
      ? `Figurinha ${formatStickerNumber(props.num, lookup).display}`
      : undefined;
  return (
    <span
      role={ariaLabel ? "img" : undefined}
      aria-label={ariaLabel}
      title={ariaLabel ? text : undefined}
      className={cn(
        "inline-flex min-w-[48px] items-center justify-center rounded-md border px-2 py-1 font-mono text-[11px] font-semibold tabular-nums",
        VARIANT_CLASS[variant],
        className
      )}
    >
      {text}
    </span>
  );
}
