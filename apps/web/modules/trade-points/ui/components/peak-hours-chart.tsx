"use client";

import { memo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Text } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";

type PeakHoursChartProps = {
  peakHours: number[] | undefined;
};

export const PeakHoursChart = memo(function PeakHoursChart({
  peakHours,
}: PeakHoursChartProps) {
  if (!peakHours || peakHours.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Horários movimentados</CardTitle>
        </CardHeader>
        <CardContent>
          <Text variant="small" className="text-muted-foreground">
            Sem dados de movimento ainda. Faça check-in para ajudar a comunidade.
          </Text>
        </CardContent>
      </Card>
    );
  }

  const max = Math.max(...peakHours, 1);
  const peakHour = peakHours.indexOf(Math.max(...peakHours));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horários movimentados</CardTitle>
        {max > 0 && (
          <Text variant="small" className="text-muted-foreground">
            Pico às {peakHour.toString().padStart(2, "0")}h
          </Text>
        )}
      </CardHeader>
      <CardContent>
        <div
          className="grid h-32 items-end gap-0.5"
          style={{ gridTemplateColumns: `repeat(${peakHours.length}, 1fr)` }}
          role="img"
          aria-label={`Heatmap de horários movimentados, pico às ${peakHour}h`}
        >
          {peakHours.map((value, hour) => {
            const intensity = max > 0 ? value / max : 0;
            const isPeak = value === max && value > 0;
            return (
              <div
                key={hour}
                className="flex flex-col items-center justify-end"
                title={`${hour.toString().padStart(2, "0")}h: ${value} check-ins`}
              >
                <div
                  className={cn(
                    "w-full rounded-t-sm transition-colors",
                    isPeak ? "bg-secondary" : "bg-primary/60"
                  )}
                  style={{ height: `${Math.max(intensity * 100, value > 0 ? 8 : 2)}%` }}
                />
              </div>
            );
          })}
        </div>
        <div
          className="mt-1 grid gap-0.5 text-[10px] text-muted-foreground"
          style={{ gridTemplateColumns: `repeat(${peakHours.length}, 1fr)` }}
          aria-hidden="true"
        >
          {peakHours.map((_, hour) => (
            <span key={hour} className="text-center">
              {hour % 3 === 0 ? hour : ""}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});
