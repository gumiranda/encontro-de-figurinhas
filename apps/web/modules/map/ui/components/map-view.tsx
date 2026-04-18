"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import { BRAND_COLORS } from "@workspace/ui/lib/design-tokens";
import type { TradePointMapItem } from "../../lib/use-arena-map";
import { useMapSelection } from "../views/map-arena-view";

type MapViewProps = {
  center: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
  points: TradePointMapItem[];
};

const userIcon = L.divIcon({
  html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:9999px;background:${BRAND_COLORS.primary};color:${BRAND_COLORS.onPrimary};font-size:10px;font-weight:800;letter-spacing:0.05em;box-shadow:0 0 0 4px rgba(149,170,255,0.25),0 0 16px rgba(149,170,255,0.45);">VOCÊ</div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function createPointIcon(selected: boolean) {
  const fill = selected ? BRAND_COLORS.primary : BRAND_COLORS.secondary;
  const ring = selected
    ? "box-shadow:0 0 0 4px rgba(149,170,255,0.35),0 6px 14px rgba(0,0,0,0.4);"
    : "box-shadow:0 0 0 3px rgba(79,243,37,0.25),0 4px 10px rgba(0,0,0,0.4);";
  const fg = selected ? BRAND_COLORS.onPrimary : BRAND_COLORS.onSecondary;
  return L.divIcon({
    html: `<div style="position:relative;display:flex;flex-direction:column;align-items:center;"><div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:9999px;background:${fill};color:${fg};${ring}"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.25" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg></div><div style="width:2px;height:8px;background:${fill};"></div></div>`,
    className: "",
    iconSize: [36, 44],
    iconAnchor: [18, 44],
  });
}

function createClusterIcon(count: number) {
  return L.divIcon({
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:9999px;background:${BRAND_COLORS.primary};color:${BRAND_COLORS.onPrimary};font-size:14px;font-weight:800;box-shadow:0 0 0 5px rgba(149,170,255,0.25),0 6px 14px rgba(0,0,0,0.45);"><span>${count}</span></div>`,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
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
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
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
