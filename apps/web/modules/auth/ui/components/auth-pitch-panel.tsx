import { Landmark, MapPin, Users } from "lucide-react";

export function AuthPitchPanel() {
  return (
    <aside
      aria-label="Pitch institucional"
      className="relative hidden flex-col justify-between overflow-hidden bg-[var(--landing-surface-container-low)] p-10 lg:flex"
    >
      <div className="absolute inset-0 stadium-gradient pointer-events-none" aria-hidden="true" />
      <div className="relative space-y-8">
        <div className="flex items-center gap-3">
          <span
            className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--landing-primary)] to-[var(--landing-primary-dim)] shadow-[0_0_24px_rgba(149,170,255,0.35)]"
            aria-hidden="true"
          >
            <Landmark className="size-5 text-[var(--landing-on-primary)]" strokeWidth={2.5} />
          </span>
          <span className="font-[var(--font-headline)] text-xl font-bold text-[var(--landing-on-surface)]">
            Figurinha Fácil
          </span>
        </div>

        <h1 className="font-[var(--font-headline)] text-4xl font-black leading-tight tracking-tighter text-[var(--landing-on-surface)]">
          Troque perto de{" "}
          <span className="text-gradient-primary">você.</span>
        </h1>

        <p className="max-w-sm text-lg leading-relaxed text-[var(--landing-on-surface-variant)]">
          Entre na maior rede de troca de figurinhas da Copa 2026. Cadastre
          repetidas e faltantes e combine trocas com colecionadores verificados
          na sua cidade.
        </p>

        <blockquote className="rounded-2xl border border-[var(--landing-outline-variant)]/30 bg-[var(--landing-surface-container)] p-5">
          <p className="text-[var(--landing-on-surface)]">
            “Em 3 semanas completei o álbum. Nunca pensei que seria tão rápido.”
          </p>
          <footer className="mt-3 text-sm text-[var(--landing-on-surface-variant)]">
            — Carla M., São Paulo
          </footer>
        </blockquote>
      </div>

      <dl className="relative grid grid-cols-2 gap-4 pt-6">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-[var(--landing-secondary)]" aria-hidden="true" />
          <div>
            <dt className="text-xs uppercase tracking-widest text-[var(--landing-on-surface-variant)]">
              Colecionadores
            </dt>
            <dd className="font-[var(--font-headline)] text-lg font-bold text-[var(--landing-on-surface)]">
              12.4k+
            </dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-[var(--landing-tertiary)]" aria-hidden="true" />
          <div>
            <dt className="text-xs uppercase tracking-widest text-[var(--landing-on-surface-variant)]">
              Pontos ativos
            </dt>
            <dd className="font-[var(--font-headline)] text-lg font-bold text-[var(--landing-on-surface)]">
              842
            </dd>
          </div>
        </div>
      </dl>
    </aside>
  );
}
