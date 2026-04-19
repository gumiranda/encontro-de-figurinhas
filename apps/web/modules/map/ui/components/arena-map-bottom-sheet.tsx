"use client";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { cn } from "@workspace/ui/lib/utils";
import type { TradePointMapItem } from "../../lib/use-arena-map";
import type { FavoriteSet } from "../../lib/use-my-favorites";
import { SpotCard } from "./spot-card";

type ArenaMapBottomSheetProps = {
  points: TradePointMapItem[];
  favorites: FavoriteSet;
  selectedId: Id<"tradePoints"> | null;
  onSelect: (id: Id<"tradePoints">) => void;
  totalCount: number;
  activeCount: number;
  className?: string;
};

export function ArenaMapBottomSheet({
  points,
  favorites,
  selectedId,
  onSelect,
  totalCount,
  activeCount,
  className,
}: ArenaMapBottomSheetProps) {
  return (
    <section
      role="region"
      aria-label="Lista de pontos próximos"
      className={cn(
        "fixed inset-x-0 z-20 rounded-t-3xl border-t border-outline-variant bg-[var(--glass-surface-strong)] px-5 pb-4 pt-3 backdrop-blur-xl",
        className,
      )}
      style={{ bottom: "var(--mobile-nav-height)" }}
    >
      <div
        aria-hidden="true"
        className="mx-auto mb-3 h-1 w-10 rounded-full bg-outline/50"
      />
      <header
        aria-live="polite"
        className="mb-3 flex items-center justify-between"
      >
        <h2 className="font-headline text-base font-bold text-on-surface">
          {totalCount} pontos ·{" "}
          <span className="text-secondary">{activeCount} ativos</span>
        </h2>
        <span className="font-mono text-[11px] text-outline">raio 5km</span>
      </header>

      {points.length === 0 ? (
        <p className="py-6 text-center text-sm text-on-surface-variant">
          Nenhum ponto bate com o filtro atual.
        </p>
      ) : (
        <div className="-mx-5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-5 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {points.map((p, idx) => (
            <SpotCard
              key={p._id}
              point={p}
              index={idx + 1}
              selected={selectedId === p._id}
              isFavorite={favorites.has(p._id as Id<"tradePoints">)}
              onSelect={() => onSelect(p._id as Id<"tradePoints">)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
