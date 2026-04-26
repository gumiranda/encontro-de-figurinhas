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
    <section className="px-4 py-32 sm:px-6 md:py-40 relative overflow-hidden bg-primary">
      {/* Ethereal gradient overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(800px_500px_at_50%_0%,rgba(255,255,255,0.08),transparent_60%)]" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-on-primary/15 text-on-primary text-[0.625rem] font-medium uppercase tracking-[0.15em] mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          Contagem regressiva
        </span>

        <h2 className="font-headline font-semibold text-[1.75rem] sm:text-3xl md:text-4xl lg:text-[2.75rem] tracking-[-0.02em] mb-6 text-on-primary leading-[1.15]">
          {countdownLead}{" "}
          <span className="block mt-2 text-tertiary">E as suas figurinhas?</span>
        </h2>

        <p className="text-on-primary text-base md:text-lg mb-12 max-w-lg mx-auto leading-[1.7]">
          Enquanto você espera, alguém está trocando. Entre agora e complete seu álbum.
        </p>

        {/* Premium inverted CTA with double-bezel */}
        <div className="flex justify-center">
          <div className=" rounded-full p-[3px] bg-on-primary/20 ring-1 ring-on-primary/30">
            <Link
              href="/sign-up"
              className="text-white group flex items-center gap-3 px-7 py-3.5 bg-on-primary  font-medium rounded-full shadow-[0_4px_24px_-4px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,0.8)] transition-[box-shadow] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-[0_8px_32px_-4px_rgba(0,0,0,0.25)]"
            >
              Quero completar meu álbum
              <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 transition-[background-color,transform] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:translate-x-0.5 group-hover:bg-primary/15">
                <ArrowRight className="w-4 h-4 text-primary-dim" strokeWidth={2} />
              </span>
            </Link>
          </div>
        </div>

        <p className="text-on-primary/70 text-[0.6875rem] mt-6 uppercase tracking-[0.1em] font-medium">
          Sem cartão de crédito · 100% gratuito
        </p>

        <p className="text-on-primary text-sm mt-12">
          <Link
            href="/ponto/solicitar"
            className="inline-flex items-center gap-1.5 font-medium underline decoration-on-primary/40 underline-offset-4 transition-colors duration-300 hover:text-tertiary hover:decoration-tertiary"
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
