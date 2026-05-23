"use client";

import Link from "next/link";
import { ChevronRight, Users } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { GepetoAvatar } from "./gepeto-avatar";
import { cn } from "@workspace/ui/lib/utils";

interface WeeklyPreviewProps {
  weekNumber: number;
  phase: string;
  gepetoScore: number;
  communityScore: number;
  totalMatches: number;
  className?: string;
}

export function WeeklyPreview({
  weekNumber,
  phase,
  gepetoScore,
  communityScore,
  totalMatches,
  className,
}: WeeklyPreviewProps) {
  const gepetoAhead = gepetoScore > communityScore;

  return (
    <Card className={cn("p-4 border-slate-700", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="font-display text-sm font-semibold">
          Capítulo {weekNumber} · {phase}
        </div>
        <Link
          href={`/gepeto/semana-${weekNumber}`}
          className="flex items-center gap-0.5 text-xs text-primary hover:underline"
        >
          Ler capítulo
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Gepeto */}
        <div
          className={cn(
            "p-3 rounded-xl border",
            gepetoAhead
              ? "border-amber-400/30 bg-amber-400/5"
              : "border-slate-700 bg-slate-800/30"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <GepetoAvatar size={20} mood="neutral" glow={false} />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              GEPETO
            </span>
          </div>
          <div className="font-display">
            <span
              className={cn(
                "text-3xl font-bold",
                gepetoAhead ? "text-amber-400" : "text-foreground"
              )}
            >
              {gepetoScore}
            </span>
            <span className="text-lg text-muted-foreground">/{totalMatches}</span>
          </div>
        </div>

        {/* Humanos */}
        <div
          className={cn(
            "p-3 rounded-xl border",
            !gepetoAhead
              ? "border-emerald-400/30 bg-emerald-400/5"
              : "border-slate-700 bg-slate-800/30"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              HUMANOS
            </span>
          </div>
          <div className="font-display">
            <span
              className={cn(
                "text-3xl font-bold",
                !gepetoAhead ? "text-emerald-400" : "text-foreground"
              )}
            >
              {communityScore}
            </span>
            <span className="text-lg text-muted-foreground">/{totalMatches}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
