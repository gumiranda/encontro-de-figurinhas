import { UserPlus, ListChecks, Handshake } from "lucide-react";

const STEPS = [
  {
    number: 1,
    icon: UserPlus,
    title: "Cadastre-se grátis",
    description: "Crie sua conta em segundos e informe quais figurinhas você tem repetidas e quais precisa.",
  },
  {
    number: 2,
    icon: ListChecks,
    title: "Encontre matches",
    description: "Nossa plataforma conecta você automaticamente com colecionadores que têm o que você precisa.",
  },
  {
    number: 3,
    icon: Handshake,
    title: "Troque e complete",
    description: "Combine um ponto de encontro seguro na sua cidade e realize a troca presencialmente.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="px-6 py-24 bg-[var(--surface)]"
      aria-labelledby="how-it-works-heading"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2
            id="how-it-works-heading"
            className="font-[var(--font-headline)] font-bold text-3xl md:text-5xl tracking-tight mb-4 text-[var(--on-surface)]"
          >
            Como funciona
          </h2>
          <p className="text-[var(--on-surface-variant)] max-w-2xl mx-auto font-[var(--font-body)]">
            Em apenas 3 passos simples você encontra as figurinhas que faltam no seu álbum.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative bg-[var(--surface-container)] rounded-2xl p-8 border border-[var(--outline-variant)]/10 text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                  {step.number}
                </div>
                <div className="w-16 h-16 rounded-2xl bg-[var(--primary)]/10 flex items-center justify-center mx-auto mb-6 mt-4">
                  <Icon className="w-8 h-8 text-[var(--primary)]" aria-hidden="true" />
                </div>
                <h3 className="font-[var(--font-headline)] font-bold text-xl mb-3 text-[var(--on-surface)]">
                  {step.title}
                </h3>
                <p className="text-[var(--on-surface-variant)] font-[var(--font-body)]">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
