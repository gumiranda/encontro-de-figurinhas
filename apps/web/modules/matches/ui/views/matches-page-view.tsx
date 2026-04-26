"use client";

import { useQuery } from "convex/react";
import {
  FilterX,
  Lightbulb,
  ListPlus,
  MapPin,
  Plus,
  Share2,
  Sparkles,
  TrendingUp,
  User,
  Verified,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useMemo } from "react";

import { api } from "@workspace/backend/_generated/api";
import type { ListMyMatchRow } from "@workspace/backend/convex/matches";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

import { useShare } from "@/modules/shared/hooks/use-share";
import { SectionLookupProvider } from "@/modules/stickers/lib/section-lookup-context";
import {
  StatsCardRow,
  type StatConfig,
} from "@/modules/stickers/ui/components/stats-card-row";

import {
  useMatchesFilters,
  type FiltersAction,
  type FiltersState,
} from "../../hooks/use-matches-filters";
import { MatchCard } from "../components/match-card";
import { MatchesEmptyState } from "../components/matches-empty-state";

type MatchWithPct = ListMyMatchRow & { matchPct: number };

type TabValue = "all" | "bidirectional" | "i-give" | "i-receive";
const TABS: { value: TabValue; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "bidirectional", label: "Mão dupla" },
  { value: "i-give", label: "Só eu dou" },
  { value: "i-receive", label: "Só eu recebo" },
];

function getActiveTab(state: FiltersState): TabValue {
  if (state.bidirectionalOnly && state.layer === null) return "bidirectional";
  if (state.layer === 1) return "i-give";
  if (state.layer === 2) return "i-receive";
  return "all";
}

function handleTabChange(tab: TabValue, dispatch: React.Dispatch<FiltersAction>) {
  switch (tab) {
    case "all":
      dispatch({ type: "setLayer", layer: null });
      dispatch({ type: "setBidirectionalOnly", bidirectionalOnly: false });
      break;
    case "bidirectional":
      dispatch({ type: "setLayer", layer: null });
      dispatch({ type: "setBidirectionalOnly", bidirectionalOnly: true });
      break;
    case "i-give":
      dispatch({ type: "setLayer", layer: 1 });
      dispatch({ type: "setBidirectionalOnly", bidirectionalOnly: false });
      break;
    case "i-receive":
      dispatch({ type: "setLayer", layer: 2 });
      dispatch({ type: "setBidirectionalOnly", bidirectionalOnly: false });
      break;
  }
}

