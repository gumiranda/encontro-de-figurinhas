"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useConvexAuth } from "convex/react";
import { ArrowRight } from "lucide-react";
import type L from "leaflet";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { useIsDesktop } from "@workspace/ui/hooks/use-is-desktop";
import { useArenaMap } from "../../lib/use-arena-map";
import { useArenaMapFilters } from "../../lib/use-arena-map-filters";
import { useMyFavorites } from "../../lib/use-my-favorites";
import { ArenaMapBottomSheet } from "./arena-map-bottom-sheet";
import { DesktopMapLayout } from "./desktop-map-layout";
import { MapFilterChips } from "./map-filter-chips";
import { MapTopBar } from "./map-top-bar";

const MapView = dynamic(
  () => import("./map-view").then((m) => m.MapView),
  { ssr: false, loading: () => <MapSkeleton /> },
);

function MapSkeleton() {
  return (
    <div className="grid h-full w-full place-items-center bg-background">
      <div
        className="size-12 animate-pulse rounded-full bg-muted"
        aria-hidden="true"
      />
      <span className="sr-only">Carregando mapa…</span>
    </div>
  );
}

function NeedsCityCta() {
  const router = useRouter();
  return (
    <div className="grid h-[100dvh] place-items-center bg-background px-6">
      <div className="max-w-sm rounded-2xl border border-outline-variant bg-surface-container p-6 text-center">
        <h2 className="font-headline text-lg font-bold text-on-surface">
          Selecione sua cidade
        </h2>
        <p className="mt-2 text-sm text-on-surface-variant">
          Para ver pontos de troca próximos, escolha uma cidade.
        </p>
        <Button
          className="mt-4"
          onClick={() => router.push("/selecionar-localizacao")}
        >
          Escolher cidade <ArrowRight aria-hidden="true" className="size-4" />
        </Button>
      </div>
    </div>
  );
}

function EmptyPointsCta() {
  return (
    <div className="absolute inset-x-4 top-1/2 z-10 mx-auto max-w-sm -translate-y-1/2 rounded-2xl border border-outline-variant bg-surface-container p-6 text-center backdrop-blur-md">
      <p className="text-sm text-on-surface">
        Nenhum ponto aprovado nesta cidade ainda.
      </p>
      <Button asChild variant="outline" className="mt-4">
        <Link href="/ponto/solicitar">Sugerir um ponto</Link>
      </Button>
    </div>
  );
}

export function ArenaMapFrame() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const canFavorite = isAuthenticated && !authLoading;
  const { status, userCoords, mapCenter, points, cityName } = useArenaMap();
  const favorites = useMyFavorites();
  const { query, setQuery, filter, setFilter, filtered, activeCount } =
    useArenaMapFilters(points, favorites);
  const [selectedId, setSelectedId] = useState<Id<"tradePoints"> | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const isDesktop = useIsDesktop();

  // NÃO mover pra middleware: `status.kind` vem do hook useArenaMap, que depende
  // de queries reativas do Convex + refs do mapa Leaflet. Servidor não vê esse
  // estado. react-doctor flagga, mas é o padrão correto pra client-only state.
  useEffect(() => {
    if (status.kind === "needs-bootstrap") router.replace("/bootstrap");
  }, [status.kind, router]);

  useEffect(() => {
    if (!canFavorite && filter === "favorites") setFilter("all");
  }, [canFavorite, filter, setFilter]);

  if (
    status.kind === "needs-bootstrap" ||
    status.kind === "loading" ||
    isDesktop === undefined ||
    !mapCenter
  ) {
    return <MapSkeleton />;
  }

  if (status.kind === "needs-city") return <NeedsCityCta />;

  const mapNode = (
    <MapView
      center={mapCenter}
      userLocation={userCoords}
      points={filtered}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onReady={(m) => {
        mapRef.current = m;
      }}
      clusterRadius={isDesktop ? 30 : 60}
    />
  );

  const skipLink = (
    <a
      href="#points-list"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-3 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary-foreground"
    >
      Pular para lista de pontos
    </a>
  );

  if (isDesktop) {
    return (
      <>
        {skipLink}
        <DesktopMapLayout
          mapNode={mapNode}
          mapRef={mapRef}
          userLocation={userCoords}
          cityName={cityName}
          totalCount={filtered.length}
          activeCount={activeCount}
          query={query}
          onQueryChange={setQuery}
          filter={filter}
          onFilterChange={setFilter}
          points={filtered}
          favorites={favorites}
          canFavorite={canFavorite}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      </>
    );
  }

  return (
    <main className="fixed inset-0 overflow-hidden bg-background text-foreground">
      {skipLink}
      <div className="absolute inset-0 isolate">{mapNode}</div>
      <MapTopBar query={query} onQueryChange={setQuery} />
      <MapFilterChips
        value={filter}
        onChange={setFilter}
        canFavorite={canFavorite}
        layout="scroll"
        className="absolute inset-x-4 top-[116px] z-20"
      />
      {points.length === 0 ? (
        <EmptyPointsCta />
      ) : (
        <ArenaMapBottomSheet
          points={filtered}
          favorites={favorites}
          canFavorite={canFavorite}
          selectedId={selectedId}
          onSelect={setSelectedId}
          totalCount={filtered.length}
          activeCount={activeCount}
        />
      )}
    </main>
  );
}
