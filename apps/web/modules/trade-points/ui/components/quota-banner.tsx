"use client";

import { memo } from "react";
import { AlertTriangle, Info } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Banner,
  BannerIcon,
  BannerTitle,
  BannerClose,
} from "@workspace/ui/components/kibo-ui/banner";
import { useQuotaStatus } from "../../lib/use-quota-status";

function QuotaBannerImpl() {
  const { quota, isLoading } = useQuotaStatus();

  if (isLoading || !quota || quota.unlimited) return null;
  if (quota.tier === "available") return null;

  const atLimit = quota.tier === "blocked";
  const lastRelative =
    quota.lastSubmissionAt !== null
      ? formatDistanceToNow(new Date(quota.lastSubmissionAt), {
          locale: ptBR,
          addSuffix: true,
        })
      : null;

  const message = atLimit
    ? `Limite atingido${lastRelative ? ` · última sugestão ${lastRelative}` : ""} — aguarde a revisão.`
    : `Você tem sugestões aguardando revisão.${lastRelative ? ` Última enviada ${lastRelative}.` : ""}`;

  return (
    <Banner className={atLimit ? "bg-destructive text-destructive-foreground" : undefined}>
      <BannerIcon icon={atLimit ? AlertTriangle : Info} />
      <BannerTitle>{message}</BannerTitle>
      {!atLimit && <BannerClose />}
    </Banner>
  );
}

export const QuotaBanner = memo(QuotaBannerImpl);
