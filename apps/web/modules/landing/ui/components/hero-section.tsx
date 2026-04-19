import Link from "next/link";
import { Landmark } from "lucide-react";
import { CitySearch } from "./city-search";

interface HeroSectionProps {
  totalTrocas?: string | null;
}

export function HeroSection({ totalTrocas }: HeroSectionProps) {
  return (
    <section
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 md:py-24"
      aria-labelledby="hero-heading"
    >
      <div className="grid items-center gap-12 md:grid-cols-2">
        <div className="z-10 space-y-6">
          <span className="tag-chip">
            <span className="pulse-dot" aria-hidden="true" />
            Ao vivo · 12.4k trocando agora
          </span>

          <h1
            id="hero-heading"
            className="font-[var(--font-headline)] text-4xl font-black leading-tight tracking-tighter text-[var(--on-surface)] sm:text-5xl lg:text-6xl"
          >
            Sua figurinha perdida{" "}
            <em className="not-italic text-gradient-primary">está aqui perto.</em>
          </h1>

          <p className="max-w-lg text-lg leading-relaxed text-[var(--on-surface-variant)]">
            A maior rede de troca do Brasil. Encontre colecionadores e pontos
            verificados na sua cidade em segundos — grátis.
          </p>

          <div className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container)] p-4 shadow-soft">
            <CitySearch />
          </div>

          <dl className="grid grid-cols-3 gap-3 pt-2">
            <Stat
              value={totalTrocas ?? "12.4k"}
              label="Colecionadores"
              tone="primary"
            />
            <Stat value="842" label="Pontos" tone="secondary" />
            <Stat value="98%" label="Match" tone="tertiary" />
          </dl>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Link
              href="/sign-up"
              className="btn-primary-gradient flex items-center justify-center px-8 text-center"
            >
              Começar grátis
            </Link>
            <Link
              href="/como-funciona"
              className="flex h-14 items-center justify-center rounded-xl border border-[var(--outline-variant)]/40 px-8 font-bold uppercase tracking-wider text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-variant)]"
            >
              Como funciona
            </Link>
          </div>
        </div>

        <div className="hidden md:block">
          <ArenaVisual />
        </div>
      </div>

      <AeoExplainer />
    </section>
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
  const toneClass = {
    primary: "text-[var(--primary)]",
    secondary: "text-[var(--secondary)]",
    tertiary: "text-[var(--tertiary)]",
  }[tone];

  return (
    <div className="rounded-xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container)] p-4 text-center">
      <dd className={`font-[var(--font-headline)] text-2xl font-black ${toneClass}`}>
        {value}
      </dd>
      <dt className="mt-1 text-[0.6875rem] uppercase tracking-widest text-[var(--on-surface-variant)]">
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
      <div className="absolute inset-0 rounded-full stadium-glow" />
      <div className="absolute inset-[8%] rounded-full border border-[var(--primary)]/25" />
      <div className="absolute inset-[20%] rounded-full border border-[var(--secondary)]/20" />
      <div className="absolute inset-[34%] rounded-full border border-[var(--tertiary)]/20" />

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dim)] shadow-[0_0_40px_rgba(149,170,255,0.45)]">
          <Landmark
            className="h-10 w-10 text-[var(--on-primary)]"
            aria-hidden="true"
            strokeWidth={2.5}
          />
        </div>
      </div>

      <PeripheralPin top="12%" left="52%" value="12" tone="secondary" />
      <PeripheralPin top="62%" left="16%" value="8" tone="tertiary" />
      <PeripheralPin top="72%" left="74%" value="23" tone="primary" />
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
  const toneBg = {
    primary: "bg-[var(--primary)] text-[var(--on-primary)]",
    secondary: "bg-[var(--secondary)] text-[var(--on-secondary)]",
    tertiary: "bg-[var(--tertiary)] text-[var(--on-tertiary)]",
  }[tone];

  return (
    <div
      className={`absolute flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full font-[var(--font-headline)] text-sm font-black shadow-lg ${toneBg}`}
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
        Figurinha Fácil é a maior rede brasileira de troca de figurinhas do álbum
        da Copa do Mundo 2026. Colecionadores cadastram repetidas e faltantes, o
        sistema encontra matches em cidades próximas e conecta via WhatsApp em
        pontos verificados. Gratuito, sem cadastro para buscar. São 670
        figurinhas no álbum e milhares de colecionadores ativos em todo o país.
      </p>
    </div>
  );
}
