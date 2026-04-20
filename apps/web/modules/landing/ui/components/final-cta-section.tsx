import Link from "next/link";
import { Rocket, MapPinPlus } from "lucide-react";

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Abertura da Copa do Mundo 2026 (11/06/2026), contagem em dias corridos no fuso local. */
const COPA_2026_START = new Date(2026, 5, 11);

function getDaysUntilCopa2026(): number {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfEvent = new Date(
    COPA_2026_START.getFullYear(),
    COPA_2026_START.getMonth(),
    COPA_2026_START.getDate(),
  );
  return Math.floor((startOfEvent.getTime() - startOfToday.getTime()) / MS_PER_DAY);
}

function copaCountdownLead(): string {
  const days = getDaysUntilCopa2026();
  if (days < 0) return "A Copa já começou.";
  if (days === 0) return "A Copa começa hoje.";
  if (days === 1) return "Falta 1 dia para a Copa.";
  return `Faltam ${days} dias para a Copa.`;
}

type FinalCTASectionProps = {
  cityName?: string | null;
};

export function FinalCTASection({ cityName }: FinalCTASectionProps = {}) {
  const suggestAnchorCity = cityName ?? "perto de você";
  return (
    <section className="px-6 py-24 relative overflow-hidden bg-primary">
      <div className="max-w-3xl mx-auto text-center relative z-10">
        <h2 className="font-headline font-bold text-3xl md:text-4xl lg:text-5xl tracking-tight mb-6 text-on-primary leading-tight">
          {copaCountdownLead()}{" "}
          <span className="block mt-1 text-tertiary">E as suas figurinhas?</span>
        </h2>
        <p className="text-on-primary/85 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed">
          Enquanto você espera, alguém está trocando. Entre agora e complete seu álbum.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-8 py-4 bg-on-primary text-primary-dim font-semibold rounded-lg shadow-md transition-colors flex items-center justify-center gap-2 text-sm uppercase tracking-wide hover:bg-on-primary/95"
          >
            Quero completar meu álbum
            <Rocket className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
        <p className="text-on-primary/60 text-xs mt-6 uppercase tracking-wide font-medium">
          Sem cartão de crédito · 100% gratuito
        </p>
        <p className="text-on-primary/75 text-sm mt-10">
          <Link
            href="/ponto/solicitar"
            className="underline decoration-1 underline-offset-4 hover:text-tertiary transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            <MapPinPlus className="w-4 h-4" aria-hidden="true" />
            Sugerir novo ponto de troca {suggestAnchorCity ? `em ${suggestAnchorCity}` : "perto de você"}
          </Link>
        </p>
      </div>
    </section>
  );
}
