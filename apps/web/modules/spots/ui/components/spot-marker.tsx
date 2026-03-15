"use client";

import { memo } from "react";
import { Marker } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";
import type { Doc, Id } from "@workspace/backend/_generated/dataModel";

function getMarkerColor(spot: Doc<"spots">): string {
  const ageMs = Date.now() - spot.createdAt;
  const ageHours = ageMs / (1000 * 60 * 60);

  if (spot.upvotes >= 3) return "text-green-500"; // Popular
  if (ageHours < 2) return "text-orange-500"; // New
  return "text-yellow-500"; // Regular
}

function getMarkerSize(spot: Doc<"spots">): string {
  if (spot.upvotes >= 5) return "h-8 w-8";
  if (spot.upvotes >= 2) return "h-7 w-7";
  return "h-6 w-6";
}

export const SpotMarker = memo(function SpotMarker({
  spot,
  onSelect,
}: {
  spot: Doc<"spots">;
  onSelect: (id: Id<"spots">) => void;
}) {
  return (
    <Marker
      latitude={spot.latitude}
      longitude={spot.longitude}
      anchor="bottom"
      onClick={(e) => {
        e.originalEvent.stopPropagation();
        onSelect(spot._id);
      }}
    >
      <button
        className="cursor-pointer transition-transform hover:scale-110 drop-shadow-md"
        aria-label={`Ponto: ${spot.title}`}
      >
        <MapPin
          className={`${getMarkerColor(spot)} ${getMarkerSize(spot)} fill-current`}
          strokeWidth={1.5}
        />
      </button>
    </Marker>
  );
});
