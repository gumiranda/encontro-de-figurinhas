import Link from "next/link";
import Image from "next/image";
import { Award } from "lucide-react";
import { CitySearch } from "./city-search";
import { HERO_IMAGE } from "../../lib/landing-data";

interface HeroSectionProps {
  totalTrocas?: string | null;
}

export function HeroSection({ totalTrocas }: HeroSectionProps) {
  return (
    <section
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 md:py-32"
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
            className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter text-[var(--landing-on-surface)] sm:text-4xl md:text-5xl lg:text-7xl"
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

        {/* Bento Stats - inline */}
        <div className="relative hidden md:block">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[var(--landing-primary)]/10 rounded-full blur-[120px]" />
          <div className="relative space-y-4">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-8 h-64 rounded-2xl overflow-hidden relative group">
                <Image
                  src={HERO_IMAGE.src}
                  alt={HERO_IMAGE.alt}
                  fill
                  className="object-cover transition duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--landing-surface)] via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="px-2 py-1 bg-[var(--landing-secondary)] text-[var(--landing-on-secondary)] text-[10px] font-black rounded-sm uppercase">
                    Destaque
                  </span>
                </div>
              </div>
              <div className="col-span-4 h-64 bg-[var(--landing-surface-container-high)] rounded-2xl flex flex-col items-center justify-center p-6 border border-[var(--landing-outline-variant)]/10">
                <Award className="text-[var(--landing-tertiary)] w-9 h-9 mb-2" aria-hidden="true" />
                <span className="font-[var(--font-headline)] font-bold text-3xl text-[var(--landing-on-surface)]">
                  {totalTrocas || "Milhares"}
                </span>
                <span className="text-[10px] text-[var(--landing-outline)] text-center uppercase tracking-widest mt-1">
                  {totalTrocas ? "Trocas Realizadas" : "de Trocas"}
                </span>
              </div>
              <div className="col-span-12 h-40 glass-card rounded-2xl border border-white/5 p-6 flex items-center justify-around">
                <div className="text-center">
                  <p className="text-[var(--landing-primary)] font-bold text-2xl">98%</p>
                  <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-tighter">Seguranca</p>
                </div>
                <div className="w-px h-12 bg-[var(--landing-outline-variant)]/20" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-[var(--landing-secondary)] font-bold text-2xl">5min</p>
                  <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-tighter">Match Medio</p>
                </div>
                <div className="w-px h-12 bg-[var(--landing-outline-variant)]/20" aria-hidden="true" />
                <div className="text-center">
                  <p className="text-[var(--landing-tertiary)] font-bold text-2xl">24/7</p>
                  <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-tighter">Suporte Arena</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
