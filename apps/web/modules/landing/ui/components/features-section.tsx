import Link from "next/link";
import { ArrowRight, Shield, Map, Zap } from "lucide-react";
import { FEATURES } from "../../lib/landing-data";

const ICON_MAP = { shield: Shield, map: Map, zap: Zap } as const;

export function FeaturesSection() {
  return (
    <section
      className="px-4 py-32 sm:px-6 md:py-40 relative"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* Features card — Double-bezel architecture */}
          <div className="order-2 lg:order-1">
            <div className="rounded-[2rem] p-[4px] bg-surface-variant/20 ring-1 ring-outline-variant/10">
              <div className="rounded-[calc(2rem-4px)] bg-surface-container-high p-8 md:p-10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
                <div className="space-y-7">
                  {FEATURES.map((feature) => {
                    const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
                    return (
                      <div
                        key={feature.id}
                        className="flex gap-4 items-start"
                      >
                        {/* Icon with double-bezel */}
                        <div className={`shrink-0 rounded-[0.875rem] p-[2px] ${feature.colorClass.replace('bg-', 'bg-').replace('/10', '/8')} ring-1 ring-current/10`}>
                          <div className={`w-10 h-10 rounded-[calc(0.875rem-2px)] flex items-center justify-center ${feature.colorClass}`}>
                            <Icon className="w-[1.125rem] h-[1.125rem]" strokeWidth={1.5} aria-hidden="true" />
                          </div>
                        </div>
                        <div>
                          <h4 className="font-headline font-medium text-base mb-0.5 text-on-surface tracking-[-0.01em]">
                            {feature.title}
                          </h4>
                          <p className="text-on-surface-variant text-sm leading-[1.6]">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            {/* Eyebrow tag */}
            <span className="eyebrow-tag">Por que usar</span>

            <h2
              id="features-heading"
              className="font-headline font-semibold text-[2rem] sm:text-4xl md:text-[2.75rem] leading-[1.15] tracking-[-0.02em] text-on-surface"
            >
              Figurinha Fácil{" "}
              <span className="text-secondary block mt-1">resolve.</span>
            </h2>

            <p className="text-on-surface-variant text-base sm:text-lg leading-[1.7] max-w-md">
              Encontre quem tem o que você precisa — e precisa do que você tem — em minutos.
            </p>

            {/* CTAs with button-in-button */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link
                href="/sign-up"
                className="btn-primary-gradient group flex items-center justify-center"
              >
                Comece a trocar grátis
                <span className="btn-icon-nest">
                  <ArrowRight className="w-4 h-4" strokeWidth={2} />
                </span>
              </Link>
              <Link
                href="/como-funciona"
                className="w-full sm:w-auto flex items-center justify-center h-[3.25rem] px-6 rounded-full border border-outline-variant/25 text-on-surface font-medium text-sm transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface-variant hover:border-outline-variant/40"
              >
                Ver como funciona
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
