"use client";

import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Bell,
  Calendar,
  Check,
  ChevronRight,
  MapPin,
  MessageSquare,
  Star,
  Undo2,
  X,
} from "lucide-react";
import { useState } from "react";

import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import {
  gradientForId,
  initials,
  relativeFromNow,
  relativeUntil,
} from "../../lib/format";

import { StickerChip } from "./sticker-chip";

const MAX_CHIPS = 4;

type Section = "urgent" | "unread" | "scheduled" | "sent" | "history";

type Props = {
  trade: ListMyTradeRow;
  section: Section;
  onAccept?: (id: ListMyTradeRow["_id"]) => Promise<void> | void;
  onDecline?: (id: ListMyTradeRow["_id"]) => Promise<void> | void;
  onCancel?: (id: ListMyTradeRow["_id"]) => Promise<void> | void;
  onMessage?: (id: ListMyTradeRow["_id"]) => void;
  onView?: (id: ListMyTradeRow["_id"]) => void;
};

function expiresLabel(ts: number): string {
  const v = relativeUntil(ts);
  if (v === "expirada" || v === "sem prazo") return v;
  return `Expira em ${v}`;
}

export function ProposalCard({
  trade,
  section,
  onAccept,
  onDecline,
  onCancel,
  onMessage,
  onView,
}: Props) {
  const [pending, setPending] = useState<null | "accept" | "decline" | "cancel">(
    null
  );

  const counterparty = trade.counterparty;
  const displayName =
    counterparty.nickname?.trim() || counterparty.name || "Colecionador";
  const handle = counterparty.nickname
    ? `@${counterparty.nickname.replace(/^@/, "")}`
    : null;

  const wantsLabel =
    trade.role === "incoming" ? "Quer de você" : "Você dá";
  const receivesLabel = "Você recebe";

  const guard =
    (kind: "accept" | "decline" | "cancel", fn?: (id: ListMyTradeRow["_id"]) => Promise<void> | void) =>
    async () => {
      if (!fn || pending) return;
      setPending(kind);
      try {
        await fn(trade._id);
      } finally {
        setPending(null);
      }
    };

  const givesPreview = trade.stickersIGive.slice(0, MAX_CHIPS);
  const givesExtra = trade.stickersIGive.length - givesPreview.length;
  const receivesPreview = trade.stickersIReceive.slice(0, MAX_CHIPS);
  const receivesExtra = trade.stickersIReceive.length - receivesPreview.length;

  return (
    <Card
      className={cn(
        "relative overflow-hidden p-4 transition-all hover:-translate-y-px hover:border-primary/20",
        "grid grid-cols-1 items-center gap-4 lg:grid-cols-[220px_1fr_auto] lg:gap-6 lg:p-5",
        section === "urgent" &&
          "border-l-4 border-l-error before:absolute before:inset-y-0 before:left-0 before:w-[3px] before:animate-pulse before:bg-error",
        section === "unread" &&
          "border-l-4 border-l-tertiary bg-gradient-to-b from-tertiary/[0.025] to-transparent"
      )}
    >
      {/* WHO */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "relative grid size-12 shrink-0 place-items-center rounded-2xl font-headline text-base font-extrabold lg:size-[52px]",
            gradientForId(counterparty._id)
          )}
        >
          {initials(displayName)}
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 truncate font-headline text-sm font-bold tracking-tight">
            {displayName}
            {counterparty.reliabilityScore >= 4 && (
              <span aria-label="Verificado" className="text-primary text-xs">
                ✓
              </span>
            )}
          </div>
          <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
            {handle && <span className="truncate">{handle}</span>}
            {trade.tradePoint && (
              <>
                <span aria-hidden className="size-0.5 rounded-full bg-outline" />
                <span className="inline-flex items-center gap-1 truncate">
                  <MapPin className="size-3" />
                  {trade.tradePoint.name}
                </span>
              </>
            )}
            {counterparty.totalTrades > 0 && (
              <>
                <span aria-hidden className="size-0.5 rounded-full bg-outline" />
                <span className="inline-flex items-center gap-0.5">
                  <Star className="size-3 fill-tertiary text-tertiary" />
                  {(counterparty.reliabilityScore || 0).toFixed(1)}
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TRADE */}
      <div className="flex items-center gap-3 lg:gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-tertiary">
            <ArrowUpRight className="size-3" />
            {wantsLabel}
          </div>
          <div className="flex flex-wrap gap-1">
            {givesPreview.map((n) => (
              <StickerChip key={n} num={n} />
            ))}
            {givesExtra > 0 && (
              <StickerChip label={`+${givesExtra}`} variant="more" />
            )}
          </div>
        </div>
        <ArrowLeftRight className="size-4 shrink-0 text-outline" />
        <div className="min-w-0 flex-1">
          <div className="mb-1.5 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-primary">
            <ArrowDownLeft className="size-3" />
            {receivesLabel}
          </div>
          <div className="flex flex-wrap gap-1">
            {receivesPreview.map((n) => (
              <StickerChip key={n} num={n} />
            ))}
            {receivesExtra > 0 && (
              <StickerChip label={`+${receivesExtra}`} variant="more" />
            )}
          </div>
        </div>
      </div>

      {/* ASIDE */}
      <div className="flex flex-col items-stretch gap-2 lg:items-end lg:min-w-[200px]">
        <div className="flex flex-wrap items-center gap-2 lg:justify-end">
          <StatusPill section={section} expiresAt={trade.expiresAt} />
          {trade.matchPct !== null && trade.matchPct > 0 && (
            <div className="inline-flex items-baseline gap-1 rounded-md border border-secondary/20 bg-secondary/5 px-2 py-1">
              <span className="font-headline text-sm font-extrabold leading-none text-secondary">
                {trade.matchPct}%
              </span>
              <span className="text-[9px] font-bold uppercase tracking-widest text-secondary">
                match
              </span>
            </div>
          )}
        </div>
        <div className="font-mono text-xs text-outline">
          {section === "scheduled" && trade.confirmedAt
            ? `aceita ${relativeFromNow(trade.confirmedAt)}`
            : trade.role === "outgoing"
              ? `enviada ${relativeFromNow(trade.createdAt)}`
              : relativeFromNow(trade.createdAt)}
          {" · "}
          {trade.stickersIGive.length}:{trade.stickersIReceive.length}
        </div>
        <ActionRow
          section={section}
          role={trade.role}
          pending={pending}
          onAccept={onAccept ? guard("accept", onAccept) : undefined}
          onDecline={onDecline ? guard("decline", onDecline) : undefined}
          onCancel={onCancel ? guard("cancel", onCancel) : undefined}
          onMessage={onMessage ? () => onMessage(trade._id) : undefined}
          onView={onView ? () => onView(trade._id) : undefined}
        />
      </div>
    </Card>
  );
}

