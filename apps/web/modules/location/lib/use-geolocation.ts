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

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    status: "idle",
    coords: null,
    error: null,
  });

  const isCheckingRef = useRef(false);

  const setStatus = useCallback(
    (status: GeolocationState["status"], error: string | null = null) =>
      setState({ status, coords: null, error }),
    []
  );

  const fetchCoords = useCallback((onSettled?: () => void) => {
    if (!navigator.geolocation) {
      onSettled?.();
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
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
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, [setStatus]);

  const checkPermission = useCallback(async () => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;

    if (!navigator.geolocation) {
      setStatus("unavailable", "GPS indisponível");
      isCheckingRef.current = false;
      return;
    }

    setState((s) => ({ ...s, status: "checking", error: null }));

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      if (result.state === "granted") {
        fetchCoords(() => {
          isCheckingRef.current = false;
        });
      } else if (result.state === "denied") {
        setStatus("denied");
        isCheckingRef.current = false;
      } else {
        setStatus("prompting");
        isCheckingRef.current = false;
      }
    } catch {
      setStatus("prompting");
      isCheckingRef.current = false;
    }
  }, [fetchCoords, setStatus]);

  const requestPermission = useCallback(() => {
    if (isCheckingRef.current) return;
    isCheckingRef.current = true;
    setState((s) => ({ ...s, status: "checking", error: null }));
    fetchCoords(() => {
      isCheckingRef.current = false;
    });
  }, [fetchCoords, setStatus]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
