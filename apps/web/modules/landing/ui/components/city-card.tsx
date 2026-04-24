import Link from "next/link";
import Image from "next/image";
import { LogIn } from "lucide-react";

interface CityCardProps {
  name: string;
  slug: string;
  state: string;
  activePoints: number;
  participants: string;
  image: string;
  imageAlt: string;
}

export function CityCard({
  name,
  slug,
  state,
  activePoints,
  participants,
  image,
  imageAlt,
}: CityCardProps) {
  return (
    <Link href={`/cidade/${slug}`} className="block">
      <article className="group bg-[var(--surface-container)] rounded-2xl border border-[var(--outline-variant)]/10 overflow-hidden hover:border-[var(--primary)]/40 transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.2)]">
        <div className="h-48 overflow-hidden relative">
          <Image
            src={image}
            alt={imageAlt}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700 outline outline-1 outline-offset-[-1px] outline-[rgba(0,0,0,0.1)] dark:outline-[rgba(255,255,255,0.1)]"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--surface-container)] to-transparent" />
          <div className="absolute top-4 left-4">
            <span className="bg-[var(--surface)]/80 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[var(--primary)]">
              {state}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-[var(--font-headline)] font-bold text-2xl mb-4 text-[var(--on-surface)]">
            {name}
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--surface-container-high)] p-4 rounded-xl border border-[var(--outline-variant)]/5">
              <p className="text-[var(--outline)] text-[10px] uppercase tracking-widest mb-1">
                Pontos Ativos
              </p>
              <p className="font-[var(--font-headline)] font-bold text-xl text-[var(--secondary)] tabular-nums">
                {activePoints}
              </p>
            </div>
            <div className="bg-[var(--surface-container-high)] p-4 rounded-xl border border-[var(--outline-variant)]/5">
              <p className="text-[var(--outline)] text-[10px] uppercase tracking-widest mb-1">
                Participantes
              </p>
              <p className="font-[var(--font-headline)] font-bold text-xl text-[var(--primary)] tabular-nums">
                {participants}
              </p>
            </div>
          </div>
          <span className="w-full mt-6 py-3 bg-[var(--surface-container-highest)] group-hover:bg-[var(--primary)] group-hover:text-[var(--on-primary)] transition-colors duration-300 font-bold rounded-lg flex items-center justify-center gap-2 text-[var(--on-surface)]">
            VER TROCAS EM {name.toUpperCase()}
            <LogIn className="w-4 h-4" aria-hidden="true" />
          </span>
        </div>
      </article>
    </Link>
  );
}
