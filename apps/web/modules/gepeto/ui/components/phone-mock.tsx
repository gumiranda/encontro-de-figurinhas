"use client";

import { Lock, Share2, Sparkles, Zap } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { GepetoAvatar } from "./gepeto-avatar";

type ScreenType = "card" | "analysis" | "verdict" | "weekly";

interface PhoneMockProps {
  screen?: ScreenType;
}

function PhoneCardScreen() {
  return (
    <div className="flex h-full flex-col px-3.5 pb-3.5 pt-8">
      <div className="text-center font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
        QUARTAS · HOJE 21h
      </div>

      <div className="relative mt-3.5 overflow-hidden rounded-2xl border border-slate-700 bg-gradient-to-br from-slate-800/90 to-slate-900 p-3.5">
        <div className="flex items-center gap-2.5">
          <GepetoAvatar size={36} mood="smug" />
          <div className="flex-1">
            <div className="font-display text-sm">Gepeto</div>
            <div className="text-[9px] text-muted-foreground">
              74% acertos · NV 7
            </div>
          </div>
          <div className="text-right">
            <div className="font-mono text-lg font-bold leading-none text-amber-400">
              78%
            </div>
            <div className="font-mono text-[6px] font-bold uppercase tracking-widest text-muted-foreground">
              CONFIANÇA
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-[1fr_auto_1fr] items-center rounded-xl border border-slate-700 bg-slate-950/55 px-3 py-2.5">
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-amber-400">2</div>
            <div className="mt-0.5 font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
              BRA
            </div>
          </div>
          <div className="font-display text-sm text-muted-foreground">×</div>
          <div className="text-center">
            <div className="font-display text-3xl font-bold text-amber-400">1</div>
            <div className="mt-0.5 font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
              ARG
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1" />

      <Button size="sm" className="h-9 w-full gap-1.5 text-xs">
        <Lock className="h-3 w-3" /> Confirmar palpite
      </Button>
    </div>
  );
}

function PhoneAnalysisScreen() {
  const insights = [
    { text: "Brasil 80% nos últimos 5", strong: true },
    { text: "ARG 1.1 gols/jogo fora", strong: false },
    { text: "Vini Jr. 4 gols em 3 ARG", strong: true },
    { text: "H2H Brasil 6V-2D quartas", strong: false },
  ];

  return (
    <div className="flex h-full flex-col gap-2 px-3.5 pb-3.5 pt-8">
      <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
        ANÁLISE TÉCNICA · 4 fatores
      </div>

      {insights.map((insight, i) => (
        <div
          key={i}
          className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800/50 px-2.5 py-2"
        >
          <div
            className={`flex h-4 w-4 shrink-0 items-center justify-center rounded ${
              insight.strong
                ? "bg-amber-400/20 text-amber-400"
                : "bg-primary/15 text-primary"
            }`}
          >
            {insight.strong ? (
              <Zap className="h-2.5 w-2.5" />
            ) : (
              <Sparkles className="h-2.5 w-2.5" />
            )}
          </div>
          <div className="text-[11px] leading-tight">{insight.text}</div>
        </div>
      ))}

      <div className="flex-1" />

      <div className="rounded-xl border border-dashed border-amber-400/40 bg-amber-400/5 px-3 py-2.5 text-[11px] italic leading-relaxed">
        "Cravei 2-1. Vini bate o pênalti aos 89."
      </div>
    </div>
  );
}

function PhoneVerdictScreen() {
  return (
    <div className="flex h-full flex-col gap-2.5 px-3.5 pb-3.5 pt-8">
      <div className="rounded-xl border border-emerald-400 bg-gradient-to-r from-emerald-400/25 to-emerald-400/5 p-3 text-center">
        <div className="text-3xl">🏆</div>
        <div className="mt-1.5 font-display text-sm font-semibold text-emerald-400">
          Você bateu a IA!
        </div>
        <div className="mt-1 text-[10px] text-emerald-300">
          +10 pts · streak 7🔥
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-700 bg-slate-800/50 p-2.5">
        <div className="rounded-lg bg-primary/10 p-2 text-center">
          <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
            VOCÊ
          </div>
          <div className="mt-1 font-display text-xl font-bold text-emerald-400">
            2-1
          </div>
          <div className="mt-0.5 text-[9px] text-muted-foreground">Cravou</div>
          <div className="mt-1 font-mono text-xs font-bold text-emerald-400">
            +25
          </div>
        </div>
        <div className="rounded-lg p-2 text-center">
          <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
            GEPETO
          </div>
          <div className="mt-1 font-display text-xl font-bold">2-2</div>
          <div className="mt-0.5 text-[9px] text-muted-foreground">Errou</div>
          <div className="mt-1 font-mono text-xs font-bold text-muted-foreground">
            +10
          </div>
        </div>
      </div>

      <Button variant="secondary" size="sm" className="h-9 gap-1.5 text-[11px]">
        <Share2 className="h-3 w-3" /> Postar vitória
      </Button>
    </div>
  );
}

function PhoneWeeklyScreen() {
  return (
    <div className="flex h-full flex-col gap-2.5 px-3.5 pb-3.5 pt-8">
      <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-amber-400">
        CAPÍTULO 03 · QUARTAS
      </div>

      <div className="py-2 text-center">
        <GepetoAvatar size={56} mood="smug" />
        <div className="mt-2 font-display text-sm font-semibold">
          Gepeto na liderança
        </div>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2.5 rounded-xl border border-slate-700 bg-slate-800/50 p-2.5">
        <div className="text-center">
          <div className="font-display text-2xl font-bold text-amber-400">11</div>
          <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
            GEPETO
          </div>
        </div>
        <div className="font-display text-base text-muted-foreground">×</div>
        <div className="text-center">
          <div className="font-display text-2xl font-bold">9</div>
          <div className="font-mono text-[7px] font-bold uppercase tracking-widest text-muted-foreground">
            HUMANOS
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-dashed border-amber-400/35 bg-amber-400/5 px-2.5 py-2 text-[11px] italic leading-relaxed">
        "Semana 3 e os humanos continuam tropeçando..."
      </div>
    </div>
  );
}

export function PhoneMock({ screen = "card" }: PhoneMockProps) {
  return (
    <div className="relative h-[560px] w-[280px] shrink-0 overflow-hidden rounded-[36px] border-[10px] border-slate-800 bg-background shadow-2xl">
      {/* Notch */}
      <div className="absolute left-1/2 top-0 z-10 h-[22px] w-[100px] -translate-x-1/2 rounded-b-[14px] bg-slate-950" />

      {screen === "card" && <PhoneCardScreen />}
      {screen === "analysis" && <PhoneAnalysisScreen />}
      {screen === "verdict" && <PhoneVerdictScreen />}
      {screen === "weekly" && <PhoneWeeklyScreen />}
    </div>
  );
}
