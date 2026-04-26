"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import {
  CheckCircle2,
  Clock,
  Filter as FilterIcon,
  Inbox,
  MapPin,
  Plus,
  Search,
  SlidersHorizontal,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

import { SectionLookupProvider } from "@/modules/stickers/lib/section-lookup-context";
import {
  StatsCardRow,
  type StatConfig,
} from "@/modules/stickers/ui/components/stats-card-row";

import { ProposalCard } from "../components/proposal-card";
import { PropostasEmptyState } from "../components/propostas-empty-state";

const URGENT_THRESHOLD_MS = 24 * 60 * 60 * 1000;
const SCHEDULED_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const ACCEPTANCE_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

type SectionKey = "urgent" | "unread" | "scheduled" | "sent" | "history";
type TabValue = "recebidas" | "enviadas" | "em-andamento" | "historico";

type SectionDef = {
  key: SectionKey;
  title: string;
  tone: "error" | "tertiary" | "secondary" | "primary" | "outline";
  tabs: TabValue[];
};

const SECTIONS: SectionDef[] = [
  { key: "urgent", title: "Expira em breve", tone: "error", tabs: ["recebidas"] },
  { key: "unread", title: "Novas para responder", tone: "tertiary", tabs: ["recebidas"] },
  { key: "scheduled", title: "Aceitas — combinar encontro", tone: "secondary", tabs: ["em-andamento"] },
  { key: "sent", title: "Enviadas por você — aguardando", tone: "primary", tabs: ["enviadas"] },
  { key: "history", title: "Histórico", tone: "outline", tabs: ["historico"] },
];

const TABS: { value: TabValue; label: string; sections: SectionKey[] }[] = [
  { value: "recebidas", label: "Recebidas", sections: ["urgent", "unread"] },
  { value: "enviadas", label: "Enviadas", sections: ["sent"] },
  { value: "em-andamento", label: "Em andamento", sections: ["scheduled"] },
  { value: "historico", label: "Histórico", sections: ["history"] },
];

type Groups = Record<SectionKey, ListMyTradeRow[]>;
const EMPTY_GROUPS = (): Groups => ({
  urgent: [],
  unread: [],
  scheduled: [],
  sent: [],
  history: [],
});

function groupTrades(trades: ListMyTradeRow[]): Groups {
  const now = Date.now();
  const g = EMPTY_GROUPS();
  for (const t of trades) {
    if (t.status === "pending_confirmation" && t.role === "incoming") {
      (t.expiresAt - now < URGENT_THRESHOLD_MS ? g.urgent : g.unread).push(t);
    } else if (
      t.status === "confirmed" &&
      t.confirmedAt &&
      now - t.confirmedAt < SCHEDULED_WINDOW_MS
    ) {
      g.scheduled.push(t);
    } else if (t.status === "pending_confirmation" && t.role === "outgoing") {
      g.sent.push(t);
    } else {
      g.history.push(t);
    }
  }
  return g;
}

const MONTH_ABBR = [
  "jan", "fev", "mar", "abr", "mai", "jun",
  "jul", "ago", "set", "out", "nov", "dez",
];

function expiringTodayCount(urgent: ListMyTradeRow[]): number {
  const cutoff = Date.now() + 24 * 60 * 60 * 1000;
  return urgent.filter((t) => t.expiresAt <= cutoff).length;
}

function weeklyEnviadasDelta(sent: ListMyTradeRow[]): number {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return sent.filter((t) => t.createdAt >= cutoff).length;
}

function firstTradeMonthLabel(list: ListMyTradeRow[]): string | null {
  const stamps = list
    .filter((t): t is ListMyTradeRow & { confirmedAt: number } =>
      t.status === "confirmed" && typeof t.confirmedAt === "number"
    )
    .map((t) => t.confirmedAt);
  if (stamps.length === 0) return null;
  const d = new Date(Math.min(...stamps));
  return `desde ${MONTH_ABBR[d.getMonth()]}/${d.getFullYear()}`;
}

function matchesSearch(trade: ListMyTradeRow, query: string): boolean {
  if (!query.trim()) return true;
  const needle = query.toLowerCase();
  return (
    trade.counterparty.name.toLowerCase().includes(needle) ||
    (trade.counterparty.nickname?.toLowerCase().includes(needle) ?? false) ||
    (trade.tradePoint?.name.toLowerCase().includes(needle) ?? false) ||
    [...trade.stickersIGive, ...trade.stickersIReceive].some((n) =>
      String(n).includes(needle)
    )
  );
}

