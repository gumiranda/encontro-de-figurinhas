"use client";

import { Users, MapPin, RefreshCw, Building2 } from "lucide-react";
import { useScrollReveal, useScrollRevealGroup } from "@/hooks/use-scroll-reveal";

const STATS = [
  {
    icon: Users,
    value: "10.000+",
    label: "Colecionadores ativos",
    color: "text-[var(--primary)]",
  },
  {
    icon: RefreshCw,
    value: "50.000+",
    label: "Trocas realizadas",
    color: "text-[var(--secondary)]",
  },
  {
    icon: MapPin,
    value: "800+",
    label: "Pontos de troca",
    color: "text-[var(--tertiary)]",
  },
  {
    icon: Building2,
    value: "150+",
    label: "Cidades cobertas",
    color: "text-yellow-500",
  },
];

export function SocialProofSection() {
  const [sectionRef, isVisible] = useScrollReveal<HTMLElement>();
  const [statsRef, statsVisible] = useScrollRevealGroup(STATS.length);

  return (
    <section
      ref={sectionRef}
      className="px-6 py-12 bg-[var(--surface-container-low)]/50 border-y border-[var(--outline-variant)]/10"
    >
      <div className="max-w-7xl mx-auto">
        <p className={`text-center text-[var(--outline)] text-sm uppercase tracking-widest mb-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          Onde colecionadores completam o álbum mais rápido
        </p>
        <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`text-center transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${statsVisible[index] ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-95"}`}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="flex justify-center mb-2">
                  <Icon
                    className={`w-6 h-6 ${stat.color} transition-transform duration-300 hover:scale-125`}
                    aria-hidden="true"
                  />
                </div>
                <p className={`font-[var(--font-headline)] font-bold text-3xl md:text-4xl ${stat.color}`}>
                  {stat.value}
                </p>
                <p className="text-[var(--outline)] text-sm mt-1">
                  {stat.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
