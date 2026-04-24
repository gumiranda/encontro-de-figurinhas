"use client";

import { memo } from "react";
import { ShieldCheck } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Pill, PillIndicator } from "@workspace/ui/components/kibo-ui/pill";
import { Text } from "@workspace/ui/components/typography";
import type { QuotaTier } from "../../lib/use-quota-status";
import { useQuotaStatus } from "../../lib/use-quota-status";

const TIER_CONFIG: Record<
  QuotaTier,
  { indicator: "success" | "warning" | "error"; label: string }
> = {
  available: { indicator: "success", label: "Disponível" },
  limited: { indicator: "warning", label: "Quase no limite" },
  blocked: { indicator: "error", label: "Limite atingido" },
};

function QuotaCardImpl() {
  const { quota, isLoading } = useQuotaStatus();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-5 rounded-full" />
            <Skeleton className="h-5 w-40" />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!quota) return null;

  if (quota.unlimited) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
            Reliability Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Pill variant="outline">
            <PillIndicator variant="success" />
            Ilimitado
          </Pill>
          <Text variant="muted" className="text-sm">
            Suas sugestões vão direto para a fila de revisão.
          </Text>
        </CardContent>
      </Card>
    );
  }

  const config = TIER_CONFIG[quota.tier];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          Reliability Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Pill variant="outline">
          <PillIndicator variant={config.indicator} />
          {config.label}
        </Pill>
        <Text variant="muted" className="text-sm">
          Sua sugestão passará por avaliação administrativa. Contribuir com bons
          pontos aumenta seu nível de confiança na arena.
        </Text>
      </CardContent>
    </Card>
  );
}

export const QuotaCard = memo(QuotaCardImpl);
