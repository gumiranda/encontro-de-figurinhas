"use client";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import {
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { LeafletContext, createLeafletContext } from "@react-leaflet/core";
import { useMap } from "react-leaflet";
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

const CARTO_DARK_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

/** Required so `getMaxZoom()` is defined (marker cluster + some Leaflet paths throw otherwise). */
const MAP_MIN_ZOOM = 3;
const MAP_MAX_ZOOM = 20;

const TILE_LAYER_MAX_ATTEMPTS = 90;
const MARKER_LAYER_MAX_ATTEMPTS = 90;

type StableMapContainerProps = {
  center: [number, number];
  zoom: number;
  className?: string;
  children?: ReactNode;
} & Omit<L.MapOptions, "center" | "zoom">;

/**
 * react-leaflet's `MapContainer` creates the map in a ref callback but destroys it in
 * `useEffect` cleanup. With Next.js `cacheComponents` / PPR and React 19, that ordering can
 * leave the container half-torn-down and trigger "Map container is being reused by another
 * instance". Creating/removing the map in `useLayoutEffect` keeps teardown in sync with the
 * container ref lifecycle.
 */
function StableMapContainer({
  center,
  zoom,
  className,
  children,
  ...options
}: StableMapContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const [leafletContext, setLeafletContext] = useState<ReturnType<
    typeof createLeafletContext
  > | null>(null);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const map = new L.Map(el, options);
    map.setView(center, zoom);
    mapRef.current = map;
    setLeafletContext(createLeafletContext(map));

    return () => {
      mapRef.current = null;
      setLeafletContext(null);
      map.remove();
    };
    // Intentionally mount once; center/zoom are synced below.
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Leaflet map options are fixed at init
  }, []);

  useEffect(() => {
    mapRef.current?.setView(center, zoom);
  }, [center, zoom]);

  return (
    <div ref={containerRef} className={className}>
      {leafletContext ? (
        <LeafletContext.Provider value={leafletContext}>
          {children}
        </LeafletContext.Provider>
      ) : null}
    </div>
  );
}

/**
 * Tile layers must not attach until `tilePane` exists; otherwise Leaflet calls appendChild on
 * undefined (React 19 / Strict Mode / Turbopack race with react-leaflet's MapContainer).
 */
