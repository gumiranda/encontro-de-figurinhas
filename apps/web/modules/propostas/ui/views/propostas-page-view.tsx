"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  Filter as FilterIcon,
  Inbox,
  Plus,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

import {
  StatsCardRow,
  type StatConfig,
} from "@/modules/stickers/ui/components/stats-card-row";

import { ProposalCard } from "../components/proposal-card";
import { PropostasEmptyState } from "../components/propostas-empty-state";

const URGENT_THRESHOLD_MS = 24 * 60 * 60 * 1000;
const SCHEDULED_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

type TabValue = "recebidas" | "enviadas" | "em-andamento" | "historico";

const TABS: { value: TabValue; label: string }[] = [
  { value: "recebidas", label: "Recebidas" },
  { value: "enviadas", label: "Enviadas" },
  { value: "em-andamento", label: "Em andamento" },
  { value: "historico", label: "Histórico" },
];

type GroupedTrades = {
  urgent: ListMyTradeRow[];
  unread: ListMyTradeRow[];
  scheduled: ListMyTradeRow[];
  sent: ListMyTradeRow[];
  history: ListMyTradeRow[];
};

function groupTrades(trades: ListMyTradeRow[]): GroupedTrades {
  const now = Date.now();
  const groups: GroupedTrades = {
    urgent: [],
    unread: [],
    scheduled: [],
    sent: [],
    history: [],
  };
  for (const t of trades) {
    if (t.status === "pending_confirmation" && t.role === "incoming") {
      if (t.expiresAt - now < URGENT_THRESHOLD_MS) groups.urgent.push(t);
      else groups.unread.push(t);
    } else if (
      t.status === "confirmed" &&
      t.confirmedAt &&
      now - t.confirmedAt < SCHEDULED_WINDOW_MS
    ) {
      groups.scheduled.push(t);
    } else if (t.status === "pending_confirmation" && t.role === "outgoing") {
      groups.sent.push(t);
    } else {
      groups.history.push(t);
    }
  }
  return groups;
}

function matchesSearch(trade: ListMyTradeRow, query: string): boolean {
  if (!query.trim()) return true;
  const needle = query.toLowerCase();
  if (trade.counterparty.name.toLowerCase().includes(needle)) return true;
  if (trade.counterparty.nickname?.toLowerCase().includes(needle)) return true;
  if (trade.tradePoint?.name.toLowerCase().includes(needle)) return true;
  const stickers = [...trade.stickersIGive, ...trade.stickersIReceive];
  return stickers.some((n) => String(n).includes(needle));
}

