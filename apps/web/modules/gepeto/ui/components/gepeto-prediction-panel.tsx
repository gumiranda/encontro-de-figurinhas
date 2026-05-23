"use client";

import { Lock } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { GepetoAvatar } from "./gepeto-avatar";
import { ConfidenceMeter } from "./confidence-meter";
import { ReasoningCard } from "./reasoning-card";

type PredictionChoice = "home" | "draw" | "away";

interface GepetoPredictionPanelProps {
  matchId: string;
  homeTeam: string;
  awayTeam: string;
  isRevealed: boolean;
  hasPrediction?: boolean;
  hasUserPrediction?: boolean;
  prediction?: PredictionChoice | null;
  exactScore?: { home: number; away: number } | null;
  confidence?: number;
  reasoning?: string[];
  trashTalk?: string;
  generatedAt?: number;
  sealHash?: string;
  className?: string;
}

function choiceLabel(
  homeTeam: string,
  awayTeam: string,
  choice: PredictionChoice,
) {
  if (choice === "home") return homeTeam;
  if (choice === "away") return awayTeam;
  return "Empate";
}

function buildSealHash(matchId: string, generatedAt?: number) {
  const raw = `${matchId}:${generatedAt ?? 0}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i += 1) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(12, "0");
  return `${hex.slice(0, 6)}...${hex.slice(-4)}`;
}

export function GepetoPredictionPanel({
  matchId,
  homeTeam,
  awayTeam,
  isRevealed,
  hasPrediction = false,
  hasUserPrediction = false,
  prediction,
  exactScore,
  confidence,
  reasoning = [],
  trashTalk,
  generatedAt,
  sealHash,
  className,
}: GepetoPredictionPanelProps) {
  const showPrediction = isRevealed && prediction && exactScore;

  return (
    <Card
      className={cn(
        "relative overflow-hidden rounded-xl border-border bg-card p-4",
        className,
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(149,170,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(149,170,255,0.35) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-3">
          <GepetoAvatar size={52} mood={showPrediction ? "smug" : "thinking"} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-display text-lg font-bold">Gepeto</span>
              <Badge variant="secondary" className="rounded-full px-2 py-0 text-[10px]">
                IA
              </Badge>
              <Badge
                variant="outline"
                className="rounded-full border-amber-400/40 px-2 py-0 text-[10px] text-amber-400"
              >
                NV 7
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground">Oponente da rodada</p>
          </div>
        </div>

        {showPrediction ? (
          <div className="mt-4 space-y-4">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
                Palpite revelado
              </p>
              <p className="font-display text-2xl font-black">
                {choiceLabel(homeTeam, awayTeam, prediction)}
              </p>
              <p className="font-display text-xl text-muted-foreground">
                {exactScore.home} × {exactScore.away}
              </p>
            </div>
            {confidence !== undefined ? (
              <ConfidenceMeter value={confidence} />
            ) : null}
            {trashTalk ? (
              <p className="border-l-2 border-primary/30 pl-3 text-sm italic text-muted-foreground">
                &ldquo;{trashTalk}&rdquo;
              </p>
            ) : null}
            {reasoning.length > 0 ? <ReasoningCard reasoning={reasoning} /> : null}
          </div>
        ) : hasPrediction ? (
          <div
            className="relative mt-4 overflow-hidden rounded-xl border border-dashed border-amber-400/45 bg-amber-400/[0.04] p-4"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, rgba(251,191,36,0.06) 0, rgba(251,191,36,0.06) 1px, transparent 1px, transparent 10px)",
            }}
          >
            <Badge className="gap-1 rounded-full bg-amber-400/15 text-amber-300 hover:bg-amber-400/15">
              <Lock className="size-3" />
              PALPITE LACRADO
            </Badge>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              {hasUserPrediction
                ? "Gepeto já cravou o palpite dele. O placar abre no apito inicial."
                : "Gepeto já gravou o palpite dele. Mande o seu primeiro pra ver o que ele cravou."}
            </p>
            <p className="mt-3 font-mono text-[10px] text-muted-foreground/80">
              SHA-256: {sealHash ?? buildSealHash(matchId, generatedAt)}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Gepeto ainda não analisou este jogo.
          </p>
        )}
      </div>
    </Card>
  );
}
