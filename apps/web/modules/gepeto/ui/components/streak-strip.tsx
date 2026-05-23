"use client";

import { Flame, X } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface DayResult {
  day: string;
  played: boolean;
  beatAI: boolean;
  isToday?: boolean;
}

interface StreakStripProps {
  days: DayResult[];
  currentStreak: number;
  streakBadgeThreshold?: number;
  streakBadgeName?: string;
  className?: string;
}

export function StreakStrip({
  days,
  currentStreak,
  streakBadgeThreshold = 7,
  streakBadgeName = "Cassetete",
  className,
}: StreakStripProps) {
  return (
    <Card className={cn("p-3.5 border-slate-700", className)}>
      <div className="flex justify-between items-center mb-2.5">
        <div className="font-display text-sm font-semibold flex items-center gap-1.5">
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          Streak vs Gepeto
        </div>
        <div className="font-mono text-sm font-bold text-amber-400">
          {currentStreak}🔥
        </div>
      </div>

      <div
        className="grid gap-1.5"
        style={{ gridTemplateColumns: `repeat(${days.length}, 1fr)` }}
      >
        {days.map((d, i) => (
          <div
            key={i}
            className={cn(
              "aspect-[1/1.2] rounded-lg flex flex-col items-center justify-center gap-0.5",
              "font-mono text-[10px] font-bold",
              d.isToday && "border border-dashed border-primary bg-transparent",
              !d.isToday && d.beatAI && "border border-emerald-400 bg-gradient-to-br from-emerald-400/25 to-amber-400/20",
              !d.isToday && d.played && !d.beatAI && "border border-slate-700 bg-slate-800/50",
              !d.isToday && !d.played && !d.beatAI && "border border-slate-700/50 bg-transparent"
            )}
            style={{
              color: d.isToday
                ? "hsl(var(--primary))"
                : d.beatAI
                  ? "hsl(var(--secondary))"
                  : "hsl(var(--muted-foreground))",
            }}
          >
            <span>{d.day}</span>
            {d.beatAI && <Flame className="h-3 w-3 text-amber-400" />}
            {!d.beatAI && d.played && <X className="h-2.5 w-2.5 text-muted-foreground" />}
            {d.isToday && (
              <span className="text-[7px] tracking-widest">HOJE</span>
            )}
          </div>
        ))}
      </div>

      <div className="text-[11px] text-muted-foreground mt-2.5">
        Palpita hoje pra manter sua sequência. Bata {streakBadgeThreshold} e ganha o badge{" "}
        <strong className="text-amber-400">{streakBadgeName}</strong>.
      </div>
    </Card>
  );
}
