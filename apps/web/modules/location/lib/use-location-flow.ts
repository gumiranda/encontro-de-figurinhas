"use client";

import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type MutableRefObject,
} from "react";
import { toast } from "sonner";
import { z } from "zod";
import { findNearestCity } from "./find-nearest-city";
import type { CityWithCoords } from "./location-constants";
import { useGeolocation } from "./use-geolocation";

const IP_CONSENT_KEY = "ip-consent-dismissed";

const IP_LOCATION_CLIENT_CLOCK_SKEW_MS = 30_000;

const IP_LOCATION_SERVER_RETRY_ATTEMPTS = 3;
const IP_LOCATION_SERVER_RETRY_BASE_MS = 400;
const IP_LOCATION_FETCH_TIMEOUT_MS = 5000;

function ipLocationFetchSignal(signal: AbortSignal): AbortSignal {
  return AbortSignal.any([signal, AbortSignal.timeout(IP_LOCATION_FETCH_TIMEOUT_MS)]);
}

const delay = (ms: number, signal: AbortSignal): Promise<void> =>
  new Promise<void>((resolve, reject) => {
    if (signal.aborted) {
      reject(new DOMException("Aborted", "AbortError"));
      return;
    }
    const id = setTimeout(resolve, ms);
    signal.addEventListener("abort", () => { clearTimeout(id); reject(new DOMException("Aborted", "AbortError")); }, { once: true });
  });

async function fetchIpLocationWithServerRetry(
  signal: AbortSignal
): Promise<IpLocationFetchResult> {
  let delayMs = IP_LOCATION_SERVER_RETRY_BASE_MS;
  let last: IpLocationFetchResult = { ok: false, reason: "server" };
  for (let attempt = 0; attempt < IP_LOCATION_SERVER_RETRY_ATTEMPTS; attempt++) {
    last = await fetchIpLocation(signal);
    if (last.ok || last.reason !== "server") return last;
    if (attempt < IP_LOCATION_SERVER_RETRY_ATTEMPTS - 1) {
      await delay(delayMs, signal);
      delayMs *= 2;
    }
  }
  return last;
}

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
  | { ok: false; reason: "parse" | "server" | "client" | "timeout" };

function isAbortSignalTimeout(e: unknown): boolean {
  return (
    (typeof DOMException !== "undefined" &&
      e instanceof DOMException &&
      e.name === "TimeoutError") ||
    (e instanceof Error && e.name === "TimeoutError")
  );
}

async function fetchIpLocation(signal: AbortSignal): Promise<IpLocationFetchResult> {
  try {
    const res = await fetch("/api/ip-location", {
      signal: ipLocationFetchSignal(signal),
    });
    if (!res.ok) {
      return {
        ok: false,
        reason: res.status >= 500 ? "server" : "client",
      };
    }
    const parsed = ipLocationResponseSchema.safeParse(await res.json());
    if (!parsed.success) return { ok: false, reason: "parse" };
    return { ok: true, data: parsed.data };
  } catch (e) {
    if (isAbortSignalTimeout(e)) {
      return { ok: false, reason: "timeout" };
    }
    throw e;
  }
}

function persistIpConsentDismissed(): void {
  setSessionItem(IP_CONSENT_KEY, "true");
}

function toastIpLocationError(
  message: string,
  onRetry: () => void
): void {
  toast.error(message, {
    action: {
      label: "Tentar novamente",
      onClick: onRetry,
    },
  });
}

const nearestNotFoundMessage = (context: string): string =>
  `Não encontramos uma cidade ${context}. Use a busca manual.`;

export type LocationSource = "gps" | "manual" | "ip";

type GeolocationHook = ReturnType<typeof useGeolocation>;

export type UseLocationFlowReturn = {
  selectedCityId: Id<"cities"> | null;
  locationSource: LocationSource;
  getIpLocationAttestationToken: () => string | null;
  showIpConsent: boolean;
  shouldShowIpDialog: boolean;
  isIpAcceptInFlight: boolean;
  gpsStatus: GeolocationHook["status"];
  coords: GeolocationHook["coords"];
  requestPermission: GeolocationHook["requestPermission"];
  dismissIpConsent: () => void;
  handleIpAccept: () => Promise<void>;
  selectCityManual: (cityId: Id<"cities"> | null) => void;
};

