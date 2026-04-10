import Link from "next/link";
import { CitySearch } from "./city-search";
import { BentoStats } from "./bento-stats";

interface HeroSectionProps {
  totalTrocas?: string | null;
}

export function HeroSection({ totalTrocas }: HeroSectionProps) {
  return (
    <section
      className="relative px-6 py-16 md:py-32 max-w-7xl mx-auto overflow-hidden"
      aria-labelledby="hero-heading"
    >
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--landing-secondary-container)]/20 border border-[var(--landing-secondary)]/20">
            <span
              className="w-2 h-2 rounded-full bg-[var(--landing-secondary)] animate-pulse"
              aria-hidden="true"
            />
            <span className="text-[var(--landing-secondary)] text-[10px] font-bold tracking-[0.2em] uppercase">
              Ao Vivo na Arena
            </span>
          </div>

          <h1
            id="hero-heading"
            className="font-[var(--font-headline)] font-black text-4xl md:text-5xl lg:text-7xl leading-tight tracking-tighter text-[var(--landing-on-surface)]"
          >
            Encontre quem tem as figurinhas que{" "}
            <span className="text-gradient-primary">voce precisa.</span>
          </h1>

          <p className="text-[var(--landing-on-surface-variant)] text-lg md:text-xl max-w-lg leading-relaxed font-[var(--font-body)]">
            A maior rede de trocas do Brasil. Troque perto de voce com seguranca, rapidez
            e conecte-se com outros colecionadores.
          </p>

          <CitySearch />

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-[var(--landing-primary)] text-[var(--landing-on-primary)] font-bold rounded-xl shadow-lg shadow-[var(--landing-primary)]/20 hover:shadow-[var(--landing-primary)]/40 transition-all flex items-center justify-center gap-2 text-center"
            >
              COMECAR AGORA
            </Link>
          </div>
        </div>

        <BentoStats totalTrocas={totalTrocas} />
      </div>
    </section>
  );
}
