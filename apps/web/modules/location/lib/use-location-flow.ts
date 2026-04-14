"use client";

import type { Id } from "@workspace/backend/_generated/dataModel";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { findNearestCity } from "./find-nearest-city";
import type { CityWithCoords } from "./location-constants";
import { useGeolocation } from "./use-geolocation";

const IP_CONSENT_KEY = "ip-consent-dismissed";

function persistIpConsentDismissed(): void {
  sessionStorage.setItem(IP_CONSENT_KEY, "true");
}

type ViewState = "gps" | "manual";

export type LocationSource = "gps" | "manual" | "ip";

export function useLocationFlow({
  cities,
  citiesError,
  currentCityId,
}: {
  cities: CityWithCoords[];
  citiesError?: string;
  currentCityId?: Id<"cities">;
}) {
  const { status: gpsStatus, coords, requestPermission } = useGeolocation();

  const [viewState, setViewState] = useState<ViewState>("gps");
  const [selectedCityId, setSelectedCityId] = useState<Id<"cities"> | null>(
    currentCityId ?? null
  );
  const [locationSource, setLocationSource] = useState<LocationSource>("manual");
  const [ipLocationToken, setIpLocationToken] = useState<string | null>(null);
  const [showIpConsent, setShowIpConsent] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(IP_CONSENT_KEY);
    setShowIpConsent(!dismissed);
  }, []);

  useEffect(() => {
    if (citiesError) {
      setViewState("manual");
    }
    if (gpsStatus === "denied" || gpsStatus === "unavailable") {
      setViewState("manual");
    }

    if (gpsStatus !== "granted" || !coords) {
      return;
    }

    setLocationSource("gps");
    setIpLocationToken(null);

    if (cities.length === 0) {
      toast.info("Use a busca manual para selecionar sua cidade.");
      return;
    }

    const nearest = findNearestCity(coords.lat, coords.lng, cities);
    if (nearest) {
      setSelectedCityId(nearest.city._id);
      if (nearest.isDistant) {
        toast.info(
          `Cidade mais próxima encontrada: ${nearest.city.name} (${nearest.distance}km)`
        );
      }
    } else {
      toast.info(
        "Não encontramos uma cidade na base para sua posição. Use a busca manual."
      );
    }
  }, [gpsStatus, coords, cities, citiesError]);

  const dismissIpConsent = useCallback(() => {
    persistIpConsentDismissed();
    setShowIpConsent(false);
  }, []);

  const handleIpAccept = useCallback(async () => {
    persistIpConsentDismissed();
    try {
      const res = await fetch("/api/ip-location");
      if (!res.ok) throw new Error("IP location failed");
      const data = (await res.json()) as {
        lat: number;
        lng: number;
        attestationToken?: string;
      };
      const nearest = findNearestCity(data.lat, data.lng, cities);
      if (nearest) {
        setSelectedCityId(nearest.city._id);
        setLocationSource("ip");
        setIpLocationToken(
          typeof data.attestationToken === "string" ? data.attestationToken : null
        );
        toast.success(
          `Localização detectada: ${nearest.city.name}, ${nearest.city.state}`
        );
      } else {
        toast.info("Não encontramos uma cidade próxima. Use a busca manual.");
      }
    } catch {
      toast.error("Não foi possível detectar sua localização");
    } finally {
      setShowIpConsent(false);
    }
  }, [cities]);

  const selectCityManual = useCallback((id: Id<"cities">) => {
    setSelectedCityId(id);
    setLocationSource("manual");
    setIpLocationToken(null);
  }, []);

  return {
    viewState,
    setViewState,
    selectedCityId,
    locationSource,
    ipLocationToken,
    showIpConsent,
    gpsStatus,
    coords,
    requestPermission,
    dismissIpConsent,
    handleIpAccept,
    selectCityManual,
  };
}
