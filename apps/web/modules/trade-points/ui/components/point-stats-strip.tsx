"use client";

import { memo, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Users } from "lucide-react";
import {
  resolveIntensity,
  resolveScoreLabel,
} from "@workspace/backend/lib/confidence-status";
type PointStatsStripProps = {
  confidenceScore: number;
  activeCheckinsCount: number;
  lastActivityAt: number | undefined;
  participantCount: number;
};

function affluenceLabel(score: number): string {
  const intensity = resolveIntensity(score);
  const labels = ["baixa", "moderada", "alta", "muito alta"] as const;
  return labels[intensity] ?? labels[0];
}

export const PointStatsStrip = memo(function PointStatsStrip({
  confidenceScore,
  activeCheckinsCount,
  lastActivityAt,
  participantCount,
}: PointStatsStripProps) {
  const ultimaAtividade = useMemo(() => {
    if (lastActivityAt === undefined) return "Sem atividade";
    return formatDistanceToNow(new Date(lastActivityAt), {
      locale: ptBR,
      addSuffix: true,
    });
  }, [lastActivityAt]);

  const afluenciaWord = useMemo(
    () => affluenceLabel(confidenceScore),
    [confidenceScore]
  );

  return (
    <div className="space-y-3 rounded-2xl border border-outline-variant/10 bg-surface-container-low p-5">
      <div className="space-y-1 text-sm">
        <p className="font-medium text-foreground">
          <span className="text-on-surface-variant">Score:</span>{" "}
          {confidenceScore.toFixed(1)} / 10 —{" "}
          {resolveScoreLabel(confidenceScore)}
        </p>
        <p className="text-on-surface-variant">
          <span className="font-medium text-foreground">Última atividade:</span>{" "}
          {ultimaAtividade}
        </p>
        <p className="text-on-surface-variant">
          <span className="font-medium text-foreground">Afluência:</span>{" "}
          {activeCheckinsCount} {afluenciaWord}
        </p>
        <p className="flex items-center gap-1.5 text-on-surface-variant">
          <Users className="h-4 w-4 shrink-0" aria-hidden />
          <span>
            <span className="font-medium text-foreground">Participantes:</span>{" "}
            {participantCount}
          </span>
        </p>
      </div>
    </div>
  );
});
