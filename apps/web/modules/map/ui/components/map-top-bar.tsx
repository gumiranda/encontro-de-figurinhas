"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { AppNavDrawer } from "@/modules/shared/ui/components/app-nav-drawer";

type MapTopBarProps = {
  query: string;
  onQueryChange: (next: string) => void;
  className?: string;
};

export function MapTopBar({ query, onQueryChange, className }: MapTopBarProps) {
  return (
    <div
      className={cn(
        "absolute inset-x-4 top-[max(theme(spacing.3),env(safe-area-inset-top))] z-30 flex items-center gap-2",
        className,
      )}
    >
      <AppNavDrawer
        variant="outline"
        className="size-10 shrink-0 border-outline-variant bg-[var(--glass-surface)] text-on-surface backdrop-blur-md"
      />

      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline"
        />
        <Input
          type="search"
          inputMode="search"
          placeholder="Buscar ponto..."
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Buscar ponto de troca"
          className="h-10 border-outline-variant bg-[var(--glass-surface)] pl-9 text-sm text-on-surface backdrop-blur-md placeholder:text-outline"
        />
      </div>

      <Button
        type="button"
        variant="outline"
        size="icon"
        aria-label="Mais filtros (em breve)"
        disabled
        className="size-10 shrink-0 border-outline-variant bg-[var(--glass-surface)] text-on-surface-variant backdrop-blur-md"
      >
        <SlidersHorizontal aria-hidden="true" className="size-5" />
      </Button>
    </div>
  );
}
