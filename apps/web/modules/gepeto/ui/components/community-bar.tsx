"use client";

import { Card } from "@workspace/ui/components/card";
import { GepetoAvatar } from "./gepeto-avatar";

interface CommunityBarProps {
  homePercent: number;
  drawPercent: number;
  awayPercent: number;
  homeFlag: string;
  awayFlag: string;
  homeColor?: string;
  awayColor?: string;
  totalPredictions?: number;
  className?: string;
}

export function CommunityBar({
  homePercent,
  drawPercent,
  awayPercent,
  homeFlag,
  awayFlag,
  homeColor = "#3b82f6",
  awayColor = "#ef4444",
  totalPredictions = 0,
  className,
}: CommunityBarProps) {
  const formatCount = (n: number) => {
    if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
    return n.toString();
  };

  const gepetoAgreesWith =
    homePercent > 45
      ? `${homePercent}%`
      : awayPercent > 45
        ? `${awayPercent}%`
        : "a minoria";

  return (
    <Card className={`p-3.5 border-slate-700 ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <div className="font-display text-sm font-semibold">
          O que a galera acha
        </div>
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {formatCount(totalPredictions)} PALPITES
        </span>
      </div>

      <div className="flex h-8 rounded-lg overflow-hidden bg-slate-800/50">
        <div
          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white"
          style={{
            width: `${homePercent}%`,
            background: `linear-gradient(135deg, ${homeColor}90, ${homeColor}50)`,
          }}
        >
          {homePercent >= 15 && (
            <>
              {homeFlag} {homePercent}%
            </>
          )}
        </div>
        <div
          className="flex items-center justify-center text-[11px] font-bold text-foreground bg-slate-600"
          style={{ width: `${drawPercent}%` }}
        >
          {drawPercent >= 10 && `=${drawPercent}%`}
        </div>
        <div
          className="flex items-center justify-center gap-1.5 text-[11px] font-bold text-white"
          style={{
            width: `${awayPercent}%`,
            background: `linear-gradient(135deg, ${awayColor}90, ${awayColor}50)`,
          }}
        >
          {awayPercent >= 15 && (
            <>
              {awayPercent}% {awayFlag}
            </>
          )}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-muted-foreground flex items-center gap-1.5">
        <GepetoAvatar size={20} mood="neutral" glow={false} />
        Gepeto concorda com {gepetoAgreesWith} da galera nessa.
      </div>
    </Card>
  );
}
