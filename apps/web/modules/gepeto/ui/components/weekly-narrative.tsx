"use client";

import { useState } from "react";
import { ChevronRight, Users, Check, X, Share2 } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { GepetoAvatar } from "./gepeto-avatar";
import { cn } from "@workspace/ui/lib/utils";

interface MatchHighlight {
  matchup: string;
  gepetoPrediction: string;
  actualResult: string;
  gepetoGotIt: boolean;
  communityGotIt: boolean;
  gepetoVoice: string;
  reasoning: string[];
}

interface WeeklyNarrativeProps {
  weekNumber: number;
  phase: string;
  gepetoScore: number;
  communityScore: number;
  totalMatches: number;
  narrative: string;
  highlights: MatchHighlight[];
  topHumans?: Array<{ nickname: string; score: number; isMe?: boolean }>;
  onShare?: () => void;
}

function HighlightRow({
  highlight,
  expanded,
  onToggle,
}: {
  highlight: MatchHighlight;
  expanded: boolean;
  onToggle: () => void;
}) {
  const { matchup, gepetoPrediction, actualResult, gepetoGotIt, communityGotIt, gepetoVoice, reasoning } = highlight;

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/50 overflow-hidden">
      <button
        onClick={onToggle}
        className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-2.5 w-full px-3 py-2.5 text-left"
      >
        <div className="font-mono text-xs font-semibold">{matchup}</div>
        <div className="font-mono text-[11px] text-muted-foreground">
          final <span className="text-foreground font-bold">{actualResult}</span>
        </div>
        <div
          className={cn(
            "px-1.5 py-0.5 rounded font-mono text-[10px] font-bold",
            gepetoGotIt
              ? "bg-emerald-400/20 text-emerald-400"
              : "bg-red-400/15 text-red-400"
          )}
        >
          G {gepetoPrediction}
        </div>
        <div
          className={cn(
            "w-[18px] h-[18px] rounded-full flex items-center justify-center",
            communityGotIt
              ? "bg-emerald-400/20 text-emerald-400"
              : "bg-red-400/15 text-red-400"
          )}
        >
          {communityGotIt ? (
            <Check className="h-2.5 w-2.5" />
          ) : (
            <X className="h-2.5 w-2.5" />
          )}
        </div>
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform",
            expanded && "rotate-90"
          )}
        />
      </button>

      {expanded && (
        <div className="px-3 py-2.5 border-t border-slate-700 bg-slate-950/40">
          <div className="flex gap-2 mb-2.5 items-start">
            <GepetoAvatar
              size={28}
              mood={gepetoGotIt ? "smug" : "angry"}
              glow={false}
            />
            <div className="flex-1 text-xs leading-relaxed italic">
              "{gepetoVoice}"
            </div>
          </div>

          <div
            className={cn(
              "font-mono text-[9px] font-bold uppercase tracking-widest mb-1.5",
              gepetoGotIt ? "text-emerald-400" : "text-red-400"
            )}
          >
            POR QUE {gepetoGotIt ? "ACERTOU" : "ERROU"}
          </div>

          <div className="space-y-1">
            {reasoning.map((r, i) => (
              <div key={i} className="flex gap-1.5 items-start text-xs leading-relaxed">
                <span
                  className={cn(
                    "font-bold shrink-0",
                    gepetoGotIt ? "text-emerald-400" : "text-red-400"
                  )}
                >
                  {gepetoGotIt ? "✓" : "✕"}
                </span>
                <span>{r}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function WeeklyNarrative({
  weekNumber,
  phase,
  gepetoScore,
  communityScore,
  totalMatches,
  narrative,
  highlights,
  topHumans,
  onShare,
}: WeeklyNarrativeProps) {
  const [expandedIndex, setExpandedIndex] = useState(0);
  const gepetoAhead = gepetoScore > communityScore;

  return (
    <div className="space-y-3.5">
      {/* Hero Card */}
      <Card className="p-0 overflow-hidden border-primary/20 bg-gradient-to-br from-slate-800/80 to-slate-900">
        <div className="px-4 pt-4 text-center">
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
            CAPÍTULO {String(weekNumber).padStart(2, "0")} · {phase.toUpperCase()}
          </div>
          <div className="flex justify-center mt-3.5">
            <GepetoAvatar size={84} mood={gepetoAhead ? "smug" : "angry"} />
          </div>
          <div className="font-display text-2xl font-bold mt-3">
            {gepetoAhead ? "Gepeto na liderança" : "Humanos resistem"}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Semana {weekNumber} de 7 · {totalMatches} jogos
          </div>
        </div>

        {/* Scoreboard */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3.5 mx-4 mt-4 p-3.5 rounded-xl border border-slate-700 bg-slate-950/55">
          <div className="text-center">
            <GepetoAvatar
              size={32}
              mood={gepetoAhead ? "smug" : "neutral"}
              glow={false}
            />
            <div
              className={cn(
                "font-display text-4xl font-bold mt-1.5 tracking-tight",
                gepetoAhead ? "text-amber-400" : "text-foreground"
              )}
            >
              {gepetoScore}
            </div>
            <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
              GEPETO
            </div>
          </div>

          <div className="font-display text-xl text-muted-foreground">×</div>

          <div className="text-center">
            <div className="w-8 h-8 rounded-full bg-slate-800 text-primary mx-auto flex items-center justify-center">
              <Users className="h-4 w-4" />
            </div>
            <div
              className={cn(
                "font-display text-4xl font-bold mt-1.5 tracking-tight",
                !gepetoAhead ? "text-emerald-400" : "text-foreground"
              )}
            >
              {communityScore}
            </div>
            <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground mt-1">
              HUMANOS
            </div>
          </div>
        </div>

        {/* Narrative Quote */}
        <div className="mx-4 mt-3.5 mb-4 p-3 rounded-xl border border-dashed border-amber-400/35 bg-amber-400/5">
          <span className="font-display text-3xl leading-none text-amber-400/45 mr-1 align-[-8px]">
            "
          </span>
          <span className="text-sm leading-relaxed italic">{narrative}</span>
        </div>
      </Card>

      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-sm font-semibold">Destaques da semana</h3>
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
            {highlights.length} JOGOS
          </span>
        </div>
        <div className="space-y-2">
          {highlights.map((h, i) => (
            <HighlightRow
              key={i}
              highlight={h}
              expanded={expandedIndex === i}
              onToggle={() => setExpandedIndex(expandedIndex === i ? -1 : i)}
            />
          ))}
        </div>
      </div>

      {/* Top Humans */}
      {topHumans && topHumans.length > 0 && (
        <Card className="p-3.5 border-slate-700">
          <div className="font-display text-sm font-semibold mb-2">
            Top humanos da semana
          </div>
          <div className="space-y-2">
            {topHumans.map((h, i) => (
              <div
                key={i}
                className={cn(
                  "flex items-center justify-between px-2.5 py-2 rounded-lg",
                  h.isMe && "bg-primary/10 border border-primary/20"
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-muted-foreground w-4">
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium">
                    @{h.nickname}
                    {h.isMe && (
                      <span className="ml-1.5 text-[10px] text-primary font-bold">
                        (você)
                      </span>
                    )}
                  </span>
                </div>
                <span className="font-mono text-sm font-bold text-emerald-400">
                  {h.score} pts
                </span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Share */}
      {onShare && (
        <Button variant="outline" className="w-full gap-1.5" onClick={onShare}>
          <Share2 className="h-4 w-4" />
          Compartilhar capítulo
        </Button>
      )}
    </div>
  );
}
