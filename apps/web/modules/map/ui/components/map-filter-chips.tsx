"use client";
import { useRef } from "react";
import { cn } from "@workspace/ui/lib/utils";
import type { ArenaFilter } from "../../lib/use-arena-map-filters";

const OPTIONS: { key: ArenaFilter; label: string }[] = [
  { key: "all", label: "Todos" },
  { key: "active", label: "Ativos agora" },
  { key: "favorites", label: "Favoritos" },
];

type MapFilterChipsProps = {
  value: ArenaFilter;
  onChange: (next: ArenaFilter) => void;
  className?: string;
  layout?: "scroll" | "wrap";
};

export function MapFilterChips({
  value,
  onChange,
  className,
  layout = "scroll",
}: MapFilterChipsProps) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    const dir = e.key === "ArrowRight" ? 1 : -1;
    const nextIdx = (idx + dir + OPTIONS.length) % OPTIONS.length;
    const target = refs.current[nextIdx];
    target?.focus();
    onChange(OPTIONS[nextIdx]!.key);
  };

  return (
    <div
      role="tablist"
      aria-label="Filtrar pontos do mapa"
      className={cn(
        "flex gap-1.5",
        layout === "scroll" &&
          "overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        layout === "wrap" && "flex-wrap",
        className,
      )}
    >
      {OPTIONS.map((opt, idx) => {
        const active = value === opt.key;
        return (
          <button
            key={opt.key}
            ref={(el) => {
              refs.current[idx] = el;
            }}
            type="button"
            role="tab"
            aria-selected={active}
            tabIndex={active ? 0 : -1}
            onClick={() => onChange(opt.key)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 font-headline text-[11px] font-semibold uppercase tracking-wider transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-outline-variant bg-[var(--glass-surface)] text-on-surface-variant backdrop-blur-md hover:text-on-surface",
            )}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
