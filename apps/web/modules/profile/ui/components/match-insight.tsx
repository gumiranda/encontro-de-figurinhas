"use client";

import { Swords } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface MatchInsightProps {
  matchCount: number;
  distance: string;
  totalTrades: number;
  onView?: () => void;
}

export function MatchInsight({
  matchCount,
  distance,
  totalTrades,
  onView,
}: MatchInsightProps) {
  return (
    <div className="relative mb-4 overflow-hidden rounded-2xl border border-emerald-400/30 bg-gradient-to-r from-emerald-400/15 to-transparent p-4">
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-400/15 text-emerald-400">
          <Swords className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="font-display text-base font-semibold">
            <span className="text-emerald-400">{matchCount} matches</span> com você
          </div>
          <div className="mt-0.5 text-xs text-muted-foreground">
            {distance} de você · {totalTrades} trocas
          </div>
        </div>
        <Button
          variant="secondary"
          size="sm"
          className="bg-emerald-400 text-emerald-950 hover:bg-emerald-500"
          onClick={onView}
        >
          Ver
        </Button>
      </div>
    </div>
  );
}
