"use client";

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import MapGL, { NavigationControl, GeolocateControl } from "react-map-gl/mapbox";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { SpotMarker } from "./spot-marker";
import { SpotPopup } from "./spot-popup";
import { AddSpotDialog } from "./add-spot-dialog";
import { Button } from "@workspace/ui/components/button";
import { Loader2, MapPinOff, MapPin, Crosshair } from "lucide-react";
import type { Id } from "@workspace/backend/_generated/dataModel";

const DEFAULT_CENTER = { latitude: -23.5505, longitude: -46.6333 };

export function SpotsMap() {
  const spots = useQuery(api.spots.listActive);
  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser, isSignedIn ? {} : "skip");

  const [selectedSpotId, setSelectedSpotId] = useState<Id<"spots"> | null>(null);
  const [pickingLocation, setPickingLocation] = useState(false);
  const [pickedLocation, setPickedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [viewState, setViewState] = useState({ ...DEFAULT_CENTER, zoom: 12 });
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const geolocateAttempted = useRef(false);

  // Batch getMyVotes for all visible spots
  const spotIds = useMemo(() => spots?.map((s) => s._id) ?? [], [spots]);
  const myVotes = useQuery(
    api.votes.getMyVotes,
    isSignedIn && spotIds.length > 0 ? { spotIds } : "skip"
  );
  const voteBySpotId = useMemo(() => {
    const map = new Map<Id<"spots">, number>();
    if (myVotes) {
      for (const v of myVotes) {
        map.set(v.spotId, v.value);
      }
    }
    return map;
  }, [myVotes]);

  useEffect(() => {
    if (geolocateAttempted.current) return;
    geolocateAttempted.current = true;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { latitude: pos.coords.latitude, longitude: pos.coords.longitude };
          setUserLocation(loc);
          setViewState((prev) => ({ ...prev, ...loc }));
        },
        () => {},
        { timeout: 5000, enableHighAccuracy: false }
      );
    }
  }, []);

  const handleMapClick = useCallback(
    (e: { lngLat: { lat: number; lng: number } }) => {
      if (pickingLocation) {
        setPickedLocation({ latitude: e.lngLat.lat, longitude: e.lngLat.lng });
        setPickingLocation(false);
        setAddDialogOpen(true);
      } else {
        setSelectedSpotId(null);
      }
    },
    [pickingLocation]
  );

  const handleSelectSpot = useCallback((id: Id<"spots">) => {
    setSelectedSpotId(id);
  }, []);

  const handleFabClick = () => {
    if (!isLoaded) return;
    if (!isSignedIn) { router.push("/sign-in?redirect_url=/mapa"); return; }
    if (currentUser === undefined) return;
    if (!currentUser || currentUser.status !== "approved") {
      toast.error("Sua conta está aguardando aprovação");
      return;
    }
    setAddDialogOpen(true);
  };

  const selectedSpot = useMemo(
    () => spots?.find((s) => s._id === selectedSpotId) ?? null,
    [spots, selectedSpotId]
  );

  if (spots === undefined) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <MapGL
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        style={{ width: "100%", height: "100%" }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        cursor={pickingLocation ? "crosshair" : "grab"}
      >
        <NavigationControl position="top-right" />
        <GeolocateControl position="top-right" trackUserLocation />

        {spots.map((spot) => (
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

      {spots.length === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinOff className="h-4 w-4" />
          Nenhum ponto ativo no momento. Seja o primeiro!
        </div>
      )}

      {pickingLocation ? (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-background/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
            <Crosshair className="h-5 w-5 text-green-500 animate-pulse" />
            <span className="text-sm font-medium">Toque no mapa para escolher o local</span>
            <Button variant="ghost" size="sm" onClick={() => setPickingLocation(false)}>
              Cancelar
            </Button>
          </div>
        </div>
      ) : (
        <Button
          onClick={handleFabClick}
          size="lg"
          className="absolute bottom-6 right-6 z-10 h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white"
          aria-label="Adicionar ponto de troca"
        >
          {!isLoaded || (isSignedIn && currentUser === undefined) ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <MapPin className="h-6 w-6" />
          )}
        </Button>
      )}

      <AddSpotDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        pickedLocation={pickedLocation}
        userLocation={userLocation}
        onPickLocation={() => { setAddDialogOpen(false); setPickingLocation(true); }}
        onSpotCreated={() => { setPickedLocation(null); setAddDialogOpen(false); }}
      />
    </>
  );
}
