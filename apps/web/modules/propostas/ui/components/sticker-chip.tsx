"use client";

import { cn } from "@workspace/ui/lib/utils";

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

export function StickerChip({
  label,
  variant = "default",
  className,
}: {
  label: string;
  variant?: Variant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex min-w-[38px] items-center justify-center rounded-md border px-2 py-1 font-mono text-[11px] font-semibold tabular-nums",
        VARIANT_CLASS[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
