"use client";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { useMutation, useQuery } from "convex/react";
import {
  AlertCircle,
  Info,
  RefreshCw,
  Trophy,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { CityAutocomplete } from "@/modules/auth/ui/components/city-autocomplete";
import {
  SUGGESTED_CITY_KEYS,
  type CityWithCoords,
} from "../../lib/location-constants";
import { resolveSetLocationToastMessage } from "../../lib/resolve-set-location-toast";
import { stateCardSpec } from "../../lib/state-card-spec";
import { useLocationFlow } from "../../lib/use-location-flow";
import { CityList } from "../components/city-list";
import { Radar } from "../components/radar-visual";
import { StateCard } from "../components/state-card";

export interface LocationSelectorViewProps {
  cities: CityWithCoords[];
  suggestedCities: CityWithCoords[];
  citiesError?: string;
  currentCityId?: Id<"cities">;
}

const SHARED_SUBTITLE =
  "Mostramos pontos e colecionadores próximos. Você pode mudar a cidade depois.";

export function LocationSelectorView({
  cities,
  suggestedCities,
  citiesError,
  currentCityId,
}: LocationSelectorViewProps) {
  const router = useRouter();
  const setLocationMutation = useMutation(api.users.setLocation);
  const citiesLive = useQuery(api.cities.getAll);

  const citiesForFlow = useMemo((): CityWithCoords[] => {
    if (citiesLive === undefined) return cities;
    if (citiesLive.length > 0) return citiesLive;
    return cities;
  }, [cities, citiesLive]);

  const suggestedCitiesResolved = useMemo((): CityWithCoords[] => {
    if (suggestedCities.length > 0) return suggestedCities;
    const map = new Map(
      citiesForFlow.map((c) => [`${c.name}|${c.state}`, c] as const)
    );
    return SUGGESTED_CITY_KEYS.reduce<CityWithCoords[]>((acc, key) => {
      const found = map.get(`${key.name}|${key.state}`);
      if (found) acc.push(found);
      return acc;
    }, []);
  }, [suggestedCities, citiesForFlow]);

  const {
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
  } = useLocationFlow({ cities: citiesForFlow, citiesError, currentCityId });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCity = selectedCityId
    ? citiesForFlow.find((c) => c._id === selectedCityId) ?? null
    : null;

  const showEmptyCitiesBanner =
    !citiesError &&
    citiesForFlow.length === 0 &&
    citiesLive !== undefined;

  const spec = stateCardSpec(selectedCity, locationSource, gpsStatus);

  const radarMode: "idle" | "searching" =
    gpsStatus === "checking" ? "searching" : "idle";

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
        ...(locationSource === "ip" && ipToken
          ? { ipLocationToken: ipToken }
          : {}),
      });
      // Deixa o cliente Convex aplicar o snapshot do user antes do DashboardShell
      // avaliar getCurrentUser (evita redirect falso para /cadastrar-figurinhas).
      await new Promise<void>((resolve) => {
        queueMicrotask(() => queueMicrotask(resolve));
      });
      router.replace("/dashboard");
    } catch (error) {
      toast.error(resolveSetLocationToastMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryAction = selectedCity ? handleConfirmLocation : requestPermission;

  const primaryDisabled = spec.primaryDisabledByState || isSubmitting;

  const sharedBanners = (
    <>
      {citiesError && (
        <div
          role="alert"
          className="mb-2 flex gap-2 rounded-lg border border-[var(--tertiary)]/50 bg-[var(--tertiary)]/10 p-4 text-[var(--tertiary)]"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <div className="min-w-0 space-y-1 text-sm">
            <p>
              Não foi possível carregar a lista de cidades. Detecção automática
              indisponível — use a busca manual.
            </p>
            <p className="break-words opacity-90">{citiesError}</p>
          </div>
        </div>
      )}

      {showEmptyCitiesBanner && (
        <div
          role="status"
          className="mb-2 flex gap-2 rounded-lg border border-[var(--outline-variant)]/30 bg-[var(--surface-container-high)] p-4 text-[var(--on-surface)]"
        >
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--on-surface-variant)]" />
          <p className="min-w-0 text-sm">
            Ainda não há cidades na lista para sugestões automáticas. Use a busca
            abaixo; se não aparecer resultado, tente novamente mais tarde.
          </p>
        </div>
      )}
    </>
  );

  return (
    <main className="relative flex min-h-screen flex-col bg-[var(--background)]">
      {/* Mobile */}
      <section
        className="flex flex-1 flex-col gap-5 overflow-x-hidden bg-[radial-gradient(700px_500px_at_50%_30%,rgba(55,102,255,0.18),transparent_60%)] px-6 pb-12 md:hidden"
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0px) + 56px)",
        }}
      >
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-[var(--on-surface)]"
            onClick={handleBack}
            aria-label="Voltar"
          >
            <X className="h-5 w-5" />
          </Button>
          <span className="font-mono text-[11px] text-[var(--outline)]">
            3 / 3
          </span>
        </div>

        <Radar variant="mobile" mode={radarMode} className="my-2" />

        <div className="space-y-2 text-center">
          <h1 className="text-[28px] font-black leading-[1.05] tracking-tight text-[var(--on-surface)]">
            Onde você{" "}
            <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text text-transparent">
              troca?
            </span>
          </h1>
          <p className="text-[13px] text-[var(--on-surface-variant)]">
            {SHARED_SUBTITLE}
          </p>
        </div>

        {sharedBanners}

        <StateCard
          size="mobile"
          spec={spec}
          onPrimary={primaryAction}
          primaryDisabled={primaryDisabled}
        />

        {spec.showRetryLink && <RetryGpsLink onClick={requestPermission} />}

        <OrDivider>ou escolher outra</OrDivider>

        <CityAutocomplete value={selectedCityId} onChange={selectCityManual} />

        <CityList
          cities={suggestedCitiesResolved}
          selectedCityId={selectedCityId}
          onSelect={selectCityManual}
          max={3}
        />
      </section>

      {/* Desktop */}
      <section className="hidden min-h-screen grid-cols-2 md:grid">
        <div className="flex flex-col justify-center gap-6 bg-[radial-gradient(400px_300px_at_30%_30%,rgba(55,102,255,0.08),transparent_60%)] px-14 py-16">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-[var(--on-primary)] shadow-sm"
              aria-hidden="true"
            >
              <Trophy className="h-4 w-4" strokeWidth={2} />
            </span>
            <span className="font-[var(--font-headline)] text-base font-semibold tracking-tight text-[var(--on-surface)]">
              Figurinha Fácil
            </span>
          </div>

          <span className="font-mono text-xs uppercase tracking-wider text-[var(--outline)]">
            Passo 03 / 03
          </span>

          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-[var(--on-surface)]">
              Onde você{" "}
              <span className="text-primary">
                troca?
              </span>
            </h1>
            <p className="max-w-[440px] text-sm text-[var(--on-surface-variant)]">
              {SHARED_SUBTITLE}
            </p>
          </div>

          {sharedBanners}

          <StateCard
            size="desktop"
            spec={spec}
            onPrimary={primaryAction}
            primaryDisabled={primaryDisabled}
            refreshSlot={
              spec.showRefresh ? (
                <RefreshGpsButton onClick={requestPermission} />
              ) : null
            }
          />

          <OrDivider>ou busque outra</OrDivider>

          <CityAutocomplete value={selectedCityId} onChange={selectCityManual} />

          <CityList
            cities={suggestedCitiesResolved}
            selectedCityId={selectedCityId}
            onSelect={selectCityManual}
            max={2}
          />
        </div>

        <div className="relative flex items-center justify-center overflow-hidden border-l border-[var(--outline-variant)] bg-[var(--surface-container-low)]">
          <Radar variant="desktop" mode={radarMode} />
        </div>
      </section>

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
            <Button
              type="button"
              onClick={handleIpAccept}
              disabled={isIpAcceptInFlight}
            >
              {isIpAcceptInFlight ? "Detectando..." : "Sim, detectar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}

function OrDivider({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2.5 font-[var(--font-headline)] text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--outline)]">
      <span className="h-px flex-1 bg-[var(--outline-variant)]" />
      {children}
      <span className="h-px flex-1 bg-[var(--outline-variant)]" />
    </div>
  );
}

function RetryGpsLink({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mx-auto flex cursor-pointer items-center gap-1.5 text-[13px] font-semibold text-[var(--primary)] transition-opacity hover:opacity-80"
    >
      <RefreshCw className="h-[14px] w-[14px]" />
      Tentar GPS novamente
    </button>
  );
}

function RefreshGpsButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      className="h-[52px] w-[52px] shrink-0 rounded-[14px] border-[var(--outline-variant)] bg-transparent p-0 text-[var(--on-surface)] hover:bg-[var(--surface-container-high)]"
      aria-label="Tentar GPS novamente"
    >
      <RefreshCw className="h-5 w-5" />
    </Button>
  );
}