export function PropostasPageView() {
  const router = useRouter();
  const { isAuthenticated } = useConvexAuth();
  const trades = useQuery(
    api.trades.listMyTrades,
    isAuthenticated ? {} : "skip"
  );
  const sections = useQuery(api.album.getSections, { includeExtras: true });

  const [tab, setTab] = useState<TabValue>("recebidas");
  const [search, setSearch] = useState("");

  const confirmTrade = useMutation(api.trades.confirm);
  const cancelTrade = useMutation(api.trades.cancel);
  const declineTrade = useMutation(api.trades.decline);

  const groups = useMemo(() => groupTrades(trades ?? []), [trades]);

  const filteredGroups = useMemo<Groups>(() => {
    const out = EMPTY_GROUPS();
    const activeSections =
      TABS.find((t) => t.value === tab)?.sections ?? [];
    for (const key of activeSections) {
      out[key] = groups[key].filter((t) => matchesSearch(t, search));
    }
    return out;
  }, [groups, tab, search]);

  const stats: StatConfig[] = useMemo(() => {
    const list = trades ?? [];
    const acceptedThisMonth = list.filter(
      (t) =>
        t.status === "confirmed" &&
        t.confirmedAt &&
        Date.now() - t.confirmedAt < ACCEPTANCE_WINDOW_MS
    ).length;
    const totalReceived = groups.urgent.length + groups.unread.length;
    const acceptanceTotal = list.filter(
      (t) =>
        (t.status === "confirmed" || t.status === "expired") &&
        t.role === "incoming"
    ).length;
    const acceptanceRate =
      acceptanceTotal > 0
        ? Math.round((acceptedThisMonth / acceptanceTotal) * 100)
        : null;
    const expiringToday = expiringTodayCount(groups.urgent);
    const weeklyDelta = weeklyEnviadasDelta(groups.sent);
    const firstMonth = firstTradeMonthLabel(list);
    return [
      {
        label: "Aguardando você",
        value: totalReceived,
        tone: "tertiary",
        description:
          expiringToday > 0
            ? `${expiringToday} expiram hoje`
            : undefined,
        descriptionIcon: expiringToday > 0 ? Clock : undefined,
        descriptionTone: "warning",
        isHighlighted: expiringToday > 0,
      },
      {
        label: "Enviadas",
        value: groups.sent.length,
        tone: "primary",
        description:
          weeklyDelta > 0 ? `+${weeklyDelta} esta semana` : undefined,
        descriptionIcon: weeklyDelta > 0 ? TrendingUp : undefined,
        descriptionTone: "success",
      },
      {
        label: "Aceitas (mês)",
        value: acceptedThisMonth,
        tone: "secondary",
        description:
          acceptanceRate !== null ? `${acceptanceRate}% taxa` : undefined,
        descriptionIcon: acceptanceRate !== null ? CheckCircle2 : undefined,
        descriptionTone: "success",
      },
      {
        label: "Figurinhas trocadas",
        value: list.filter((t) => t.status === "confirmed").length,
        tone: "outline",
        description: firstMonth ?? undefined,
        descriptionTone: "muted",
      },
    ];
  }, [trades, groups]);

  if (trades === undefined) return <PropostasPageSkeleton />;

  const visibleCount = SECTIONS.reduce(
    (acc, s) => acc + filteredGroups[s.key].length,
    0
  );
  const hasAnyTrade = trades.length > 0;

  const callMutation = async (
    mut: (a: { tradeId: ListMyTradeRow["_id"] }) => Promise<unknown>,
    id: ListMyTradeRow["_id"],
    success: string,
    failure: string
  ) => {
    try {
      await mut({ tradeId: id });
      toast.success(success);
    } catch (err) {
      toast.error(failure);
      console.error(err);
    }
  };

  const handleAccept = (id: ListMyTradeRow["_id"]) =>
    callMutation(
      confirmTrade,
      id,
      "Proposta aceita. Combine o encontro pelo chat.",
      "Não foi possível aceitar agora."
    );
  const handleDecline = (id: ListMyTradeRow["_id"]) =>
    callMutation(declineTrade, id, "Proposta recusada.", "Não foi possível recusar agora.");
  const handleCancel = (id: ListMyTradeRow["_id"]) =>
    callMutation(cancelTrade, id, "Proposta cancelada.", "Não foi possível cancelar agora.");
  const comingSoon = (label: string) => () => toast.message(`${label} em breve.`);

  return (
    <SectionLookupProvider sections={sections ?? []}>
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
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-xs uppercase tracking-wide"
          >
            <SlidersHorizontal className="size-4" />
            Filtros
          </Button>
          <Button
            asChild
            size="sm"
            className="gap-2 text-xs uppercase tracking-wide"
          >
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
          {TABS.map(({ value, label, sections }) => {
            const count = sections.reduce(
              (acc, k) => acc + groups[k].length,
              0
            );
            return (
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
                  {count}
                </span>
              </TabsTrigger>
            );
          })}
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
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={comingSoon("Ordenação")}
        >
          <FilterIcon className="size-3.5" />
          Mais recentes
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="gap-1.5"
          onClick={() => toast.message("Filtro de regiões em breve.")}
        >
          <MapPin className="size-3.5" />
          Todas regiões
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
        {SECTIONS.map((s) => {
          const list = filteredGroups[s.key];
          if (list.length === 0) return null;
          return (
            <Section
              key={s.key}
              title={s.title}
              tone={s.tone}
              count={list.length}
            >
              {list.map((t) => (
                <ProposalCard
                  key={t._id}
                  trade={t}
                  section={s.key}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                  onCancel={handleCancel}
                  onMessage={comingSoon("Chat")}
                  onView={(id) => router.push(`/propostas/${id}`)}
                />
              ))}
            </Section>
          );
        })}
      </div>
    </div>
    </SectionLookupProvider>
  );
}

function Section({
  title,
  tone,
  count,
  children,
}: {
  title: string;
  tone: SectionDef["tone"];
  count: number;
  children: React.ReactNode;
}) {
  const toneClass: Record<SectionDef["tone"], string> = {
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
      <StatsCardRow stats={[]} loading />
      <Skeleton className="h-10 w-80 rounded-xl" />
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
