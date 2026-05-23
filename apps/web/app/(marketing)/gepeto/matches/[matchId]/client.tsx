"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id, Doc } from "@workspace/backend/_generated/dataModel";
import {
  AICard,
  PredictionForm,
  VerdictBanner,
  CommunityBar,
  StreakStrip,
} from "@/modules/gepeto";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Card } from "@workspace/ui/components/card";

interface GepetoMatchClientProps {
  matchId: Id<"worldCupMatches">;
  match: Doc<"worldCupMatches">;
}

export function GepetoMatchClient({ matchId, match }: GepetoMatchClientProps) {
  const matchDetail = useQuery(api.gepeto.getDashboardMatch, { matchId });
  const userStats = useQuery(api.gepeto.getDashboardHub);

  const isRevealed = match.kickoffAt <= Date.now();
  const isFinished = match.status === "finished";
  const hasResult =
    match.homeScore !== undefined && match.awayScore !== undefined;

  if (matchDetail === undefined) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-24 w-full" />
      </div>
    );
  }

  const { aiPrediction, userPrediction, community } = matchDetail;

  const showVerdict =
    isFinished &&
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

  return (
    <div className="space-y-4">
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

      {/* AI Prediction Card */}
      {aiPrediction ? (
        <AICard
          homeTeam={match.homeTeamName}
          awayTeam={match.awayTeamName}
          prediction={aiPrediction.prediction}
          exactScore={aiPrediction.exactScore}
          confidence={aiPrediction.confidence}
          reasoning={aiPrediction.reasoning}
          trashTalk={aiPrediction.trashTalk}
          hasBadge={userPrediction?.hasBadge}
          matchId={matchId}
          isRevealed={isRevealed}
        />
      ) : (
        <Card className="p-6 text-center border-slate-700">
          <p className="text-muted-foreground">
            Gepeto ainda não analisou este jogo.
          </p>
        </Card>
      )}

      {/* User prediction form */}
      {!isFinished && (
        <div>
          <h2 className="text-lg font-semibold mb-3">Faça seu palpite</h2>
          <PredictionForm
            matchId={matchId}
            homeTeam={match.homeTeamName}
            awayTeam={match.awayTeamName}
            kickoffAt={match.kickoffAt}
            existingPrediction={
              userPrediction
                ? {
                    prediction: userPrediction.prediction,
                    exactScore: userPrediction.exactScore,
                  }
                : undefined
            }
          />
        </div>
      )}

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
      {isFinished && hasResult && !showVerdict && (
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
