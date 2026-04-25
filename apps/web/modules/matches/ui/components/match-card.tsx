"use client";

import { ArrowRight, Book, Handshake, MapPin, Sparkles, Verified } from "lucide-react";
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

import { formatDistanceKmLabel, roundDistanceKmHalf } from "../../../shared/lib/format-distance";
import { MatchCardActions } from "./match-card-actions";
import { MatchInitialsAvatar } from "./match-initials-avatar";
import { MatchTradeModal } from "./match-trade-modal";
import { StickerLanes } from "./sticker-lanes";

export type MatchCardProps = {
  match: ListMyMatchRow;
  matchPct?: number;
  variant?: "default" | "elite" | "featured";
  rareNumbers?: Set<number>;
  className?: string;
};

function getMatchPctVariant(pct: number): "high" | "mid" | "low" {
  if (pct >= 75) return "high";
  if (pct >= 50) return "mid";
  return "low";
}

const MATCH_PCT_STYLES = {
  high: "bg-secondary/10 text-secondary",
  mid: "bg-primary/10 text-primary",
  low: "bg-tertiary/10 text-tertiary",
};

function formatSlugAsLocation(slug: string): string {
  if (!slug) return "";
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function MatchCard({
  match,
  matchPct = 0,
  variant = "default",
  rareNumbers = new Set(),
  className,
}: MatchCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const isFeatured = variant === "featured";
  const isElite = variant === "elite" || isFeatured;
  const avatarSize = isElite ? 52 : 48;
  const distanceKm = roundDistanceKmHalf(match.distanceKm);
  const pctVariant = getMatchPctVariant(matchPct);
  const isNear = distanceKm <= 5;

  const inner = (
    <Card
      className={cn(
        "relative overflow-hidden transition-shadow",
        isElite && "border-transparent shadow-md ring-1 ring-primary/15 ring-inset",
        isFeatured && "border-secondary/20 bg-gradient-to-br from-secondary/5 to-primary/5",
        className
      )}
    >
      {isFeatured && (
        <div
          aria-label="Melhor match do dia"
          className="absolute -top-0.5 left-4 rounded-b-lg bg-secondary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-on-secondary"
        >
          ⚡ Melhor match do dia
        </div>
      )}

      <CardHeader className={cn("pb-3", isFeatured && "pt-8")}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <MatchInitialsAvatar
              name={match.displayNickname}
              seed={match.avatarSeed}
              size={avatarSize}
              className={cn(isElite && "ring-2 ring-primary/20")}
            />
            <div className="min-w-0">
              <CardTitle className="flex items-center gap-1.5 truncate text-base leading-snug">
                {match.displayNickname}
                {(match.isVerified ?? false) && (
                  <Verified className="size-3.5 text-tertiary" />
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-1 text-xs">
                <span>{formatSlugAsLocation(match.tradePointSlug)}</span>
                <span className="text-outline">·</span>
                <span>{formatDistanceKmLabel(distanceKm)}</span>
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {matchPct > 0 && (
              <div
                className={cn(
                  "flex flex-col items-center rounded-lg px-2.5 py-1",
                  MATCH_PCT_STYLES[pctVariant]
                )}
              >
                <span className="font-headline text-lg font-bold leading-none">
                  {matchPct}%
                </span>
                <span className="text-[9px] font-bold uppercase tracking-wider opacity-80">
                  match
                </span>
              </div>
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
        {/* Badges row */}
        <div className="flex flex-wrap gap-1.5">
          {match.isBidirectional && (
            <Badge className="border-secondary/25 bg-secondary/10 text-secondary text-[10px]">
              <Sparkles className="mr-1 size-3" />
              Mão dupla
            </Badge>
          )}
          {(match.hasRareStickers ?? false) && (
            <Badge className="border-tertiary/25 bg-tertiary/10 text-tertiary text-[10px]">
              <Sparkles className="mr-1 size-3" />
              Com raras
            </Badge>
          )}
          {isNear && (
            <Badge variant="outline" className="text-[10px]">
              <MapPin className="mr-1 size-3" />
              Perto
            </Badge>
          )}
        </div>

        {/* Sticker lanes */}
        <StickerLanes
          theyHaveINeed={match.theyHaveINeed}
          iHaveTheyNeed={match.iHaveTheyNeed}
          rareNumbers={rareNumbers}
        />

        {/* Footer */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-3 text-xs text-on-surface-variant">
            <span className="flex items-center gap-1">
              <Book className="size-3.5 text-outline" />
              <strong className="font-headline font-bold text-on-surface">{match.albumCompletionPct}%</strong>
              <span>álbum</span>
            </span>
            <span className="flex items-center gap-1">
              <Handshake className="size-3.5 text-outline" />
              <strong className="font-headline font-bold text-on-surface">{match.confirmedTradesCount}</strong>
              <span>trocas</span>
            </span>
          </div>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            Propor troca
            <ArrowRight className="ml-1.5 size-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const cardWithModal = (
    <>
      {inner}
      {modalOpen && (
        <MatchTradeModal
          matchedUserId={match.matchedUserId}
          matchedUserNickname={match.displayNickname}
          tradePointId={match.tradePointId}
          distanceKm={distanceKm}
          tradesCount={match.confirmedTradesCount}
          open={modalOpen}
          onOpenChange={setModalOpen}
        />
      )}
    </>
  );

  if (!isElite) {
    return cardWithModal;
  }

  return (
    <div
      className={cn(
        "rounded-2xl p-px shadow-sm",
        isFeatured
          ? "bg-gradient-to-br from-secondary/25 via-card to-primary/20"
          : "bg-gradient-to-br from-primary/25 via-card to-tertiary/20",
        className
      )}
    >
      <div className="rounded-[calc(1rem-1px)] bg-card">{cardWithModal}</div>
    </div>
  );
}
