"use client";
import type { ReactNode, RefObject } from "react";
import { Search } from "lucide-react";
import type L from "leaflet";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Input } from "@workspace/ui/components/input";
import { AppNavDrawer } from "@/modules/shared/ui/components/app-nav-drawer";
import type { TradePointMapItem } from "../../lib/use-arena-map";
import type { ArenaFilter } from "../../lib/use-arena-map-filters";
import type { FavoriteSet } from "../../lib/use-my-favorites";
import { MapDesktopOverlays } from "./map-desktop-overlays";
import { MapFilterChips } from "./map-filter-chips";
import { SpotRow } from "./spot-row";

type DesktopMapLayoutProps = {
  mapNode: ReactNode;
  mapRef: RefObject<L.Map | null>;
  userLocation: { lat: number; lng: number } | null;
  cityName: string | null;
  totalCount: number;
  activeCount: number;
  query: string;
  onQueryChange: (next: string) => void;
  filter: ArenaFilter;
  onFilterChange: (next: ArenaFilter) => void;
  points: TradePointMapItem[];
  favorites: FavoriteSet;
  canFavorite: boolean;
  selectedId: Id<"tradePoints"> | null;
  onSelect: (id: Id<"tradePoints">) => void;
};

const LIST_ID = "points-list";

export function DesktopMapLayout({
  mapNode,
  mapRef,
  userLocation,
  cityName,
  totalCount,
  activeCount,
  query,
  onQueryChange,
  filter,
  onFilterChange,
  points,
  favorites,
  canFavorite,
  selectedId,
  onSelect,
}: DesktopMapLayoutProps) {

  return (
    <div className="grid h-[100dvh] grid-cols-[380px_1fr]">
      <aside className="flex flex-col overflow-hidden border-r border-outline-variant bg-surface-container-low">
        <header className="border-b border-outline-variant px-5 py-4">
          <div className="mb-3 flex items-center gap-3">
            <AppNavDrawer variant="outline" />
            <h2 className="font-headline text-xl font-extrabold leading-tight text-on-surface">
              Pontos em{" "}
              <span className="text-primary">{cityName ?? "sua cidade"}</span>
            </h2>
          </div>
          <p
            aria-live="polite"
            className="mt-1 font-mono text-xs text-on-surface-variant"
          >
            {totalCount} pontos · {activeCount} ativos · raio 5km
          </p>
          <div className="relative mt-3">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline"
            />
            <Input
              type="search"
              inputMode="search"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              placeholder="Buscar por nome ou endereço..."
              aria-label="Buscar ponto na lista"
              aria-controls={LIST_ID}
              className="h-10 border-outline-variant pl-9"
            />
          </div>
          <MapFilterChips
            value={filter}
            onChange={onFilterChange}
            canFavorite={canFavorite}
            layout="wrap"
            className="mt-3"
          />
        </header>

        <div className="flex-1 overflow-y-auto p-3">
          {points.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-on-surface-variant">
              Nenhum ponto bate com o filtro atual.
            </p>
          ) : (
            <ul
              id={LIST_ID}
              role="listbox"
              aria-label="Pontos de troca"
              className="flex flex-col gap-1"
            >
              {points.map((p, idx) => (
                <li key={p._id} role="option" aria-selected={selectedId === p._id}>
                  <SpotRow
                    point={p}
                    index={idx + 1}
                    selected={selectedId === p._id}
                    isFavorite={favorites.has(p._id as Id<"tradePoints">)}
                    canFavorite={canFavorite}
                    onSelect={() => onSelect(p._id as Id<"tradePoints">)}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      <section className="relative overflow-hidden">
        {mapNode}
        <MapDesktopOverlays
          query={query}
          onQueryChange={onQueryChange}
          mapRef={mapRef}
          userLocation={userLocation}
        />
      </section>
    </div>
  );
}
