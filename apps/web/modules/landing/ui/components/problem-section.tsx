"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { PROBLEM_STATS } from "../../lib/landing-data";
import { LandingCard } from "./landing-card";

const COLOR_CLASSES: Record<string, string> = {
  error: "text-[#ff6e84]",
  tertiary: "text-[#ffc965]",
  primary: "text-[#95aaff]",
};

export function ProblemSection() {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>();

  return (
    <section className="section-band px-6 py-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div
            ref={ref}
            className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
          >
            <span className="eyebrow">O problema</span>
            <h2 className="mt-4 font-bold text-3xl md:text-5xl tracking-tight leading-[1.05] text-pretty text-[#e1e4fa]">
              Você gastou <span className="text-[#ff6e84]">R$ 480</span> em pacotes
              <br />e ainda tem 47 figurinhas faltando.
            </h2>
            <p className="mt-5 text-[#a6aabf] text-lg leading-relaxed max-w-lg">
              O álbum da Copa promete. A banca não. Você abre 8 pacotes e ganha mais 6
              MEX-10 repetidas. Sua pilha de repetidas cresce mais rápido que o álbum.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3">
              {PROBLEM_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#13192b] border border-white/5 p-3 sm:p-4 text-center"
                >
                  <p
                    className={`font-mono text-lg sm:text-2xl font-bold ${COLOR_CLASSES[stat.color]}`}
                  >
                    {stat.value}
                  </p>
                  <p className="text-[10px] sm:text-[11px] text-[#a6aabf] mt-1 leading-tight">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="absolute inset-0 bg-[#ff6e84]/5 rounded-3xl blur-2xl" />
            <div className="relative grid grid-cols-4 gap-1.5 sm:gap-2.5 max-w-xs sm:max-w-sm mx-auto lg:max-w-none">
              <LandingCard variant="sticker-have" code="BRA-10" flag="🇧🇷" />
              <LandingCard variant="sticker-have" code="BRA-10" flag="🇧🇷" />
              <LandingCard variant="sticker-have" code="BRA-10" flag="🇧🇷" />
              <LandingCard variant="sticker-have" code="BRA-10" flag="🇧🇷" />
              <LandingCard variant="sticker-have" code="BRA-10" flag="🇧🇷" />
              <LandingCard variant="sticker-have" code="BRA-10" flag="🇧🇷" />
              <LandingCard
                variant="sticker-need"
                code="ARG-09"
                flag="🇦🇷"
                photoText="faltando"
              />
              <LandingCard
                variant="sticker-need"
                code="FRA-07"
                flag="🇫🇷"
                photoText="faltando"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full glass-ethereal text-[10px] sm:text-[11px] font-mono whitespace-nowrap">
              <span className="text-[#ff6e84]">6× BRA-10</span>
              <span className="text-[#a6aabf]"> · 2 faltando</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
