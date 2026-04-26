"use client";

import { ArrowDownLeft, ArrowUpRight, Check, Pencil, X } from "lucide-react";
import Link from "next/link";

import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { Button } from "@workspace/ui/components/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";
import { cn } from "@workspace/ui/lib/utils";

type Props = {
  trade: ListMyTradeRow;
  isPending: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onCancel: () => void;
};

export function ProposalDetailFooter({
  trade,
  isPending,
  onAccept,
  onDecline,
  onCancel,
}: Props) {
  const isPendingTrade = trade.status === "pending_confirmation";
  const isIncoming = trade.role === "incoming";
  const isOutgoing = trade.role === "outgoing";

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "sticky bottom-4 z-10 grid gap-3 rounded-2xl border border-outline-variant/15 bg-surface-container-low p-4 shadow-2xl shadow-black/30",
          "sm:grid-cols-[1fr_auto] sm:items-center sm:gap-4"
        )}
      >
        <Summary trade={trade} />

        {!isPendingTrade ? (
          <Button asChild variant="outline" size="sm">
            <Link href="/propostas">Voltar para propostas</Link>
          </Button>
        ) : isIncoming ? (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onDecline}
              disabled={isPending}
              className="text-error hover:bg-error/10 hover:text-error"
            >
              <X className="size-4" aria-hidden />
              Recusar
            </Button>
            <Tooltip>
              <TooltipTrigger asChild>
                <span tabIndex={0}>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled
                    className="cursor-not-allowed"
                  >
                    <Pencil className="size-4" aria-hidden />
                    Contraproposta
                  </Button>
                </span>
              </TooltipTrigger>
              <TooltipContent>Em breve</TooltipContent>
            </Tooltip>
            <Button
              type="button"
              size="sm"
              onClick={onAccept}
              disabled={isPending}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            >
              <Check className="size-4" aria-hidden />
              Aceitar troca
            </Button>
          </div>
        ) : isOutgoing ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
            className="text-error hover:bg-error/10 hover:text-error"
          >
            <X className="size-4" aria-hidden />
            Cancelar proposta
          </Button>
        ) : null}
      </div>
    </TooltipProvider>
  );
}

function Summary({ trade }: { trade: ListMyTradeRow }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-on-surface-variant">
      <span className="inline-flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-tertiary/15 text-tertiary">
          <ArrowUpRight className="size-3" aria-hidden />
        </span>
        Dando{" "}
        <strong className="font-headline font-bold text-on-surface">
          {trade.stickersIGive.length}
        </strong>
      </span>
      <span className="inline-flex items-center gap-2">
        <span className="grid size-6 place-items-center rounded-md bg-primary/15 text-primary">
          <ArrowDownLeft className="size-3" aria-hidden />
        </span>
        Recebendo{" "}
        <strong className="font-headline font-bold text-on-surface">
          {trade.stickersIReceive.length}
        </strong>
      </span>
    </div>
  );
}
