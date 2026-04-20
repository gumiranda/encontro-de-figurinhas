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
            className="font-headline text-5xl font-black leading-[0.95] tracking-tighter text-on-surface sm:text-6xl lg:text-7xl xl:text-8xl animate-fade-in-up opacity-0 delay-100"
          >
            Pare de acumular repetidas.{" "}
            <span className="text-gradient-primary block sm:inline">Comece a trocar hoje.</span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-on-surface-variant sm:text-xl animate-fade-in-up opacity-0 delay-200">
            Cadastre suas figurinhas em 30 segundos. O sistema encontra quem tem
            o que você precisa — e precisa do que você tem.
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
              Encontrar trocas na minha cidade
            </Link>
            <Link
              href="/como-funciona"
              className="flex h-14 items-center justify-center rounded-xl border-2 border-outline-variant/50 px-8 font-bold uppercase tracking-wider text-on-surface transition-all hover:bg-surface-variant hover:border-primary/40 hover:scale-[1.02]"
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
      bg: "bg-gradient-to-br from-primary/15 to-primary-dim/25",
      border: "border-primary/30",
      glow: "shadow-[0_0_20px_rgba(149,170,255,0.2)]",
    },
    secondary: {
      text: "text-secondary",
      bg: "bg-gradient-to-br from-secondary/10 to-secondary-dim/20",
      border: "border-secondary/25",
      glow: "shadow-[0_0_20px_rgba(79,243,37,0.15)]",
    },
    tertiary: {
      text: "text-tertiary",
      bg: "bg-gradient-to-br from-tertiary/10 to-tertiary-dim/20",
      border: "border-tertiary/25",
      glow: "shadow-[0_0_20px_rgba(255,201,101,0.15)]",
    },
  }[tone];

  if (featured) {
    return (
      <div className={`rounded-2xl border-2 ${toneStyles.border} ${toneStyles.bg} p-5 text-center ${toneStyles.glow} row-span-1`}>
        <dd className={`font-headline text-4xl font-black ${toneStyles.text} animate-number-pop`}>
          {value}
        </dd>
        <dt className="mt-2 text-xs uppercase tracking-widest text-on-surface-variant font-semibold">
          {label}
        </dt>
      </div>
    );
  }

  return (
    <div className={`rounded-xl border ${toneStyles.border} ${toneStyles.bg} p-4 text-center`}>
      <dd className={`font-headline text-2xl font-black ${toneStyles.text}`}>
        {value}
      </dd>
      <dt className="mt-1 text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
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
      bg: "bg-gradient-to-br from-primary/10 to-primary-dim/15",
      border: "border-primary/20",
    },
    secondary: {
      text: "text-secondary",
      bg: "bg-gradient-to-br from-secondary/10 to-secondary-dim/15",
      border: "border-secondary/20",
    },
    tertiary: {
      text: "text-tertiary",
      bg: "bg-gradient-to-br from-tertiary/10 to-tertiary-dim/15",
      border: "border-tertiary/20",
    },
  }[tone];

  return (
    <div className={`rounded-xl border ${toneStyles.border} ${toneStyles.bg} p-4 text-center`}>
      <dd className={`font-headline text-2xl font-black ${toneStyles.text}`}>
        {value}
      </dd>
      <dt className="mt-1 text-[0.6875rem] uppercase tracking-widest text-on-surface-variant">
        {label}
      </dt>
    </div>
  );
}

function ArenaVisual() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-lg"
      role="img"
      aria-label="Arena visual com colecionadores ativos em cidades próximas"
    >
      {/* Background glow */}
      <div className="absolute inset-0 rounded-full stadium-glow" />

      {/* Animated rings */}
      <div className="absolute inset-[5%] rounded-full border-2 border-primary/30 arena-ring arena-ring-1" />
      <div className="absolute inset-[18%] rounded-full border border-secondary/25 arena-ring arena-ring-2" />
      <div className="absolute inset-[32%] rounded-full border border-tertiary/20 arena-ring arena-ring-3" />

      {/* Radar sweep */}
      <div className="radar-sweep" aria-hidden="true" />

      {/* Center landmark - BOLD with glow pulse */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary-container to-primary-dim shadow-arena-center animate-glow-pulse">
          <Landmark
            className="h-12 w-12 text-on-primary"
            aria-hidden="true"
            strokeWidth={2.5}
          />
        </div>
      </div>

      {/* Floating pins with staggered animations */}
      <PeripheralPin top="10%" left="55%" value="12" tone="secondary" delay={0} />
      <PeripheralPin top="60%" left="12%" value="8" tone="tertiary" delay={200} />
      <PeripheralPin top="75%" left="78%" value="23" tone="primary" delay={400} />
      <PeripheralPin top="30%" left="85%" value="5" tone="secondary" delay={600} />
    </div>
  );
}

function PeripheralPin({
  top,
  left,
  value,
  tone,
  delay = 0,
}: {
  top: string;
  left: string;
  value: string;
  tone: "primary" | "secondary" | "tertiary";
  delay?: number;
}) {
  const toneStyles = {
    primary: {
      bg: "bg-gradient-to-br from-primary to-primary-dim",
      text: "text-on-primary",
      shadow: "shadow-[0_4px_20px_rgba(149,170,255,0.5)]",
    },
    secondary: {
      bg: "bg-gradient-to-br from-secondary to-secondary-dim",
      text: "text-on-secondary",
      shadow: "shadow-[0_4px_20px_rgba(79,243,37,0.5)]",
    },
    tertiary: {
      bg: "bg-gradient-to-br from-tertiary to-tertiary-dim",
      text: "text-on-tertiary",
      shadow: "shadow-[0_4px_20px_rgba(255,201,101,0.5)]",
    },
  }[tone];

  return (
    <div
      className={`absolute flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-headline text-base font-black animate-float-pin ${toneStyles.bg} ${toneStyles.text} ${toneStyles.shadow}`}
      style={{ top, left, animationDelay: `${delay}ms` }}
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
        Figurinha Fácil é a maior rede brasileira de troca de figurinhas do álbum
        da Copa do Mundo 2026. Colecionadores cadastram repetidas e faltantes, o
        sistema encontra matches em cidades próximas e conecta via WhatsApp em
        pontos verificados. Gratuito, sem cadastro para buscar. São 670
        figurinhas no álbum e milhares de colecionadores ativos em todo o país.
      </p>
    </div>
  );
}
