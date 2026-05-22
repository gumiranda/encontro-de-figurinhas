"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { toast } from "sonner";
import { Target } from "lucide-react";

type Prediction = "home" | "draw" | "away";

interface PredictionFormProps {
  matchId: Id<"worldCupMatches">;
  homeTeam: string;
  awayTeam: string;
  kickoffAt: number;
  existingPrediction?: {
    prediction: Prediction;
    exactScore?: { home: number; away: number } | null;
  };
  onSuccess?: () => void;
}

export function PredictionForm({
  matchId,
  homeTeam,
  awayTeam,
  kickoffAt,
  existingPrediction,
  onSuccess,
}: PredictionFormProps) {
  const recordPrediction = useMutation(api.gepeto.recordUserPrediction);
  const [prediction, setPrediction] = useState<Prediction | null>(
    existingPrediction?.prediction ?? null
  );
  const [homeScore, setHomeScore] = useState(
    existingPrediction?.exactScore?.home ?? 0
  );
  const [awayScore, setAwayScore] = useState(
    existingPrediction?.exactScore?.away ?? 0
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLocked = kickoffAt <= Date.now();

  const handleSubmit = async () => {
    if (!prediction) {
      toast.error("Selecione um palpite");
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

  if (isLocked) {
    return (
      <Card className="p-4 bg-muted/50">
        <p className="text-sm text-muted-foreground text-center">
          🔒 Palpites fechados - jogo em andamento
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <Target className="h-4 w-4 text-primary" />
        <span>Seu palpite</span>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Button
          variant={prediction === "home" ? "default" : "outline"}
          className={cn(prediction === "home" && "ring-2 ring-primary")}
          onClick={() => setPrediction("home")}
        >
          {homeTeam}
        </Button>
        <Button
          variant={prediction === "draw" ? "default" : "outline"}
          className={cn(prediction === "draw" && "ring-2 ring-primary")}
          onClick={() => setPrediction("draw")}
        >
          Empate
        </Button>
        <Button
          variant={prediction === "away" ? "default" : "outline"}
          className={cn(prediction === "away" && "ring-2 ring-primary")}
          onClick={() => setPrediction("away")}
        >
          {awayTeam}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2">
        <Input
          type="number"
          min={0}
          max={20}
          className="w-16 text-center"
          value={homeScore}
          onChange={(e) => setHomeScore(Math.max(0, parseInt(e.target.value) || 0))}
        />
        <span className="font-bold">x</span>
        <Input
          type="number"
          min={0}
          max={20}
          className="w-16 text-center"
          value={awayScore}
          onChange={(e) => setAwayScore(Math.max(0, parseInt(e.target.value) || 0))}
        />
      </div>

      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={isSubmitting || !prediction}
      >
        {isSubmitting ? "Salvando..." : existingPrediction ? "Atualizar palpite" : "Registrar palpite"}
      </Button>
    </Card>
  );
}
