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
      className="px-4 py-32 sm:px-6 md:py-40 bg-surface relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Ethereal background orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(600px_400px_at_20%_30%,rgba(149,170,255,0.06),transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(500px_350px_at_80%_70%,rgba(79,243,37,0.04),transparent_60%)]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="eyebrow-tag mb-6 inline-flex">3 passos</span>
          <h2
            id="how-it-works-heading"
            className="font-headline font-semibold text-[1.75rem] sm:text-3xl md:text-4xl tracking-[-0.02em] mb-5 text-on-surface"
          >
            Como funciona
          </h2>
          <p className="text-on-surface-variant max-w-lg mx-auto text-base leading-[1.7]">
            Em 3 passos simples você encontra as figurinhas que faltam e completa seu álbum.
          </p>
        </div>

        {/* Steps grid with double-bezel cards */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8">
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
                className={`relative rounded-[1.75rem] p-[3px] ${colorSchemes.shell}`}
              >
                <div className="rounded-[calc(1.75rem-3px)] bg-surface-container p-7 md:p-8 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
                  {/* Step number badge */}
                  <div className={`absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full ${colorSchemes.number} text-on-primary flex items-center justify-center font-headline font-medium text-xs shadow-[0_2px_8px_-2px_rgba(0,0,0,0.3)]`}>
                    {step.number}
                  </div>
                  {/* Icon with inner bezel */}
                  <div className={`w-12 h-12 rounded-[0.875rem] ${colorSchemes.iconBg} flex items-center justify-center mx-auto mb-5 mt-1 ${colorSchemes.icon} shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]`}>
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
