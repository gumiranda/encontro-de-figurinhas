"use client";

import { useState } from "react";
import { PhoneMock } from "./phone-mock";

const STEPS = [
  {
    num: "01",
    title: "Gepeto crava primeiro",
    desc: "Antes de cada jogo, a IA grava um palpite blindado com hash SHA-256. Ninguém pode trapacear.",
    screen: "card" as const,
  },
  {
    num: "02",
    title: "Análise técnica pública",
    desc: "Cada palpite vem com 3-4 insights: histórico, posse, gols por jogo, escalações. Tudo aberto.",
    screen: "analysis" as const,
  },
  {
    num: "03",
    title: "Você palpita",
    desc: "Marca seu placar antes do apito. Os palpites de todo mundo ficam selados até o juiz começar.",
    screen: "card" as const,
  },
  {
    num: "04",
    title: "Apita = ganha quem acertou",
    desc: "Quem cravou ganha mais. Se você fez melhor que o Gepeto, leva a badge 'Bati a IA' + posts pra WhatsApp.",
    screen: "verdict" as const,
  },
];

export function HowItWorks() {
  const [step, setStep] = useState(0);

  return (
    <section id="como" className="border-t border-border py-24">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <div className="font-mono text-xs font-bold uppercase tracking-widest text-primary">
            COMO FUNCIONA
          </div>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Quatro passos.
            <br />
            <span className="text-muted-foreground">Mil briga.</span>
          </h2>
        </div>

        <div className="grid items-center gap-8 lg:grid-cols-[1fr_280px] lg:gap-16">
          <div className="space-y-3">
            {STEPS.map((s, i) => (
              <button
                key={i}
                onClick={() => setStep(i)}
                className={`grid w-full grid-cols-[auto_1fr] gap-4 rounded-2xl border p-5 text-left transition-all ${
                  step === i
                    ? "border-primary bg-muted/50"
                    : "border-border bg-transparent hover:bg-muted/30"
                }`}
              >
                <div
                  className={`font-display text-3xl font-bold tracking-tight transition-colors ${
                    step === i ? "text-primary" : "text-muted-foreground/40"
                  }`}
                >
                  {s.num}
                </div>
                <div>
                  <div className="font-display text-lg font-semibold">
                    {s.title}
                  </div>
                  <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="flex justify-center lg:order-last">
            <PhoneMock screen={STEPS[step]?.screen ?? "card"} />
          </div>
        </div>
      </div>
    </section>
  );
}
