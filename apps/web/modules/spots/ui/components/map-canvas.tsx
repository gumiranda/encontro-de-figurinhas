"use client";

import MapGL, { NavigationControl, GeolocateControl } from "react-map-gl/mapbox";
import { useMapContext } from "./map-provider";
import { SpotMarker } from "./spot-marker";
import { SpotPopup } from "./spot-popup";

export function MapCanvas() {
  const {
    viewState,
    handleMove,
    handleMapClick,
    pickingLocation,
    spots,
    handleSelectSpot,
    selectedSpot,
    setSelectedSpotId,
    voteBySpotId,
  } = useMapContext();

  return (
    <MapGL
      {...viewState}
      onMove={handleMove}
      onClick={handleMapClick}
      style={{ width: "100%", height: "100%" }}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      cursor={pickingLocation ? "crosshair" : "grab"}
    >
      <NavigationControl position="top-right" />
      <GeolocateControl position="top-right" trackUserLocation />

      {spots?.map((spot) => (
        <SpotMarker key={spot._id} spot={spot} onSelect={handleSelectSpot} />
      ))}

      {selectedSpot && (
        <SpotPopup
          spot={selectedSpot}
          onClose={() => setSelectedSpotId(null)}
          myVote={voteBySpotId.get(selectedSpot._id) ?? 0}
        />
      )}
    </MapGL>
  );
}
