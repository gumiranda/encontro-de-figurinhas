"use client";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Typography } from "@workspace/ui/components/typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useMutation } from "convex/react";
import { AlertCircle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { CityWithCoords } from "../../lib/location-constants";
import { useLocationFlow } from "../../lib/use-location-flow";
import { GpsPermissionScreen } from "../components/gps-permission-screen";
import { ManualSearchScreen } from "../components/manual-search-screen";

interface LocationSelectorViewProps {
  cities: CityWithCoords[];
  suggestedCities: CityWithCoords[];
  citiesError?: string;
  currentCityId?: Id<"cities">;
}

export function LocationSelectorView({
  cities,
  suggestedCities,
  citiesError,
  currentCityId,
}: LocationSelectorViewProps) {
  const router = useRouter();
  const setLocationMutation = useMutation(api.users.setLocation);

  const {
    viewState,
    setViewState,
    selectedCityId,
    locationSource,
    getIpLocationAttestationToken,
    showIpConsent,
    gpsStatus,
    coords,
    requestPermission,
    dismissIpConsent,
    handleIpAccept,
    selectCityManual,
    isIpAcceptInFlight,
  } = useLocationFlow({ cities, citiesError, currentCityId });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkipToManual = () => setViewState("manual");

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const handleConfirmLocation = async () => {
    if (!selectedCityId || isSubmitting) return;
    const ipToken =
      locationSource === "ip" ? getIpLocationAttestationToken() : null;
    setIsSubmitting(true);
    try {
      await setLocationMutation({
        cityId: selectedCityId,
        locationSource,
        ...(locationSource === "gps" && coords
          ? { lat: coords.lat, lng: coords.lng }
          : {}),
        ...(locationSource === "ip" && ipToken ? { ipLocationToken: ipToken } : {}),
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("setLocation failed:", error);
      const message = error instanceof Error ? error.message : "";
      if (message.includes("aguarde") || message.includes("Limite")) {
        toast.error(message);
      } else {
        toast.error("Erro ao salvar localização. Tente novamente.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const shouldShowIpDialog =
    viewState === "manual" && gpsStatus === "denied" && showIpConsent;

  const gpsDetectedCityLabel =
    viewState === "gps" && locationSource === "gps" && selectedCityId
      ? (cities.find((c) => c._id === selectedCityId)?.name ?? null)
      : null;

  return (
    <div className="min-h-screen flex flex-col p-6">
      <header className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={handleBack}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Typography variant="h1" className="text-lg">
          Selecionar localização
        </Typography>
      </header>

      {citiesError && (
        <div
          role="alert"
          className="mb-4 flex gap-2 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
        >
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <div className="text-sm space-y-1 min-w-0">
            <p>
              Não foi possível carregar a lista de cidades. Detecção automática
              indisponível — use a busca manual.
            </p>
            <p className="text-destructive/90 break-words">{citiesError}</p>
          </div>
        </div>
      )}

      {viewState === "gps" && (
        <GpsPermissionScreen
          status={gpsStatus}
          detectedCityLabel={gpsDetectedCityLabel}
          onRequestPermission={requestPermission}
          onSkipToManual={handleSkipToManual}
        />
      )}

      {viewState === "manual" && (
        <ManualSearchScreen
          selectedCityId={selectedCityId}
          onCitySelect={selectCityManual}
          suggestedCities={suggestedCities}
        />
      )}

      {selectedCityId && (
        <div className="mt-auto pt-6">
          <Button
            className="w-full"
            disabled={isSubmitting}
            onClick={handleConfirmLocation}
          >
            {isSubmitting ? "Salvando..." : "Confirmar localização"}
          </Button>
        </div>
      )}

      <Dialog
        open={shouldShowIpDialog}
        onOpenChange={(open) => {
          if (!open) dismissIpConsent();
        }}
      >
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Detectar localização aproximada?</DialogTitle>
            <DialogDescription>
              Podemos usar seu IP para sugerir uma cidade próxima.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={dismissIpConsent}
              disabled={isIpAcceptInFlight}
            >
              Não, obrigado
            </Button>
            <Button onClick={handleIpAccept} disabled={isIpAcceptInFlight}>
              {isIpAcceptInFlight ? "Detectando..." : "Sim, detectar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
