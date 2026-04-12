import Link from "next/link";
import { Rocket } from "lucide-react";

export function FinalCTASection() {
  return (
    <section className="px-6 py-24 bg-gradient-to-br from-[var(--landing-primary)] to-[var(--landing-primary-container)]">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="font-[var(--font-headline)] font-bold text-3xl md:text-5xl tracking-tight mb-6 text-[var(--landing-on-primary)]">
          Pronto para completar seu álbum?
        </h2>
        <p className="text-[var(--landing-on-primary)]/80 text-lg md:text-xl mb-8 font-[var(--font-body)]">
          Junte-se a mais de 10.000 colecionadores que já estão trocando figurinhas.
          Cadastro gratuito e sem compromisso.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="w-full sm:w-auto px-10 py-5 bg-[var(--landing-on-primary)] text-[var(--landing-primary)] font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 text-lg"
          >
            CRIAR CONTA GRÁTIS
            <Rocket className="w-5 h-5" aria-hidden="true" />
          </Link>
        </div>
        <p className="text-[var(--landing-on-primary)]/60 text-sm mt-6">
          Sem cartão de crédito. Cancele quando quiser.
        </p>
      </div>
    </section>
  );
}
