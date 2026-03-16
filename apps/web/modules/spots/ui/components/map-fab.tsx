"use client";

import { Button } from "@workspace/ui/components/button";
import { Loader2, MapPin, Crosshair } from "lucide-react";
import { useMapContext } from "./map-provider";

export function MapFAB() {
  const {
    pickingLocation,
    setPickingLocation,
    handleFabClick,
    isLoaded,
    isSignedIn,
    currentUser,
  } = useMapContext();

  if (pickingLocation) {
    return (
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
        <div className="bg-background/95 backdrop-blur-sm rounded-lg px-4 py-3 shadow-lg flex items-center gap-3">
          <Crosshair className="h-5 w-5 text-green-500 animate-pulse" />
          <span className="text-sm font-medium">Toque no mapa para escolher o local</span>
          <Button variant="ghost" size="sm" onClick={() => setPickingLocation(false)}>
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
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
  );
}
