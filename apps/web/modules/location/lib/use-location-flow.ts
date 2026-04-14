"use client";

import type { Id } from "@workspace/backend/_generated/dataModel";
import { useEffect, useReducer, useRef, useState } from "react";
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
  } catch {}
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
  | { ok: false; reason: "parse" | "server" | "client" };

function isAbortError(e: unknown): boolean {
  return (
    (e instanceof DOMException && e.name === "AbortError") ||
    (e instanceof Error && e.name === "AbortError")
  );
}

async function fetchIpLocation(
  signal?: AbortSignal
): Promise<IpLocationFetchResult> {
  const res = await fetch("/api/ip-location", { signal });
  if (!res.ok) {
    return {
      ok: false,
      reason: res.status >= 500 ? "server" : "client",
    };
  }
  const parsed = ipLocationResponseSchema.safeParse(await res.json());
  if (!parsed.success) return { ok: false, reason: "parse" };
  return { ok: true, data: parsed.data };
}

function persistIpConsentDismissed(): void {
  setSessionItem(IP_CONSENT_KEY, "true");
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

export type LocationState = {
  viewState: ViewState;
  selectedCityId: Id<"cities"> | null;
  locationSource: LocationSource;
  ipLocationToken: string | null;
  showIpConsent: boolean;
};

export type LocationAction =
  | { type: "SET_VIEW"; view: ViewState }
  | { type: "SET_GPS_SOURCE"; cityId?: Id<"cities"> }
  | { type: "SET_MANUAL_SOURCE"; cityId: Id<"cities"> }
  | { type: "SET_IP_SOURCE"; cityId: Id<"cities">; token: string }
  | { type: "SET_SHOW_IP_CONSENT"; show: boolean }
  | { type: "SYNC_CURRENT_CITY_ID"; cityId: Id<"cities"> }
  | { type: "DISMISS_IP_CONSENT" };

function initialLocationState(currentCityId?: Id<"cities">): LocationState {
  return {
    viewState: "gps",
    selectedCityId: currentCityId ?? null,
    locationSource: "manual",
    ipLocationToken: null,
    showIpConsent: false,
  };
}

export function locationReducer(
  state: LocationState,
  action: LocationAction
): LocationState {
  switch (action.type) {
    case "SET_VIEW":
      return { ...state, viewState: action.view };
    case "SET_GPS_SOURCE":
      return {
        ...state,
        ...(action.cityId !== undefined ? { selectedCityId: action.cityId } : {}),
        locationSource: "gps",
        ipLocationToken: null,
      };
    case "SET_MANUAL_SOURCE":
      return {
        ...state,
        selectedCityId: action.cityId,
        locationSource: "manual",
        ipLocationToken: null,
      };
    case "SET_IP_SOURCE":
      return {
        ...state,
        selectedCityId: action.cityId,
        locationSource: "ip",
        ipLocationToken: action.token,
      };
    case "SET_SHOW_IP_CONSENT":
      return { ...state, showIpConsent: action.show };
    case "SYNC_CURRENT_CITY_ID":
      if (state.selectedCityId) return state;
      return { ...state, selectedCityId: action.cityId };
    case "DISMISS_IP_CONSENT":
      return { ...state, showIpConsent: false };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
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

  const abortControllerRef = useRef<AbortController | null>(null);

  const [isIpAcceptInFlight, setIsIpAcceptInFlight] = useState(false);

  const [state, dispatch] = useReducer(
    locationReducer,
    currentCityId,
    (initialCityId?: Id<"cities">) => initialLocationState(initialCityId)
  );

  useEffect(() => {
    if (!currentCityId) return;
    if (state.selectedCityId) return;
    dispatch({ type: "SYNC_CURRENT_CITY_ID", cityId: currentCityId });
  }, [currentCityId, state.selectedCityId]);

  useEffect(() => {
    const dismissed = getSessionItem(IP_CONSENT_KEY);
    dispatch({
      type: "SET_SHOW_IP_CONSENT",
      show: dismissed === null,
    });
  }, []);

  useEffect(() => {
    if (!citiesError) return;
    toast.error("Erro ao carregar cidades. Use a busca manual.");
    dispatch({ type: "SET_VIEW", view: "manual" });
  }, [citiesError]);

  useEffect(() => {
    if (gpsStatus === "denied" || gpsStatus === "unavailable") {
      dispatch({ type: "SET_VIEW", view: "manual" });
    }
  }, [gpsStatus]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
      abortControllerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (gpsStatus !== "granted" || !coords) {
      return;
    }

    const currentCities = citiesRef.current;
    if (currentCities.length === 0) {
      dispatch({ type: "SET_GPS_SOURCE" });
      toast.info("Use a busca manual para selecionar sua cidade.");
      return;
    }

    const nearest = findNearestCity(
      coords.lat,
      coords.lng,
      currentCities
    );
    if (nearest) {
      dispatch({ type: "SET_GPS_SOURCE", cityId: nearest.city._id });
      if (nearest.isDistant) {
        toast.info(
          `Cidade mais próxima encontrada: ${nearest.city.name} (${nearest.distance}km)`
        );
      }
    } else {
      toast.info(NEAREST_NOT_FOUND_GPS);
      dispatch({ type: "SET_GPS_SOURCE" });
    }
  }, [gpsStatus, coords, cities.length]);

  function setViewState(next: ViewState): void {
    dispatch({ type: "SET_VIEW", view: next });
  }

  function dismissIpConsent(): void {
    persistIpConsentDismissed();
    dispatch({ type: "DISMISS_IP_CONSENT" });
  }

  async function handleIpAccept(): Promise<void> {
    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    const signal = controller.signal;

    setIsIpAcceptInFlight(true);
    try {
      const result = await fetchIpLocation(signal);
      if (!result.ok) {
        const message =
          result.reason === "parse"
            ? "Resposta inválida do servidor"
            : result.reason === "server"
              ? "Serviço indisponível. Tente novamente em instantes."
              : "Não foi possível detectar sua localização";
        toast.error(message);
        return;
      }
      const data = result.data;
      // UX: resposta pode ser adulterada; a mutação Convex usa verifyIpLocationToken (valida `exp`).
      if (data.expiresAt <= Date.now()) {
        toast.error("Confirmação de localização expirou. Tente novamente.");
        return;
      }
      const nearest = findNearestCity(
        data.lat,
        data.lng,
        citiesRef.current
      );
      if (nearest) {
        dispatch({
          type: "SET_IP_SOURCE",
          cityId: nearest.city._id,
          token: data.attestationToken,
        });
        toast.success(
          `Localização detectada: ${nearest.city.name}, ${nearest.city.state}`
        );
      } else {
        toast.info(NEAREST_NOT_FOUND_IP);
      }
    } catch (e) {
      if (isAbortError(e)) return;
      toast.error("Não foi possível detectar sua localização");
    } finally {
      if (abortControllerRef.current === controller) {
        setIsIpAcceptInFlight(false);
        persistIpConsentDismissed();
        dispatch({ type: "DISMISS_IP_CONSENT" });
      }
    }
  }

  function selectCityManual(id: Id<"cities">): void {
    dispatch({ type: "SET_MANUAL_SOURCE", cityId: id });
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
