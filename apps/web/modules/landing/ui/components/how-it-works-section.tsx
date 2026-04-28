"use client";

import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";
import { Search, ArrowLeftRight, Handshake, CheckCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";

const STEPS = [
  {
    num: "01",
    Icon: Search,
    title: "Cadastrar",
    desc: "Registre as figurinhas que você tem e as que faltam. Digita os códigos (BRA-10, ARG-09) ou importa por foto.",
    iconColor: "text-[#95aaff]",
  },
  {
    num: "02",
    Icon: ArrowLeftRight,
    title: "Ponto de troca",
    desc: "Escolha onde quer trocar: shopping, banca, metrô. Veja colecionadores ativos em cada ponto.",
    iconColor: "text-[#95aaff]",
  },
  {
    num: "03",
    Icon: Handshake,
    title: "Match",
    desc: "O app cruza sua lista com quem frequenta o mesmo ponto. Mostra quem tem o que você precisa.",
    iconColor: "text-[#95aaff]",
  },
  {
    num: "04",
    Icon: CheckCircle,
    title: "Trocar",
    desc: "Receba propostas ou faça você. Encontrem, troquem, confirmem. Álbum atualiza sozinho.",
    iconColor: "text-[#4ff325]",
  },
];

export function HowItWorksSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [stepsRef, stepsVisible] = useScrollRevealGroup(STEPS.length);

  return (
    <section id="como" className="px-6 py-24">
      <div className="max-w-7xl mx-auto">
        <div
          ref={headerRef}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <span className="eyebrow">Como funciona</span>
          <h2 className="mt-4 font-bold text-3xl md:text-5xl tracking-tight text-[#e1e4fa]">
            Quatro passos. <span className="text-gradient-hero">Sem intermediário.</span>
          </h2>
          <p className="mt-4 text-[#a6aabf] text-lg">
            Direto entre coletores. Sem revenda, sem leilão, sem taxa.
          </p>
        </div>

        <div ref={stepsRef} className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step, index) => (
            <div
              key={step.num}
              className={`relative rounded-2xl bg-[#13192b] border border-white/5 p-6 hover:border-[#95aaff]/30 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                stepsVisible[index] ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between mb-4">
                <span className="step-num text-5xl md:text-6xl lg:text-[5rem]">
                  {step.num}
                </span>
                <step.Icon
                  className={`w-6 h-6 ${step.iconColor}`}
                />
              </div>
              <h3 className="font-bold text-xl mb-2 text-[#e1e4fa]">{step.title}</h3>
              <p className="text-sm text-[#a6aabf] leading-relaxed">{step.desc}</p>
            </div>
          ))}

          <div className="connector hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] -z-10 h-px bg-[radial-gradient(circle,rgba(149,170,255,0.4)_1px,transparent_1px)] bg-[length:8px_1px]" />
        </div>

        <div className="mt-12 flex justify-center">
          <Button asChild variant="outline" className="rounded-full gap-2">
            <Link href="/cadastrar-figurinhas/quick">
              Cadastrar minhas figurinhas
              <ArrowLeftRight className="w-4 h-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
