"use client";

import { Card, CardContent, CardHeader } from "@workspace/ui/components/card";
import { Star } from "lucide-react";
import type { Id } from "@workspace/backend/_generated/dataModel";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";

type Props = {
  displayNickname: string;
  avatarSeed: Id<"users">;
  albumCompletionPct: number;
  totalTrades: number;
  ratingAvg: number | undefined;
  ratingCount: number;
};

export function PublicProfileCard({
  displayNickname,
  avatarSeed,
  totalTrades,
  ratingAvg,
  ratingCount,
}: Props) {
  const hasRating = ratingAvg !== undefined && ratingCount > 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <MatchDicebearAvatar seed={avatarSeed} size={64} />
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold truncate">@{displayNickname}</h1>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {hasRating && (
              <span className="flex items-center gap-1">
                <Star className="size-4 fill-yellow-400 text-yellow-400" />
                {ratingAvg.toFixed(1)}
              </span>
            )}
            {totalTrades > 0 && (
              <span>
                {totalTrades} {totalTrades === 1 ? "troca" : "trocas"}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-sm text-muted-foreground">
          Veja as figurinhas disponíveis para troca
        </p>
      </CardContent>
    </Card>
  );
}
