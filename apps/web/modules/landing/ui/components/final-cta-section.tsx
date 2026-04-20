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
    <section className="px-6 py-32 relative overflow-hidden">
      {/* Bold gradient background with multiple layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-dim via-primary to-primary-container" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(79,243,37,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,201,101,0.1),transparent_60%)]" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="font-headline font-black text-4xl md:text-6xl lg:text-7xl tracking-tight mb-8 text-on-primary leading-[0.95]">
          {copaCountdownLead()}{" "}
          <span className="block mt-2 text-tertiary">E as suas figurinhas?</span>
        </h2>
        <p className="text-on-primary/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto leading-relaxed">
          Enquanto você espera, alguém está trocando. Entre agora e complete seu álbum.
        </p>
        <div className="flex flex-col sm:flex-row gap-5 justify-center">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-12 py-6 bg-on-primary text-primary-dim font-black rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_48px_rgba(0,0,0,0.4)] transition-all flex items-center justify-center gap-3 text-lg uppercase tracking-wider hover:scale-[1.03] hover:-translate-y-1"
          >
            QUERO COMPLETAR MEU ÁLBUM
            <Rocket className="w-6 h-6" aria-hidden="true" />
          </Link>
        </div>
        <p className="text-on-primary/70 text-sm mt-8 uppercase tracking-widest font-semibold">
          Sem cartão de crédito · 100% gratuito
        </p>
        <p className="text-on-primary/80 text-base mt-12">
          <Link
            href="/ponto/solicitar"
            className="underline decoration-2 underline-offset-4 hover:decoration-tertiary hover:text-tertiary transition-all inline-flex items-center gap-2 font-semibold"
          >
            <MapPinPlus className="w-5 h-5" aria-hidden="true" />
            Sugerir novo ponto de troca {suggestAnchorCity ? `em ${suggestAnchorCity}` : "perto de você"}
          </Link>
        </p>
      </div>
    </section>
  );
}
