"use client";

import { memo } from "react";
import { Marker } from "react-map-gl/mapbox";
import { MapPin } from "lucide-react";
import type { Doc, Id } from "@workspace/backend/_generated/dataModel";

function getMarkerStyle(spot: Doc<"spots">) {
  const ageHours = (Date.now() - spot.createdAt) / (1000 * 60 * 60);
  return {
    color: spot.upvotes >= 3 ? "text-green-500" : ageHours < 2 ? "text-orange-500" : "text-yellow-500",
    size: spot.upvotes >= 5 ? "h-8 w-8" : spot.upvotes >= 2 ? "h-7 w-7" : "h-6 w-6",
  };
}

export const SpotMarker = memo(function SpotMarker({
  spot,
  onSelect,
}: {
  spot: Doc<"spots">;
  onSelect: (id: Id<"spots">) => void;
}) {
  const style = getMarkerStyle(spot);
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
          className={`${style.color} ${style.size} fill-current`}
          strokeWidth={1.5}
        />
      </button>
    </Marker>
  );
});
