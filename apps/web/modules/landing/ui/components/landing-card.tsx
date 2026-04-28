"use client";

import { cn } from "@workspace/ui/lib/utils";

export type LandingCardVariant =
  | "sticker"
  | "sticker-legend"
  | "sticker-have"
  | "sticker-need"
  | "selection";

const VARIANT_CLASSES: Record<LandingCardVariant, string> = {
  sticker:
    "border-white/[0.06] bg-gradient-to-b from-[#1e253b] to-[#13192b]",
  "sticker-legend":
    "border-[#ffc965]/35 bg-gradient-to-b from-[#3a2f0c] to-[#1a1408]",
  "sticker-have":
    "border-[#4ff325]/30 bg-gradient-to-b from-[#0e2a08] to-[#0d1323]",
  "sticker-need":
    "border-[#95aaff]/25 border-dashed bg-[#0d1323]/40",
  selection:
    "border-white/[0.06] bg-white/[0.03] hover:bg-[#95aaff]/[0.08] hover:border-[#95aaff]/25 transition-all duration-200 cursor-pointer",
};

const PHOTO_CLASSES: Record<LandingCardVariant, string> = {
  sticker:
    "bg-gradient-to-b from-[#2a3354] to-[#181f33] text-[#6b7290]",
  "sticker-legend":
    "bg-gradient-to-b from-[#5f4200] to-[#2a1d00] text-[#ffc965]",
  "sticker-have":
    "bg-gradient-to-b from-[#103a04] to-[#0a1c01] text-[#4ff325]",
  "sticker-need":
    "bg-transparent text-[#6b7290]",
  selection: "",
};

const CODE_CLASSES: Record<LandingCardVariant, string> = {
  sticker: "text-[#e1e4fa]",
  "sticker-legend": "text-[#ffc965]",
  "sticker-have": "text-[#e1e4fa]",
  "sticker-need": "text-[#a6aabf]",
  selection: "",
};

interface StickerCardProps {
  variant: Exclude<LandingCardVariant, "selection">;
  code: string;
  flag: string;
  photoText?: string;
  className?: string;
}

interface SelectionCardProps {
  variant: "selection";
  name: string;
  flag: string;
  count: string;
  className?: string;
}

type LandingCardProps = StickerCardProps | SelectionCardProps;

export function LandingCard(props: LandingCardProps) {
  if (props.variant === "selection") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 p-2.5 rounded-lg border",
          VARIANT_CLASSES.selection,
          props.className
        )}
      >
        <span className="text-2xl leading-none">{props.flag}</span>
        <div className="min-w-0">
          <div className="font-semibold text-[0.8125rem] text-[#e1e4fa] truncate">
            {props.name}
          </div>
          <div className="font-mono text-[0.625rem] text-[#6b7290]">
            {props.count}
          </div>
        </div>
      </div>
    );
  }

  const { variant, code, flag, photoText, className } = props;

  return (
    <div
      className={cn(
        "relative aspect-[3/4] rounded-xl border overflow-hidden flex flex-col p-2.5 transition-transform duration-400 hover:-translate-y-1",
        VARIANT_CLASSES[variant],
        variant === "sticker-legend" && "after:absolute after:inset-0 after:bg-gradient-to-br after:from-transparent after:via-[#ffc965]/20 after:to-transparent after:pointer-events-none",
        className
      )}
    >
      <div
        className={cn(
          "flex-1 rounded-lg flex items-center justify-center font-mono text-[0.625rem] tracking-wide",
          "bg-[repeating-linear-gradient(135deg,rgba(255,255,255,0.025)_0_6px,transparent_6px_14px)]",
          PHOTO_CLASSES[variant]
        )}
      >
        {photoText || "photo"}
      </div>
      <div className="flex justify-between items-center mt-2 text-[0.6875rem]">
        <span className={cn("font-bold tracking-wide", CODE_CLASSES[variant])}>
          {code}
        </span>
        <span className="text-sm">{flag}</span>
      </div>
    </div>
  );
}
