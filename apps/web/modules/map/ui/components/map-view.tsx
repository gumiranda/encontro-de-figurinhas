"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { BRAND_COLORS, BRAND_SHADOWS } from "@workspace/ui/lib/design-tokens";
import { derivePointStatus, type PinStatus } from "../../lib/derive-point-status";
import type { TradePointMapItem } from "../../lib/use-arena-map";

type MapViewProps = {
  center: [number, number];
  zoom?: number;
  userLocation?: { lat: number; lng: number } | null;
  points: TradePointMapItem[];
  selectedId: Id<"tradePoints"> | null;
  onSelect: (id: Id<"tradePoints">) => void;
  onReady?: (map: L.Map) => void;
  clusterRadius?: number;
};

const userIcon = L.divIcon({
  html: `<div style="display:flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:9999px;background:${BRAND_COLORS.primary};color:${BRAND_COLORS.onPrimary};font-size:10px;font-weight:800;letter-spacing:0.05em;box-shadow:${BRAND_SHADOWS.markerPrimary};">VOCÊ</div>`,
  className: "",
  iconSize: [40, 40],
  iconAnchor: [20, 20],
});

function createBubbleIcon(index: number, status: PinStatus, selected: boolean) {
  const palette =
    status === "active"
      ? {
          bg: BRAND_COLORS.secondary,
          fg: BRAND_COLORS.onSecondary,
          shadow: BRAND_SHADOWS.markerSuccess,
        }
      : {
          bg: BRAND_COLORS.surfaceContainerHigh,
          fg: BRAND_COLORS.onSurfaceVariant,
          shadow: BRAND_SHADOWS.markerMuted,
        };
  const ring = selected
    ? `box-shadow:0 0 0 3px rgba(149,170,255,.45),${palette.shadow};`
    : `box-shadow:${palette.shadow};`;
  return L.divIcon({
    className: "",
    iconSize: [40, 42],
    iconAnchor: [20, 42],
    html: `<div style="display:flex;flex-direction:column;align-items:center">
  <div style="padding:6px 10px;border-radius:10px;background:${palette.bg};color:${palette.fg};font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:12px;white-space:nowrap;${ring}">${index}</div>
  <div style="width:2px;height:10px;background:${palette.bg};opacity:.4;margin-top:-1px"></div>
  <div style="width:10px;height:10px;border-radius:50%;background:${palette.bg};box-shadow:0 0 12px ${palette.bg}"></div>
</div>`,
  });
}

function createClusterIcon(count: number) {
  return L.divIcon({
    html: `<div style="position:relative;display:flex;align-items:center;justify-content:center;width:44px;height:44px;border-radius:9999px;background:${BRAND_COLORS.primary};color:${BRAND_COLORS.onPrimary};font-size:14px;font-weight:800;box-shadow:${BRAND_SHADOWS.cluster};"><span>${count}</span></div>`,
    className: "",
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
}

function MapReadyBridge({ onReady }: { onReady?: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady?.(map);
  }, [map, onReady]);
  return null;
}

function PanToSelected({
  points,
  selectedId,
}: {
  points: TradePointMapItem[];
  selectedId: Id<"tradePoints"> | null;
}) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const p = points.find((pt) => pt._id === selectedId);
    if (p) map.flyTo([p.lat, p.lng], Math.max(map.getZoom(), 15));
  }, [selectedId, points, map]);
  return null;
}

function PointMarkers({
  points,
  selectedId,
  onSelect,
}: {
  points: TradePointMapItem[];
  selectedId: Id<"tradePoints"> | null;
  onSelect: (id: Id<"tradePoints">) => void;
}) {
  return (
    <>
      {points.map((p, idx) => {
        const id = p._id as Id<"tradePoints">;
        return (
          <Marker
            key={p._id}
            position={[p.lat, p.lng]}
            icon={createBubbleIcon(
              idx + 1,
              derivePointStatus(p),
              selectedId === id,
            )}
            title={p.name}
            alt={p.name}
            eventHandlers={{
              click: () => onSelect(id),
            }}
          />
        );
      })}
    </>
  );
}

export function MapView({
  center,
  zoom = 13,
  userLocation,
  points,
  selectedId,
  onSelect,
  onReady,
  clusterRadius = 60,
}: MapViewProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      zoomControl={false}
      className="h-full w-full"
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        subdomains="abcd"
      />
      <MapReadyBridge onReady={onReady} />
      <PanToSelected points={points} selectedId={selectedId} />
      {userLocation && (
        <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon} />
      )}
      <MarkerClusterGroup
        chunkedLoading
        maxClusterRadius={clusterRadius}
        iconCreateFunction={(cluster: { getChildCount(): number }) =>
          createClusterIcon(cluster.getChildCount())
        }
      >
        <PointMarkers
          points={points}
          selectedId={selectedId}
          onSelect={onSelect}
        />
      </MarkerClusterGroup>
    </MapContainer>
  );
}
