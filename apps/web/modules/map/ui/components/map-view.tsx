"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { TradePointMapItem } from "../../lib/use-arena-map";
import { useMapSelection } from "../views/map-arena-view";

type MapViewProps = {
  center: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
  points: TradePointMapItem[];
};

const userIcon = L.divIcon({
  html: `<div class="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-xs font-bold shadow-lg ring-4 ring-primary/30">VOCÊ</div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function createPointIcon(selected: boolean) {
  return L.divIcon({
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full ${selected ? "bg-primary ring-4 ring-primary/50" : "bg-secondary"} text-secondary-foreground shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
    className: "",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
}

function createClusterIcon(count: number) {
  return L.divIcon({
    html: `<div class="relative flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg"><span class="absolute inset-0 rounded-full bg-primary motion-safe:animate-ping opacity-30"></span><span class="relative">${count}</span></div>`,
    className: "",
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
}

function MapControls() {
  const map = useMap();
  return (
    <div className="absolute right-4 top-4 z-[1000] flex flex-col gap-2">
      <button
        type="button"
        onClick={() => map.zoomIn()}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-md"
        aria-label="Aumentar zoom"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14" />
          <path d="M12 5v14" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => map.zoomOut()}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-background text-foreground shadow-md"
        aria-label="Diminuir zoom"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14" />
        </svg>
      </button>
    </div>
  );
}

function PanToSelected({ points }: { points: TradePointMapItem[] }) {
  const map = useMap();
  const { selectedId } = useMapSelection();
  useEffect(() => {
    if (!selectedId) return;
    const p = points.find((pt) => pt._id === selectedId);
    if (p) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 15));
  }, [selectedId, points, map]);
  return null;
}

function PointMarkers({ points }: { points: TradePointMapItem[] }) {
  const { selectedId, setSelectedId } = useMapSelection();
  return (
    <>
      {points.map((p) => (
        <Marker
          key={p._id}
          position={[p.lat, p.lng]}
          icon={createPointIcon(selectedId === p._id)}
          eventHandlers={{
            click: () => setSelectedId(p._id),
          }}
        />
      ))}
    </>
  );
}

export function MapView({ center, zoom = 13, userLocation, points }: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      className="h-[50dvh] w-full"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      <MapControls />
      <PanToSelected points={points} />
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
      )}
      <MarkerClusterGroup
        chunkedLoading
        iconCreateFunction={(cluster: { getChildCount(): number }) =>
          createClusterIcon(cluster.getChildCount())}
      >
        <PointMarkers points={points} />
      </MarkerClusterGroup>
    </MapContainer>
  );
}
