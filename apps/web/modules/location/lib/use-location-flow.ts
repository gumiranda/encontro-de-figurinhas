"use client";

import type { Id } from "@workspace/backend/_generated/dataModel";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { findNearestCity } from "./find-nearest-city";
import type { CityWithCoords } from "./location-constants";
import { useGeolocation } from "./use-geolocation";

const IP_CONSENT_KEY = "ip-consent-dismissed";

function getSessionItem(key: string): string | null {
  try {
    return typeof window !== "undefined" ? sessionStorage.getItem(key) : null;
  } catch {
    return null;
  }
}

function setSessionItem(key: string, value: string): void {
  try {
    sessionStorage.setItem(key, value);
  } catch {
    // Silently fail - privacy mode or quota exceeded
  }
}

/** Matches GET /api/ip-location JSON body on success (validated at runtime). */
const ipLocationResponseSchema = z.object({
  lat: z.number().finite(),
  lng: z.number().finite(),
  city: z.string().optional(),
  attestationToken: z.string().min(1).optional(),
});

function persistIpConsentDismissed(): void {
  setSessionItem(IP_CONSENT_KEY, "true");
}

type NearestCityResult = NonNullable<ReturnType<typeof findNearestCity>>;

function processNearestCity(
  lat: number,
  lng: number,
  cities: CityWithCoords[],
  onFound: (nearest: NearestCityResult) => void,
  notFoundMessage: string
): boolean {
  const nearest = findNearestCity(lat, lng, cities);
  if (nearest) {
    onFound(nearest);
    return true;
  }
  toast.info(notFoundMessage);
  return false;
}

const NEAREST_NOT_FOUND_GPS =
  "Não encontramos uma cidade na base para sua posição. Use a busca manual.";
const NEAREST_NOT_FOUND_IP =
  "Não encontramos uma cidade próxima. Use a busca manual.";

export type ViewState = "gps" | "manual";

export type LocationSource = "gps" | "manual" | "ip";

type GeolocationHook = ReturnType<typeof useGeolocation>;

export type UseLocationFlowReturn = {
  viewState: ViewState;
  setViewState: (next: ViewState) => void;
  selectedCityId: Id<"cities"> | null;
  locationSource: LocationSource;
  ipLocationToken: string | null;
  showIpConsent: boolean;
  gpsStatus: GeolocationHook["status"];
  coords: GeolocationHook["coords"];
  requestPermission: GeolocationHook["requestPermission"];
  dismissIpConsent: () => void;
  handleIpAccept: () => Promise<void>;
  selectCityManual: (cityId: Id<"cities">) => void;
};

type LocationState = {
  viewState: ViewState;
  selectedCityId: Id<"cities"> | null;
  locationSource: LocationSource;
  ipLocationToken: string | null;
  showIpConsent: boolean;
};

function initialLocationState(currentCityId?: Id<"cities">): LocationState {
  return {
    viewState: "gps",
    selectedCityId: currentCityId ?? null,
    locationSource: "manual",
    ipLocationToken: null,
    showIpConsent: false,
  };
}

export function useLocationFlow({
  cities,
  citiesError,
  currentCityId,
}: {
  cities: CityWithCoords[];
  citiesError?: string;
  currentCityId?: Id<"cities">;
}): UseLocationFlowReturn {
  const { status: gpsStatus, coords, requestPermission } = useGeolocation();

  const citiesRef = useRef(cities);
  citiesRef.current = cities;

  const [state, setState] = useState<LocationState>(() =>
    initialLocationState(currentCityId)
  );

  useEffect(() => {
    const dismissed = getSessionItem(IP_CONSENT_KEY);
    setState((prev) => ({ ...prev, showIpConsent: !dismissed }));
  }, []);

  useEffect(() => {
    if (citiesError || gpsStatus === "denied" || gpsStatus === "unavailable") {
      setState((prev) => ({ ...prev, viewState: "manual" }));
    }
  }, [citiesError, gpsStatus]);

  useEffect(() => {
    if (gpsStatus !== "granted" || !coords) {
      return;
    }

    if (cities.length === 0) {
      setState((prev) => ({
        ...prev,
        locationSource: "gps",
        ipLocationToken: null,
      }));
      toast.info("Use a busca manual para selecionar sua cidade.");
      return;
    }

    const found = processNearestCity(
      coords.lat,
      coords.lng,
      cities,
      (nearest) => {
        setState((prev) => ({
          ...prev,
          locationSource: "gps",
          ipLocationToken: null,
          selectedCityId: nearest.city._id,
        }));
        if (nearest.isDistant) {
          toast.info(
            `Cidade mais próxima encontrada: ${nearest.city.name} (${nearest.distance}km)`
          );
        }
      },
      NEAREST_NOT_FOUND_GPS
    );

    if (!found) {
      setState((prev) => ({
        ...prev,
        locationSource: "gps",
        ipLocationToken: null,
      }));
    }
  }, [gpsStatus, coords, cities]);

  function setViewState(next: ViewState): void {
    setState((prev) => ({ ...prev, viewState: next }));
  }

  function dismissIpConsent(): void {
    persistIpConsentDismissed();
    setState((prev) => ({ ...prev, showIpConsent: false }));
  }

  async function handleIpAccept(): Promise<void> {
    try {
      const res = await fetch("/api/ip-location");
      if (!res.ok) throw new Error("IP location failed");
      const json: unknown = await res.json();
      const parsed = ipLocationResponseSchema.safeParse(json);
      if (!parsed.success) {
        toast.error("Resposta inválida do servidor");
        return;
      }
      const data = parsed.data;
      processNearestCity(
        data.lat,
        data.lng,
        citiesRef.current,
        (nearest) => {
          setState((prev) => ({
            ...prev,
            selectedCityId: nearest.city._id,
            locationSource: "ip",
            ipLocationToken: data.attestationToken ?? null,
          }));
          toast.success(
            `Localização detectada: ${nearest.city.name}, ${nearest.city.state}`
          );
        },
        NEAREST_NOT_FOUND_IP
      );
    } catch {
      toast.error("Não foi possível detectar sua localização");
    } finally {
      persistIpConsentDismissed();
      setState((prev) => ({ ...prev, showIpConsent: false }));
    }
  }

  function selectCityManual(id: Id<"cities">): void {
    setState((prev) => ({
      ...prev,
      selectedCityId: id,
      locationSource: "manual",
      ipLocationToken: null,
    }));
  }

  const {
    viewState,
    selectedCityId,
    locationSource,
    ipLocationToken,
    showIpConsent,
  } = state;

  return {
    viewState,
    setViewState,
    selectedCityId,
    locationSource,
    ipLocationToken,
    showIpConsent,
    gpsStatus,
    coords,
    requestPermission,
    dismissIpConsent,
    handleIpAccept,
    selectCityManual,
  };
}
