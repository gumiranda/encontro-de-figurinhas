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
  if (quota.remaining === quota.limit) return null;

  const atLimit = quota.remaining === 0;
  const pending = quota.limit - quota.remaining;
  const lastRelative =
    quota.lastSubmissionAt !== null
      ? formatDistanceToNow(new Date(quota.lastSubmissionAt), {
          locale: ptBR,
          addSuffix: true,
        })
      : null;

  const message = atLimit
    ? `Limite atingido${lastRelative ? ` · última sugestão ${lastRelative}` : ""} — aguarde a revisão.`
    : `Você tem ${pending} sugestão${pending > 1 ? "es" : ""} pendente${pending > 1 ? "s" : ""}${lastRelative ? ` · última ${lastRelative}` : ""}.`;

  return (
    <Banner className={atLimit ? "bg-destructive text-destructive-foreground" : undefined}>
      <BannerIcon icon={atLimit ? AlertTriangle : Info} />
      <BannerTitle>{message}</BannerTitle>
      {!atLimit && <BannerClose />}
    </Banner>
  );
}

export const QuotaBanner = memo(QuotaBannerImpl);
