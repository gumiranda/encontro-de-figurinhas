"use client";

import { ArrowLeftRight, MessageCircle, Sparkles } from "lucide-react";
import { useState } from "react";

import type { ListMyMatchRow } from "@workspace/backend/convex/matches";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import { formatDistanceKmLabel, roundDistanceKmHalf } from "../../lib/format-match-distance";
import { MatchCardActions } from "./match-card-actions";
import { MatchDicebearAvatar } from "./match-dicebear-avatar";
import { MatchTradeDrawer } from "./match-trade-drawer";

export type MatchCardProps = {
  match: ListMyMatchRow;
  variant?: "default" | "elite";
  className?: string;
};

function stickerSampleLabel(nums: number[], max = 5): string {
  const slice = nums.slice(0, max);
  return slice.length ? slice.join(", ") : "—";
}

export function MatchCard({ match, variant = "default", className }: MatchCardProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isElite = variant === "elite";
  const avatarSize = isElite ? 52 : 40;
  const distanceKm = roundDistanceKmHalf(match.distanceKm);

  const inner = (
    <Card
      className={cn(
        "overflow-hidden transition-shadow",
        isElite &&
          "border-transparent shadow-md ring-1 ring-primary/15 ring-inset",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <MatchDicebearAvatar
              seed={match.avatarSeed}
              size={avatarSize}
              className={cn(isElite && "ring-2 ring-primary/20")}
            />
            <div className="min-w-0">
              <CardTitle className="truncate text-base leading-snug">
                {match.displayNickname}
              </CardTitle>
              <CardDescription className="text-xs">
                {formatDistanceKmLabel(distanceKm)}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1">
            {match.isBidirectional && (
              <Badge variant="secondary" className="shrink-0 text-xs">
                <Sparkles className="mr-1 size-3" />
                Mão dupla
              </Badge>
            )}
            <MatchCardActions
              matchedUserId={match.matchedUserId}
              matchedUserNickname={match.displayNickname}
              tradePointId={match.tradePointId}
              tradePointSlug={match.tradePointSlug}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between gap-2 text-sm">
          <div className="min-w-0">
            <p className="text-muted-foreground">Eles têm / você precisa</p>
            <p className="font-mono text-xs text-foreground/90">
              {stickerSampleLabel(match.theyHaveINeed)}
            </p>
          </div>
          <ArrowLeftRight className="size-5 shrink-0 text-muted-foreground" />
          <div className="min-w-0 text-right">
            <p className="text-muted-foreground">Você tem / eles precisam</p>
            <p className="font-mono text-xs text-foreground/90">
              {stickerSampleLabel(match.iHaveTheyNeed)}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span>Álbum {match.albumCompletionPct}%</span>
            <span aria-hidden>·</span>
            <span>{match.confirmedTradesCount} trocas</span>
          </div>
          <Button size="sm" onClick={() => setDrawerOpen(true)}>
            <MessageCircle className="mr-1.5 size-3.5" />
            Propor troca
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const cardWithDrawer = (
    <>
      {inner}
      <MatchTradeDrawer
        matchedUserId={match.matchedUserId}
        matchedUserNickname={match.displayNickname}
        tradePointId={match.tradePointId}
        theyHaveINeed={match.theyHaveINeed}
        iHaveTheyNeed={match.iHaveTheyNeed}
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
      />
    </>
  );

  if (!isElite) {
    return cardWithDrawer;
  }

  return (
    <div
      className={cn(
        "rounded-2xl bg-gradient-to-br from-primary/25 via-card to-tertiary/20 p-px shadow-sm",
        className
      )}
    >
      <div className="rounded-[calc(1rem-1px)] bg-card">{cardWithDrawer}</div>
    </div>
  );
}
