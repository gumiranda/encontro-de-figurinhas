import Image from "next/image";
import { Award } from "lucide-react";
import { HERO_IMAGE } from "../../lib/landing-data";

interface BentoStatsProps {
  totalTrocas?: string | null;
}

export function BentoStats({ totalTrocas }: BentoStatsProps) {
  return (
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
            <Award
              className="text-[var(--landing-tertiary)] w-9 h-9 mb-2"
              aria-hidden="true"
            />
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
              <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-tighter">
                Seguranca
              </p>
            </div>
            <div
              className="w-px h-12 bg-[var(--landing-outline-variant)]/20"
              aria-hidden="true"
            />
            <div className="text-center">
              <p className="text-[var(--landing-secondary)] font-bold text-2xl">5min</p>
              <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-tighter">
                Match Medio
              </p>
            </div>
            <div
              className="w-px h-12 bg-[var(--landing-outline-variant)]/20"
              aria-hidden="true"
            />
            <div className="text-center">
              <p className="text-[var(--landing-tertiary)] font-bold text-2xl">24/7</p>
              <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-tighter">
                Suporte Arena
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
