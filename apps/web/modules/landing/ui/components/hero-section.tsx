import Link from "next/link";
import { Landmark } from "lucide-react";
import { CitySearch } from "./city-search";

interface HeroSectionProps {
  totalTrocas?: string | null;
}

export function HeroSection({ totalTrocas }: HeroSectionProps) {
  return (
    <section
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-20 sm:px-6 md:py-32"
      aria-labelledby="hero-heading"
    >
      <div className="grid items-center gap-12 md:grid-cols-2 lg:gap-20">
        <div className="z-10 space-y-8">
          <span className="tag-chip animate-fade-in-up opacity-0">
            <span className="pulse-dot" aria-hidden="true" />
            12.400+ trocas realizadas · 847 cidades
          </span>

          <h1
            id="hero-heading"
            className="font-headline text-4xl font-bold leading-tight tracking-tight text-on-surface sm:text-5xl lg:text-6xl animate-fade-in-up opacity-0 delay-100"
          >
            Pare de acumular repetidas.{" "}
            <span className="text-gradient-primary block sm:inline">Comece a trocar hoje.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant sm:text-xl animate-fade-in-up opacity-0 delay-200">
            Cadastre suas repetidas, encontre quem precisa delas — e quem tem as que você procura. Match automático, troca presencial.
          </p>

          <div className="rounded-2xl border border-outline-variant/30 bg-surface-container p-5 shadow-soft animate-fade-in-up opacity-0 delay-300">
            <CitySearch />
          </div>

          <dl className="grid grid-cols-3 gap-3 pt-2 animate-fade-in-up opacity-0 delay-400">
            <StatHero
              value={totalTrocas ?? "12.4k"}
              label="Colecionadores"
              tone="primary"
              featured
            />
            <Stat value="842" label="Pontos" tone="secondary" />
            <Stat value="98%" label="Match" tone="tertiary" />
          </dl>

          <div className="flex flex-col gap-4 pt-4 sm:flex-row animate-fade-in-up opacity-0 delay-500">
            <Link
              href="/sign-up"
              className="btn-primary-gradient btn-primary-gradient-xl flex items-center justify-center px-10 text-center"
            >
              Começar a trocar agora
            </Link>
            <Link
              href="/como-funciona"
              className="flex h-12 items-center justify-center rounded-lg border border-outline-variant/40 px-6 font-semibold text-sm uppercase tracking-wide text-on-surface transition-colors hover:bg-surface-variant hover:border-outline-variant/60"
            >
              Como funciona
            </Link>
          </div>
        </div>

        <div className="hidden md:block animate-fade-in-scale opacity-0 delay-300">
          <ArenaVisual />
        </div>
      </div>

      <AeoExplainer />
    </section>
  );
}

function StatHero({
  value,
  label,
  tone,
  featured,
}: {
  value: string;
  label: string;
  tone: "primary" | "secondary" | "tertiary";
  featured?: boolean;
}) {
  const toneStyles = {
    primary: {
      text: "text-primary",
      bg: "bg-primary/8",
      border: "border-primary/20",
    },
    secondary: {
      text: "text-secondary",
      bg: "bg-secondary/6",
      border: "border-secondary/15",
    },
    tertiary: {
      text: "text-tertiary",
      bg: "bg-tertiary/6",
      border: "border-tertiary/15",
    },
  }[tone];

  if (featured) {
    return (
      <div className={`rounded-xl border ${toneStyles.border} ${toneStyles.bg} p-4 text-center row-span-1`}>
        <dd className={`font-headline text-3xl font-bold ${toneStyles.text} animate-number-pop`}>
          {value}
        </dd>
        <dt className="mt-1.5 text-xs uppercase tracking-wide text-on-surface-variant font-medium">
          {label}
        </dt>
      </div>
    );
  }

  return (
    <div className={`rounded-lg border ${toneStyles.border} ${toneStyles.bg} p-3 text-center`}>
      <dd className={`font-headline text-xl font-bold ${toneStyles.text}`}>
        {value}
      </dd>
      <dt className="mt-1 text-[0.6875rem] uppercase tracking-wide text-on-surface-variant">
        {label}
      </dt>
    </div>
  );
}

function Stat({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneStyles = {
    primary: {
      text: "text-primary",
      bg: "bg-primary/6",
      border: "border-primary/15",
    },
    secondary: {
      text: "text-secondary",
      bg: "bg-secondary/5",
      border: "border-secondary/12",
    },
    tertiary: {
      text: "text-tertiary",
      bg: "bg-tertiary/5",
      border: "border-tertiary/12",
    },
  }[tone];

  return (
    <div className={`rounded-lg border ${toneStyles.border} ${toneStyles.bg} p-3 text-center`}>
      <dd className={`font-headline text-xl font-bold ${toneStyles.text}`}>
        {value}
      </dd>
      <dt className="mt-1 text-[0.6875rem] uppercase tracking-wide text-on-surface-variant">
        {label}
      </dt>
    </div>
  );
}

function ArenaVisual() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-md"
      role="img"
      aria-label="Arena visual com colecionadores ativos em cidades próximas"
    >
      {/* Background glow — refined */}
      <div className="absolute inset-0 rounded-full stadium-glow opacity-60" />

      {/* Animated rings — refined opacity */}
      <div className="absolute inset-[5%] rounded-full border border-primary/20 arena-ring arena-ring-1" />
      <div className="absolute inset-[18%] rounded-full border border-secondary/15 arena-ring arena-ring-2" />
      <div className="absolute inset-[32%] rounded-full border border-tertiary/12 arena-ring arena-ring-3" />

      {/* Radar sweep */}
      <div className="radar-sweep opacity-70" aria-hidden="true" />

      {/* Center landmark — refined */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="relative flex h-18 w-18 items-center justify-center rounded-full bg-primary shadow-lg">
          <Landmark
            className="h-9 w-9 text-on-primary"
            aria-hidden="true"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Floating pins — refined */}
      <PeripheralPin top="10%" left="55%" value="12" tone="secondary" />
      <PeripheralPin top="60%" left="12%" value="8" tone="tertiary" />
      <PeripheralPin top="75%" left="78%" value="23" tone="primary" />
      <PeripheralPin top="30%" left="85%" value="5" tone="secondary" />
    </div>
  );
}

function PeripheralPin({
  top,
  left,
  value,
  tone,
}: {
  top: string;
  left: string;
  value: string;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneStyles = {
    primary: { bg: "bg-primary", text: "text-on-primary" },
    secondary: { bg: "bg-secondary", text: "text-on-secondary" },
    tertiary: { bg: "bg-tertiary", text: "text-on-tertiary" },
  }[tone];

  return (
    <div
      className={`absolute flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-headline text-sm font-bold shadow-md animate-float-pin ${toneStyles.bg} ${toneStyles.text}`}
      style={{ top, left }}
      aria-hidden="true"
    >
      {value}
    </div>
  );
}

function AeoExplainer() {
  return (
    <div className="mt-12 max-w-3xl rounded-2xl border border-[var(--outline-variant)]/25 bg-[var(--surface-container-low)] p-6">
      <h2 className="mb-2 font-[var(--font-headline)] text-lg font-bold text-[var(--on-surface)]">
        O que é o Figurinha Fácil?
      </h2>
      <p className="text-[var(--on-surface-variant)]">
        A rede de troca de figurinhas da Copa 2026. Cadastre repetidas e faltantes, encontre matches perto de você, combine via WhatsApp. 670 figurinhas no álbum, milhares de colecionadores ativos. Gratuito.
      </p>
    </div>
  );
}
