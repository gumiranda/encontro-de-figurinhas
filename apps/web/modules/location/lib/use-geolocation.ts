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

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    coords: null,
    error: null,
  });

  const mountedRef = useRef(true);
  const isCheckingRef = useRef(false);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
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

    const releaseCheck = () => {
      isCheckingRef.current = false;
    };

    // Sem Permissions API: único término é fetchCoords; não há .query().finally abaixo.
    if (!navigator.permissions) {
      void fetchCoords().finally(releaseCheck);
      return;
    }

    // Com Permissions API: .finally(releaseCheck) corre após o .then/.catch, inclusive
    // quando granted retorna a Promise de fetchCoords (encadeamento) ou quando denied/prompt
    // termina síncrono (releaseCheck ainda roda após o handler).
    void navigator.permissions
      .query({ name: "geolocation" })
      .then(({ state: perm }) => {
        if (perm === "granted") return fetchCoords();
        if (mountedRef.current) {
          setState({
            status: perm === "denied" ? "denied" : "prompting",
            coords: null,
            error: perm === "denied" ? "Permissão negada" : null,
          });
        }
      })
      .catch(() => fetchCoords())
      .finally(releaseCheck);
  }, [beginCheck, fetchCoords]);

  const requestPermission = useCallback(() => {
    if (!beginCheck()) return;
    const releaseCheck = () => {
      isCheckingRef.current = false;
    };
    void fetchCoords().finally(releaseCheck);
  }, [beginCheck, fetchCoords]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
