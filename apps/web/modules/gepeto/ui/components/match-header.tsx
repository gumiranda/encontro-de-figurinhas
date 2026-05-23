"use client";

import { MapPin } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

type MatchState = "preMatch" | "live" | "postMatch";

interface MatchHeaderProps {
  homeTeam: { name: string; code: string; flag: string; color?: string };
  awayTeam: { name: string; code: string; flag: string; color?: string };
  phase: string;
  date: string;
  stadium?: string;
  state: MatchState;
  timeToKickoff?: string;
  liveMinute?: number;
  liveHalf?: string;
  finalScore?: { home: number; away: number };
  className?: string;
}

export function MatchHeader({
  homeTeam,
  awayTeam,
  phase,
  date,
  stadium,
  state,
  timeToKickoff = "3h 12min",
  liveMinute,
  liveHalf = "1º TEMPO",
  finalScore,
  className,
}: MatchHeaderProps) {
  const isLive = state === "live";
  const isFinished = state === "postMatch";

  return (
    <div
      className={cn(
        "px-4 pt-4 pb-3 bg-gradient-to-b from-primary/5 to-transparent",
        className
      )}
    >
      {/* Phase + Status */}
      <div className="flex items-center justify-center gap-2 mb-2 flex-wrap">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          {phase.toUpperCase()}
        </span>
        <span className="w-[3px] h-[3px] rounded-full bg-border" />
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground whitespace-nowrap">
          {isLive ? "AO VIVO" : isFinished ? "ENCERRADO" : date.toUpperCase()}
        </span>
        {isLive && (
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
        )}
      </div>

      {/* Teams + Score */}
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-1 sm:gap-2">
        {/* Home Team */}
        <div className="min-w-0 text-center">
          <div className="text-4xl leading-none sm:text-[44px]">{homeTeam.flag}</div>
          <div
            className="mt-1.5 truncate font-display text-sm font-semibold sm:text-base"
            style={{ color: homeTeam.color }}
          >
            {homeTeam.code}
          </div>
          <div className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{homeTeam.name}</div>
        </div>

        {/* Center: Score or Countdown */}
        <div className="shrink-0 px-1 text-center whitespace-nowrap">
          {isFinished && finalScore ? (
            <div className="font-display text-4xl font-bold tracking-wide">
              {finalScore.home}
              <span className="text-muted-foreground mx-1">·</span>
              {finalScore.away}
            </div>
          ) : isLive ? (
            <>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                {liveHalf}
              </div>
              <div className="font-display text-2xl font-semibold mt-0.5">
                {liveMinute}'
              </div>
            </>
          ) : (
            <>
              <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                COMEÇA EM
              </div>
              <div className="font-display text-xl font-semibold mt-0.5">
                {timeToKickoff}
              </div>
            </>
          )}
        </div>

        {/* Away Team */}
        <div className="min-w-0 text-center">
          <div className="text-4xl leading-none sm:text-[44px]">{awayTeam.flag}</div>
          <div
            className="mt-1.5 truncate font-display text-sm font-semibold sm:text-base"
            style={{ color: awayTeam.color }}
          >
            {awayTeam.code}
          </div>
          <div className="truncate text-[10px] text-muted-foreground sm:text-[11px]">{awayTeam.name}</div>
        </div>
      </div>

      {/* Stadium */}
      {stadium && (
        <div className="mt-3 flex items-center justify-center gap-1.5 px-2 text-center text-[10px] text-muted-foreground sm:text-[11px]">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{stadium}</span>
        </div>
      )}
    </div>
  );
}
