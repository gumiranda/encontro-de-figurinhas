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

  const statusRef = useRef(state.status);
  const isMountedRef = useRef(true);

  useEffect(() => {
    statusRef.current = state.status;
  }, [state.status]);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const fetchCoords = useCallback(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!isMountedRef.current) return;
        setState({
          status: "granted",
          coords: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
          error: null,
        });
      },
      (error) => {
        if (!isMountedRef.current) return;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setState({
              status: "denied",
              coords: null,
              error: "Permissão negada",
            });
            break;
          case error.POSITION_UNAVAILABLE:
            setState({
              status: "unavailable",
              coords: null,
              error: "Posição indisponível",
            });
            break;
          case error.TIMEOUT:
            setState({ status: "timeout", coords: null, error: "Timeout" });
            break;
        }
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  }, []);

  const checkPermission = useCallback(async () => {
    if (statusRef.current === "checking") return;
    if (!navigator.geolocation) {
      setState({
        status: "unavailable",
        coords: null,
        error: "GPS indisponível",
      });
      return;
    }

    setState({ status: "checking", coords: null, error: null });

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      if (!isMountedRef.current) return;
      if (result.state === "granted") {
        fetchCoords();
      } else if (result.state === "denied") {
        setState((s) => ({ ...s, status: "denied" }));
      } else {
        setState((s) => ({ ...s, status: "prompting" }));
      }
    } catch {
      if (!isMountedRef.current) return;
      setState({ status: "prompting", coords: null, error: null });
    }
  }, [fetchCoords]);

  const requestPermission = useCallback(() => {
    setState({ status: "checking", coords: null, error: null });
    fetchCoords();
  }, [fetchCoords]);

  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  return { ...state, requestPermission, checkPermission };
}
