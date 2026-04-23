"use client";

import type { ListMyMatchRow } from "@workspace/backend/convex/matches";

import { MatchCard } from "./match-card";

export type MatchCardEliteProps = {
  match: ListMyMatchRow;
  className?: string;
};

/** Gradient frame + larger avatar; same data as {@link MatchCard}. */
export function MatchCardElite({ match, className }: MatchCardEliteProps) {
  return <MatchCard match={match} variant="elite" className={className} />;
}
