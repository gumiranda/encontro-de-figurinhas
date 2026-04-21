"use client";

import { memo, useEffect } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sparkles, Sticker, Users } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
import {
  buildSectionLookup,
  formatStickerNumber,
  groupBySections,
  type Section,
} from "@/modules/stickers/lib/sticker-parser";

type PresentMatchesSectionProps = {
  tradePointId: Id<"tradePoints">;
  className?: string;
};

export function PresentMatchesSection({
  tradePointId,
  className,
}: PresentMatchesSectionProps) {
  const data = useQuery(api.checkins.listPresentMatchesAtPoint, { tradePointId });
  const sectionsData = useQuery(api.album.getSections);

  useEffect(() => {
    if (data && process.env.NODE_ENV === "development") {
      console.log("[analytics] present_matches_viewed", {
        state: data.state,
        matches_count: data.state === "ready" ? data.matches.length : 0,
        truncated: data.state === "ready" ? data.truncated : false,
      });
    }
  }, [data]);

  if (!data || data.state === "needs-auth" || data.state === "banned") {
    return null;
  }

  if (data.state === "not-found") {
    return null;
  }

  if (data.state === "no-stickers") {
    return (
      <Card className={cn("rounded-2xl border border-outline-variant/10 bg-surface-container-low", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <Users className="h-5 w-5 shrink-0" aria-hidden />
            Quem está aqui agora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Sticker
              className="h-10 w-10 shrink-0 text-primary"
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Cadastre suas figurinhas para ver quem tem o que você precisa.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/cadastrar-figurinhas/quick">Cadastrar figurinhas</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.state === "no-needs") {
    return (
      <Card className={cn("rounded-2xl border border-outline-variant/10 bg-surface-container-low", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <Users className="h-5 w-5 shrink-0" aria-hidden />
            Quem está aqui agora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Você já tem todas as figurinhas que precisa! Parabéns pelo álbum completo.
          </p>
        </CardContent>
      </Card>
    );
  }

  const { matches, truncated } = data;

  if (matches.length === 0) {
    return (
      <Card className={cn("rounded-2xl border border-outline-variant/10 bg-surface-container-low", className)}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <Users className="h-5 w-5 shrink-0" aria-hidden />
            Quem está aqui agora
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Ninguém aqui tem figurinhas que você precisa agora.
          </p>
        </CardContent>
      </Card>
    );
  }

  const sections: Section[] = sectionsData ?? [];
  const lookup = sections.length > 0 ? buildSectionLookup(sections) : null;

  const countLabel = truncated ? `${matches.length}+` : String(matches.length);
  const bestMatchCount = matches[0]?.totalMatches ?? 0;

  return (
    <Card className={cn("rounded-2xl border border-outline-variant/10 bg-surface-container-low shadow-lg", className)}>
      <CardHeader className="pb-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <Users className="h-5 w-5 shrink-0 text-primary" aria-hidden />
            Quem está aqui agora
          </CardTitle>
          <Badge variant="secondary" className="rounded-full px-2.5 py-0.5 text-xs font-medium">
            {countLabel} {Number(countLabel) === 1 ? "pessoa" : "pessoas"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 pt-2">
        {matches.map((match, index) => (
          <PresentMatchCard
            key={match.checkinId}
            match={match}
            lookup={lookup}
            isTopMatch={index === 0 && bestMatchCount >= 5}
            rank={index + 1}
          />
        ))}
      </CardContent>
    </Card>
  );
}

type MatchData = {
  checkinId: Id<"checkins">;
  displayNickname: string;
  avatarSeed: string;
  checkinAt: number;
  matchingStickers: number[];
  totalMatches: number;
};

type PresentMatchCardProps = {
  match: MatchData;
  lookup: ReturnType<typeof buildSectionLookup> | null;
  isTopMatch?: boolean;
  rank: number;
};

const PresentMatchCard = memo(function PresentMatchCard({
  match,
  lookup,
  isTopMatch = false,
}: PresentMatchCardProps) {
  const timeAgo = formatDistanceToNow(match.checkinAt, {
    addSuffix: true,
    locale: ptBR,
  });

  const grouped = lookup
    ? groupBySections(match.matchingStickers, lookup)
    : new Map<string, number[]>();

  const groupEntries = Array.from(grouped.entries());
  const visibleGroups = groupEntries.slice(0, 5);
  const hiddenGroupsCount = Math.max(0, groupEntries.length - 5);

  const cardClasses = isTopMatch
    ? "rounded-xl border-2 border-primary/30 bg-gradient-to-br from-primary/5 via-surface-container to-tertiary/5 p-3 shadow-sm ring-1 ring-primary/10"
    : "rounded-xl border border-outline-variant/15 bg-surface-container/50 p-3 transition-colors hover:bg-surface-container";

  return (
    <div
      className={cardClasses}
      aria-label={`Trocar com ${match.displayNickname}, ${match.totalMatches} figurinhas que você precisa`}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <MatchDicebearAvatar
            seed={match.avatarSeed}
            size={isTopMatch ? 48 : 40}
            className={isTopMatch ? "ring-2 ring-primary/20" : ""}
          />
          {isTopMatch && (
            <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary shadow-sm">
              <Sparkles className="h-3 w-3 text-primary-foreground" />
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className={cn(
                  "truncate font-medium",
                  isTopMatch ? "text-base" : "text-sm"
                )}>
                  {match.displayNickname}
                </p>
                {isTopMatch && (
                  <span className="text-xs text-primary font-medium">Melhor match</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
            <div className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold tabular-nums",
              isTopMatch
                ? "bg-primary/15 text-primary"
                : "bg-secondary/80 text-secondary-foreground"
            )}>
              {match.totalMatches} fig.
            </div>
          </div>

          {visibleGroups.length > 0 && (
            <div className="mt-2.5 flex flex-wrap gap-1.5">
              {visibleGroups.map(([code, numbers]) => (
                <StickerChip
                  key={code}
                  code={code}
                  numbers={numbers}
                  lookup={lookup}
                  highlight={isTopMatch}
                />
              ))}
              {hiddenGroupsCount > 0 && (
                <span className="inline-flex items-center rounded-md bg-muted/50 px-2 py-0.5 text-xs text-muted-foreground">
                  +{hiddenGroupsCount}
                </span>
              )}
            </div>
          )}

          {visibleGroups.length === 0 && match.matchingStickers.length > 0 && (
            <div className="mt-2">
              <p className="font-mono text-xs text-muted-foreground">
                {match.matchingStickers.slice(0, 8).join(", ")}
                {match.matchingStickers.length > 8 && ` +${match.matchingStickers.length - 8}`}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});

type StickerChipProps = {
  code: string;
  numbers: number[];
  lookup: ReturnType<typeof buildSectionLookup> | null;
  highlight?: boolean;
};

function StickerChip({ code, numbers, lookup, highlight = false }: StickerChipProps) {
  const section = lookup?.byCode.get(code);
  const flagEmoji = section?.flagEmoji ?? "";

  const formatted = numbers.slice(0, 4).map((n) => {
    if (lookup) {
      const info = formatStickerNumber(n, lookup);
      return info.relativeNum;
    }
    return n;
  });

  const hiddenCount = numbers.length - 4;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs",
        highlight
          ? "bg-primary/10 text-primary"
          : "bg-muted/80 text-muted-foreground"
      )}
    >
      <span className="shrink-0">{flagEmoji}</span>
      <span className="font-mono">
        {formatted.join(", ")}
        {hiddenCount > 0 && (
          <span className="opacity-70"> +{hiddenCount}</span>
        )}
      </span>
    </span>
  );
}