export function PropostasPageView() {
  const { isAuthenticated } = useConvexAuth();
  const trades = useQuery(
    api.trades.listMyTrades,
    isAuthenticated ? {} : "skip"
  );

  const [tab, setTab] = useState<TabValue>("recebidas");
  const [search, setSearch] = useState("");

  const confirmTrade = useMutation(api.trades.confirm);
  const cancelTrade = useMutation(api.trades.cancel);
  const declineTrade = useMutation(api.trades.decline);

  const groups = useMemo(
    () => groupTrades(trades ?? []),
    [trades]
  );

  const stats: StatConfig[] = useMemo(() => {
    const acceptedThisMonth = (trades ?? []).filter(
      (t) =>
        t.status === "confirmed" &&
        t.confirmedAt &&
        Date.now() - t.confirmedAt < 30 * 24 * 60 * 60 * 1000
    ).length;
    const totalReceived = groups.urgent.length + groups.unread.length;
    const expiringToday = groups.urgent.length;
    const totalActive =
      totalReceived + groups.sent.length + groups.scheduled.length;
    const acceptanceTotal = (trades ?? []).filter(
      (t) =>
        (t.status === "confirmed" || t.status === "expired") &&
        t.role === "incoming"
    ).length;
    const acceptanceRate =
      acceptanceTotal > 0
        ? Math.round((acceptedThisMonth / acceptanceTotal) * 100)
        : null;
    return [
      {
        label: "Aguardando você",
        value: totalReceived,
        tone: "tertiary",
        description:
          expiringToday > 0
            ? `${expiringToday} expiram em breve`
            : "Sem urgências",
        isHighlighted: expiringToday > 0,
      },
      {
        label: "Enviadas",
        value: groups.sent.length,
        tone: "primary",
        description: totalActive > 0 ? `${totalActive} ativas` : undefined,
      },
      {
        label: "Aceitas (30d)",
        value: acceptedThisMonth,
        tone: "secondary",
        description:
          acceptanceRate !== null ? `${acceptanceRate}% taxa` : undefined,
      },
      {
        label: "Trocas totais",
        value: (trades ?? []).filter((t) => t.status === "confirmed").length,
        tone: "outline",
      },
    ];
  }, [trades, groups]);

  const tabCounts: Record<TabValue, number> = {
    recebidas: groups.urgent.length + groups.unread.length,
    enviadas: groups.sent.length,
    "em-andamento": groups.scheduled.length,
    historico: groups.history.length,
  };

  const filteredGroups = useMemo<Partial<GroupedTrades>>(() => {
    const apply = (rows: ListMyTradeRow[]) =>
      rows.filter((t) => matchesSearch(t, search));
    switch (tab) {
      case "recebidas":
        return {
          urgent: apply(groups.urgent),
          unread: apply(groups.unread),
        };
      case "enviadas":
        return { sent: apply(groups.sent) };
      case "em-andamento":
        return { scheduled: apply(groups.scheduled) };
      case "historico":
        return { history: apply(groups.history) };
    }
  }, [groups, tab, search]);

  const visibleCount = Object.values(filteredGroups)
    .filter(Boolean)
    .reduce((acc, list) => acc + (list?.length ?? 0), 0);

  if (trades === undefined) return <PropostasPageSkeleton />;

  const hasAnyTrade = trades.length > 0;

  const handleAccept = async (id: ListMyTradeRow["_id"]) => {
    try {
      await confirmTrade({ tradeId: id });
      toast.success("Proposta aceita. Combine o encontro pelo chat.");
    } catch (err) {
      toast.error("Não foi possível aceitar agora.");
      console.error(err);
    }
  };
  const handleDecline = async (id: ListMyTradeRow["_id"]) => {
    try {
      await declineTrade({ tradeId: id });
      toast.success("Proposta recusada.");
    } catch (err) {
      toast.error("Não foi possível recusar agora.");
      console.error(err);
    }
  };
  const handleCancel = async (id: ListMyTradeRow["_id"]) => {
    try {
      await cancelTrade({ tradeId: id });
      toast.success("Proposta cancelada.");
    } catch (err) {
      toast.error("Não foi possível cancelar agora.");
      console.error(err);
    }
  };
  const handleMessage = () => {
    toast.message("Chat em breve.");
  };
  const handleView = () => {
    toast.message("Detalhes em breve.");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-extrabold tracking-tight sm:text-4xl">
            Propostas
          </h1>
          <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
            Suas trocas pendentes, enviadas e fechadas. Responda em até 48h pra
            manter sua reputação alta.
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <SlidersHorizontal className="size-4" />
            Filtros
          </Button>
          <Button asChild size="sm" className="gap-2">
            <Link href="/matches">
              <Plus className="size-4" />
              Nova proposta
            </Link>
          </Button>
        </div>
      </div>

      <StatsCardRow stats={stats} />

      <Tabs value={tab} onValueChange={(v) => setTab(v as TabValue)}>
        <TabsList className="bg-surface-container-low">
          {TABS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value} className="gap-2">
              {label}
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 font-mono text-[10px] font-bold",
                  tab === value
                    ? "bg-primary text-primary-foreground"
                    : "bg-surface-container-highest text-on-surface-variant"
                )}
              >
                {tabCounts[value]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline" />
          <Input
            placeholder="Buscar por pessoa ou figurinha..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" disabled>
          <FilterIcon className="size-3.5" />
          Mais recentes
        </Button>
        <span className="ml-auto text-xs text-on-surface-variant">
          {visibleCount} {visibleCount === 1 ? "proposta" : "propostas"}
        </span>
      </div>

      {!hasAnyTrade && (
        <PropostasEmptyState
          icon={Inbox}
          title="Nenhuma proposta ainda"
          description="Quando alguém propor uma troca, ela aparece aqui. Encontre matches e envie a primeira."
          ctaHref="/matches"
          ctaLabel="Ver matches"
        />
      )}

      {hasAnyTrade && visibleCount === 0 && (
        <PropostasEmptyState
          icon={Inbox}
          title="Nada por aqui"
          description="Sem propostas nessa aba ou para essa busca."
        />
      )}

      <div className="space-y-3">
        {filteredGroups.urgent && filteredGroups.urgent.length > 0 && (
          <Section
            title="Expira em breve"
            tone="error"
            count={filteredGroups.urgent.length}
          >
            {filteredGroups.urgent.map((t) => (
              <ProposalCard
                key={t._id}
                trade={t}
                section="urgent"
                onAccept={handleAccept}
                onDecline={handleDecline}
                onView={handleView}
              />
            ))}
          </Section>
        )}
        {filteredGroups.unread && filteredGroups.unread.length > 0 && (
          <Section
            title="Novas para responder"
            tone="tertiary"
            count={filteredGroups.unread.length}
          >
            {filteredGroups.unread.map((t) => (
              <ProposalCard
                key={t._id}
                trade={t}
                section="unread"
                onAccept={handleAccept}
                onDecline={handleDecline}
                onView={handleView}
              />
            ))}
          </Section>
        )}
        {filteredGroups.scheduled && filteredGroups.scheduled.length > 0 && (
          <Section
            title="Aceitas — combinar encontro"
            tone="secondary"
            count={filteredGroups.scheduled.length}
          >
            {filteredGroups.scheduled.map((t) => (
              <ProposalCard
                key={t._id}
                trade={t}
                section="scheduled"
                onMessage={handleMessage}
                onView={handleView}
              />
            ))}
          </Section>
        )}
        {filteredGroups.sent && filteredGroups.sent.length > 0 && (
          <Section
            title="Enviadas por você — aguardando"
            tone="primary"
            count={filteredGroups.sent.length}
          >
            {filteredGroups.sent.map((t) => (
              <ProposalCard
                key={t._id}
                trade={t}
                section="sent"
                onCancel={handleCancel}
                onMessage={handleMessage}
              />
            ))}
          </Section>
        )}
        {filteredGroups.history && filteredGroups.history.length > 0 && (
          <Section
            title="Histórico"
            tone="outline"
            count={filteredGroups.history.length}
          >
            {filteredGroups.history.map((t) => (
              <ProposalCard key={t._id} trade={t} section="history" />
            ))}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  tone,
  count,
  children,
}: {
  title: string;
  tone: "error" | "tertiary" | "secondary" | "primary" | "outline";
  count: number;
  children: React.ReactNode;
}) {
  const toneClass: Record<typeof tone, string> = {
    error: "text-error",
    tertiary: "text-tertiary",
    secondary: "text-secondary",
    primary: "text-primary",
    outline: "text-on-surface",
  };
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-3 px-1">
        <h2
          className={cn(
            "font-headline text-sm font-extrabold tracking-tight",
            toneClass[tone]
          )}
        >
          {title}
        </h2>
        <span className="font-mono text-xs text-outline">
          {count} {count === 1 ? "proposta" : "propostas"}
        </span>
        <div className="h-px flex-1 bg-outline-variant/20" />
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function PropostasPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-80" />
      </div>
      <div className="grid gap-3 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-outline-variant/40 bg-surface-container p-4"
          >
            <Skeleton className="h-8 w-16" />
            <Skeleton className="mt-2 h-3 w-20" />
          </div>
        ))}
      </div>
      <Skeleton className="h-10 w-80 rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="mt-1 h-3 w-24" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full rounded-lg" />
              <div className="flex justify-end gap-2">
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
