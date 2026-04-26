"use client";

import type { LucideIcon } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

export type StatDescriptionTone = "warning" | "success" | "muted";

export interface StatConfig {
  label: string;
  value: number;
  tone: "secondary" | "primary" | "tertiary" | "outline";
  description?: string;
  descriptionIcon?: LucideIcon;
  descriptionTone?: StatDescriptionTone;
  isHighlighted?: boolean;
}

const DESCRIPTION_TONE_CLASS: Record<StatDescriptionTone, string> = {
  warning: "text-tertiary",
  success: "text-secondary",
  muted: "text-on-surface-variant",
};

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
      {stats.map(
        ({
          label,
          value,
          tone,
          description,
          descriptionIcon: DescIcon,
          descriptionTone = "muted",
          isHighlighted,
        }) => (
          <div
            key={label}
            className={cn(
              "rounded-2xl border border-outline-variant/40 bg-surface-container p-4",
              isHighlighted && "border-secondary/25 bg-gradient-to-br from-secondary/10 to-secondary/2"
            )}
          >
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              {label}
            </p>
            <p
              className={cn(
                "mt-2 font-headline text-[32px] font-black leading-none tabular-nums",
                TONE_CLASS[tone]
              )}
            >
              {value}
            </p>
            {description && (
              <p
                className={cn(
                  "mt-2 inline-flex items-center gap-1 text-xs",
                  DESCRIPTION_TONE_CLASS[descriptionTone]
                )}
              >
                {DescIcon && <DescIcon className="size-3" aria-hidden />}
                {description}
              </p>
            )}
          </div>
        )
      )}
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
