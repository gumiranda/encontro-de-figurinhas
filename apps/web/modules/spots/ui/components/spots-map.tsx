"use client";

import { Loader2, MapPinOff } from "lucide-react";
import { MapProvider, useMapContext } from "./map-provider";
import { MapCanvas } from "./map-canvas";
import { MapFAB } from "./map-fab";
import { AddSpotDialog } from "./add-spot-dialog";

function SpotsMapContent() {
  const { spots } = useMapContext();

  if (spots === undefined) {
    return (
      <div className="flex h-dvh items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <MapCanvas />

      {spots.length === 0 && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-lg px-4 py-3 shadow-md flex items-center gap-2 text-sm text-muted-foreground">
          <MapPinOff className="h-4 w-4" />
          Nenhum ponto ativo no momento. Seja o primeiro!
        </div>
      )}

      <MapFAB />
      <AddSpotDialog />
    </>
  );
}

export function SpotsMap() {
  return (
    <MapProvider>
      <SpotsMapContent />
    </MapProvider>
  );
}
