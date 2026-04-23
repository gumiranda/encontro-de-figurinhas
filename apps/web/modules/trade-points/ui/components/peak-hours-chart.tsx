"use client";

import { memo, useId, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Text } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";

type PeakHoursChartProps = {
  peakHours: number[] | null | undefined;
  className?: string;
};

function normalizePeakHours(peakHours: number[] | null | undefined): number[] {
  return Array.from({ length: 24 }, (_, i) =>
    Math.max(0, Math.floor(peakHours?.[i] ?? 0))
  );
}

export const PeakHoursChart = memo(function PeakHoursChart({
  peakHours,
  className,
}: PeakHoursChartProps) {
  const chartLabelId = useId();

  const safeHours = useMemo(
    () => normalizePeakHours(peakHours),
    [peakHours]
  );

  const max = useMemo(
    () => Math.max(1, ...safeHours),
    [safeHours]
  );

  const peakValue = useMemo(
    () => safeHours.reduce((a, b) => Math.max(a, b), 0),
    [safeHours]
  );

  const hasNoData =
    peakHours === null ||
    peakHours === undefined ||
    safeHours.every((v) => v === 0);

  if (hasNoData) {
    return (
      <Card
        className={cn(
          "rounded-2xl border-outline-variant/10 bg-surface-container-low shadow-xl",
          className
        )}
      >
        <CardHeader>
          <CardTitle>Horários movimentados</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Sem dados ainda.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        "rounded-2xl border-outline-variant/10 bg-surface-container-low shadow-xl",
        className
      )}
    >
      <CardHeader>
        <CardTitle>Horários movimentados</CardTitle>
        {peakValue > 0 && (
          <Text variant="small" className="text-muted-foreground">
            Pico:{" "}
            {safeHours
              .map((v, h) => (v === peakValue ? h : -1))
              .filter((h) => h >= 0)
              .map((h) => `${h}h`)
              .join(", ")}
          </Text>
        )}
      </CardHeader>
      <CardContent className="space-y-2">
        <span id={chartLabelId} className="sr-only">
          Distribuição de check-ins por hora
        </span>
        <div className="-mx-1 overflow-x-auto px-1 sm:mx-0 sm:overflow-visible">
          <div className="min-w-[520px] sm:min-w-0">
        <div
          role="img"
          aria-labelledby={chartLabelId}
          className="grid h-36 items-end gap-0.5"
          style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
        >
          {safeHours.map((value, hour) => {
            const isPeak = value > 0 && value === peakValue;
            const overHalf = value > max * 0.5;
            const barColorClass = isPeak
              ? "bg-secondary"
              : overHalf
                ? "bg-primary-dim"
                : "bg-surface-container-highest";

            const pct = max > 0 ? (value / max) * 100 : 0;
            const heightPct = value > 0 ? Math.max(pct, 8) : 4;

            const label = `${hour} horas, ${value} check-in${value === 1 ? "" : "s"}`;

            return (
              <div
                key={hour}
                className="flex h-full min-h-0 flex-col justify-end"
              >
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-colors",
                    barColorClass
                  )}
                  style={{
                    height: `${heightPct}%`,
                    minHeight: value > 0 ? 4 : 2,
                  }}
                  title={`${hour.toString().padStart(2, "0")}h — ${value} check-ins`}
                  aria-label={label}
                />
              </div>
            );
          })}
        </div>
        <div
          className="grid gap-0.5 text-[9px] text-muted-foreground tabular-nums sm:text-[10px]"
          style={{ gridTemplateColumns: "repeat(24, minmax(0, 1fr))" }}
          aria-hidden="true"
        >
          {safeHours.map((_, hour) => (
            <span key={hour} className="min-w-0 text-center sm:truncate">
              {hour % 3 === 0 ? `${hour}h` : ""}
            </span>
          ))}
        </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});
