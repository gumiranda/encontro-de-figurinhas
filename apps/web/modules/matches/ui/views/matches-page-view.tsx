"use client";

import { useQuery } from "convex/react";
import { ListPlus, MapPin, Share2, Sparkles, User } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";

import { api } from "@workspace/backend/_generated/api";
import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { useShare } from "@/modules/trade-points/lib/use-share";

import { useMatchesFilters } from "../../hooks/use-matches-filters";
import { MatchCard } from "../components/match-card";
import { MatchesEmptyState } from "../components/matches-empty-state";

export function MatchesPageView() {
  const { queryArgs } = useMatchesFilters();
  const share = useShare();

  const findData = useQuery(api.matches.findUserMatches, {});

  /** User has city + stickers; `findUserMatches` can stay `"computing"` forever while `userMatchCache` is stale — the page uses `listMyMatches` instead, so we must not block on `"ready"`. */
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
    canLoadMatches &&
    listMatches !== undefined &&
    listMatches.matches.length === 0;

  const presentMatchRowsAtPointQ = useQuery(
    api.matches.listPresentMatchRowsAtActivePoint,
    needPresentFallback
      ? { bidirectionalOnly: queryArgs.bidirectionalOnly }
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

  const cachePresentFallback = useMemo(() => {
    if (!needPresentFallback) return [];
    if (presentMatchRowsAtPointQ === undefined) return [];
    if (queryArgs.layer === 2) return [];
    return presentMatchRowsAtPointQ.matches;
  }, [needPresentFallback, presentMatchRowsAtPointQ, queryArgs.layer]);

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

  const matches =
    listMatches.matches.length > 0
      ? listMatches.matches
      : cachePresentFallback;

  if (presentUserIds.length > 0 && matches.length === 0) {
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

  if (matches.length === 0) {
    return (
      <MatchesEmptyState
        icon={Sparkles}
        title="Seus matches estão a caminho"
        description="Novos colecionadores entram todo dia. Volte em breve ou atualize suas figurinhas para ampliar as chances."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Matches</h1>
        <p className="text-muted-foreground">Usuários com figurinhas compatíveis</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {matches.map((match) => (
          <MatchCard
            key={`${match.matchedUserId}-${match.tradePointId}-${match.layer}`}
            match={match}
          />
        ))}
      </div>
    </div>
  );
}

function MatchesPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-12 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