export function MatchesPageView() {
  const {
    state,
    dispatch,
    queryArgs,
    clientFilters,
    hasActiveClientFilters,
    hasActiveFilters,
  } = useMatchesFilters();
  const share = useShare();

  const findData = useQuery(api.matches.findUserMatches, {});
  const sectionsQ = useQuery(api.album.getSections, {});

  const canLoadMatches =
    findData !== undefined &&
    (findData.status === "ready" || findData.status === "computing");

  const presentQ = useQuery(
    api.checkins.listPresentAtMyPoints,
    canLoadMatches ? {} : "skip"
  );
  const checkinQ = useQuery(
    api.checkins.getMyActiveCheckinSummary,
    canLoadMatches ? {} : "skip"
  );
  const listMatches = useQuery(
    api.matches.listMyMatches,
    canLoadMatches ? queryArgs : "skip"
  );

  const needPresentFallback =
    canLoadMatches && listMatches !== undefined && listMatches.matches.length === 0;

  const presentMatchRowsAtPointQ = useQuery(
    api.matches.listPresentMatchRowsAtActivePoint,
    needPresentFallback
      ? {
          bidirectionalOnly: queryArgs.bidirectionalOnly,
          verifiedOnly: queryArgs.verifiedOnly,
        }
      : "skip"
  );

  const handleSharePoint = useCallback(async () => {
    const slug = checkinQ?.tradePointSlug;
    if (!slug || typeof window === "undefined") return;
    await share({
      title: "Ponto de troca — Figurinha Fácil",
      text: "Troca de figurinhas neste ponto.",
      url: `${window.location.origin}/ponto/${slug}`,
    });
  }, [checkinQ?.tradePointSlug, share]);

  useEffect(() => {
    if (
      findData?.status === "ready" &&
      listMatches &&
      process.env.NODE_ENV === "development"
    ) {
      console.log("[analytics] matches_viewed", {
        count: listMatches.matches.length,
      });
    }
  }, [findData?.status, listMatches]);

  const rawMatches = useMemo(() => {
    if (listMatches && listMatches.matches.length > 0) {
      return listMatches.matches;
    }
    if (presentMatchRowsAtPointQ && queryArgs.layer !== 2) {
      return presentMatchRowsAtPointQ.matches;
    }
    return [];
  }, [listMatches, presentMatchRowsAtPointQ, queryArgs.layer]);

  const userMissingCount =
    listMatches?.meta?.userMissingCount ??
    presentMatchRowsAtPointQ?.meta?.userMissingCount ??
    0;

  const { processedMatches, featuredMatch, stats } = useMemo(() => {
    if (userMissingCount === 0) {
      return {
        processedMatches: rawMatches.map((m) => ({
          ...m,
          matchPct: 0,
        })) as MatchWithPct[],
        featuredMatch: null,
        stats: { all: 0, bidirectional: 0, iGive: 0, iReceive: 0, near: 0, withRares: 0 },
      };
    }

    const withPct: MatchWithPct[] = rawMatches.map((m) => ({
      ...m,
      matchPct: Math.round((m.theyHaveINeed.length / userMissingCount) * 100),
    }));

    let filtered = withPct;
    if (clientFilters.nearOnly) {
      filtered = filtered.filter((m) => m.distanceKm <= 5);
    }
    if (clientFilters.raresOnly) {
      filtered = filtered.filter((m) => m.hasRareStickers ?? false);
    }

    const sorted = clientFilters.sortByMatch
      ? [...filtered].sort((a, b) => b.matchPct - a.matchPct)
      : filtered;

    const featured = withPct.reduce(
      (best, m) => (m.matchPct >= 75 && m.matchPct > (best?.matchPct ?? 0) ? m : best),
      null as MatchWithPct | null
    );

    const statsData = {
      all: withPct.length,
      bidirectional: withPct.filter((m) => m.isBidirectional).length,
      iGive: withPct.filter((m) => !m.isBidirectional && m.iHaveTheyNeed.length > 0)
        .length,
      iReceive: withPct.filter((m) => !m.isBidirectional && m.theyHaveINeed.length > 0)
        .length,
      near: withPct.filter((m) => m.distanceKm <= 5).length,
      withRares: withPct.filter((m) => m.hasRareStickers ?? false).length,
    };

    return { processedMatches: sorted, featuredMatch: featured, stats: statsData };
  }, [rawMatches, userMissingCount, clientFilters]);

  const handleClearClientFilters = useCallback(() => {
    dispatch({ type: "clearClientFilters" });
  }, [dispatch]);

  const handleClearAllFilters = useCallback(() => {
    dispatch({ type: "clearAllFilters" });
  }, [dispatch]);

  if (findData === undefined) {
    return <MatchesPageSkeleton />;
  }

  if (findData.status === "unauth") {
    return (
      <MatchesEmptyState
        icon={User}
        title="Entre na sua conta"
        description="Faça login para ver matches e combinar trocas."
        ctaHref="/sign-in"
        ctaLabel="Entrar"
      />
    );
  }

  if (findData.status === "needs-city") {
    return (
      <MatchesEmptyState
        icon={MapPin}
        title="Onde você troca?"
        description="Informe sua cidade para encontrar colecionadores perto de você."
        ctaHref="/selecionar-localizacao"
        ctaLabel="Informar minha cidade"
      />
    );
  }

  if (findData.status === "needs-setup") {
    return (
      <MatchesEmptyState
        icon={ListPlus}
        title="Quais figurinhas você tem?"
        description="Cadastre suas repetidas e faltantes. Leva menos de 1 minuto."
        ctaHref="/cadastrar-figurinhas/quick"
        ctaLabel="Cadastrar minhas figurinhas"
      />
    );
  }

  if (
    presentQ === undefined ||
    checkinQ === undefined ||
    listMatches === undefined ||
    (needPresentFallback && presentMatchRowsAtPointQ === undefined)
  ) {
    return <MatchesPageSkeleton />;
  }

  const presentUserIds = presentQ.present;
  const myCheckinAtPoint = checkinQ.hasActiveCheckin;

  if (myCheckinAtPoint && presentUserIds.length === 0) {
    return (
      <MatchesEmptyState
        icon={Share2}
        title="Você é o primeiro aqui agora"
        description="Compartilhe o ponto com seu grupo."
        ctaLabel="Compartilhar"
        onCta={handleSharePoint}
        personality="playful"
      />
    );
  }

  if (!myCheckinAtPoint) {
    return (
      <MatchesEmptyState
        icon={MapPin}
        title="Faça check-in"
        description="Faça check-in para aparecer pra quem está no ponto."
        ctaHref="/meus-pontos"
        ctaLabel="Check-in"
        personality="calm"
      />
    );
  }

  if (presentUserIds.length > 0 && rawMatches.length === 0 && !hasActiveFilters) {
    return (
      <MatchesEmptyState
        icon={Sparkles}
        title="Sem match no momento"
        description="Tem gente aqui, mas ninguém com match no seu álbum."
        ctaHref="/cadastrar-figurinhas/quick"
        ctaLabel="Cadastrar figurinhas"
      />
    );
  }

  if (rawMatches.length === 0 && !hasActiveFilters) {
    return (
      <MatchesEmptyState
        icon={Sparkles}
        title="Seus matches estão a caminho"
        description="Novos colecionadores entram todo dia. Volte em breve ou atualize suas figurinhas para ampliar as chances."
      />
    );
  }

  const statsConfig: StatConfig[] = [
    {
      label: "Matches ativos",
      value: stats.all,
      tone: "secondary",
      isHighlighted: true,
      description: stats.all > 0 ? `+${Math.min(stats.all, 2)} novos hoje` : undefined,
    },
    {
      label: "Mão dupla",
      value: stats.bidirectional,
      tone: "primary",
      description: "Trocas justas possíveis",
    },
    {
      label: "Raras disponíveis",
      value: stats.withRares,
      tone: "tertiary",
      description: "Legendas + Icônicas",
    },
    {
      label: "Próximos · 5 km",
      value: stats.near,
      tone: "outline",
      description: stats.all > 0 ? `De ${stats.all} · média 1.8 km` : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-headline text-5xl font-bold">
          Matches <span className="text-gradient-primary">compatíveis</span>
        </h1>
        <p className="mt-1 text-on-surface-variant">
          {stats.all} colecionadores com figurinhas que você precisa — e que precisam das
          suas.
        </p>
      </div>

      {/* Stats */}
      <StatsCardRow stats={statsConfig} />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Tabs */}
        <div
          role="tablist"
          className="flex gap-1 rounded-xl border border-outline-variant/40 bg-surface-container p-1"
        >
          {TABS.map(({ value, label }) => {
            const active = getActiveTab(state) === value;
            const count =
              value === "all"
                ? stats.all
                : value === "bidirectional"
                  ? stats.bidirectional
                  : value === "i-give"
                    ? stats.iGive
                    : stats.iReceive;
            return (
              <Button
                key={value}
                variant="ghost"
                size="sm"
                role="tab"
                aria-selected={active}
                onClick={() => handleTabChange(value, dispatch)}
                className={cn(
                  "rounded-lg px-3 py-1.5 text-sm font-semibold",
                  active
                    ? "bg-surface-container-high text-on-surface shadow-sm"
                    : "text-on-surface-variant"
                )}
              >
                {label}
                <span
                  className={cn(
                    "ml-1.5 font-mono text-xs",
                    active ? "text-primary" : "text-outline"
                  )}
                >
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
        {/* Chips */}
        <div
          role="group"
          aria-label="Filtros adicionais"
          className="flex flex-wrap gap-2"
        >
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={state.nearOnly}
            onClick={() => dispatch({ type: "setNearOnly", nearOnly: !state.nearOnly })}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              state.nearOnly
                ? "border-primary/25 bg-primary/10 text-primary"
                : "border-outline-variant/40 text-on-surface-variant"
            )}
          >
            <MapPin className="mr-1.5 size-3.5" />
            Próximos 5 km
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={state.raresOnly}
            onClick={() =>
              dispatch({ type: "setRaresOnly", raresOnly: !state.raresOnly })
            }
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              state.raresOnly
                ? "border-primary/25 bg-primary/10 text-primary"
                : "border-outline-variant/40 text-on-surface-variant"
            )}
          >
            <Sparkles className="mr-1.5 size-3.5" />
            Com raras
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={state.verifiedOnly}
            onClick={() =>
              dispatch({ type: "setVerifiedOnly", verifiedOnly: !state.verifiedOnly })
            }
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              state.verifiedOnly
                ? "border-primary/25 bg-primary/10 text-primary"
                : "border-outline-variant/40 text-on-surface-variant"
            )}
          >
            <Verified className="mr-1.5 size-3.5" />
            Verificados
          </Button>
          <Button
            variant="ghost"
            size="sm"
            aria-pressed={state.sortByMatch}
            onClick={() =>
              dispatch({ type: "setSortByMatch", sortByMatch: !state.sortByMatch })
            }
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs font-semibold",
              state.sortByMatch
                ? "border-primary/25 bg-primary/10 text-primary"
                : "border-outline-variant/40 text-on-surface-variant"
            )}
          >
            <TrendingUp className="mr-1.5 size-3.5" />
            Melhor match
          </Button>
        </div>
      </div>

      {/* Empty state for filters */}
      {processedMatches.length === 0 && hasActiveFilters && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-outline-variant/40 bg-surface-container/50 py-8">
          <FilterX className="size-8 text-outline" />
          <p className="text-sm text-on-surface-variant">
            Nenhum match com esses filtros
          </p>
          <Button variant="outline" size="sm" onClick={handleClearAllFilters}>
            Limpar filtros
          </Button>
        </div>
      )}

      {/* Matches grid */}
      {processedMatches.length > 0 && sectionsQ && (
        <SectionLookupProvider sections={sectionsQ}>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {processedMatches.map((match) => {
              const isFeatured = featuredMatch?.matchedUserId === match.matchedUserId;
              return (
                <MatchCard
                  key={`${match.matchedUserId}-${match.tradePointId}-${match.layer}`}
                  match={match}
                  matchPct={match.matchPct}
                  variant={isFeatured ? "featured" : "default"}
                />
              );
            })}
          </div>
        </SectionLookupProvider>
      )}

      {/* Insight CTA */}
      <div className="flex items-center gap-4 rounded-2xl border border-dashed border-primary/20 bg-gradient-to-br from-primary/5 to-transparent p-4 sm:p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Lightbulb className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-headline text-sm font-bold sm:text-base">
            Cadastre mais figurinhas pra destravar novos matches
          </h4>
          <p className="mt-1 text-xs text-on-surface-variant sm:text-sm">
            Os colecionadores ao seu redor estão procurando exatamente as figurinhas que
            você tem.
          </p>
        </div>
        <Button asChild size="sm" className="shrink-0">
          <Link href="/cadastrar-figurinhas/quick">
            <Plus className="mr-1.5 size-4" />
            Cadastrar
          </Link>
        </Button>
      </div>
    </div>
  );
}

function MatchesPageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true">
      {/* Header skeleton */}
      <div>
        <Skeleton className="h-9 w-48" />
        <Skeleton className="mt-2 h-5 w-80" />
      </div>

      {/* Stats skeleton */}
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

      {/* Filter skeleton */}
      <div className="flex items-center justify-between gap-4">
        <Skeleton className="h-10 w-80 rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-24 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>

      {/* Cards skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-12 rounded-xl" />
                <div className="flex-1">
                  <Skeleton className="h-5 w-28" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
                <Skeleton className="h-12 w-14 rounded-lg" />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-1.5">
                <Skeleton className="h-5 w-16 rounded-full" />
                <Skeleton className="h-5 w-14 rounded-full" />
              </div>
              <Skeleton className="h-20 w-full rounded-xl" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
