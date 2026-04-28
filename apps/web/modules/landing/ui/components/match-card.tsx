"use client";

import { LandingCard } from "./landing-card";
import { Button } from "@workspace/ui/components/button";

export function MatchCard() {
  return (
    <div className="relative">
      <div className="absolute -inset-8 bg-[#95aaff]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="relative glass-ethereal rounded-3xl p-5 shadow-ambient-lg">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="pulse-dot" />
            <span className="text-[#4ff325] font-semibold tracking-wide">
              MATCH ENCONTRADO
            </span>
          </div>
          <span className="text-[10px] font-mono text-[#a6aabf]">
            a 1,2 km · há 12s
          </span>
        </div>

        <div className="overflow-x-auto -mx-5 px-5 pb-2 md:mx-0 md:px-0 md:pb-0">
          <div className="flex gap-3 min-w-max md:grid md:grid-cols-3 md:min-w-0">
            <LandingCard
              variant="sticker-have"
              code="BRA-10"
              flag="🇧🇷"
              photoText="photo"
              className="w-24 md:w-auto"
            />
            <LandingCard
              variant="sticker-legend"
              code="BRA-FWC"
              flag="⭐"
              photoText="legendária"
              className="w-24 md:w-auto"
            />
            <LandingCard
              variant="sticker-need"
              code="ARG-09"
              flag="🇦🇷"
              photoText="a buscar"
              className="w-24 md:w-auto"
            />
          </div>
        </div>

        <div className="rounded-xl bg-[#181f33] border border-white/5 p-4 flex items-center gap-3 mt-5">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#95aaff] to-[#3766ff] grid place-items-center font-bold text-[#00247e] text-sm">
            MS
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-semibold text-sm truncate text-[#e1e4fa]">
                Marina S.
              </p>
              <svg
                className="w-4 h-4 text-[#95aaff] fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
              </svg>
            </div>
            <p className="text-[11px] text-[#a6aabf] font-mono">
              tem BRA-10 · quer ARG-09
            </p>
          </div>
          <Button size="sm" className="h-9 px-4 text-xs">
            Trocar
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] font-mono text-[#a6aabf]">
          <span>Vila Madalena · São Paulo</span>
          <span>★ 4.9 · 142 trocas</span>
        </div>
      </div>
    </div>
  );
}
