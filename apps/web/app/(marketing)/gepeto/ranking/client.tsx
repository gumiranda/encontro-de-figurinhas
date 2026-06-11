"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Trophy } from "lucide-react";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";

export function RankingClient() {
  const leaderboard = useQuery(api.gepeto.getLeaderboard, { limit: 50 });

  if (leaderboard === undefined) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (leaderboard.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            Nenhum palpite registrado ainda. Seja o primeiro!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {leaderboard.map((entry, index) => (
        <Card key={entry._id}>
          <CardContent className="py-4 flex items-center gap-4">
            <div className="flex-shrink-0 w-8 text-center">
              {index < 3 ? (
                <Trophy
                  className={`h-5 w-5 mx-auto ${
                    index === 0
                      ? "text-amber-500"
                      : index === 1
                        ? "text-gray-400"
                        : "text-amber-700"
                  }`}
                />
              ) : (
                <span className="text-muted-foreground font-medium">
                  {index + 1}
                </span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">
                Usuário #{entry.userId.slice(-6)}
              </p>
              <p className="text-sm text-muted-foreground">
                {entry.totalMatches} jogos
              </p>
            </div>

            <div className="text-right">
              <p className="text-lg font-bold text-primary">
                {entry.totalPoints} pontos
              </p>
              <p className="text-xs text-muted-foreground">
                {entry.winCount} vitórias · {entry.tieCount} empates
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
