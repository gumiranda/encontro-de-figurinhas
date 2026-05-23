"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { toast } from "sonner";
import { Lock, User } from "lucide-react";
import {
  canRecordUserPrediction,
  getPredictionLockReason,
} from "../../lib/match-state";
import { ScoreStepper } from "./score-stepper";

type Prediction = "home" | "draw" | "away";

interface PredictionFormProps {
  matchId: Id<"worldCupMatches">;
  homeTeam: string;
  awayTeam: string;
  kickoffAt: number;
  homeScore?: number;
  awayScore?: number;
  existingPrediction?: {
    prediction: Prediction;
    exactScore?: { home: number; away: number } | null;
  };
  onSuccess?: () => void;
}

function derivePrediction(home: number, away: number): Prediction {
  if (home > away) return "home";
  if (away > home) return "away";
  return "draw";
}

export function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  kickoffAt,
  homeScore: matchHomeScore,
  awayScore: matchAwayScore,
  existingPrediction,
  onSuccess,
}: PredictionFormProps) {
  const recordPrediction = useMutation(api.gepeto.recordUserPrediction);
  const [homeScore, setHomeScore] = useState(
    existingPrediction?.exactScore?.home ?? 0,
  );
  const [awayScore, setAwayScore] = useState(
    existingPrediction?.exactScore?.away ?? 0,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const match = {
    kickoffAt,
    homeScore: matchHomeScore,
    awayScore: matchAwayScore,
  };
  const canPredict = canRecordUserPrediction(match);
  const lockReason = getPredictionLockReason(match);
  const prediction = derivePrediction(homeScore, awayScore);

  const handleSubmit = async () => {
    if (!canPredict) {
      toast.error(lockReason ?? "Palpites fechados.");
      return;
    }

    setIsSubmitting(true);
    try {
      await recordPrediction({
        matchId,
        prediction,
        exactScore: { home: homeScore, away: awayScore },
      });
      toast.success("Palpite registrado!");
      onSuccess?.();
    } catch (e: any) {
      toast.error(e.message || "Erro ao registrar palpite");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="overflow-hidden rounded-2xl border-[#444b65] bg-[#172039] text-[#dfe5ff]">
      <div className="flex items-center gap-2 px-4 pt-4">
        <div className="flex size-8 items-center justify-center rounded-full bg-[#95aaff]/15">
          <User className="size-4 text-[#95aaff]" />
        </div>
        <span className="font-medium">Seu palpite</span>
      </div>

      <div className="flex items-center justify-center gap-5 px-4 py-6">
        <ScoreStepper
          value={homeScore}
          onChange={setHomeScore}
          disabled={!canPredict}
          className="text-[#dfe5ff]"
        />
        <span className="font-display text-3xl text-[#aeb4ca]">×</span>
        <ScoreStepper
          value={awayScore}
          onChange={setAwayScore}
          disabled={!canPredict}
          className="text-[#dfe5ff]"
        />
      </div>

      <div className="px-4 pb-4">
        {canPredict ? (
          <Button
            className="h-12 w-full gap-2 rounded-2xl bg-[#95aaff] text-base font-black text-[#082054] hover:bg-[#a9baff]"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            <Lock className="size-4" />
            {isSubmitting
              ? "Salvando..."
              : existingPrediction
                ? "Atualizar e enfrentar o Gepeto"
                : "Confirmar e enfrentar o Gepeto"}
          </Button>
        ) : (
          <div className="rounded-xl border border-[#444b65] bg-[#12192e]/70 px-4 py-3 text-center text-sm text-[#aeb4ca]">
            🔒 {lockReason}
          </div>
        )}
      </div>

      {!canPredict && existingPrediction?.exactScore ? (
        <p className="px-4 pb-4 text-center text-xs text-[#aeb4ca]">
          Você palpitou {existingPrediction.exactScore.home} ×{" "}
          {existingPrediction.exactScore.away} (
          {existingPrediction.prediction === "home"
            ? homeTeam
            : existingPrediction.prediction === "away"
              ? awayTeam
              : "Empate"}
          )
        </p>
      ) : null}
    </Card>
  );
}
