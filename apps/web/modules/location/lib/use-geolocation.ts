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

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    coords: null,
    error: null,
  });

  const isCheckingRef = useRef(false);

  const fetchCoords = useCallback(
    () =>
      new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            setState({
              status: "granted",
              coords: { lat: coords.latitude, lng: coords.longitude },
              error: null,
            });
            resolve();
          },
          (error) => {
            const { code, PERMISSION_DENIED, POSITION_UNAVAILABLE, TIMEOUT } = error;
            const [status, err] =
              code === PERMISSION_DENIED
                ? (["denied", "Permissão negada"] as const)
                : code === TIMEOUT
                  ? (["timeout", "Timeout"] as const)
                  : code === POSITION_UNAVAILABLE
                    ? (["unavailable", "Posição indisponível"] as const)
                    : (["unavailable", "Erro desconhecido"] as const);
            setState({ status, coords: null, error: err });
            resolve();
          },
          GEO_OPTIONS
        );
      }),
    []
  );

  const checkPermission = useCallback(() => {
    if (isCheckingRef.current) return;
    if (!navigator.geolocation) {
      setState({ status: "unavailable", coords: null, error: "GPS indisponível" });
      return;
    }

    isCheckingRef.current = true;
    setState((s) => ({ ...s, status: "checking", error: null }));

    let queryPromise: Promise<PermissionStatus>;
    try {
      queryPromise = navigator.permissions.query({ name: "geolocation" });
    } catch {
      fetchCoords().finally(() => {
        isCheckingRef.current = false;
      });
      return;
    }

    queryPromise
      .then(({ state: perm }) => {
        if (perm === "granted") return fetchCoords();
        setState({
          status: perm === "denied" ? "denied" : "prompting",
          coords: null,
          error: perm === "denied" ? "Permissão negada" : null,
        });
      })
      .catch(() => fetchCoords())
      .finally(() => {
        isCheckingRef.current = false;
      });
  }, [fetchCoords]);

  const requestPermission = useCallback(() => {
    if (isCheckingRef.current) return;
    if (!navigator.geolocation) {
      setState({ status: "unavailable", coords: null, error: "GPS indisponível" });
      return;
    }

    isCheckingRef.current = true;
    setState((s) => ({ ...s, status: "checking", error: null }));
    fetchCoords().finally(() => {
      isCheckingRef.current = false;
    });
  }, [fetchCoords]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
