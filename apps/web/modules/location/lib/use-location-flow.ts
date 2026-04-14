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

const ipLocationResponseSchema = z.object({
  lat: z.number().finite(),
  lng: z.number().finite(),
  city: z.string().optional(),
  attestationToken: z.string().min(1),
  expiresAt: z.number().finite(),
});

type IpLocationResponse = z.infer<typeof ipLocationResponseSchema>;

type IpLocationFetchResult =
  | { ok: true; data: IpLocationResponse }
  | { ok: false; reason: "http" | "parse" };

async function fetchIpLocation(): Promise<IpLocationFetchResult> {
  const res = await fetch("/api/ip-location");
  if (!res.ok) return { ok: false, reason: "http" };
  const parsed = ipLocationResponseSchema.safeParse(await res.json());
  if (!parsed.success) return { ok: false, reason: "parse" };
  return { ok: true, data: parsed.data };
}

function persistIpConsentDismissed(): void {
  setSessionItem(IP_CONSENT_KEY, "true");
}

type NearestCityResult = NonNullable<ReturnType<typeof findNearestCity>>;

function processNearestCity(
  lat: number,
  lng: number,
  cities: CityWithCoords[],
  onFound: (nearest: NearestCityResult) => void,
  onNotFound: () => void
): void {
  const nearest = findNearestCity(lat, lng, cities);
  if (nearest) {
    onFound(nearest);
  } else {
    onNotFound();
  }
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
  isIpAcceptInFlight: boolean;
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

  /** Impede segundo clique antes do re-render (estado React não é síncrono). */
  const ipAcceptLockedRef = useRef(false);
  const [isIpAcceptInFlight, setIsIpAcceptInFlight] = useState(false);

  const [state, setState] = useState<LocationState>(() =>
    initialLocationState(currentCityId)
  );

  useEffect(() => {
    if (!currentCityId) return;
    setState((prev) => {
      if (prev.selectedCityId) return prev;
      return { ...prev, selectedCityId: currentCityId };
    });
  }, [currentCityId]);

  const setGpsSource = (selectedCityId?: Id<"cities">): void => {
    setState((prev) => ({
      ...prev,
      ...(selectedCityId !== undefined ? { selectedCityId } : {}),
      locationSource: "gps",
      ipLocationToken: null,
    }));
  };

  const setManualSource = (selectedCityId?: Id<"cities">): void => {
    setState((prev) => ({
      ...prev,
      ...(selectedCityId !== undefined ? { selectedCityId } : {}),
      locationSource: "manual",
      ipLocationToken: null,
    }));
  };

  useEffect(() => {
    const dismissed = getSessionItem(IP_CONSENT_KEY);
    setState((prev) => ({ ...prev, showIpConsent: !dismissed }));
  }, []);

  useEffect(() => {
    if (!citiesError) return;
    toast.error("Erro ao carregar cidades. Use a busca manual.");
    setState((prev) => ({ ...prev, viewState: "manual" }));
  }, [citiesError]);

  useEffect(() => {
    if (gpsStatus === "denied" || gpsStatus === "unavailable") {
      setState((prev) => ({ ...prev, viewState: "manual" }));
    }
  }, [gpsStatus]);

  useEffect(() => {
    if (gpsStatus !== "granted" || !coords) {
      return;
    }

    const currentCities = citiesRef.current;
    if (currentCities.length === 0) {
      setGpsSource();
      toast.info("Use a busca manual para selecionar sua cidade.");
      return;
    }

    processNearestCity(
      coords.lat,
      coords.lng,
      currentCities,
      (nearest) => {
        setGpsSource(nearest.city._id);
        if (nearest.isDistant) {
          toast.info(
            `Cidade mais próxima encontrada: ${nearest.city.name} (${nearest.distance}km)`
          );
        }
      },
      () => {
        toast.info(NEAREST_NOT_FOUND_GPS);
        setGpsSource();
      }
    );
  }, [gpsStatus, coords]);

  function setViewState(next: ViewState): void {
    setState((prev) => ({ ...prev, viewState: next }));
  }

  function dismissIpConsent(): void {
    persistIpConsentDismissed();
    setState((prev) => ({ ...prev, showIpConsent: false }));
  }

  async function handleIpAccept(): Promise<void> {
    if (ipAcceptLockedRef.current || isIpAcceptInFlight) return;
    ipAcceptLockedRef.current = true;
    setIsIpAcceptInFlight(true);
    try {
      const result = await fetchIpLocation();
      if (!result.ok) {
        toast.error(
          result.reason === "parse"
            ? "Resposta inválida do servidor"
            : "Não foi possível detectar sua localização"
        );
        return;
      }
      const data = result.data;
      if (data.expiresAt <= Date.now()) {
        toast.error("Confirmação de localização expirou. Tente novamente.");
        return;
      }
      processNearestCity(
        data.lat,
        data.lng,
        citiesRef.current,
        (nearest) => {
          setState((prev) => ({
            ...prev,
            selectedCityId: nearest.city._id,
            locationSource: "ip",
            ipLocationToken: data.attestationToken,
          }));
          toast.success(
            `Localização detectada: ${nearest.city.name}, ${nearest.city.state}`
          );
        },
        () => {
          toast.info(NEAREST_NOT_FOUND_IP);
        }
      );
    } catch {
      toast.error("Não foi possível detectar sua localização");
    } finally {
      ipAcceptLockedRef.current = false;
      setIsIpAcceptInFlight(false);
      persistIpConsentDismissed();
      setState((prev) => ({ ...prev, showIpConsent: false }));
    }
  }

  function selectCityManual(id: Id<"cities">): void {
    setManualSource(id);
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
    isIpAcceptInFlight,
    gpsStatus,
    coords,
    requestPermission,
    dismissIpConsent,
    handleIpAccept,
    selectCityManual,
  };
}
