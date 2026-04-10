import Link from "next/link";
import { Rocket } from "lucide-react";
import { FeatureItem } from "./feature-item";
import { FEATURES } from "../../lib/landing-data";

export function FeaturesSection() {
  return (
    <section
      className="px-6 py-24 relative overflow-hidden"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-0 bg-[var(--landing-primary)]/5 -skew-y-3 origin-right" />
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-br from-[var(--landing-secondary)]/30 to-[var(--landing-primary)]/30 blur-2xl opacity-20" />
              <div className="relative bg-[var(--landing-surface-container-high)] rounded-3xl p-8 border border-[var(--landing-outline-variant)]/10">
                <div className="space-y-6">
                  {FEATURES.map((feature) => (
                    <FeatureItem
                      key={feature.id}
                      icon={feature.icon as "shield" | "map" | "zap"}
                      title={feature.title}
                      description={feature.description}
                      colorClass={feature.colorClass}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2 space-y-8">
            <h2
              id="features-heading"
              className="font-[var(--font-headline)] font-black text-4xl md:text-6xl leading-tight text-[var(--landing-on-surface)]"
            >
              Preparado para completar seu{" "}
              <span className="text-[var(--landing-secondary)]">album?</span>
            </h2>
            <p className="text-[var(--landing-on-surface-variant)] text-lg font-[var(--font-body)]">
              Junte-se a milhares de colecionadores e transforme sua jornada em uma
              experiencia de elite.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="px-8 py-4 bg-[var(--landing-primary)] text-[var(--landing-on-primary)] font-bold rounded-xl shadow-lg shadow-[var(--landing-primary)]/20 hover:shadow-[var(--landing-primary)]/40 transition-all flex items-center justify-center gap-2"
              >
                COMECAR AGORA
                <Rocket className="w-5 h-5" aria-hidden="true" />
              </Link>
              <Link
                href="#"
                className="px-8 py-4 bg-transparent border border-[var(--landing-outline-variant)]/30 text-[var(--landing-on-surface)] font-bold rounded-xl hover:bg-[var(--landing-surface-variant)] transition-all text-center"
              >
                SAIBA MAIS
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
