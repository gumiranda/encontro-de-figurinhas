"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface GeolocationState {
  status:
    | "idle"
    | "checking"
    | "prompting"
    | "granted"
    | "denied"
    | "unavailable"
    | "timeout";
  coords: { lat: number; lng: number } | null;
  error: string | null;
}

const GEO_OPTIONS: PositionOptions = {
  timeout: 10000,
  enableHighAccuracy: false,
  maximumAge: 5 * 60 * 1000,
};

const GPS_UNAVAILABLE: GeolocationState = {
  status: "unavailable",
  coords: null,
  error: "GPS indisponível",
};

/** GeolocationPositionError.code — https://w3c.github.io/geolocation-api/#position_error_interface */
const GEO_ERROR_MAP: Record<number, [GeolocationState["status"], string]> = {
  1: ["denied", "Permissão negada"],
  2: ["unavailable", "Posição indisponível"],
  3: ["timeout", "Timeout"],
};

const UNKNOWN_GEO_ERROR: [GeolocationState["status"], string] = [
  "unavailable",
  "Erro desconhecido",
];

export type UseGeolocationOptions = {
  /** Se true, chama checkPermission uma vez ao montar. O padrão é false para evitar prompt de geolocalização sem gesto do usuário. */
  autoCheck?: boolean;
};

/**
 * Estado + ações. Quando `status === "prompting"`, a permissão ainda não foi solicitada ao usuário;
 * a transição esperada é chamar `requestPermission()` (idealmente após um gesto).
 */
export interface UseGeolocationReturn extends GeolocationState {
  requestPermission: () => void;
  checkPermission: () => void;
}

export function useGeolocation({
  autoCheck = false,
}: UseGeolocationOptions = {}): UseGeolocationReturn {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    coords: null,
    error: null,
  });

  const mountedRef = useRef(true);
  const isCheckingRef = useRef(false);

  useEffect(() => () => {
    mountedRef.current = false;
  }, []);

  const fetchCoords = useCallback(
    () =>
      new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            if (mountedRef.current) {
              setState({
                status: "granted",
                coords: { lat: coords.latitude, lng: coords.longitude },
                error: null,
              });
            }
            resolve();
          },
          ({ code }) => {
            const [status, error] = GEO_ERROR_MAP[code] ?? UNKNOWN_GEO_ERROR;
            if (mountedRef.current) {
              setState({ status, coords: null, error });
            }
            resolve();
          },
          GEO_OPTIONS
        );
      }),
    []
  );

  const beginCheck = useCallback((): boolean => {
    if (isCheckingRef.current) return false;
    if (!navigator.geolocation) {
      setState(GPS_UNAVAILABLE);
      return false;
    }
    isCheckingRef.current = true;
    setState((s) => ({ ...s, status: "checking", error: null }));
    return true;
  }, []);

  const checkPermission = useCallback(() => {
    if (!beginCheck()) return;

    // Sem Permissions API: único término é fetchCoords; não há .query().finally abaixo.
    if (!navigator.permissions) {
      void fetchCoords().finally(() => {
        isCheckingRef.current = false;
      });
      return;
    }

    // Com Permissions API: .finally zera isCheckingRef após o .then/.catch, inclusive
    // quando granted retorna a Promise de fetchCoords (encadeamento) ou quando denied/prompt
    // termina síncrono (o .finally ainda roda após o handler).
    void navigator.permissions
      .query({ name: "geolocation" })
      .then(({ state: perm }) => {
        if (perm === "granted") return fetchCoords();
        if (mountedRef.current) {
          setState({
            status: perm === "denied" ? "denied" : "prompting",
            coords: null,
            error: perm === "denied" ? GEO_ERROR_MAP[1]![1] : null,
          });
        }
      })
      .catch(() => fetchCoords())
      .finally(() => {
        isCheckingRef.current = false;
      });
  }, [beginCheck, fetchCoords]);

  const requestPermission = useCallback(() => {
    if (!beginCheck()) return;
    void fetchCoords().finally(() => {
      isCheckingRef.current = false;
    });
  }, [beginCheck, fetchCoords]);

  useEffect(() => {
    if (autoCheck) checkPermission();
  }, [autoCheck, checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
