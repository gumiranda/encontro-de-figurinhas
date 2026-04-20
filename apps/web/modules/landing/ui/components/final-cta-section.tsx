import Link from "next/link";
import { Rocket, MapPinPlus } from "lucide-react";

type FinalCTASectionProps = {
  cityName?: string | null;
};

export function FinalCTASection({ cityName }: FinalCTASectionProps = {}) {
  const suggestAnchorCity = cityName ?? "perto de você";
  return (
    <section className="px-6 py-24 bg-gradient-to-br from-[var(--primary)] to-[var(--primary-container)]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[var(--font-headline)] font-bold text-3xl md:text-5xl tracking-tight mb-6 text-[var(--on-primary)]">
          Faltam 58 dias para a Copa. E as suas figurinhas?
        </h2>
        <p className="text-[var(--on-primary)]/80 text-lg md:text-xl mb-8 font-[var(--font-body)]">
          Enquanto você espera, alguém está trocando. Entre agora e complete seu álbum.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-10 py-5 bg-[var(--on-primary)] text-[var(--primary)] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            QUERO COMPLETAR MEU ÁLBUM
            <Rocket className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
        <p className="text-[var(--on-primary)]/60 text-sm mt-6">
          Sem cartão de crédito. 100% gratuito.
        </p>
        <p className="text-[var(--on-primary)]/80 text-base mt-10 font-[var(--font-body)]">
          <Link
            href="/ponto/solicitar"
            className="underline decoration-2 underline-offset-4 hover:decoration-[var(--on-primary)] transition-all inline-flex items-center gap-2"
          >
            <MapPinPlus className="w-4 h-4" aria-hidden="true" />
            Sugerir novo ponto de troca de figurinhas {suggestAnchorCity ? `em ${suggestAnchorCity}` : "perto de você"}
          </Link>
        </p>
      </div>
    </section>
  );
}
