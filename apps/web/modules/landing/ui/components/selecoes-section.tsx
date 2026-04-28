"use client";

import Link from "next/link";
import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";
import { LandingCard } from "./landing-card";
import { TEAMS } from "../../lib/landing-data";

export function SelecoesSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [gridRef, gridVisible] = useScrollRevealGroup(TEAMS.length);

  return (
    <section id="selecoes" className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div>
            <span className="eyebrow">32 seleções</span>
            <h2 className="mt-4 font-bold text-3xl md:text-5xl tracking-tight text-[#e1e4fa]">
              Encontre a sua <span className="text-gradient-hero">próxima rara.</span>
            </h2>
            <p className="mt-3 text-[#a6aabf] text-lg max-w-xl">
              Filtre por seleção e raridade. Cada figurinha tem código (ex: BRA-10),
              posição e nível de raridade.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <button className="px-4 py-2 rounded-full bg-[#95aaff] text-[#00247e] font-bold">
              Todas
            </button>
            <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#e1e4fa] hover:bg-white/10 transition">
              Comum
            </button>
            <button className="px-4 py-2 rounded-full bg-[#ffc965]/10 border border-[#ffc965]/30 text-[#ffc965] hover:bg-[#ffc965]/20 transition">
              Dourada
            </button>
            <button className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#e1e4fa] hover:bg-white/10 transition">
              Legend
            </button>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"
        >
          {TEAMS.map((team, index) => (
            <Link
              key={team.slug}
              href={`/selecao/${team.slug}`}
              className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                gridVisible[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${Math.min(index * 30, 300)}ms` }}
            >
              <LandingCard
                variant="selection"
                name={team.name}
                flag={team.flag}
                count={team.count}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
