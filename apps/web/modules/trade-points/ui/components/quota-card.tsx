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
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@workspace/ui/components/kibo-ui/status";
import { Text } from "@workspace/ui/components/typography";
import { useQuotaStatus } from "../../lib/use-quota-status";

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
          <Pill variant="default">
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

  const statusValue =
    quota.remaining === quota.limit
      ? "online"
      : quota.remaining > 0
        ? "degraded"
        : "offline";
  const statusLabel =
    statusValue === "online"
      ? "Todas as sugestões disponíveis"
      : statusValue === "degraded"
        ? "Quota parcialmente usada"
        : "Limite atingido";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          Reliability Score
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <Status status={statusValue}>
            <StatusIndicator />
            <StatusLabel>{statusLabel}</StatusLabel>
          </Status>
          <Pill variant="outline">
            {quota.remaining}/{quota.limit}
          </Pill>
        </div>
        <Text variant="muted" className="text-sm">
          {quota.remaining > 0
            ? `${quota.remaining} de ${quota.limit} sugestões restantes.`
            : "Aguarde a revisão para enviar uma nova sugestão."}
        </Text>
      </CardContent>
    </Card>
  );
}

export const QuotaCard = memo(QuotaCardImpl);
