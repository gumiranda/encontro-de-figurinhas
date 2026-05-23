"use client";

import Link from "next/link";
import { Clock, Zap, ChevronRight } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { GepetoAvatar } from "./gepeto-avatar";
import { cn } from "@workspace/ui/lib/utils";

interface NextMatchCardProps {
  matchId: string;
  homeTeam: { name: string; code: string; flag: string };
  awayTeam: { name: string; code: string; flag: string };
  phase: string;
  stadium: string;
  timeToKickoff: string;
  gepetoAccuracy: number;
  userAccuracy: number;
  userInitials?: string;
  className?: string;
}

export function NextMatchCard({
  matchId,
  homeTeam,
  awayTeam,
  phase,
  stadium,
  timeToKickoff,
  gepetoAccuracy,
  userAccuracy,
  userInitials = "EU",
  className,
}: NextMatchCardProps) {
  return (
    <Card
      className={cn(
        "p-0 overflow-hidden border-primary/20 bg-gradient-to-br from-slate-800/90 to-slate-900",
        className
      )}
    >
      <div className="relative p-4">
        {/* Background grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(149,170,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(149,170,255,0.3) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
              PRÓXIMO DUELO
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-400/15 text-amber-400">
              <Clock className="h-3 w-3" />
              <span className="font-mono text-xs font-bold">{timeToKickoff}</span>
            </div>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-center gap-6 mb-3">
            <div className="text-center">
              <div className="text-4xl mb-1">{homeTeam.flag}</div>
              <div className="font-display text-sm font-semibold">
                {homeTeam.code}
              </div>
            </div>

            <div className="font-display text-lg text-muted-foreground">vs</div>

            <div className="text-center">
              <div className="text-4xl mb-1">{awayTeam.flag}</div>
              <div className="font-display text-sm font-semibold">
                {awayTeam.code}
              </div>
            </div>
          </div>

          {/* Phase + Stadium */}
          <div className="text-center text-xs text-muted-foreground mb-4">
            {phase} · {stadium}
          </div>

          {/* Accuracy comparison */}
          <div className="flex items-center justify-center gap-4 p-3 rounded-xl border border-slate-700 bg-slate-950/50 mb-4">
            {/* Gepeto */}
            <div className="flex items-center gap-2.5">
              <GepetoAvatar size={36} mood="neutral" glow={false} />
              <div>
                <div className="text-xs text-muted-foreground">Gepeto</div>
                <div className="font-display text-lg font-bold text-primary">
                  {gepetoAccuracy}%
                </div>
                <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                  ACERTOS
                </div>
              </div>
            </div>

            <div className="text-muted-foreground">×</div>

            {/* User */}
            <div className="flex items-center gap-2.5">
              <div>
                <div className="text-xs text-muted-foreground text-right">
                  Você
                </div>
                <div className="font-display text-lg font-bold text-emerald-400 text-right">
                  {userAccuracy}%
                </div>
                <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground text-right">
                  ACERTOS
                </div>
              </div>
              <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-display text-sm font-bold">
                {userInitials}
              </div>
            </div>
          </div>

          {/* CTA */}
          <Button asChild className="w-full gap-2 h-12">
            <Link href={`/gepeto/matches/${matchId}`}>
              <Zap className="h-4 w-4" />
              Ir para o duelo
            </Link>
          </Button>

          {/* All matches link */}
          <Link
            href="/gepeto/jogos"
            className="flex items-center justify-center gap-1 mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Ver todos os jogos da Copa
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </Card>
  );
}
