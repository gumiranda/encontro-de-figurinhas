"use client";

import { ArrowDownLeft, ArrowUpRight, Repeat2 } from "lucide-react";

import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { cn } from "@workspace/ui/lib/utils";

import { StickerTile } from "./sticker-tile";

export function ProposalDetailTradeGrid({
  trade,
}: {
  trade: ListMyTradeRow;
}) {
  const giveCount = trade.stickersIGive.length;
  const getCount = trade.stickersIReceive.length;
  const fair = giveCount === getCount;

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-stretch">
      <Lane
        tone="give"
        icon={ArrowUpRight}
        label="Você dá"
        sublabel={`${giveCount} ${giveCount === 1 ? "figurinha" : "figurinhas"}`}
        stickers={trade.stickersIGive}
      />

      <div className="flex items-center justify-center gap-3 lg:flex-col">
        <div className="rounded-xl border border-outline-variant/15 bg-surface-container-low px-3 py-2 text-center">
          <div className="font-headline text-lg font-extrabold leading-none tracking-tight">
            <span className="text-tertiary tabular-nums">{giveCount}</span>
            <span className="px-1 text-outline">→</span>
            <span className="text-primary tabular-nums">{getCount}</span>
          </div>
          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.12em] text-outline">
            balanço
          </p>
        </div>

        <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-tertiary to-primary text-primary-foreground shadow-lg shadow-primary/30">
          <Repeat2 className="size-5" aria-hidden />
        </div>

        <span
          className={cn(
            "rounded-full px-3 py-1 text-[10px] font-bold",
            fair
              ? "bg-secondary/10 text-secondary"
              : "bg-tertiary/10 text-tertiary"
          )}
        >
          {fair ? "✓ Justa" : "Desbalanceada"}
        </span>
      </div>

      <Lane
        tone="get"
        icon={ArrowDownLeft}
        label="Você recebe"
        sublabel={`${getCount} ${getCount === 1 ? "figurinha" : "figurinhas"}`}
        stickers={trade.stickersIReceive}
      />
    </section>
  );
}

function Lane({
  tone,
  icon: Icon,
  label,
  sublabel,
  stickers,
}: {
  tone: "give" | "get";
  icon: typeof ArrowUpRight;
  label: string;
  sublabel: string;
  stickers: number[];
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border bg-surface-container-low p-4 sm:p-5",
        tone === "give"
          ? "border-tertiary/15"
          : "border-primary/15"
      )}
    >
      <header className="flex items-center gap-3">
        <div
          className={cn(
            "grid size-9 place-items-center rounded-xl",
            tone === "give"
              ? "bg-tertiary/10 text-tertiary"
              : "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-4" aria-hidden />
        </div>
        <div>
          <p className="font-headline text-base font-extrabold tracking-tight">
            {label}
          </p>
          <p className="text-xs text-on-surface-variant">{sublabel}</p>
        </div>
      </header>

      {stickers.length === 0 ? (
        <p className="text-sm text-on-surface-variant">
          Nenhuma figurinha selecionada.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {stickers.map((n) => (
            <StickerTile key={n} num={n} tone={tone} />
          ))}
        </div>
      )}
    </div>
  );
}
