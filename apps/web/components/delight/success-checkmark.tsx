"use client";

import { cn } from "@workspace/ui/lib/utils";

interface SuccessCheckmarkProps {
  size?: number;
  className?: string;
  tone?: "primary" | "secondary" | "tertiary";
}

const TONE_COLORS = {
  primary: { stroke: "var(--primary)", bg: "color-mix(in oklab, var(--primary) 15%, transparent)" },
  secondary: { stroke: "var(--secondary)", bg: "color-mix(in oklab, var(--secondary) 15%, transparent)" },
  tertiary: { stroke: "var(--tertiary)", bg: "color-mix(in oklab, var(--tertiary) 15%, transparent)" },
};

export function SuccessCheckmark({
  size = 64,
  className,
  tone = "secondary",
}: SuccessCheckmarkProps) {
  const colors = TONE_COLORS[tone];

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Sucesso"
    >
      <div
        className="absolute inset-0 rounded-full animate-bounce-in"
        style={{ backgroundColor: colors.bg }}
      />
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        className="relative z-10"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="4"
          className="success-check-circle"
        />
        <path
          d="M30 52 L45 67 L72 35"
          fill="none"
          stroke={colors.stroke}
          strokeWidth="5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="success-check-path"
        />
      </svg>
    </div>
  );
}
