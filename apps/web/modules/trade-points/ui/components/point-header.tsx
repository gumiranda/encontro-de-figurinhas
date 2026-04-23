"use client";

import { memo, useMemo } from "react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Clock, MapPin, Users } from "lucide-react";
import {
  resolveIntensity,
  resolveScoreLabel,
} from "@workspace/backend/lib/confidence-status";
import { Text } from "@workspace/ui/components/typography";

type PointHeaderProps = {
  name: string;
  address: string;
  suggestedHours?: string;
  cityName: string | null;
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

export const PointHeader = memo(function PointHeader({
  name,
  address,
  suggestedHours,
  cityName,
  confidenceScore,
  activeCheckinsCount,
  lastActivityAt,
  participantCount,
}: PointHeaderProps) {
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
    <div className="space-y-3 px-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{name}</h1>
        {cityName && (
          <Text variant="small" className="text-muted-foreground">
            {cityName}
          </Text>
        )}
      </div>
      <div className="flex items-start gap-2 text-muted-foreground">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
        <Text variant="small">{address}</Text>
      </div>
      {suggestedHours && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <Text variant="small">{suggestedHours}</Text>
        </div>
      )}

      <div className="space-y-1 border-t border-border/50 pt-3 text-sm">
        <p className="font-medium text-foreground">
          <span className="text-muted-foreground">Score:</span>{" "}
          {confidenceScore.toFixed(1)} / 10 —{" "}
          {resolveScoreLabel(confidenceScore)}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Última atividade:</span>{" "}
          {ultimaAtividade}
        </p>
        <p className="text-muted-foreground">
          <span className="font-medium text-foreground">Afluência:</span>{" "}
          {activeCheckinsCount} {afluenciaWord}
        </p>
        <p className="flex items-center gap-1.5 text-muted-foreground">
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
