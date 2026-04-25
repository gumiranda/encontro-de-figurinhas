"use client";

import { Footprints, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { cn } from "@workspace/ui/lib/utils";

type Tone = "match" | "distance";

export function ProposalDetailInsights({
  trade,
}: {
  trade: ListMyTradeRow;
}) {
  const cards: {
    tone: Tone;
    icon: LucideIcon;
    label: string;
    value: string;
    hint?: string;
    valueClass?: string;
  }[] = [];

  if (trade.matchPct !== null) {
    cards.push({
      tone: "match",
      icon: Heart,
      label: "Compatibilidade",
      value: `${trade.matchPct}%`,
      hint:
        trade.matchPct >= 70
          ? "Match alto — necessidades opostas"
          : trade.matchPct >= 30
            ? "Match razoável"
            : "Poucas figurinhas em comum",
      valueClass:
        trade.matchPct >= 70
          ? "text-secondary"
          : trade.matchPct >= 30
            ? "text-tertiary"
            : "text-on-surface",
    });
  }

  if (trade.tradePoint) {
    cards.push({
      tone: "distance",
      icon: Footprints,
      label: "Ponto de troca",
      value: trade.tradePoint.name,
      hint: trade.tradePoint.address,
    });
  }

  if (cards.length === 0) return null;

  return (
    <section
      className={cn(
        "grid gap-3",
        cards.length === 1 ? "sm:grid-cols-1" : "sm:grid-cols-2"
      )}
    >
      {cards.map(({ tone, icon: Icon, label, value, hint, valueClass }) => (
        <div
          key={tone}
          className="rounded-2xl border border-outline-variant/15 bg-surface-container-low p-4"
        >
          <div
            className={cn(
              "mb-2 grid size-8 place-items-center rounded-lg",
              tone === "match"
                ? "bg-secondary/10 text-secondary"
                : "bg-primary/10 text-primary"
            )}
          >
            <Icon className="size-4" aria-hidden />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-on-surface-variant">
            {label}
          </p>
          <p
            className={cn(
              "mt-1 font-headline text-xl font-extrabold tracking-tight truncate",
              valueClass
            )}
            title={value}
          >
            {value}
          </p>
          {hint && (
            <p className="mt-1 text-xs text-on-surface-variant truncate">
              {hint}
            </p>
          )}
        </div>
      ))}
    </section>
  );
}
