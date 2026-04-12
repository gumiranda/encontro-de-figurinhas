import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CityCard } from "./city-card";
import { CITIES } from "../../lib/landing-data";

export function CitiesSection() {
  return (
    <section
      className="px-6 py-24 bg-[var(--landing-surface-container-low)]/50"
      aria-labelledby="cities-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2
              id="cities-heading"
              className="font-[var(--font-headline)] font-bold text-3xl md:text-5xl tracking-tight mb-4 text-[var(--landing-on-surface)]"
            >
              Principais Arenas
            </h2>
            <p className="text-[var(--landing-on-surface-variant)] max-w-md font-[var(--font-body)]">
              As cidades com maior volume de trocas e pontos de encontro ativos esta semana.
            </p>
          </div>
          <Link
            href="#"
            className="inline-flex items-center gap-2 text-[var(--landing-primary)] font-bold hover:gap-4 transition-all"
          >
            VER TODAS AS CIDADES
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {CITIES.map((city) => (
            <CityCard
              key={city.id}
              name={city.name}
              slug={city.slug}
              state={city.state}
              activePoints={city.activePoints}
              participants={city.participants}
              image={city.image}
              imageAlt={city.imageAlt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