export type LocationState = {
  selectedCityId: Id<"cities"> | null;
  locationSource: LocationSource;
  showIpConsent: boolean;
  isIpAcceptInFlight: boolean;
};

export type LocationAction =
  | { type: "SET_GPS_SOURCE"; cityId?: Id<"cities"> }
  | { type: "SET_MANUAL_SOURCE"; cityId: Id<"cities"> }
  | { type: "SET_IP_SOURCE"; cityId: Id<"cities"> }
  | { type: "SET_SHOW_IP_CONSENT"; show: boolean }
  | { type: "SYNC_CURRENT_CITY_ID"; cityId: Id<"cities"> }
  | { type: "DISMISS_IP_CONSENT" }
  | { type: "IP_ACCEPT_START" }
  | { type: "IP_ACCEPT_END" };

function initialLocationState(currentCityId?: Id<"cities">): LocationState {
  return {
    selectedCityId: currentCityId ?? null,
    locationSource: "manual",
    showIpConsent: false,
    isIpAcceptInFlight: false,
  };
}

export function locationReducer(
  state: LocationState,
  action: LocationAction
): LocationState {
  switch (action.type) {
    case "SET_GPS_SOURCE":
      return {
        ...state,
        selectedCityId: action.cityId ?? state.selectedCityId,
        locationSource: "gps",
      };
    case "SET_MANUAL_SOURCE":
      return {
        ...state,
        selectedCityId: action.cityId,
        locationSource: "manual",
      };
    case "SET_IP_SOURCE":
      return {
        ...state,
        selectedCityId: action.cityId,
        locationSource: "ip",
      };
    case "SET_SHOW_IP_CONSENT":
      return { ...state, showIpConsent: action.show };
    case "SYNC_CURRENT_CITY_ID":
      if (state.selectedCityId) return state;
      return { ...state, selectedCityId: action.cityId };
    case "DISMISS_IP_CONSENT":
      return { ...state, showIpConsent: false };
    case "IP_ACCEPT_START":
      return { ...state, isIpAcceptInFlight: true };
    case "IP_ACCEPT_END":
      return { ...state, isIpAcceptInFlight: false };
    default: {
      const _exhaustive: never = action;
      return _exhaustive;
    }
  }
}

type IpFetchFailureReason = Extract<
  IpLocationFetchResult,
  { ok: false }
>["reason"];

function prepareIpLocationAbort(
  abortControllerRef: MutableRefObject<AbortController | null>
): AbortController {
  abortControllerRef.current?.abort();
  const controller = new AbortController();
  abortControllerRef.current = controller;
  return controller;
}

function toastIpFetchFailureReason(
  reason: IpFetchFailureReason,
  retryIpAccept: () => void
): void {
  const message =
    reason === "parse"
      ? "Resposta inválida do servidor"
      : reason === "server"
        ? "Serviço indisponível. Tente novamente em instantes."
        : reason === "timeout"
          ? "A requisição demorou demais. Verifique sua conexão e tente novamente."
          : "Não foi possível detectar sua localização";
  toastIpLocationError(message, retryIpAccept);
}

