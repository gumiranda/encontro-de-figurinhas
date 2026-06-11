"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id, Doc } from "@workspace/backend/_generated/dataModel";
import {
  GepetoPredictionPanel,
  PredictionForm,
  VerdictBanner,
  CommunityBar,
  StreakStrip,
  MatchHeader,
} from "@/modules/gepeto";
import {
  isMatchFinished,
  isPredictionRevealed,
} from "@/modules/gepeto/lib/match-state";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card } from "@workspace/ui/components/card";

interface GepetoMatchClientProps {
  matchId: Id<"worldCupMatches">;
  match: Doc<"worldCupMatches">;
}

export function GepetoMatchClient({ matchId, match: initialMatch }: GepetoMatchClientProps) {
  const matchDetail = useQuery(api.gepeto.getDashboardMatch, { matchId });
  const userStats = useQuery(api.gepeto.getDashboardHub);

  if (matchDetail === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const match = matchDetail.match ?? initialMatch;
  const { aiPrediction, userPrediction, community } = matchDetail;

  const hasResult = isMatchFinished(match);
  const isRevealed = isPredictionRevealed(match);

  const showVerdict =
    hasResult &&
    userPrediction?.exactScore &&
    aiPrediction?.exactScore;

  const communityTotal = community.total;
  const homePercent =
    communityTotal > 0
      ? Math.round((community.counts.home / communityTotal) * 100)
      : 33;
  const drawPercent =
    communityTotal > 0
      ? Math.round((community.counts.draw / communityTotal) * 100)
      : 34;
  const awayPercent = 100 - homePercent - drawPercent;

  // Build streak data from recent results (simplified - shows last 7 days)
  const streakDays = buildStreakDays(userStats?.stats);

  // Determine match state
  const matchState = hasResult ? "postMatch" : isRevealed ? "live" : "preMatch";

  // Calculate time to kickoff
  const getTimeToKickoff = () => {
    const diff = match.kickoffAt - Date.now();
    if (diff <= 0) return "Agora";
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    if (hours > 24) return `${Math.floor(hours / 24)}d ${hours % 24}h`;
    return `${hours}h ${minutes}min`;
  };

  return (
    <div className="min-w-0 space-y-4 overflow-x-hidden">
      {/* Match Header */}
      <MatchHeader
        homeTeam={{
          name: match.homeTeamName,
          code: match.homeTeamName.slice(0, 3).toUpperCase(),
          flag: match.homeTeamFlag,
        }}
        awayTeam={{
          name: match.awayTeamName,
          code: match.awayTeamName.slice(0, 3).toUpperCase(),
          flag: match.awayTeamFlag,
        }}
        phase={matchDetail.round?.name ?? "Copa 2026"}
        date={new Date(match.kickoffAt).toLocaleDateString("pt-BR", {
          weekday: "short",
          day: "numeric",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        })}
        stadium={match.venue}
        state={matchState}
        timeToKickoff={getTimeToKickoff()}
        finalScore={
          hasResult ? { home: match.homeScore!, away: match.awayScore! } : undefined
        }
      />

      {/* Post-match verdict */}
      {showVerdict && (
        <VerdictBanner
          userPrediction={userPrediction.exactScore!}
          gepetoPrediction={aiPrediction.exactScore}
          actualResult={{
            home: match.homeScore!,
            away: match.awayScore!,
          }}
          onShare={() => {
            const text = `Meu palpite vs Gepeto em ${match.homeTeamName} x ${match.awayTeamName}!`;
            if (navigator.share) {
              navigator.share({ text, url: window.location.href });
            }
          }}
        />
      )}

      <PredictionForm
        matchId={matchId}
        homeTeam={match.homeTeamName}
        awayTeam={match.awayTeamName}
        kickoffAt={match.kickoffAt}
        homeScore={match.homeScore}
        awayScore={match.awayScore}
        existingPrediction={
          userPrediction
            ? {
                prediction: userPrediction.prediction,
                exactScore: userPrediction.exactScore,
              }
            : undefined
        }
      />

      <GepetoPredictionPanel
        matchId={matchId}
        homeTeam={match.homeTeamName}
        awayTeam={match.awayTeamName}
        isRevealed={isRevealed}
        hasPrediction={!!aiPrediction}
        hasUserPrediction={!!userPrediction}
        prediction={aiPrediction?.prediction ?? null}
        exactScore={aiPrediction?.exactScore ?? null}
        confidence={aiPrediction?.confidence}
        reasoning={aiPrediction?.reasoning ?? []}
        trashTalk={aiPrediction?.trashTalk}
        generatedAt={aiPrediction?.generatedAt}
      />

      {/* Community predictions bar */}
      {communityTotal > 0 && (
        <CommunityBar
          homePercent={homePercent}
          drawPercent={drawPercent}
          awayPercent={awayPercent}
          homeFlag={match.homeTeamFlag}
          awayFlag={match.awayTeamFlag}
          totalPredictions={communityTotal}
        />
      )}

      {/* Streak strip */}
      {streakDays.length > 0 && (
        <StreakStrip
          days={streakDays}
          currentStreak={calculateStreak(streakDays)}
        />
      )}

      {/* Final result display (when no verdict banner) */}
      {hasResult && !showVerdict && (
        <Card className="p-4 text-center border-slate-700">
          <p className="text-sm text-muted-foreground mb-1">Resultado final</p>
          <p className="text-2xl font-bold">
            {match.homeScore} x {match.awayScore}
          </p>
        </Card>
      )}
    </div>
  );
}

function buildStreakDays(
  stats?: { winCount: number; lossCount: number; totalMatches: number } | null
) {
  if (!stats || stats.totalMatches === 0) return [];

  const dayLabels = ["D", "S", "T", "Q", "Q", "S", "S"];
  const today = new Date().getDay();

  return dayLabels.map((_, i) => {
    const dayIndex = (today - 6 + i + 7) % 7;
    const isToday = i === 6;
    const played = i < stats.totalMatches;
    const beatAI = played && i < stats.winCount;

    return {
      day: dayLabels[dayIndex] ?? "?",
      played: played && !isToday,
      beatAI,
      isToday,
    };
  });
}

function calculateStreak(
  days: Array<{ beatAI: boolean; played: boolean; isToday?: boolean }>
) {
  let streak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    const d = days[i];
    if (!d || d.isToday) continue;
    if (!d.played) continue;
    if (d.beatAI) streak++;
    else break;
  }
  return streak;
}
