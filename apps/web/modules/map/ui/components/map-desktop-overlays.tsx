"use client";
import type { RefObject } from "react";
import Link from "next/link";
import { LocateFixed, MapPinPlus, Minus, Plus, Search } from "lucide-react";
import type L from "leaflet";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { MapLegend } from "./map-legend";

type MapDesktopOverlaysProps = {
  query: string;
  onQueryChange: (next: string) => void;
  mapRef: RefObject<L.Map | null>;
  userLocation: { lat: number; lng: number } | null;
};

export function MapDesktopOverlays({
  query,
  onQueryChange,
  mapRef,
  userLocation,
}: MapDesktopOverlaysProps) {
  const handleRecenter = () => {
    const map = mapRef.current;
    if (!map) return;
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], Math.max(map.getZoom(), 14));
    } else {
      map.locate({ setView: true, maxZoom: 14 });
    }
  };

  return (
    <>
      <div className="pointer-events-none absolute inset-x-4 top-4 z-10 flex items-center justify-between gap-3">
        <div className="pointer-events-auto relative w-full max-w-sm">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-outline"
          />
          <Input
            type="search"
            inputMode="search"
            value={query}
            onChange={(e) => onQueryChange(e.target.value)}
            placeholder="Buscar neste mapa..."
            aria-label="Buscar ponto neste mapa"
            className="h-10 border-outline-variant bg-[var(--glass-surface)] pl-9 text-sm text-on-surface backdrop-blur-md placeholder:text-outline"
          />
        </div>
        <div className="pointer-events-auto">
          <Button asChild size="sm">
            <Link href="/ponto/solicitar">
              <MapPinPlus aria-hidden="true" className="size-4" />
              Sugerir ponto
            </Link>
          </Button>
        </div>
      </div>

      <div className="absolute right-4 top-[76px] z-10 flex flex-col gap-1.5">
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Aumentar zoom"
          onClick={() => mapRef.current?.zoomIn()}
          className="size-10 border-outline-variant bg-[var(--glass-surface)] text-on-surface backdrop-blur-md"
        >
          <Plus aria-hidden="true" className="size-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Diminuir zoom"
          onClick={() => mapRef.current?.zoomOut()}
          className="size-10 border-outline-variant bg-[var(--glass-surface)] text-on-surface backdrop-blur-md"
        >
          <Minus aria-hidden="true" className="size-5" />
        </Button>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Centralizar em mim"
          onClick={handleRecenter}
          className="size-10 border-outline-variant bg-[var(--glass-surface)] text-primary backdrop-blur-md"
        >
          <LocateFixed aria-hidden="true" className="size-5" />
        </Button>
      </div>

      <MapLegend className="absolute bottom-4 left-4 z-10" />
    </>
  );
}
