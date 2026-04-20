import { UserPlus, ListChecks, Handshake } from "lucide-react";

const STEPS = [
  {
    number: 1,
    icon: UserPlus,
    title: "Crie sua conta em 30 segundos",
    description: "E-mail ou Google. Sem formulários longos, sem espera.",
  },
  {
    number: 2,
    icon: ListChecks,
    title: "Cadastre repetidas e faltantes",
    description: "Digite os números e pronto. O sistema organiza tudo pra você.",
  },
  {
    number: 3,
    icon: Handshake,
    title: "Encontre quem tem o que você precisa",
    description: "Matches automáticos com colecionadores perto de você. Combine via WhatsApp.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="px-6 py-24 bg-surface relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Subtle background pattern — refined */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(149,170,255,0.04),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,243,37,0.03),transparent_50%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2
            id="how-it-works-heading"
            className="font-headline font-bold text-3xl md:text-4xl tracking-tight mb-4 text-on-surface"
          >
            Como funciona
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto text-base md:text-lg">
            Em 3 passos simples você encontra as figurinhas que faltam e completa seu álbum.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const colorSchemes = [
              { bg: "bg-primary/6", icon: "text-primary", number: "bg-primary" },
              { bg: "bg-secondary/5", icon: "text-secondary", number: "bg-secondary" },
              { bg: "bg-tertiary/5", icon: "text-tertiary", number: "bg-tertiary" },
            ][index] ?? { bg: "bg-primary/6", icon: "text-primary", number: "bg-primary" };

            return (
              <div
                key={step.number}
                className={`relative ${colorSchemes.bg} rounded-2xl p-8 border border-outline-variant/10 text-center`}
              >
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full ${colorSchemes.number} text-on-primary flex items-center justify-center font-headline font-bold text-sm shadow-sm`}>
                  {step.number}
                </div>
                <div className={`w-14 h-14 rounded-xl bg-surface-container flex items-center justify-center mx-auto mb-6 mt-2 ${colorSchemes.icon}`}>
                  <Icon className="w-7 h-7" aria-hidden="true" />
                </div>
                <h3 className="font-headline font-semibold text-xl mb-3 text-on-surface">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">
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
