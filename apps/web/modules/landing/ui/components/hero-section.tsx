import Link from "next/link";
import { Landmark, ArrowRight } from "lucide-react";
import { CitySearch } from "./city-search";

interface HeroSectionProps {
  totalTrocas?: string | null;
}

export function HeroSection({ totalTrocas }: HeroSectionProps) {
  return (
    <section
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-24 sm:px-6 md:py-40"
      aria-labelledby="hero-heading"
    >
      <div className="grid items-center gap-16 md:grid-cols-2 lg:gap-24">
        <div className="z-10 space-y-10">
          {/* Eyebrow tag */}
          <span className="tag-chip animate-fade-in-up opacity-0">
            <span className="pulse-dot" aria-hidden="true" />
            12.400+ trocas realizadas · 847 cidades
          </span>

          {/* Hero headline — premium typography */}
          <h1
            id="hero-heading"
            className="font-headline text-[2.5rem] font-semibold leading-[1.1] tracking-[-0.02em] text-on-surface sm:text-5xl lg:text-[3.5rem] animate-fade-in-up opacity-0 delay-100"
          >
            Pare de acumular repetidas.{" "}
            <span className="text-gradient-primary block sm:inline mt-1 sm:mt-0">
              Comece a trocar hoje.
            </span>
          </h1>

          <p className="max-w-lg text-base leading-[1.7] text-on-surface-variant sm:text-lg animate-fade-in-up opacity-0 delay-200">
            Cadastre suas repetidas, encontre quem precisa delas — e quem tem as que você procura. Match automático, troca presencial.
          </p>

          {/* Double-bezel search container */}
          <div className="card-shell animate-fade-in-up opacity-0 delay-300">
            <div className="card-core p-5">
              <CitySearch />
            </div>
          </div>

          {/* Stats with premium spacing */}
          <dl className="grid grid-cols-3 gap-4 pt-4 animate-fade-in-up opacity-0 delay-400">
            <StatHero
              value={totalTrocas ?? "12.4k"}
              label="Colecionadores"
              tone="primary"
              featured
            />
            <Stat value="842" label="Pontos" tone="secondary" />
            <Stat value="98%" label="Match" tone="tertiary" />
          </dl>

          {/* CTAs with button-in-button pattern */}
          <div className="flex flex-col gap-4 pt-6 sm:flex-row animate-fade-in-up opacity-0 delay-500">
            <Link
              href="/sign-up"
              className="btn-primary-gradient btn-primary-gradient-xl group flex items-center justify-center text-center"
            >
              Começar a trocar
              <span className="btn-icon-nest">
                <ArrowRight className="w-4 h-4" strokeWidth={2} />
              </span>
            </Link>
            <Link
              href="/como-funciona"
              className="flex h-[3.5rem] items-center justify-center rounded-full border border-outline-variant/30 px-7 font-medium text-sm text-on-surface transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-surface-variant hover:border-outline-variant/50"
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
      shell: "bg-primary/5 ring-1 ring-primary/10",
      core: "bg-surface-container",
    },
    secondary: {
      text: "text-secondary",
      shell: "bg-secondary/4 ring-1 ring-secondary/8",
      core: "bg-surface-container",
    },
    tertiary: {
      text: "text-tertiary",
      shell: "bg-tertiary/4 ring-1 ring-tertiary/8",
      core: "bg-surface-container",
    },
  }[tone];

  if (featured) {
    return (
      <div className={`rounded-[1.25rem] p-[3px] ${toneStyles.shell}`}>
        <div className={`rounded-[calc(1.25rem-3px)] ${toneStyles.core} p-4 text-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.06)]`}>
          <dd className={`font-headline text-[1.75rem] font-semibold tracking-[-0.01em] ${toneStyles.text} animate-number-pop`}>
            {value}
          </dd>
          <dt className="mt-1 text-[0.625rem] uppercase tracking-[0.12em] text-on-surface-variant font-medium">
            {label}
          </dt>
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-[1rem] p-[2px] ${toneStyles.shell}`}>
      <div className={`rounded-[calc(1rem-2px)] ${toneStyles.core} p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`}>
        <dd className={`font-headline text-xl font-semibold tracking-[-0.01em] ${toneStyles.text}`}>
          {value}
        </dd>
        <dt className="mt-0.5 text-[0.5625rem] uppercase tracking-[0.1em] text-on-surface-variant">
          {label}
        </dt>
      </div>
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
      shell: "bg-primary/4 ring-1 ring-primary/8",
      core: "bg-surface-container",
    },
    secondary: {
      text: "text-secondary",
      shell: "bg-secondary/3 ring-1 ring-secondary/6",
      core: "bg-surface-container",
    },
    tertiary: {
      text: "text-tertiary",
      shell: "bg-tertiary/3 ring-1 ring-tertiary/6",
      core: "bg-surface-container",
    },
  }[tone];

  return (
    <div className={`rounded-[1rem] p-[2px] ${toneStyles.shell}`}>
      <div className={`rounded-[calc(1rem-2px)] ${toneStyles.core} p-3 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`}>
        <dd className={`font-headline text-lg font-semibold tracking-[-0.01em] ${toneStyles.text}`}>
          {value}
        </dd>
        <dt className="mt-0.5 text-[0.5625rem] uppercase tracking-[0.1em] text-on-surface-variant">
          {label}
        </dt>
      </div>
    </div>
  );
}

function ArenaVisual() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[26rem]"
      role="img"
      aria-label="Arena visual com colecionadores ativos em cidades próximas"
    >
      {/* Background glow — premium ethereal */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(55,102,255,0.12)_0%,transparent_70%)]" />

      {/* Animated rings — premium hairline */}
      <div className="absolute inset-[5%] rounded-full border border-primary/15 arena-ring arena-ring-1" />
      <div className="absolute inset-[18%] rounded-full border border-secondary/10 arena-ring arena-ring-2" />
      <div className="absolute inset-[32%] rounded-full border border-tertiary/8 arena-ring arena-ring-3" />

      {/* Radar sweep */}
      <div className="radar-sweep opacity-60" aria-hidden="true" />

      {/* Center landmark — double-bezel architecture */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="rounded-full p-[3px] bg-primary/20 ring-1 ring-primary/30">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-[0_4px_24px_-4px_rgba(149,170,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <Landmark
              className="h-7 w-7 text-on-primary"
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      {/* Floating pins — premium */}
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
    primary: {
      shell: "bg-primary/15 ring-1 ring-primary/25",
      core: "bg-primary",
      text: "text-on-primary",
    },
    secondary: {
      shell: "bg-secondary/12 ring-1 ring-secondary/20",
      core: "bg-secondary",
      text: "text-on-secondary",
    },
    tertiary: {
      shell: "bg-tertiary/12 ring-1 ring-tertiary/20",
      core: "bg-tertiary",
      text: "text-on-tertiary",
    },
  }[tone];

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-[2px] animate-float-pin ${toneStyles.shell}`}
      style={{ top, left }}
      aria-hidden="true"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-full font-headline text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${toneStyles.core} ${toneStyles.text}`}>
        {value}
      </div>
    </div>
  );
}

function AeoExplainer() {
  return (
    <div className="mt-20 max-w-3xl">
      {/* Double-bezel card */}
      <div className="rounded-[1.5rem] p-[3px] bg-surface-variant/30 ring-1 ring-outline-variant/15">
        <div className="rounded-[calc(1.5rem-3px)] bg-surface-container-low p-6 shadow-[inset_0_1px_1px_rgba(255,255,255,0.04)]">
          <h2 className="mb-3 font-headline text-base font-semibold tracking-[-0.01em] text-on-surface">
            O que é o Figurinha Fácil?
          </h2>
          <p className="text-sm text-on-surface-variant leading-[1.7]">
            <strong className="text-on-surface font-medium">Figurinha Fácil é uma plataforma gratuita que conecta colecionadores de figurinhas da Copa do Mundo 2026 em todo o Brasil.</strong>{" "}
            Usuários cadastram suas figurinhas repetidas e faltantes, o sistema encontra automaticamente outros colecionadores com necessidades complementares (matches), e as trocas são combinadas via WhatsApp em pontos de encontro verificados. Mais de 10.000 colecionadores ativos em 150+ cidades.
          </p>
        </div>
      </div>
    </div>
  );
}
