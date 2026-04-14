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
            const [status, error] =
              GEO_ERROR_MAP[code] ?? (["unavailable", "Erro desconhecido"] as const);
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

    if (!navigator.permissions) {
      fetchCoords().finally(() => {
        isCheckingRef.current = false;
      });
      return;
    }

    navigator.permissions
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
      .finally(() => {
        isCheckingRef.current = false;
      });
  }, [beginCheck, fetchCoords]);

  const requestPermission = useCallback(() => {
    if (!beginCheck()) return;
    fetchCoords().finally(() => {
      isCheckingRef.current = false;
    });
  }, [beginCheck, fetchCoords]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
