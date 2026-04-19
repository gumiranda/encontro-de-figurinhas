import { Users, MapPin, RefreshCw, Star } from "lucide-react";

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
    value: "150+",
    label: "Cidades cobertas",
    color: "text-[var(--tertiary)]",
  },
  {
    icon: Star,
    value: "4.8",
    label: "Avaliação média",
    color: "text-yellow-500",
  },
];

export function SocialProofSection() {
  return (
    <section className="px-6 py-12 bg-[var(--surface-container-low)]/50 border-y border-[var(--outline-variant)]/10">
      <div className="max-w-7xl mx-auto">
        <p className="text-center text-[var(--outline)] text-sm uppercase tracking-widest mb-8">
          A maior comunidade de troca de figurinhas do Brasil
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center">
                <div className="flex justify-center mb-2">
                  <Icon className={`w-6 h-6 ${stat.color}`} aria-hidden="true" />
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
