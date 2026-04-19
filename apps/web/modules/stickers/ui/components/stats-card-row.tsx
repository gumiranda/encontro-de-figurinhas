"use client";

import { cn } from "@workspace/ui/lib/utils";

interface StatsCardRowProps {
  have: number;
  duplicates: number;
  missing: number;
  total: number;
  className?: string;
}

interface StatConfig {
  label: string;
  value: number;
  tone: "secondary" | "primary" | "tertiary" | "outline";
}

const TONE_CLASS: Record<StatConfig["tone"], string> = {
  secondary: "text-secondary",
  primary: "text-primary",
  tertiary: "text-tertiary",
  outline: "text-on-surface",
};

export function StatsCardRow({
  have,
  duplicates,
  missing,
  total,
  className,
}: StatsCardRowProps) {
  const stats: StatConfig[] = [
    { label: "Tenho", value: have, tone: "secondary" },
    { label: "Duplicadas", value: duplicates, tone: "primary" },
    { label: "Preciso", value: missing, tone: "tertiary" },
    { label: "Total álbum", value: total, tone: "outline" },
  ];

  return (
    <div
      className={cn(
        "grid gap-3",
        "md:grid-cols-4",
        className
      )}
    >
      {stats.map(({ label, value, tone }) => (
        <div
          key={label}
          className="rounded-2xl border border-outline-variant/40 bg-surface-container p-4"
        >
          <p
            className={cn(
              "font-headline text-[26px] font-black leading-none",
              TONE_CLASS[tone]
            )}
          >
            {value}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
            {label}
          </p>
        </div>
      ))}
    </div>
  );
}
