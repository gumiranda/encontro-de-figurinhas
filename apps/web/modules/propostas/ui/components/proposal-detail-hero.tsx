"use client";

import { Clock, MapPin, ShieldCheck, Star } from "lucide-react";

import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { cn } from "@workspace/ui/lib/utils";

import {
  gradientForId,
  initials,
  relativeFromNow,
  relativeUntil,
} from "../../lib/format";

export function ProposalDetailHero({ trade }: { trade: ListMyTradeRow }) {
  const cp = trade.counterparty;
  const displayName = cp.nickname?.trim() || cp.name || "Colecionador";
  const handle = cp.nickname ? `@${cp.nickname.replace(/^@/, "")}` : null;
  const verified = cp.reliabilityScore >= 4;

  const headline =
    trade.role === "incoming" ? "Proposta recebida de" : "Proposta enviada para";

  return (
    <section className="relative overflow-hidden rounded-2xl border border-tertiary/15 bg-gradient-to-b from-tertiary/[0.04] to-surface-container-low p-5 sm:p-6">
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-1 bg-tertiary"
      />
      <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center lg:gap-8">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "relative grid size-16 shrink-0 place-items-center rounded-2xl font-headline text-xl font-extrabold",
              gradientForId(cp._id)
            )}
          >
            {initials(displayName)}
            <span
              aria-hidden
              className="absolute -bottom-0.5 -right-0.5 size-4 rounded-full border-[3px] border-surface-container-low bg-secondary"
            />
          </div>
          <div className="min-w-0 space-y-1">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-tertiary">
              {headline}
            </p>
            <div className="flex items-center gap-2 font-headline text-2xl font-extrabold tracking-tight sm:text-3xl">
              <span className="truncate">{displayName}</span>
              {verified && (
                <ShieldCheck
                  className="size-4 shrink-0 text-primary"
                  aria-label="Verificado"
                />
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-on-surface-variant">
              {handle && <span className="truncate">{handle}</span>}
              {handle && trade.tradePoint && (
                <Dot />
              )}
              {trade.tradePoint && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  <span className="truncate">{trade.tradePoint.name}</span>
                </span>
              )}
              {cp.totalTrades > 0 && (
                <>
                  <Dot />
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3 fill-tertiary text-tertiary" />
                    <span className="font-headline font-bold text-on-surface">
                      {cp.reliabilityScore.toFixed(1)}
                    </span>
                    <span>· {cp.totalTrades} trocas</span>
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="lg:text-right">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-tertiary">
            {trade.status === "pending_confirmation" ? "Expira em" : "Status"}
          </p>
          <div className="mt-1 inline-flex items-center gap-2 font-headline text-2xl font-extrabold tracking-tight text-tertiary sm:text-3xl">
            <Clock className="size-5" aria-hidden />
            {trade.status === "pending_confirmation"
              ? relativeUntil(trade.expiresAt)
              : statusCopy(trade.status)}
          </div>
          <p className="mt-1 font-mono text-[11px] text-outline">
            {trade.role === "incoming" ? "recebida " : "enviada "}
            {relativeFromNow(trade.createdAt)}
          </p>
        </div>
      </div>
    </section>
  );
}

function Dot() {
  return (
    <span
      aria-hidden
      className="size-0.5 shrink-0 rounded-full bg-outline"
    />
  );
}

function statusCopy(status: ListMyTradeRow["status"]): string {
  switch (status) {
    case "confirmed":
      return "Aceita";
    case "declined":
      return "Recusada";
    case "cancelled":
      return "Cancelada";
    case "expired":
      return "Expirada";
    case "disputed":
      return "Em disputa";
    default:
      return "—";
  }
}
