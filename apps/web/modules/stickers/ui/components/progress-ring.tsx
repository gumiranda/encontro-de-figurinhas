"use client";

import { cn } from "@workspace/ui/lib/utils";

interface ProgressRingProps {
  size?: number;
  strokeWidth?: number;
  value: number; // 0-1
  color?: string;
  bgColor?: string;
  className?: string;
}

export function ProgressRing({
  size = 36,
  strokeWidth = 3,
  value,
  color,
  bgColor,
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(1, Math.max(0, value)));

  return (
    <svg
      width={size}
      height={size}
      className={cn("transform -rotate-90", className)}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        className={bgColor ?? "stroke-outline-variant/30"}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        className={cn(
          "transition-[stroke-dashoffset] duration-500",
          color ?? (value >= 1 ? "stroke-tertiary" : "stroke-secondary")
        )}
      />
    </svg>
  );
}
