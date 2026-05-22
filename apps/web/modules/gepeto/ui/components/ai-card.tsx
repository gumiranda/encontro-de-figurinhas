"use client";

import { useEffect, useRef } from "react";
import { Bot, Sparkles } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { celebrateMilestone } from "@/components/delight/celebrate-toast";
import { ConfidenceMeter } from "./confidence-meter";
import { ReasoningCard } from "./reasoning-card";

interface AICardProps {
  homeTeam: string;
  awayTeam: string;
  prediction: "home" | "draw" | "away";
  exactScore: { home: number; away: number };
  confidence: number;
  reasoning: string[];
  trashTalk?: string;
  hasBadge?: boolean;
  matchId: string;
  isRevealed?: boolean;
}

export function AICard({
  homeTeam,
  awayTeam,
  prediction,
  exactScore,
  confidence,
  reasoning,
  trashTalk,
  hasBadge,
  matchId,
  isRevealed = true,
}: AICardProps) {
  const celebratedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (hasBadge && !celebratedRef.current.has(matchId)) {
      celebratedRef.current.add(matchId);
      celebrateMilestone("beatAI");
    }
  }, [hasBadge, matchId]);

  const predictionText = {
    home: homeTeam,
    draw: "Empate",
    away: awayTeam,
  }[prediction];

  const scoreText = `${exactScore.home} x ${exactScore.away}`;

  return (
    <Card className="relative overflow-hidden p-6 glass-ethereal">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5 text-primary animate-glow-pulse" />
        <span className="font-semibold text-primary">Gepeto previu</span>
        {hasBadge && (
          <Badge variant="default" className="ml-auto animate-bounce-in bg-amber-500">
            <Sparkles className="h-3 w-3 mr-1" />
            Você venceu!
          </Badge>
        )}
      </div>

      {isRevealed ? (
        <>
          <div className="text-2xl font-bold mb-1">{predictionText}</div>
          <div className="text-lg text-muted-foreground mb-3">{scoreText}</div>
          <ConfidenceMeter value={confidence} />

          {trashTalk && (
            <p className="mt-4 text-sm text-muted-foreground italic border-l-2 border-primary/30 pl-3">
              "{trashTalk}"
            </p>
          )}

          <ReasoningCard reasoning={reasoning} className="mt-4" />
        </>
      ) : (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🔒</div>
          <p className="text-muted-foreground">Palpite lacrado até o início do jogo</p>
        </div>
      )}
    </Card>
  );
}
