"use client";

import { useEffect, useState } from "react";
import { Clock, Users } from "lucide-react";
import { GepetoAvatar } from "./gepeto-avatar";

export function HeroBoard() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((v) => v + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  const gepetoScores = [11, 12, 11];
  const humanScores = [9, 9, 10];

  return (
    <div className="relative animate-float">
      {/* Floating quote bubble */}
      <div className="absolute -top-7 -left-4 z-10 max-w-[260px] rounded-2xl rounded-bl border border-amber-400 bg-slate-900/90 px-3.5 py-2.5 text-sm italic text-foreground shadow-2xl">
        <span className="mr-0.5 font-display text-xl text-amber-400/50">"</span>
        Cravei Brasil 2-1. Quem discorda, abre o Excel.
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-slate-800/80 to-slate-900/90 p-7 shadow-2xl">
        {/* Background grid effect */}
        <div
          className="pointer-events-none absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              "linear-gradient(rgba(149,170,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(149,170,255,0.3) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />

        <div className="relative z-10">
          <div className="mb-5 flex items-center justify-between">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-amber-400">
              SEMANA 3 · AO VIVO
            </span>
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" />
          </div>

          {/* Scoreboard */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            <div className="text-center">
              <GepetoAvatar size={64} mood="smug" />
              <div
                key={tick}
                className="mt-2.5 font-display text-6xl font-bold tracking-tighter text-amber-400 transition-all"
              >
                {gepetoScores[tick % 3]}
              </div>
              <div className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                GEPETO
              </div>
            </div>

            <div className="font-display text-3xl text-muted-foreground">×</div>

            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-primary/60 shadow-lg shadow-primary/20">
                <Users className="h-7 w-7 text-primary-foreground" />
              </div>
              <div
                key={`h-${tick}`}
                className="mt-2.5 font-display text-6xl font-bold tracking-tighter text-primary transition-all"
              >
                {humanScores[tick % 3]}
              </div>
              <div className="mt-1.5 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
                HUMANOS
              </div>
            </div>
          </div>

          {/* Next match */}
          <div className="mt-5 flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950/50 px-3.5 py-2.5">
            <div>
              <div className="font-mono text-[8px] font-bold uppercase tracking-widest text-muted-foreground">
                PRÓXIMO DUELO
              </div>
              <div className="mt-0.5 font-display text-base">
                🇧🇷 BRA × ARG 🇦🇷
              </div>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-amber-400/15 px-2.5 py-1.5 font-mono text-xs font-bold text-amber-400">
              <Clock className="h-3 w-3" /> 3h 12min
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
