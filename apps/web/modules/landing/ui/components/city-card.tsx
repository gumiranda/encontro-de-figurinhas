import Image from "next/image";
import { LogIn } from "lucide-react";

interface CityCardProps {
  name: string;
  state: string;
  activePoints: number;
  participants: string;
  image: string;
  imageAlt: string;
}

export function CityCard({
  name,
  state,
  activePoints,
  participants,
  image,
  imageAlt,
}: CityCardProps) {
  return (
    <article className="group bg-[var(--landing-surface-container)] rounded-2xl border border-[var(--landing-outline-variant)]/10 overflow-hidden hover:border-[var(--landing-primary)]/40 transition-all duration-300">
      <div className="h-48 overflow-hidden relative">
        <Image
          src={image}
          alt={imageAlt}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--landing-surface-container)] to-transparent" />
        <div className="absolute top-4 left-4">
          <span className="bg-[var(--landing-surface)]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--landing-primary)]">
            {state}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-[var(--font-headline)] font-bold text-2xl mb-4 text-[var(--landing-on-surface)]">
          {name}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[var(--landing-surface-container-high)] p-4 rounded-xl border border-[var(--landing-outline-variant)]/5">
            <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-widest mb-1">
              Pontos Ativos
            </p>
            <p className="font-[var(--font-headline)] font-bold text-xl text-[var(--landing-secondary)]">
              {activePoints}
            </p>
          </div>
          <div className="bg-[var(--landing-surface-container-high)] p-4 rounded-xl border border-[var(--landing-outline-variant)]/5">
            <p className="text-[var(--landing-outline)] text-[10px] uppercase tracking-widest mb-1">
              Participantes
            </p>
            <p className="font-[var(--font-headline)] font-bold text-xl text-[var(--landing-primary)]">
              {participants}
            </p>
          </div>
        </div>
        <button
          type="button"
          className="w-full mt-6 py-3 bg-[var(--landing-surface-container-highest)] hover:bg-[var(--landing-primary)] hover:text-[var(--landing-on-primary)] transition-all font-bold rounded-lg flex items-center justify-center gap-2 text-[var(--landing-on-surface)]"
        >
          ENTRAR NESTA ARENA
          <LogIn className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}
