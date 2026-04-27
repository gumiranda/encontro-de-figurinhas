"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Link from "next/link";
import { BRAND_COLORS } from "@workspace/ui/lib/design-tokens";

interface City {
  name: string;
  slug: string;
  lat: number;
  lng: number;
}

interface CitiesMapProps {
  cities: City[];
}

const BRAZIL_CENTER: [number, number] = [-15.7801, -47.9292];
const BRAZIL_ZOOM = 4;

function createCityIcon() {
  return L.divIcon({
    html: `<div style="display:flex;align-items:center;justify-content:center;width:24px;height:24px;border-radius:50%;background:${BRAND_COLORS.primary};box-shadow:0 2px 8px rgba(0,0,0,0.3);border:2px solid white;"></div>`,
    className: "",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}

export function CitiesMap({ cities }: CitiesMapProps) {
  const cityIcon = createCityIcon();

  return (
    <MapContainer
      center={BRAZIL_CENTER}
      zoom={BRAZIL_ZOOM}
      scrollWheelZoom={false}
      className="h-64 md:h-80 w-full"
      style={{ background: BRAND_COLORS.surfaceContainerHigh }}
    >
      <TileLayer
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      />
      {cities.map((city) => (
        <Marker
          key={city.slug}
          position={[city.lat, city.lng]}
          icon={cityIcon}
        >
          <Popup>
            <div className="text-center">
              <p className="font-semibold mb-1">{city.name}</p>
              <Link
                href={`/cidade/${city.slug}`}
                className="text-primary text-sm hover:underline"
              >
                Ver cidade
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
