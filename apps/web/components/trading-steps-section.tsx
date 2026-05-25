"use client";

import Link from "next/link";
import { useScrollRevealGroup } from "@/hooks/use-scroll-reveal";
import { Button } from "@workspace/ui/components/button";
import { ArrowRight, UserPlus, ListChecks, Handshake } from "lucide-react";

const STEPS = [
  {
    num: "01",
    Icon: UserPlus,
    title: "Cadastre-se grátis",
    desc: "Crie sua conta em segundos. Sem cartão, sem compromisso.",
  },
  {
    num: "02",
    Icon: ListChecks,
    title: "Marque suas figurinhas",
    desc: 'Indique quais você tem repetidas e quais precisa.',
  },
  {
    num: "03",
    Icon: Handshake,
    title: "Encontre um match",
    desc: "Conectamos você com quem tem o que você precisa.",
  },
];

interface TradingStepsSectionProps {
  displayLabel: string;
}

export function TradingStepsSection({ displayLabel }: TradingStepsSectionProps) {
  const [stepsRef, stepsVisible] = useScrollRevealGroup(STEPS.length);

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Steps Column */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-8 text-foreground">
              Como conseguir a {displayLabel}
            </h2>

            <div ref={stepsRef} className="relative space-y-0">
              {/* Timeline connector */}
              <div className="absolute left-[1.75rem] top-12 bottom-12 w-px bg-gradient-to-b from-primary/40 via-primary/20 to-transparent hidden md:block" />

              {STEPS.map((step, index) => (
                <div
                  key={step.num}
                  className={`relative flex gap-6 pb-8 last:pb-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    stepsVisible[index]
                      ? "opacity-100 translate-x-0"
                      : "opacity-0 -translate-x-4"
                  }`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  {/* Number circle */}
                  <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <span className="font-mono text-lg font-bold text-primary">
                      {step.num}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="pt-2">
                    <div className="flex items-center gap-2 mb-1">
                      <step.Icon className="w-4 h-4 text-primary" />
                      <h3 className="font-semibold text-lg text-foreground">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Column */}
          <div className="lg:col-span-2">
            <div className="glass-ethereal rounded-2xl p-6 md:p-8 sticky top-24">
              <p className="text-sm text-muted-foreground mb-2">
                Procurando a figurinha
              </p>
              <p className="font-mono text-2xl font-bold text-foreground mb-4">
                {displayLabel}?
              </p>
              <p className="text-muted-foreground text-sm mb-6">
                Milhares de colecionadores cadastrados. Encontre quem tem ela repetida.
              </p>
              <Button asChild className="w-full">
                <Link href="/sign-up">
                  Criar conta grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
