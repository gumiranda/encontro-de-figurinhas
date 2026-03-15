"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import Map, { Marker, NavigationControl } from "react-map-gl/mapbox";
import { MapPin, Clock, User, ArrowLeft, MapPinOff } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { SpotActions } from "@/modules/spots/ui/components/spot-actions";
import { formatTimeRemaining } from "@/modules/spots/ui/components/spot-popup";
import Link from "next/link";

export function SpotDetailClient({ spotId }: { spotId: string }) {
  const spot = useQuery(api.spots.getById, { id: spotId });

  if (spot === undefined) {
    return (
      <div className="h-dvh flex flex-col">
        <div className="flex-1 bg-muted">
          <Skeleton className="w-full h-full" />
        </div>
        <div className="p-6 space-y-3">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>
    );
  }

  if (spot === null) {
    return (
      <div className="h-dvh flex items-center justify-center">
        <div className="text-center space-y-4 p-6">
          <MapPinOff className="h-12 w-12 mx-auto text-muted-foreground" />
          <h1 className="text-xl font-semibold">Ponto não encontrado</h1>
          <p className="text-muted-foreground text-sm">
            Este ponto de troca não existe ou já expirou.
          </p>
          <Link href="/mapa">
            <Button className="bg-green-500 hover:bg-green-600">
              <MapPin className="h-4 w-4 mr-1" />
              Ver todos os pontos
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh flex flex-col">
      <div className="flex-1 min-h-[40dvh] relative">
        <Map
          initialViewState={{
            latitude: spot.latitude,
            longitude: spot.longitude,
            zoom: 15,
          }}
          style={{ width: "100%", height: "100%" }}
          mapStyle="mapbox://styles/mapbox/streets-v12"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          interactive={false}
        >
          <NavigationControl position="top-right" />
          <Marker
            latitude={spot.latitude}
            longitude={spot.longitude}
            anchor="bottom"
          >
            <MapPin className="h-8 w-8 text-green-500 fill-current drop-shadow-md" strokeWidth={1.5} />
          </Marker>
        </Map>

        <Link href="/mapa" className="absolute top-20 left-4 z-10">
          <Button
            variant="secondary"
            size="sm"
            className="bg-background/90 backdrop-blur-sm shadow-md"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Ver mapa
          </Button>
        </Link>
      </div>

      <Card className="rounded-t-xl -mt-4 relative z-10 border-t shadow-lg">
        <CardContent className="p-6 space-y-4">
          <div>
            <h1 className="text-xl font-bold">{spot.title}</h1>
            {spot.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {spot.description}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              {spot.createdByName}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {formatTimeRemaining(spot.expiresAt)}
            </span>
          </div>

          <div className="pt-2 border-t">
            <SpotActions spot={spot} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
