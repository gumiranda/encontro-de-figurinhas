import { cn } from "@workspace/ui/lib/utils";

export function MapLegend({ className }: { className?: string }) {
  return (
    <div
      role="img"
      aria-label="Legenda do mapa: verde = ativo agora, cinza = sem gente"
      className={cn(
        "flex items-center gap-4 rounded-2xl border border-outline-variant bg-[var(--glass-surface)] px-4 py-3 backdrop-blur-md",
        className,
      )}
    >
      <span className="flex items-center gap-2 font-headline text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-secondary shadow-[0_0_10px_var(--secondary)]"
        />
        Ativo agora
      </span>
      <span className="flex items-center gap-2 font-headline text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant">
        <span
          aria-hidden="true"
          className="size-2.5 rounded-full bg-surface-container-high"
        />
        Sem gente
      </span>
    </div>
  );
}
