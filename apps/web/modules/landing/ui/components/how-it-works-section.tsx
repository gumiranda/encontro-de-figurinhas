"use client";

import { UserPlus, ListChecks, Handshake } from "lucide-react";
import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";

const STEPS = [
  {
    number: 1,
    icon: UserPlus,
    title: "Cadastre-se em 30 segundos",
    description: "Só precisa de e-mail. Sem burocracia.",
  },
  {
    number: 2,
    icon: ListChecks,
    title: "Diga o que tem e o que falta",
    description: "Cole a lista ou digite. O sistema organiza.",
  },
  {
    number: 3,
    icon: Handshake,
    title: "Combine a troca pelo WhatsApp",
    description: "Veja quem está perto, mande mensagem, marque o encontro.",
  },
];

export function HowItWorksSection() {
  const [headerRef, headerVisible] = useScrollReveal<HTMLDivElement>();
  const [stepsRef, stepsVisible] = useScrollRevealGroup(STEPS.length);

  return (
    <section
      className="px-4 py-32 sm:px-6 md:py-40 bg-surface relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Ethereal background orbs with parallax */}
      <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_20%_30%,rgba(149,170,255,0.06),transparent_60%)] parallax-slow" />
      <div className="absolute inset-0 bg-[radial-gradient(500px_350px_at_80%_70%,rgba(79,243,37,0.04),transparent_60%)] parallax-medium" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div ref={headerRef} className="text-center mb-20">
          <span className={`eyebrow-tag mb-6 inline-flex transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>3 passos</span>
          <h2
            id="how-it-works-heading"
            className={`font-headline font-semibold text-[1.75rem] sm:text-3xl md:text-4xl tracking-[-0.02em] mb-5 text-on-surface text-balance transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-100 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
          >
            Como funciona
          </h2>
          <p className={`text-on-surface-variant max-w-lg mx-auto text-base leading-[1.7] text-pretty transition-[opacity,transform] duration-600 ease-[cubic-bezier(0.16,1,0.3,1)] delay-200 ${headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
            Em 3 passos simples você encontra as figurinhas que faltam e completa seu álbum.
          </p>
        </div>

        {/* Steps grid with double-bezel cards */}
        <div ref={stepsRef} className="grid md:grid-cols-3 gap-6 md:gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const colorSchemes = [
              { shell: "bg-primary/4 ring-1 ring-primary/8", icon: "text-primary", number: "bg-primary", iconBg: "bg-primary/8" },
              { shell: "bg-secondary/3 ring-1 ring-secondary/6", icon: "text-secondary", number: "bg-secondary", iconBg: "bg-secondary/6" },
              { shell: "bg-tertiary/3 ring-1 ring-tertiary/6", icon: "text-tertiary", number: "bg-tertiary", iconBg: "bg-tertiary/6" },
            ][index] ?? { shell: "bg-primary/4 ring-1 ring-primary/8", icon: "text-primary", number: "bg-primary", iconBg: "bg-primary/8" };

            return (
              <div
                key={step.number}
                className={`relative rounded-[1.75rem] p-[3px] ${colorSchemes.shell} transition-[opacity,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-ambient-lg ${stepsVisible[index] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-95"}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="rounded-[calc(1.75rem-3px)] bg-surface-container p-7 md:p-8 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
                  {/* Step number badge */}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full ${colorSchemes.number} text-on-primary flex items-center justify-center font-headline font-medium text-xs shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)] transition-transform duration-300 ${stepsVisible[index] ? "scale-100" : "scale-0"}`} style={{ transitionDelay: `${index * 150 + 200}ms` }}>
                    {step.number}
                  </div>
                  {/* Icon with inner bezel */}
                  <div className={`w-12 h-12 rounded-[0.875rem] ${colorSchemes.iconBg} flex items-center justify-center mx-auto mb-5 mt-1 ${colorSchemes.icon} shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-transform duration-300 hover:scale-110`}>
                    <Icon className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="font-headline font-medium text-lg mb-2 text-on-surface tracking-[-0.01em]">
                    {step.title}
                  </h3>
                  <p className="text-on-surface-variant text-sm leading-[1.65]">
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
