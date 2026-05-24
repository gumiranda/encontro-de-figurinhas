"use client";

import { useEffect, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { Pill, PillIndicator } from "@workspace/ui/components/kibo-ui/pill";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { toast } from "sonner";
import { Check, Lock, User } from "lucide-react";
import {
  canRecordUserPrediction,
  getPredictionLockReason,
} from "../../lib/match-state";
import { getGepetoToastError } from "../../lib/toast-errors";
import { ScoreStepper } from "./score-stepper";

type Prediction = "home" | "draw" | "away";
type ConfirmedPrediction = {
  prediction: Prediction;
  exactScore?: { home: number; away: number } | null;
} | null;

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

function predictionLabel(
  homeTeam: string,
  awayTeam: string,
  prediction: Prediction,
) {
  if (prediction === "home") return homeTeam;
  if (prediction === "away") return awayTeam;
  return "Empate";
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
  const [confirmedPrediction, setConfirmedPrediction] =
    useState<ConfirmedPrediction>(existingPrediction ?? null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const match = {
    kickoffAt,
    homeScore: matchHomeScore,
    awayScore: matchAwayScore,
  };
  const canPredict = canRecordUserPrediction(match);
  const lockReason = getPredictionLockReason(match);
  const controlsDisabled = !canPredict || isSubmitting;
  const existingPredictionChoice = existingPrediction?.prediction;
  const existingPredictionHome = existingPrediction?.exactScore?.home;
  const existingPredictionAway = existingPrediction?.exactScore?.away;

  useEffect(() => {
    if (isSubmitting) return;

    const exactScore =
      existingPredictionHome !== undefined &&
      existingPredictionAway !== undefined
        ? { home: existingPredictionHome, away: existingPredictionAway }
        : null;

    setConfirmedPrediction(
      existingPredictionChoice
        ? { prediction: existingPredictionChoice, exactScore }
        : null,
    );
    if (exactScore) {
      setHomeScore(exactScore.home);
      setAwayScore(exactScore.away);
    }
  }, [
    existingPredictionChoice,
    existingPredictionHome,
    existingPredictionAway,
    isSubmitting,
  ]);

  const handleSubmit = async () => {
    if (isSubmitting) return;
    if (!canPredict) {
      toast.error(lockReason ?? "Palpites fechados.");
      return;
    }

    const nextScore = { home: homeScore, away: awayScore };
    const nextPrediction = derivePrediction(nextScore.home, nextScore.away);

    setIsSubmitting(true);
    try {
      await recordPrediction({
        matchId,
        prediction: nextPrediction,
        exactScore: nextScore,
      });
      setConfirmedPrediction({
        prediction: nextPrediction,
        exactScore: nextScore,
      });
      toast.success("Palpite registrado!");
      onSuccess?.();
    } catch (error: unknown) {
      toast.error(
        getGepetoToastError(error, "Não foi possível registrar seu palpite."),
      );
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
        {confirmedPrediction ? (
          <Pill className="ml-auto border-[#4ff325]/30 bg-[#4ff325]/10 text-[#b9ff9f]">
            <PillIndicator variant="success" />
            Salvo
          </Pill>
        ) : null}
      </div>

      <div className="flex items-center justify-center gap-3 px-2 py-6 sm:gap-5 sm:px-4">
        <ScoreStepper
          value={homeScore}
          onChange={setHomeScore}
          disabled={controlsDisabled}
          className="text-[#dfe5ff]"
        />
        <span className="font-display text-2xl text-[#aeb4ca] sm:text-3xl">
          ×
        </span>
        <ScoreStepper
          value={awayScore}
          onChange={setAwayScore}
          disabled={controlsDisabled}
          className="text-[#dfe5ff]"
        />
      </div>

      {confirmedPrediction ? (
        <div className="px-4 pb-4">
          <div className="rounded-xl border border-[#95aaff]/35 bg-[#95aaff]/10 px-4 py-3 text-sm">
            <div className="flex items-center gap-2 font-black text-[#dfe5ff]">
              <Check className="size-4 text-[#4ff325]" />
              Palpite salvo
            </div>
            <p className="mt-1 text-[#aeb4ca]">
              Seu palpite:{" "}
              {confirmedPrediction.exactScore
                ? `${confirmedPrediction.exactScore.home} × ${confirmedPrediction.exactScore.away}, `
                : ""}
              {predictionLabel(
                homeTeam,
                awayTeam,
                confirmedPrediction.prediction,
              )}
            </p>
          </div>
        </div>
      ) : null}

      <div className="px-4 pb-4">
        {canPredict ? (
          <Button
            className="h-12 w-full gap-2 rounded-2xl bg-[#95aaff] px-3 text-sm font-black text-[#082054] hover:bg-[#a9baff] sm:text-base"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner className="size-4" />
            ) : (
              <Lock className="size-4" />
            )}
            {isSubmitting
              ? "Salvando..."
              : confirmedPrediction
                ? "Atualizar e enfrentar o Gepeto"
                : "Confirmar e enfrentar o Gepeto"}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl border border-[#444b65] bg-[#12192e]/70 px-4 py-3 text-center text-sm text-[#aeb4ca]">
            <Lock className="size-4" />
            {lockReason}
          </div>
        )}
      </div>
    </Card>
  );
}
