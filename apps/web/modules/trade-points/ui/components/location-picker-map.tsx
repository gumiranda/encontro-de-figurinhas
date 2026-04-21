"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useLayoutEffect, useRef } from "react";
import { BRAND_COLORS, BRAND_SHADOWS } from "@workspace/ui/lib/design-tokens";

type Props = {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
};

const CARTO_DARK_URL =
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
const CARTO_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const createMarkerIcon = () =>
  L.divIcon({
    html: `<div style="display:flex;flex-direction:column;align-items:center">
      <div style="width:24px;height:24px;border-radius:50%;background:${BRAND_COLORS.primary};border:3px solid ${BRAND_COLORS.onPrimary};box-shadow:${BRAND_SHADOWS.markerPrimary};"></div>
      <div style="width:2px;height:8px;background:${BRAND_COLORS.primary};opacity:.6;margin-top:-2px"></div>
    </div>`,
    className: "",
    iconSize: [24, 32],
    iconAnchor: [12, 32],
  });

function LocationPickerMapInner({ lat, lng, onLocationChange }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);

  onLocationChangeRef.current = onLocationChange;

  useLayoutEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 15,
      zoomControl: false,
      attributionControl: true,
      minZoom: 3,
      maxZoom: 19,
    });

    L.tileLayer(CARTO_DARK_URL, {
      attribution: CARTO_ATTRIBUTION,
      subdomains: "abcd",
    }).addTo(map);

    const marker = L.marker([lat, lng], {
      icon: createMarkerIcon(),
      draggable: true,
    }).addTo(map);

    marker.on("dragend", () => {
      const pos = marker.getLatLng();
      onLocationChangeRef.current(pos.lat, pos.lng);
    });

    mapRef.current = map;
    markerRef.current = marker;

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current) return;

    const currentPos = markerRef.current.getLatLng();
    if (
      Math.abs(currentPos.lat - lat) > 0.0001 ||
      Math.abs(currentPos.lng - lng) > 0.0001
    ) {
      markerRef.current.setLatLng([lat, lng]);
      mapRef.current.setView([lat, lng], mapRef.current.getZoom(), {
        animate: true,
      });
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      className="h-[200px] w-full overflow-hidden rounded-xl"
      style={{ zIndex: 0 }}
    />
  );
}

export { LocationPickerMapInner as LocationPickerMap };
