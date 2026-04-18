"use client";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Heading, Text } from "@workspace/ui/components/typography";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useMutation } from "convex/react";
import { AlertCircle, ArrowLeft, CheckCircle2, Info } from "lucide-react";
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
    <main className="relative flex min-h-screen flex-col bg-background">
      <header
        className="fixed top-0 w-full z-50 flex items-center gap-3 px-6 min-h-16 bg-[var(--background)]"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
          boxShadow: "0 25px 50px -12px rgba(149, 170, 255, 0.1)",
        }}
      >
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-[var(--on-surface)] hover:text-[var(--primary)]"
          onClick={handleBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <Heading
          level={1}
          className="font-headline font-bold tracking-tighter uppercase text-lg text-[var(--primary)]"
        >
          figurinha fácil
        </Heading>
      </header>

      <div
        style={{ paddingTop: "calc(4rem + 2rem + env(safe-area-inset-top, 0px))" }}
        className="pb-32 px-6 max-w-xl mx-auto w-full flex flex-col flex-1 stadium-gradient"
      >
        {citiesError && (
          <div
            role="alert"
            className="mb-4 flex gap-2 rounded-lg border border-[var(--tertiary)]/50 bg-[var(--tertiary)]/10 p-4 text-[var(--tertiary)]"
          >
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <div className="text-sm space-y-1 min-w-0">
              <Text variant="small" className="font-normal">
                Não foi possível carregar a lista de cidades. Detecção automática
                indisponível — use a busca manual.
              </Text>
              <Text variant="small" className="font-normal opacity-90 break-words">
                {citiesError}
              </Text>
            </div>
          </div>
        )}

        {!citiesError && cities.length === 0 && (
          <div
            role="status"
            className="mb-4 flex gap-2 rounded-lg border border-[var(--outline-variant)]/30 bg-[var(--surface-container-high)] p-4 text-[var(--on-surface)]"
          >
            <Info className="h-4 w-4 shrink-0 mt-0.5 text-[var(--on-surface-variant)]" />
            <div className="text-sm space-y-1 min-w-0">
              <Text variant="small" className="font-normal">
                Ainda não há cidades na lista para sugestões automáticas. Use a
                busca abaixo; se não aparecer resultado, tente novamente mais tarde.
              </Text>
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
          <Button
            type="button"
            variant="ghost"
            onClick={handleConfirmLocation}
            disabled={isSubmitting}
            className="btn-primary-gradient mt-8 w-full"
          >
            {isSubmitting ? "Salvando..." : "Confirmar localização"}
            <CheckCircle2 className="ml-2 h-5 w-5" />
          </Button>
        )}
      </div>

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
              type="button"
              variant="outline"
              onClick={dismissIpConsent}
              disabled={isIpAcceptInFlight}
            >
              Não, obrigado
            </Button>
            <Button type="button" onClick={handleIpAccept} disabled={isIpAcceptInFlight}>
              {isIpAcceptInFlight ? "Detectando..." : "Sim, detectar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
