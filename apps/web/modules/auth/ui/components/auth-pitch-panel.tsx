import { MapPin, Trophy, Users } from "lucide-react";

export function AuthPitchPanel() {
  return (
    <aside
      aria-label="Pitch institucional"
      className="relative hidden flex-col justify-between overflow-hidden bg-[var(--surface-container-low)] p-10 lg:flex"
    >
      <div className="absolute inset-0 stadium-gradient pointer-events-none" aria-hidden="true" />
      <div className="relative space-y-6">
        <div className="flex items-center gap-3">
          <span
            className="flex size-9 items-center justify-center rounded-lg bg-primary shadow-sm"
            aria-hidden="true"
          >
            <Trophy className="size-4 text-[var(--on-primary)]" strokeWidth={2} />
          </span>
          <span className="font-[var(--font-headline)] text-lg font-semibold text-[var(--on-surface)]">
            Figurinha Fácil
          </span>
        </div>

        <h1 className="font-[var(--font-headline)] text-3xl font-bold leading-tight tracking-tight text-[var(--on-surface)]">
          Troque perto de{" "}
          <span className="text-gradient-primary">você.</span>
        </h1>

        <p className="max-w-sm text-base leading-relaxed text-[var(--on-surface-variant)]">
          Entre na maior rede de troca de figurinhas da Copa 2026. Cadastre
          repetidas e faltantes e combine trocas com colecionadores verificados
          na sua cidade.
        </p>

        <blockquote className="rounded-2xl border border-[var(--outline-variant)]/30 bg-[var(--surface-container)] p-5">
          <p className="text-[var(--on-surface)]">
            “Em 3 semanas completei o álbum. Nunca pensei que seria tão rápido.”
          </p>
          <footer className="mt-3 text-sm text-[var(--on-surface-variant)]">
            — Carla M., São Paulo
          </footer>
        </blockquote>
      </div>

      <dl className="relative grid grid-cols-2 gap-4 pt-6">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-[var(--secondary)]" aria-hidden="true" />
          <div>
            <dt className="text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
              Colecionadores
            </dt>
            <dd className="font-[var(--font-headline)] text-lg font-bold text-[var(--on-surface)]">
              12.4k+
            </dd>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="size-5 text-[var(--tertiary)]" aria-hidden="true" />
          <div>
            <dt className="text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
              Pontos ativos
            </dt>
            <dd className="font-[var(--font-headline)] text-lg font-bold text-[var(--on-surface)]">
              842
            </dd>
          </div>
        </div>
      </dl>
    </aside>
  );
}
