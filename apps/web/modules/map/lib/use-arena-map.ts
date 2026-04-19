"use client";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { haversine } from "@workspace/backend/lib/geo";
import type { FunctionReturnType } from "convex/server";

export type MapViewResponse = FunctionReturnType<
  typeof api.tradePoints.getMapView
>;
export type TradePointRaw = (MapViewResponse & { state: "ready" })["points"][number];
export type TradePointMapItem = TradePointRaw & { distanceKm: number };

export type ArenaMapStatus =
  | { kind: "loading" }
  | { kind: "needs-bootstrap" }
  | { kind: "needs-city" }
  | { kind: "ready" };

export function useArenaMap() {
  const data = useQuery(api.tradePoints.getMapView);

  const status: ArenaMapStatus = useMemo(() => {
    if (data === undefined) return { kind: "loading" };
    if (data.state === "needs-bootstrap") return { kind: "needs-bootstrap" };
    if (data.state === "needs-city") return { kind: "needs-city" };
    return { kind: "ready" };
  }, [data]);

  const userCoords = useMemo(
    () => (data?.state === "ready" ? data.userLocation : null),
    [data]
  );

  const mapCenter = useMemo<[number, number] | null>(() => {
    if (data?.state !== "ready") return null;
    if (data.userLocation) return [data.userLocation.lat, data.userLocation.lng];
    return [data.city.lat, data.city.lng];
  }, [data]);

  const points = useMemo<TradePointMapItem[]>(() => {
    if (data?.state !== "ready") return [];
    const origin = data.userLocation ?? data.city;
    return data.points
      .map((p) => ({
        ...p,
        distanceKm: haversine(origin.lat, origin.lng, p.lat, p.lng),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [data]);

  const cityName = data?.state === "ready" ? data.city.name : null;

  return { status, userCoords, mapCenter, points, cityName };
}
