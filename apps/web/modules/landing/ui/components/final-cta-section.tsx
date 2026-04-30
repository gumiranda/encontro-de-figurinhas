"use client";

import { ArrowRight, MapPinPlus } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

const MS_PER_DAY = 1000 * 60 * 60 * 24;
const COPA_2026_START = new Date(2026, 5, 11);

function useCopaCountdownLead(): string {
  return useMemo(() => {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfEvent = new Date(
      COPA_2026_START.getFullYear(),
      COPA_2026_START.getMonth(),
      COPA_2026_START.getDate()
    );
    const days = Math.floor(
      (startOfEvent.getTime() - startOfToday.getTime()) / MS_PER_DAY
    );

    if (days < 0) return "A Copa já começou.";
    if (days === 0) return "A Copa começa hoje.";
    if (days === 1) return "Falta 1 dia para a Copa.";
    return `Faltam ${days} dias para a Copa.`;
  }, []);
}

type FinalCTASectionProps = {
  cityName?: string | null;
};

export function FinalCTASection({ cityName }: FinalCTASectionProps = {}) {
  const countdownLead = useCopaCountdownLead();
  const suggestAnchorCity = cityName ?? "perto de você";
  return (
    <section className="px-6 py-28 md:py-36 relative overflow-hidden bg-[#090e1c]">
      {/* Ethereal gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_0%,rgba(149,170,255,0.08),transparent_60%)]" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="eyebrow eyebrow-green mb-8">
          <span className="pulse-dot" />
          Contagem regressiva
        </span>

        <h2 className="font-bold text-3xl sm:text-4xl md:text-5xl tracking-tight mb-6 text-[#e1e4fa] leading-[1.1]">
          {countdownLead}{" "}
          <span className="block mt-2 text-gradient-hero">E as suas figurinhas?</span>
        </h2>

        <p className="text-[#a6aabf] text-base md:text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          Enquanto você espera, alguém está trocando. Entre agora e complete seu álbum.
        </p>

        {/* CTA Button */}
        <div className="flex justify-center">
          <Link
            href="/sign-in"
            className="group inline-flex items-center gap-3 px-7 py-4 bg-gradient-to-r from-[#95aaff] to-[#3766ff] text-[#00247e] font-bold rounded-full shadow-[0_4px_24px_-4px_rgba(55,102,255,0.4)] transition-all duration-300 hover:shadow-[0_8px_32px_-4px_rgba(55,102,255,0.5)] hover:scale-[1.02]"
          >
            Cadastrar minhas figurinhas
            <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#00247e]/20 transition-transform duration-300 group-hover:translate-x-0.5">
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </span>
          </Link>
        </div>

        <p className="text-[#a6aabf]/70 text-[0.6875rem] mt-6 uppercase tracking-[0.1em] font-medium">
          Sem cartão de crédito · 100% gratuito
        </p>

        <p className="text-[#a6aabf] text-sm mt-10">
          <Link
            href="/ponto/solicitar"
            className="inline-flex items-center gap-1.5 font-medium underline decoration-[#95aaff]/40 underline-offset-4 transition-colors duration-300 hover:text-[#95aaff] hover:decoration-[#95aaff]"
          >
            <MapPinPlus className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
            Sugerir novo ponto de troca{" "}
            {suggestAnchorCity ? `em ${suggestAnchorCity}` : "perto de você"}
          </Link>
        </p>
      </div>
    </section>
  );
}