function CartoDarkTileLayer() {
  const map = useMap();
  useEffect(() => {
    let layer: L.TileLayer | undefined;
    let cancelled = false;
    let rafId = 0;
    let attempts = 0;

    const tryAdd = () => {
      if (cancelled) return;
      if (attempts++ > TILE_LAYER_MAX_ATTEMPTS) return;

      const el = map.getContainer();
      if (!el?.isConnected) {
        rafId = requestAnimationFrame(tryAdd);
        return;
      }

      const tilePane = map.getPane("tilePane");
      if (!tilePane) {
        rafId = requestAnimationFrame(tryAdd);
        return;
      }

      const next = L.tileLayer(CARTO_DARK_URL, {
        attribution: CARTO_ATTRIBUTION,
        subdomains: "abcd",
        minZoom: MAP_MIN_ZOOM,
        maxZoom: MAP_MAX_ZOOM,
      });
      try {
        next.addTo(map);
        layer = next;
      } catch {
        rafId = requestAnimationFrame(tryAdd);
      }
    };

    map.whenReady(() => {
      rafId = requestAnimationFrame(tryAdd);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (layer) {
        try {
          map.removeLayer(layer);
        } catch {
          // Map may already be torn down (Strict Mode / navigation).
        }
      }
    };
  }, [map]);
  return null;
}

function MapReadyBridge({ onReady }: { onReady?: (map: L.Map) => void }) {
  const map = useMap();
  useEffect(() => {
    onReady?.(map);
  }, [map, onReady]);
  return null;
}

/**
 * `MarkerClusterGroup` from react-leaflet-cluster + React 19 can throw `_leaflet_pos` / appendChild
 * during cluster refresh; trade-point markers use imperative `L.markerClusterGroup` instead.
 */
function MapMarkerLayersWhenReady({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const map = useMap();
  useEffect(() => {
    let cancelled = false;
    let rafId = 0;
    let attempts = 0;

    const tryReady = () => {
      if (cancelled) return;
      if (attempts++ > MARKER_LAYER_MAX_ATTEMPTS) return;

      const el = map.getContainer();
      if (!el?.isConnected) {
        rafId = requestAnimationFrame(tryReady);
        return;
      }

      if (
        !map.getPane("overlayPane") ||
        !map.getPane("markerPane") ||
        !map.getPane("shadowPane")
      ) {
        rafId = requestAnimationFrame(tryReady);
        return;
      }

      setReady(true);
    };

    map.whenReady(() => {
      rafId = requestAnimationFrame(tryReady);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
  }, [map]);

  return ready ? children : null;
}

/**
 * react-leaflet's `<Marker>` can still hit appendChild-on-undefined after panes exist; the user
 * pin is added imperatively like `CartoDarkTileLayer` for a stable lifecycle.
 */
function UserLocationMarker({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    let layer: L.Marker | undefined;
    let cancelled = false;
    let rafId = 0;
    let attempts = 0;

    const tryAddOrMove = () => {
      if (cancelled) return;
      if (attempts++ > MARKER_LAYER_MAX_ATTEMPTS) return;

      if (!map.getContainer()?.isConnected || !map.getPane("markerPane")) {
        rafId = requestAnimationFrame(tryAddOrMove);
        return;
      }

      const ll = L.latLng(lat, lng);
      try {
        if (!layer) {
          layer = L.marker(ll, { icon: userIcon }).addTo(map);
        } else {
          layer.setLatLng(ll);
        }
      } catch {
        rafId = requestAnimationFrame(tryAddOrMove);
      }
    };

    map.whenReady(() => {
      rafId = requestAnimationFrame(tryAddOrMove);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (layer) {
        try {
          map.removeLayer(layer);
        } catch {
          // Map may already be torn down.
        }
      }
    };
  }, [map, lat, lng]);

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

function TradePointsClusterLayer({
  points,
  selectedId,
  onSelect,
  clusterRadius,
}: {
  points: TradePointMapItem[];
  selectedId: Id<"tradePoints"> | null;
  onSelect: (id: Id<"tradePoints">) => void;
  clusterRadius: number;
}) {
  const map = useMap();
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    let group: L.MarkerClusterGroup | undefined;
    let cancelled = false;
    let rafId = 0;
    let attempts = 0;

    const syncMarkers = (g: L.MarkerClusterGroup) => {
      g.clearLayers();
      points.forEach((p, idx) => {
        const id = p._id as Id<"tradePoints">;
        const marker = L.marker([p.lat, p.lng], {
          icon: createBubbleIcon(
            idx + 1,
            derivePointStatus(p),
            selectedId === id,
          ),
          title: p.name,
        });
        marker.on("click", () => {
          onSelectRef.current(id);
        });
        g.addLayer(marker);
      });
    };

    const tryAttach = () => {
      if (cancelled) return;
      if (attempts++ > MARKER_LAYER_MAX_ATTEMPTS) return;

      if (!map.getContainer()?.isConnected || !map.getPane("markerPane")) {
        rafId = requestAnimationFrame(tryAttach);
        return;
      }

      try {
        if (!group) {
          group = L.markerClusterGroup({
            maxClusterRadius: clusterRadius,
            iconCreateFunction: (cluster: L.MarkerCluster) =>
              createClusterIcon(cluster.getChildCount()),
            chunkedLoading: false,
          });
          group.addTo(map);
        }
        syncMarkers(group);
      } catch {
        rafId = requestAnimationFrame(tryAttach);
      }
    };

    map.whenReady(() => {
      rafId = requestAnimationFrame(tryAttach);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      if (group) {
        try {
          map.removeLayer(group);
        } catch {
          // Map may already be torn down.
        }
      }
    };
  }, [map, clusterRadius, points, selectedId]);

  return null;
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
  const [domReady, setDomReady] = useState(false);
  /** Fresh DOM per mount so Leaflet never reuses a container (Strict Mode / navigation). */
  const [mapContainerKey] = useState(
    () =>
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `map-${Math.random().toString(36).slice(2)}`,
  );

  // Leaflet needs a laid-out container; same-tick mount (React 19 / Turbopack) can leave
  // map panes undefined → TileLayer appendChild on undefined. One rAF defers past layout.
  useEffect(() => {
    const id = requestAnimationFrame(() => setDomReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (!domReady) {
    return (
      <div
        className="h-full min-h-[200px] w-full bg-muted animate-pulse"
        aria-hidden
      />
    );
  }

  return (
    <div key={mapContainerKey} className="h-full w-full">
      <StableMapContainer
        center={center}
        zoom={zoom}
        minZoom={MAP_MIN_ZOOM}
        maxZoom={MAP_MAX_ZOOM}
        zoomControl={false}
        className="h-full w-full"
      >
        <CartoDarkTileLayer />
        <MapReadyBridge onReady={onReady} />
        <MapMarkerLayersWhenReady>
          <PanToSelected points={points} selectedId={selectedId} />
          {userLocation && (
            <UserLocationMarker lat={userLocation.lat} lng={userLocation.lng} />
          )}
          <TradePointsClusterLayer
            points={points}
            selectedId={selectedId}
            onSelect={onSelect}
            clusterRadius={clusterRadius}
          />
        </MapMarkerLayersWhenReady>
      </StableMapContainer>
    </div>
  );
}
