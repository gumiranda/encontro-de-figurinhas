"use client";

import { memo } from "react";
import { Handshake, MapPin, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

type Stats = {
  activePoints: number;
  tradesCount: number;
  peopleCount: number;
  liveNowSum: number;
};

type Cap = {
  current: number;
  max: number;
  isPremium: boolean;
};

type PointsKpiStripProps = {
  stats: Stats;
  cap: Cap;
};

export const PointsKpiStrip = memo(function PointsKpiStrip({
  stats,
  cap,
}: PointsKpiStripProps) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <Kpi
        accent="primary"
        Icon={MapPin}
        label="Pontos ativos"
        value={String(cap.current)}
        unit={`/ ${cap.max} totais`}
        delta={cap.isPremium ? "Premium" : "Free"}
      />
      <Kpi
        accent="secondary"
        Icon={Handshake}
        label="Trocas confirmadas"
        value={String(stats.tradesCount)}
      />
      <Kpi
        accent="tertiary"
        Icon={Users}
        label="Pessoas conhecidas"
        value={String(stats.peopleCount)}
      />
      <Kpi
        accent="outline"
        Icon={TrendingUp}
        label="Atividade agora"
        value={String(stats.liveNowSum)}
        unit="aqui"
        highlight={stats.liveNowSum > 0}
      />
    </div>
  );
});

type KpiProps = {
  accent: "primary" | "secondary" | "tertiary" | "outline";
  Icon: LucideIcon;
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  highlight?: boolean;
};

function Kpi({
  accent,
  Icon,
  label,
  value,
  unit,
  delta,
  highlight,
}: KpiProps) {
  return (
    <Card className="relative gap-2 overflow-hidden border-outline-variant/10 bg-surface-container-low p-4">
      <span
        className={cn(
          "absolute inset-y-0 left-0 w-9 opacity-10",
          accent === "primary" && "bg-primary",
          accent === "secondary" && "bg-secondary",
          accent === "tertiary" && "bg-tertiary",
          accent === "outline" && "bg-outline"
        )}
        aria-hidden
      />
      <div className="text-[0.62rem] font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </div>
      <div
        className={cn(
          "flex items-baseline gap-1.5 font-headline text-2xl font-bold tabular-nums leading-none tracking-tight md:text-3xl",
          highlight && "text-secondary"
        )}
      >
        {value}
        {unit && (
          <span className="text-xs font-semibold text-on-surface-variant">
            {unit}
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 text-[0.7rem] font-semibold text-on-surface-variant">
        <Icon className="size-3" aria-hidden />
        {delta ?? null}
      </div>
    </Card>
  );
}