function StatusPill({
  section,
  expiresAt,
}: {
  section: Section;
  expiresAt: number;
}) {
  if (section === "urgent") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-tertiary">
        <span className="size-1.5 animate-pulse rounded-full bg-current" />
        {expiresLabel(expiresAt)}
      </span>
    );
  }
  if (section === "unread") {
    return (
      <span className="rounded-full bg-tertiary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-tertiary">
        Aguarda resposta
      </span>
    );
  }
  if (section === "scheduled") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
        <Calendar className="size-3" />
        Combinar encontro
      </span>
    );
  }
  if (section === "sent") {
    return (
      <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">
        Aguardando resposta
      </span>
    );
  }
  return (
    <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-outline">
      Encerrada
    </span>
  );
}

function ActionRow({
  section,
  role,
  pending,
  onAccept,
  onDecline,
  onCancel,
  onMessage,
  onView,
}: {
  section: Section;
  role: "incoming" | "outgoing";
  pending: null | "accept" | "decline" | "cancel";
  onAccept?: () => void;
  onDecline?: () => void;
  onCancel?: () => void;
  onMessage?: () => void;
  onView?: () => void;
}) {
  if (section === "scheduled") {
    return (
      <div className="flex flex-wrap gap-1.5 lg:justify-end">
        {onMessage && (
          <Button size="sm" variant="ghost" onClick={onMessage} className="h-8 gap-1.5 px-3">
            <MessageSquare className="size-3.5" />
            Chat
          </Button>
        )}
        {onView && (
          <Button size="sm" variant="outline" onClick={onView} className="h-8 px-3">
            Ver detalhes
          </Button>
        )}
      </div>
    );
  }
  if (section === "sent") {
    return (
      <div className="flex flex-wrap gap-1.5 lg:justify-end">
        {onMessage && (
          <Button size="sm" variant="ghost" onClick={onMessage} className="h-8 gap-1.5 px-3">
            <Bell className="size-3.5" />
            Cutucar
          </Button>
        )}
        {onCancel && (
          <Button
            size="sm"
            variant="ghost"
            onClick={onCancel}
            disabled={pending === "cancel"}
            className="h-8 gap-1.5 px-3 text-error hover:bg-error/10 hover:text-error"
          >
            <Undo2 className="size-3.5" />
            Cancelar
          </Button>
        )}
        {onView && <DetailsButton onClick={onView} />}
      </div>
    );
  }
  if (section === "history") {
    if (!onView) return null;
    return (
      <div className="flex flex-wrap gap-1.5 lg:justify-end">
        <DetailsButton onClick={onView} />
      </div>
    );
  }
  // urgent + unread: incoming actions
  if (role !== "incoming") return null;
  return (
    <div className="flex flex-wrap gap-1.5 lg:justify-end">
      {onDecline && (
        <Button
          size="sm"
          variant="ghost"
          onClick={onDecline}
          disabled={pending === "decline"}
          aria-label="Recusar"
          className="size-8 px-0 text-error hover:bg-error/10 hover:text-error"
        >
          <X className="size-4" />
        </Button>
      )}
      {onView && <DetailsButton onClick={onView} />}
      {onAccept && (
        <Button
          size="sm"
          onClick={onAccept}
          disabled={pending === "accept"}
          className="h-8 gap-1.5 bg-secondary px-3 text-secondary-foreground hover:bg-secondary/90"
        >
          <Check className="size-3.5" />
          Aceitar
        </Button>
      )}
    </div>
  );
}

function DetailsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={onClick}
      className="h-8 gap-1.5 px-3 text-primary hover:bg-primary/10"
    >
      Detalhes
      <ChevronRight className="size-3.5" />
    </Button>
  );
}

