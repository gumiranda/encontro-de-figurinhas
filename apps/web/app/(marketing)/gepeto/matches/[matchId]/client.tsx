"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id, Doc } from "@workspace/backend/_generated/dataModel";
import { AICard, PredictionForm } from "@/modules/gepeto";
import { Skeleton } from "@workspace/ui/components/skeleton";

interface GepetoMatchClientProps {
  matchId: Id<"worldCupMatches">;
  match: Doc<"worldCupMatches">;
}

export function GepetoMatchClient({ matchId, match }: GepetoMatchClientProps) {
  const aiPrediction = useQuery(api.gepeto.getAIPrediction, { matchId });
  const userPrediction = useQuery(api.gepeto.getUserPrediction, { matchId });

  const isRevealed = match.kickoffAt <= Date.now();

  return (
    <div className="space-y-6">
      {aiPrediction === undefined ? (
        <Skeleton className="h-48 w-full" />
      ) : aiPrediction ? (
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
        <div className="p-6 rounded-lg bg-muted/50 text-center">
          <p className="text-muted-foreground">
            Gepeto ainda não analisou este jogo.
          </p>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold mb-3">Faça seu palpite</h2>
        {userPrediction === undefined ? (
          <Skeleton className="h-48 w-full" />
        ) : (
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
        )}
      </div>

      {isRevealed && match.homeScore !== undefined && (
        <div className="p-4 rounded-lg bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-1">Resultado final</p>
          <p className="text-2xl font-bold">
            {match.homeScore} x {match.awayScore}
          </p>
        </div>
      )}
    </div>
  );
}
