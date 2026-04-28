"use client";

import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { CITIES } from "../../lib/landing-data";
import { CityCard } from "./city-card";

export function CitiesSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [cardsRef, cardsVisible] = useScrollRevealGroup(CITIES.length);

  return (
    <section
      className="px-6 py-24 bg-[var(--surface-container-low)]/50"
      aria-labelledby="cities-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div>
            <h2
              id="cities-heading"
              className={`font-[var(--font-headline)] text-3xl md:text-5xl tracking-tight mb-4 text-balance text-[var(--on-surface)] transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              Principais Arenas
            </h2>
            <p
              className={`text-[var(--on-surface-variant)] max-w-md font-[var(--font-body)] transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
            >
              As cidades com maior volume de trocas e pontos de encontro ativos esta
              semana.
            </p>
          </div>
          <Link
            href="#"
            className={`inline-flex items-center gap-2 text-[var(--primary)] font-bold hover:gap-4 transition-[gap,opacity,transform] duration-300 ${headerVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"}`}
          >
            VER TODAS AS CIDADES
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>

        <div
          ref={cardsRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {CITIES.map((city, index) => (
            <div
              key={city.id}
              className={`card-float transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${cardsVisible[index] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <CityCard
                name={city.name}
                slug={city.slug}
                state={city.state}
                activePoints={city.activePoints}
                participants={city.participants}
                image={city.image}
                imageAlt={city.imageAlt}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
