"use client";

import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

export interface StatConfig {
  label: string;
  value: number;
  tone: "secondary" | "primary" | "tertiary" | "outline";
  description?: string;
  isHighlighted?: boolean;
}

export interface StatsCardRowProps {
  stats: StatConfig[];
  className?: string;
  loading?: boolean;
}

interface StickerStatsProps {
  have: number;
  duplicates: number;
  missing: number;
  total: number;
  className?: string;
}

const TONE_CLASS: Record<StatConfig["tone"], string> = {
  secondary: "text-secondary",
  primary: "text-primary",
  tertiary: "text-tertiary",
  outline: "text-on-surface",
};

export function StatsCardRow({
  stats,
  className,
  loading = false,
}: StatsCardRowProps) {
  if (loading) {
    return (
      <div
        className={cn("grid gap-3", "md:grid-cols-4", className)}
        aria-busy="true"
      >
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-outline-variant/40 bg-surface-container p-4"
          >
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "grid gap-3",
        stats.length === 4 ? "md:grid-cols-4" : `md:grid-cols-${stats.length}`,
        className
      )}
    >
      {stats.map(({ label, value, tone, description, isHighlighted }) => (
        <div
          key={label}
          className={cn(
            "rounded-2xl border border-outline-variant/40 bg-surface-container p-4",
            isHighlighted && "border-secondary/25 bg-gradient-to-br from-secondary/10 to-secondary/2"
          )}
        >
          <p
            className={cn(
              "font-headline text-[26px] font-black leading-none tabular-nums",
              TONE_CLASS[tone]
            )}
          >
            {value}
          </p>
          <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
            {label}
          </p>
          {description && (
            <p className="mt-1 text-xs text-on-surface-variant">{description}</p>
          )}
        </div>
      ))}
    </div>
  );
}

export function StickerStatsRow({
  have,
  duplicates,
  missing,
  total,
  className,
}: StickerStatsProps) {
  const stats: StatConfig[] = [
    { label: "Tenho", value: have, tone: "secondary" },
    { label: "Duplicadas", value: duplicates, tone: "primary" },
    { label: "Preciso", value: missing, tone: "tertiary" },
    { label: "Total álbum", value: total, tone: "outline" },
  ];

  return <StatsCardRow stats={stats} className={className} />;
}
