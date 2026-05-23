"use client";

import { Share2, ChevronRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { GepetoAvatar } from "./gepeto-avatar";
import { cn } from "@workspace/ui/lib/utils";

interface ScoreSliceProps {
  label: string;
  who: "user" | "gepeto";
  home: number;
  away: number;
  exact: boolean;
  winner: boolean;
  pts: number;
  isWinner: boolean;
  userInitials?: string;
}

function ScoreSlice({
  label,
  who,
  home,
  away,
  exact,
  winner,
  pts,
  isWinner,
  userInitials = "EU",
}: ScoreSliceProps) {
  return (
    <div
      className={cn(
        "py-3 px-2.5 text-center relative",
        who === "user" && "border-r border-slate-700",
        isWinner && "bg-primary/5"
      )}
    >
      {who === "gepeto" ? (
        <div className="flex justify-center mb-1">
          <GepetoAvatar size={28} mood={isWinner ? "smug" : "angry"} glow={false} />
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground mx-auto mb-1 flex items-center justify-center font-display text-sm font-bold">
          {userInitials}
        </div>
      )}
      <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div
        className={cn(
          "font-display text-2xl font-bold mt-1 tracking-wide",
          isWinner ? "text-emerald-400" : "text-foreground"
        )}
      >
        {home}-{away}
      </div>
      <div className="text-[10px] text-muted-foreground mt-0.5">
        {exact ? "Cravou o placar" : winner ? "Acertou o vencedor" : "Errou"}
      </div>
      <div
        className={cn(
          "font-mono text-sm mt-1 font-bold",
          isWinner ? "text-emerald-400" : "text-muted-foreground"
        )}
      >
        +{pts} pts
      </div>
    </div>
  );
}

interface VerdictBannerProps {
  userPrediction: { home: number; away: number };
  gepetoPrediction: { home: number; away: number };
  actualResult: { home: number; away: number };
  userInitials?: string;
  onShare?: () => void;
  onNext?: () => void;
}

export function VerdictBanner({
  userPrediction,
  gepetoPrediction,
  actualResult,
  userInitials = "EU",
  onShare,
  onNext,
}: VerdictBannerProps) {
  const userExact =
    userPrediction.home === actualResult.home &&
    userPrediction.away === actualResult.away;
  const gepetoExact =
    gepetoPrediction.home === actualResult.home &&
    gepetoPrediction.away === actualResult.away;

  const userGotWinner =
    (userPrediction.home > userPrediction.away) ===
    (actualResult.home > actualResult.away);
  const gepetoGotWinner =
    (gepetoPrediction.home > gepetoPrediction.away) ===
    (actualResult.home > actualResult.away);

  const userPts = userExact ? 25 : userGotWinner ? 10 : 0;
  const gepetoPts = gepetoExact ? 25 : gepetoGotWinner ? 10 : 0;
  const userWon = userPts > gepetoPts;

  return (
    <Card className="overflow-hidden border-slate-700 mb-3.5">
      <div
        className={cn(
          "absolute inset-0 -z-10",
          userWon
            ? "bg-gradient-to-br from-emerald-400/25 via-transparent to-transparent"
            : "bg-gradient-to-br from-red-400/20 via-transparent to-transparent"
        )}
      />

      <div className="px-4 pt-4 pb-3">
        <div
          className={cn(
            "font-mono text-xs font-bold uppercase tracking-widest",
            userWon ? "text-emerald-400" : "text-red-400"
          )}
        >
          {userWon ? "🏆 VOCÊ BATEU A IA" : "GEPETO PASSOU"}
        </div>
        <div
          className={cn(
            "font-display text-xl font-semibold mt-1",
            userWon ? "text-emerald-400" : "text-foreground"
          )}
        >
          {userWon
            ? "Mostrou pro robô como se palpita."
            : "Ele te pegou nessa, mas a volta tá engatilhada."}
        </div>
      </div>

      <div className="grid grid-cols-2 mx-4 mb-3.5 rounded-xl border border-slate-700 bg-slate-950/50 overflow-hidden">
        <ScoreSlice
          label="VOCÊ"
          who="user"
          home={userPrediction.home}
          away={userPrediction.away}
          exact={userExact}
          winner={userGotWinner}
          pts={userPts}
          isWinner={userWon}
          userInitials={userInitials}
        />
        <ScoreSlice
          label="GEPETO"
          who="gepeto"
          home={gepetoPrediction.home}
          away={gepetoPrediction.away}
          exact={gepetoExact}
          winner={gepetoGotWinner}
          pts={gepetoPts}
          isWinner={!userWon}
        />
      </div>

      <div className="flex gap-2 px-3.5 pb-3.5">
        <Button
          variant="secondary"
          size="sm"
          className="flex-1 gap-1.5"
          onClick={onShare}
        >
          <Share2 className="h-3.5 w-3.5" />
          {userWon ? "Postar vitória" : "Postar revanche"}
        </Button>
        {onNext && (
          <Button variant="outline" size="sm" className="px-3.5" onClick={onNext}>
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </Card>
  );
}
