"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type SetStateAction,
} from "react";

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

const GEOLOCATION_MAXIMUM_AGE_MS = 5 * 60 * 1000;

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    coords: null,
    error: null,
  });

  const mountedRef = useRef(true);
  const isCheckingRef = useRef(false);

  const withCheckGuard = useCallback((fn: () => void | Promise<void>) => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    Promise.resolve(fn()).finally(() => {
      isCheckingRef.current = false;
    });
  }, []);

  const setStateIfMounted = useCallback((update: SetStateAction<GeolocationState>) => {
    if (!mountedRef.current) return;
    setState(update);
  }, []);

  const setStatus = useCallback(
    (status: GeolocationState["status"], error: string | null = null) =>
      setStateIfMounted({ status, coords: null, error }),
    [setStateIfMounted]
  );

  const setChecking = useCallback(
    () => setStateIfMounted((s) => ({ ...s, status: "checking", error: null })),
    [setStateIfMounted]
  );

  const fetchCoords = useCallback((onSettled?: () => void) => {
    if (!navigator.geolocation) {
      onSettled?.();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setStateIfMounted({
          status: "granted",
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
        onSettled?.();
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setStatus("denied", "Permissão negada");
            break;
          case error.POSITION_UNAVAILABLE:
            setStatus("unavailable", "Posição indisponível");
            break;
          case error.TIMEOUT:
            setStatus("timeout", "Timeout");
            break;
          default:
            setStatus("unavailable", "Erro desconhecido");
            break;
        }
        onSettled?.();
      },
      {
        timeout: 10000,
        enableHighAccuracy: false,
        maximumAge: GEOLOCATION_MAXIMUM_AGE_MS,
      }
    );
  }, [setStatus, setStateIfMounted]);

  const awaitFetchCoords = useCallback(
    () =>
      new Promise<void>((resolve) => {
        fetchCoords(() => resolve());
      }),
    [fetchCoords]
  );

  const checkPermission = useCallback(() => {
    void withCheckGuard(async () => {
      if (!navigator.geolocation) {
        setStatus("unavailable", "GPS indisponível");
        return;
      }

      setChecking();

      try {
        const result = await navigator.permissions.query({ name: "geolocation" });
        if (result.state === "granted") {
          await awaitFetchCoords();
        } else if (result.state === "denied") {
          setStatus("denied");
        } else {
          setStatus("prompting");
        }
      } catch {
        setStatus("prompting");
      }
    });
  }, [withCheckGuard, awaitFetchCoords, setStatus, setStateIfMounted]);

  const requestPermission = useCallback(() => {
    void withCheckGuard(async () => {
      setStateIfMounted((s) => ({ ...s, status: "checking", error: null }));
      await awaitFetchCoords();
    });
  }, [withCheckGuard, awaitFetchCoords, setStateIfMounted]);

  useEffect(() => {
    mountedRef.current = true;
    void checkPermission();
    return () => {
      mountedRef.current = false;
    };
  }, [checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
