"use client";

import { Progress } from "@workspace/ui/components/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

interface AlbumProgressModuleProps {
  pasted: number;
  total: number;
  duplicatesCount: number;
  missingCount: number;
}

function Kpi({
  label,
  value,
  accentClass,
}: {
  label: string;
  value: number;
  accentClass: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-muted/50 p-2.5 text-center">
      <div className={`font-mono text-xl font-bold ${accentClass}`}>{value}</div>
      <div className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function AlbumProgressModule({
  pasted,
  total,
  duplicatesCount,
  missingCount,
}: AlbumProgressModuleProps) {
  const pct = (pasted / total) * 100;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">Progresso do álbum</CardTitle>
        <span className="font-mono text-xs text-muted-foreground">
          {pasted} / {total}
        </span>
      </CardHeader>
      <CardContent>
        <div className="mb-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold text-primary">
            {pct.toFixed(1)}%
          </span>
          <span className="text-sm text-muted-foreground">colado</span>
        </div>

        <Progress value={pct} className="h-2" />

        <div className="mt-3.5 grid grid-cols-3 gap-2">
          <Kpi label="Coladas" value={pasted} accentClass="text-primary" />
          <Kpi label="Repetidas" value={duplicatesCount} accentClass="text-emerald-400" />
          <Kpi label="Faltam" value={missingCount} accentClass="text-amber-400" />
        </div>
      </CardContent>
    </Card>
  );
}
