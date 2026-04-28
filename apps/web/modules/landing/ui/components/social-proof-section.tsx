"use client";

import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { RARITY_LEADERBOARD, SOCIAL_STATS } from "../../lib/landing-data";

const STATS_ARRAY = [
  { ...SOCIAL_STATS.trocas, gradient: true },
  SOCIAL_STATS.colecionadores,
  SOCIAL_STATS.matchMedio,
  SOCIAL_STATS.cidades,
];

const REGIONAL_LINKS = [
  { href: "/estado/sp", label: "São Paulo · 14.2k" },
  { href: "/estado/rj", label: "Rio · 8.9k" },
  { href: "/estado/mg", label: "Minas · 5.2k" },
  { href: "/estado/rs", label: "RS · 3.8k" },
  { href: "/estado/pr", label: "Paraná · 3.1k" },
  { href: "/estado/ba", label: "Bahia · 2.7k" },
  { href: "/estado/pe", label: "Pernambuco · 2.1k" },
];

export function SocialProofSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [statsRef, statsVisible] = useScrollRevealGroup(STATS_ARRAY.length);
  const [leaderRef, leaderVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-band px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center mb-14 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="eyebrow eyebrow-green">
            <span className="pulse-dot" />
            Dados ao vivo
          </span>
          <h2 className="mt-4 font-bold text-3xl md:text-5xl tracking-tight text-[#e1e4fa]">
            A maior arena de trocas
            <br className="hidden md:block" /> da Copa 2026.
          </h2>
        </div>

        <div
          ref={statsRef}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-14"
        >
          {STATS_ARRAY.map((stat, index) => (
            <div
              key={stat.label}
              className={`rounded-2xl glass-ethereal p-6 md:p-8 shadow-ambient transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                statsVisible[index]
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <p className="text-xs font-mono uppercase tracking-widest text-[#a6aabf] mb-2">
                {stat.label}
              </p>
              <p
                className={`font-bold text-4xl md:text-5xl ${
                  "gradient" in stat && stat.gradient
                    ? "text-gradient-hero"
                    : "text-[#e1e4fa]"
                }`}
              >
                {stat.value}
              </p>
              <p className="text-xs font-mono mt-2 text-[#4ff325]">{stat.delta}</p>
            </div>
          ))}
        </div>

        <div
          ref={leaderRef}
          className={`rounded-3xl bg-[#13192b] border border-white/5 p-6 md:p-10 shadow-ambient-lg transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            leaderVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div>
              <h3 className="font-bold text-2xl text-[#e1e4fa]">
                Mais procuradas esta semana
              </h3>
              <p className="text-sm text-[#a6aabf] mt-1">
                Ranking ao vivo, atualizado a cada match.
              </p>
            </div>
            <Link
              href="/raras"
              className="text-xs font-semibold text-[#95aaff] uppercase tracking-widest flex items-center gap-1 hover:gap-2 transition-all"
            >
              Ver ranking completo
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {RARITY_LEADERBOARD.map((item) => (
              <Link
                key={item.code}
                href={`/selecao/${item.slug}`}
                className={`group rounded-2xl bg-[#181f33] border p-5 transition-all hover:border-[#95aaff]/40 ${
                  item.gold
                    ? "border-[#ffc965]/20 hover:border-[#ffc965]/50"
                    : "border-white/5"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] font-mono uppercase tracking-widest ${
                      item.gold ? "text-[#ffc965]" : "text-[#a6aabf]"
                    }`}
                  >
                    #{item.rank} dourada
                  </span>
                  <span className="text-2xl">{item.flag}</span>
                </div>
                <p className="font-bold text-xl text-[#e1e4fa]">{item.code}</p>
                <p className="text-xs text-[#a6aabf] mt-1">
                  {item.player} · {item.team}
                </p>
                <div className="mt-4 flex items-center justify-between text-xs font-mono">
                  <span className={item.gold ? "text-[#ffc965]" : "text-[#95aaff]"}>
                    {item.seeking} buscando
                  </span>
                  <span className="text-[#a6aabf]">{item.odds}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="font-mono text-[#a6aabf] mr-2">Mapa de calor regional:</span>
          {REGIONAL_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-1.5 rounded-full bg-white/5 hover:bg-[#95aaff]/10 hover:text-[#95aaff] transition border border-white/5 text-[#e1e4fa]"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/estados" className="px-3 py-1.5 rounded-full text-[#95aaff]">
            +19 estados →
          </Link>
        </div>
      </div>
    </section>
  );
}
