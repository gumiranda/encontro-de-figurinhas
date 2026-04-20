import { UserPlus, ListChecks, Handshake } from "lucide-react";

const STEPS = [
  {
    number: 1,
    icon: UserPlus,
    title: "Crie sua conta em 30 segundos",
    description: "Cadastro rápido, sem burocracia. Use seu e-mail ou conta Google.",
  },
  {
    number: 2,
    icon: ListChecks,
    title: "Cadastre repetidas e faltantes",
    description: "Marque as figurinhas que você tem de sobra e as que precisa completar.",
  },
  {
    number: 3,
    icon: Handshake,
    title: "Encontre trocas e combine",
    description: "Veja no mapa quem está perto e combine o encontro para realizar a troca.",
  },
];

export function HowItWorksSection() {
  return (
    <section
      className="px-6 py-32 bg-surface relative overflow-hidden"
      aria-labelledby="how-it-works-heading"
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(149,170,255,0.08),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(79,243,37,0.05),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2
            id="how-it-works-heading"
            className="font-headline font-black text-4xl md:text-6xl tracking-tight mb-6 text-on-surface"
          >
            Como funciona
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto text-lg md:text-xl">
            Em 3 passos simples você encontra as figurinhas que faltam e completa seu álbum.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            const colorSchemes = [
              { bg: "from-primary/20 to-primary-dim/30", icon: "text-primary", number: "bg-gradient-to-br from-primary to-primary-dim", glow: "shadow-[0_0_30px_rgba(149,170,255,0.3)]" },
              { bg: "from-secondary/15 to-secondary-dim/25", icon: "text-secondary", number: "bg-gradient-to-br from-secondary to-secondary-dim", glow: "shadow-[0_0_30px_rgba(79,243,37,0.25)]" },
              { bg: "from-tertiary/15 to-tertiary-dim/25", icon: "text-tertiary", number: "bg-gradient-to-br from-tertiary to-tertiary-dim", glow: "shadow-[0_0_30px_rgba(255,201,101,0.25)]" },
            ][index] ?? { bg: "from-primary/20 to-primary-dim/30", icon: "text-primary", number: "bg-primary", glow: "" };

            return (
              <div
                key={step.number}
                className={`relative bg-gradient-to-br ${colorSchemes.bg} rounded-3xl p-10 border border-outline-variant/15 text-center transition-transform hover:scale-[1.02] hover:-translate-y-1 ${colorSchemes.glow}`}
              >
                <div className={`absolute -top-5 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full ${colorSchemes.number} text-on-primary flex items-center justify-center font-headline font-black text-lg shadow-lg`}>
                  {step.number}
                </div>
                <div className={`w-20 h-20 rounded-2xl bg-surface-container flex items-center justify-center mx-auto mb-8 mt-4 ${colorSchemes.icon}`}>
                  <Icon className="w-10 h-10" aria-hidden="true" />
                </div>
                <h3 className="font-headline font-bold text-2xl mb-4 text-on-surface">
                  {step.title}
                </h3>
                <p className="text-on-surface-variant leading-relaxed">
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
