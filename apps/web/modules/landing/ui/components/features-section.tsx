import Link from "next/link";
import { Rocket, Shield, Map, Zap } from "lucide-react";
import { FEATURES } from "../../lib/landing-data";

const ICON_MAP = { shield: Shield, map: Map, zap: Zap } as const;

export function FeaturesSection() {
  return (
    <section
      className="px-6 py-32 relative"
      aria-labelledby="features-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="bg-surface-container-high rounded-3xl p-10 border border-outline-variant/20">
                <div className="space-y-8">
                  {FEATURES.map((feature, index) => {
                    const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
                    return (
                      <div
                        key={feature.id}
                        className="flex gap-4 items-start"
                      >
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${feature.colorClass}`}>
                          <Icon className="w-5 h-5" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="font-headline font-semibold text-lg mb-1 text-on-surface">
                            {feature.title}
                          </h4>
                          <p className="text-on-surface-variant text-sm leading-relaxed">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
          </div>

          <div className="order-1 lg:order-2 space-y-6">
            <h2
              id="features-heading"
              className="font-headline font-bold text-4xl md:text-5xl leading-tight tracking-tight text-on-surface"
            >
              Figurinha Fácil{" "}
              <span className="text-secondary block mt-1">resolve.</span>
            </h2>
            <p className="text-on-surface-variant text-lg leading-relaxed max-w-lg">
              Encontre quem tem o que você precisa — e precisa do que você tem — em minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Link
                href="/sign-up"
                className="btn-primary-gradient flex items-center justify-center gap-2"
              >
                Comece a trocar grátis
                <Rocket className="w-4 h-4" aria-hidden="true" />
              </Link>
              <Link
                href="/como-funciona"
                className="w-full sm:w-auto px-6 py-3 border border-outline-variant/30 text-on-surface font-medium text-sm rounded-lg hover:bg-surface-variant transition-colors text-center"
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
