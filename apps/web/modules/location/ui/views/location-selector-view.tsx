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
import { AlertCircle, ArrowLeft, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import type { CityWithCoords } from "../../lib/location-constants";
import { resolveSetLocationToastMessage } from "../../lib/resolve-set-location-toast";
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
    shouldShowIpDialog,
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
      toast.error(resolveSetLocationToastMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const gpsDetectedCityLabel = useMemo(() => {
    if (viewState !== "gps" || locationSource !== "gps") return undefined;
    return cities.find((c) => c._id === selectedCityId)?.name;
  }, [viewState, locationSource, cities, selectedCityId]);

  return (
    <main className="landing-theme relative flex min-h-screen flex-col bg-[var(--landing-background)] stadium-gradient p-6">
      <header className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          className="text-[var(--landing-on-surface)] hover:text-[var(--landing-primary)]"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Typography
          variant="h1"
          className="text-lg text-[var(--landing-on-surface)]"
        >
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

      {!citiesError && cities.length === 0 && (
        <div
          role="status"
          className="mb-4 flex gap-2 rounded-lg border border-border bg-muted/40 p-4 text-foreground"
        >
          <Info className="h-4 w-4 shrink-0 mt-0.5 text-muted-foreground" />
          <div className="text-sm space-y-1 min-w-0">
            <p>
              Ainda não há cidades na lista para sugestões automáticas. Use a
              busca abaixo; se não aparecer resultado, tente novamente mais tarde.
            </p>
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
    </main>
  );
}
