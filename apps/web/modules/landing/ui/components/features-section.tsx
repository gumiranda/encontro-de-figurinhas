import Link from "next/link";
import { Rocket, Shield, Map, Zap } from "lucide-react";
import { FEATURES } from "../../lib/landing-data";

const ICON_MAP = { shield: Shield, map: Map, zap: Zap } as const;

export function FeaturesSection() {
  return (
    <section
      className="px-6 py-32 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      {/* Bold diagonal background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/5 -skew-y-2 origin-right" />
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent blur-3xl" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              {/* Dramatic glow behind card */}
              <div className="absolute -inset-8 bg-gradient-to-br from-secondary/40 via-primary/30 to-tertiary/20 blur-3xl opacity-30" />
              <div className="relative bg-gradient-to-br from-surface-container-high to-surface-container rounded-3xl p-10 border border-outline-variant/20 shadow-2xl">
                <div className="space-y-8">
                  {FEATURES.map((feature, index) => {
                    const Icon = ICON_MAP[feature.icon as keyof typeof ICON_MAP];
                    return (
                      <div
                        key={feature.id}
                        className="flex gap-5 items-start group"
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${feature.colorClass}`}>
                          <Icon className="w-7 h-7" aria-hidden="true" />
                        </div>
                        <div>
                          <h4 className="font-headline font-bold text-xl mb-2 text-on-surface">
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
          </div>

          <div className="order-1 lg:order-2 space-y-10">
            <h2
              id="features-heading"
              className="font-headline font-black text-5xl md:text-7xl leading-[0.95] tracking-tight text-on-surface"
            >
              Figurinha Fácil{" "}
              <span className="text-secondary block mt-2">resolve.</span>
            </h2>
            <p className="text-on-surface-variant text-xl leading-relaxed max-w-lg">
              Encontre quem tem o que você precisa — e precisa do que você tem — em minutos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/sign-up"
                className="btn-primary-gradient btn-primary-gradient-xl flex items-center justify-center gap-3"
              >
                COMECE A TROCAR GRÁTIS
                <Rocket className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="/como-funciona"
                className="w-full sm:w-auto px-8 py-4 bg-transparent border-2 border-outline-variant/40 text-on-surface font-bold rounded-xl hover:bg-surface-variant hover:border-primary/30 transition-all text-center hover:scale-[1.02]"
              >
                VER COMO FUNCIONA
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