function applyIpLocationFetchSuccess(
  data: IpLocationResponse,
  cities: CityWithCoords[],
  dispatch: (action: LocationAction) => void,
  attestationRef: MutableRefObject<string | null>,
  retryIpAccept: () => void
): void {
  if (data.expiresAt <= Date.now() + IP_LOCATION_CLIENT_CLOCK_SKEW_MS) {
    toastIpLocationError(
      "Confirmação de localização expirou. Tente novamente.",
      retryIpAccept
    );
    return;
  }
  const nearest = findNearestCity(data.lat, data.lng, cities);
  if (nearest) {
    attestationRef.current = data.attestationToken;
    dispatch({ type: "SET_IP_SOURCE", cityId: nearest.city._id });
    toast.success(
      `Localização detectada: ${nearest.city.name}, ${nearest.city.state}`
    );
  } else {
    toast.info(nearestNotFoundMessage("próxima"));
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

  const citiesKey = `${cities.length}-${cities[0]?._id ?? ""}-${cities.at(-1)?._id ?? ""}`;
  const citiesStable = useMemo(() => cities, [citiesKey]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const ipLocationAttestationRef = useRef<string | null>(null);

  const [state, dispatch] = useReducer(
    locationReducer,
    currentCityId,
    (initialCityId?: Id<"cities">) => initialLocationState(initialCityId)
  );

  useEffect(() => {
    if (state.locationSource !== "ip") {
      ipLocationAttestationRef.current = null;
    }
  }, [state.locationSource]);

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
    if (citiesError) {
      toast.error("Erro ao carregar cidades. Use a busca manual.");
      return;
    }

    if (gpsStatus !== "granted" || !coords) return;

    if (citiesStable.length === 0) {
      dispatch({ type: "SET_GPS_SOURCE" });
      toast.info("Use a busca manual para selecionar sua cidade.");
      return;
    }

    const nearest = findNearestCity(coords.lat, coords.lng, citiesStable);
    if (nearest) {
      dispatch({ type: "SET_GPS_SOURCE", cityId: nearest.city._id });
      if (nearest.isDistant) {
        toast.info(
          `Cidade mais próxima encontrada: ${nearest.city.name} (${nearest.distance}km)`
        );
      }
    } else {
      toast.info(nearestNotFoundMessage("na base para sua posição"));
      dispatch({ type: "SET_GPS_SOURCE" });
    }
  }, [citiesError, gpsStatus, coords, citiesStable]);

  useEffect(() => {
    return () => abortControllerRef.current?.abort();
  }, []);

  // Intencional: após recusa explícita o diálogo IP não reabre nesta sessão.
  // `sessionStorage` preserva a decisão até a aba fechar; retry do GPS não ressurge o prompt.
  function dismissIpConsent(): void {
    persistIpConsentDismissed();
    dispatch({ type: "DISMISS_IP_CONSENT" });
  }

  async function handleIpAccept(): Promise<void> {
    const retryIpAccept = () => void handleIpAccept();
    const controller = prepareIpLocationAbort(abortControllerRef);
    const signal = controller.signal;

    dispatch({ type: "IP_ACCEPT_START" });
    try {
      const result = await fetchIpLocationWithServerRetry(signal);
      if (!result.ok) {
        toastIpFetchFailureReason(result.reason, retryIpAccept);
        return;
      }
      applyIpLocationFetchSuccess(
        result.data,
        citiesStable,
        dispatch,
        ipLocationAttestationRef,
        retryIpAccept
      );
    } catch (e) {
      if (e instanceof Error && e.name === "AbortError") return;
      toastIpLocationError(
        "Não foi possível detectar sua localização",
        retryIpAccept
      );
    } finally {
      if (abortControllerRef.current === controller) {
        dispatch({ type: "IP_ACCEPT_END" });
        dismissIpConsent();
      }
    }
  }

  function selectCityManual(id: Id<"cities"> | null): void {
    if (id == null) return;
    const cityExists = citiesStable.some((c) => c._id === id);
    if (!cityExists) {
      toast.error("Cidade inválida");
      return;
    }
    dispatch({ type: "SET_MANUAL_SOURCE", cityId: id });
  }

  const getIpLocationAttestationToken = (): string | null =>
    ipLocationAttestationRef.current;

  const {
    selectedCityId,
    locationSource,
    showIpConsent,
    isIpAcceptInFlight,
  } = state;

  const shouldShowIpDialog =
    gpsStatus === "denied" && showIpConsent && !selectedCityId;

  return {
    selectedCityId,
    locationSource,
    getIpLocationAttestationToken,
    showIpConsent,
    shouldShowIpDialog,
    isIpAcceptInFlight,
    gpsStatus,
    coords,
    requestPermission,
    dismissIpConsent,
    handleIpAccept,
    selectCityManual,
  };
}
