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
import { cn } from "@workspace/ui/lib/utils";
import { useMutation } from "convex/react";
import {
  AlertCircle,
  Check,
  Info,
  Landmark,
  LocateFixed,
  MapPin,
  RefreshCw,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { CityAutocomplete } from "@/modules/auth/ui/components/city-autocomplete";
import type { CityWithCoords } from "../../lib/location-constants";
import { resolveSetLocationToastMessage } from "../../lib/resolve-set-location-toast";
import {
  type LocationSource,
  useLocationFlow,
} from "../../lib/use-location-flow";
import { Radar } from "../components/radar-visual";

type GpsStatus =
  | "idle"
  | "checking"
  | "prompting"
  | "granted"
  | "denied"
  | "unavailable"
  | "timeout";

interface LocationSelectorViewProps {
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
  } = useLocationFlow({ cities, citiesError, currentCityId });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedCity = selectedCityId
    ? cities.find((c) => c._id === selectedCityId) ?? null
    : null;

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
      router.push("/dashboard");
    } catch (error) {
      toast.error(resolveSetLocationToastMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const primaryAction = selectedCity ? handleConfirmLocation : requestPermission;

  const primaryDisabled = isSubmitting || gpsStatus === "checking";

  const showRefresh =
    gpsStatus !== "checking" &&
    (!selectedCityId ||
      locationSource === "ip" ||
      gpsStatus === "denied" ||
      gpsStatus === "timeout" ||
      gpsStatus === "unavailable");

  const showMobileRetry =
    gpsStatus !== "checking" &&
    (!!selectedCityId ||
      gpsStatus === "denied" ||
      gpsStatus === "timeout" ||
      gpsStatus === "unavailable");

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

      {!citiesError && cities.length === 0 && (
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
            <em className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text not-italic text-transparent">
              troca?
            </em>
          </h1>
          <p className="text-[13px] text-[var(--on-surface-variant)]">
            {SHARED_SUBTITLE}
          </p>
        </div>

        {sharedBanners}

        <StateCard
          size="mobile"
          city={selectedCity}
          locationSource={locationSource}
          gpsStatus={gpsStatus}
          onPrimary={primaryAction}
          primaryDisabled={primaryDisabled}
        />

        {showMobileRetry && <RetryGpsLink onClick={requestPermission} />}

        <OrDivider>ou escolher outra</OrDivider>

        <CityAutocomplete value={selectedCityId} onChange={selectCityManual} />

        <CityList
          cities={suggestedCities}
          selectedCityId={selectedCityId}
          onSelect={selectCityManual}
          max={3}
        />
      </section>

      {/* Desktop */}
      <section className="hidden min-h-screen grid-cols-2 md:grid">
        <div className="flex flex-col justify-center gap-6 bg-[radial-gradient(500px_400px_at_30%_30%,rgba(55,102,255,0.15),transparent_60%)] px-14 py-16">
          <div className="flex items-center gap-2.5">
            <span
              className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary)] shadow-[0_0_20px_rgba(149,170,255,0.3)]"
              aria-hidden="true"
            >
              <Landmark className="h-5 w-5" strokeWidth={2.5} />
            </span>
            <span className="font-[var(--font-headline)] text-base font-extrabold tracking-tight text-[var(--on-surface)]">
              Figurinha Fácil
            </span>
          </div>

          <span className="font-mono text-xs uppercase tracking-wider text-[var(--outline)]">
            Passo 03 / 03
          </span>

          <div className="space-y-3">
            <h1 className="text-5xl font-black leading-none tracking-tight text-[var(--on-surface)]">
              Onde você{" "}
              <em className="bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] bg-clip-text not-italic text-transparent">
                troca?
              </em>
            </h1>
            <p className="max-w-[440px] text-[15px] text-[var(--on-surface-variant)]">
              {SHARED_SUBTITLE}
            </p>
          </div>

          {sharedBanners}

          <StateCard
            size="desktop"
            city={selectedCity}
            locationSource={locationSource}
            gpsStatus={gpsStatus}
            onPrimary={primaryAction}
            primaryDisabled={primaryDisabled}
            refreshSlot={
              showRefresh ? (
                <RefreshGpsButton onClick={requestPermission} />
              ) : null
            }
          />

          <OrDivider>ou busque outra</OrDivider>

          <CityAutocomplete value={selectedCityId} onChange={selectCityManual} />

          <CityList
            cities={suggestedCities}
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

interface StateCardProps {
  size: "mobile" | "desktop";
  city: CityWithCoords | null;
  locationSource: LocationSource;
  gpsStatus: GpsStatus;
  onPrimary: () => void;
  primaryDisabled: boolean;
  refreshSlot?: React.ReactNode;
}

function StateCard({
  size,
  city,
  locationSource,
  gpsStatus,
  onPrimary,
  primaryDisabled,
  refreshSlot,
}: StateCardProps) {
  const spec = stateCardSpec(city, locationSource, gpsStatus);

  const iconTileSize =
    size === "desktop" ? "h-12 w-12 rounded-[14px]" : "h-10 w-10 rounded-xl";
  const iconInnerSize = size === "desktop" ? "h-7 w-7" : "h-5 w-5";
  const titleSize = size === "desktop" ? "text-[17px]" : "text-[15px]";

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "flex items-center gap-3 rounded-2xl border bg-[var(--surface-container)] p-4",
          spec.borderClass
        )}
      >
        <div
          className={cn(
            "flex shrink-0 items-center justify-center",
            iconTileSize,
            spec.iconTileClass
          )}
        >
          <spec.Icon className={iconInnerSize} />
        </div>
        <div className="min-w-0 flex-1">
          <div
            className={cn(
              "font-[var(--font-headline)] font-bold text-[var(--on-surface)]",
              titleSize
            )}
          >
            {spec.title}
          </div>
          <div className="mt-0.5 text-xs text-[var(--on-surface-variant)]">
            {spec.subtitle}
          </div>
        </div>
        {spec.pill && (
          <Pill tone={spec.pill.tone} pulseDot={spec.pill.pulseDot}>
            {spec.pill.label}
          </Pill>
        )}
      </div>

      <div className="flex items-stretch gap-2.5">
        <Button
          type="button"
          onClick={onPrimary}
          disabled={primaryDisabled}
          className="btn-primary-gradient h-[52px] flex-1 gap-2 rounded-[14px] text-sm"
        >
          <spec.PrimaryIcon className="h-5 w-5" />
          {spec.primaryLabel}
        </Button>
        {refreshSlot}
      </div>
    </div>
  );
}

interface StateCardSpec {
  Icon: typeof LocateFixed;
  PrimaryIcon: typeof Check;
  title: string;
  subtitle: string;
  primaryLabel: string;
  borderClass: string;
  iconTileClass: string;
  pill: { label: string; tone: PillTone; pulseDot?: boolean } | null;
}

function stateCardSpec(
  city: CityWithCoords | null,
  locationSource: LocationSource,
  gpsStatus: GpsStatus
): StateCardSpec {
  if (city && locationSource === "gps") {
    return {
      Icon: LocateFixed,
      PrimaryIcon: Check,
      title: `Detectamos: ${city.name}`,
      subtitle: `GPS · ${city.state}`,
      primaryLabel: "Usar essa cidade",
      borderClass: "border-[var(--secondary)]",
      iconTileClass:
        "bg-[color-mix(in_srgb,var(--secondary)_15%,transparent)] text-[var(--secondary)]",
      pill: { label: "Detectado", tone: "success" },
    };
  }
  if (city && locationSource === "ip") {
    return {
      Icon: LocateFixed,
      PrimaryIcon: Check,
      title: `Detectamos: ${city.name}`,
      subtitle: `IP · ${city.state} · próximo a você`,
      primaryLabel: "Usar essa cidade",
      borderClass: "border-[var(--tertiary)]",
      iconTileClass:
        "bg-[color-mix(in_srgb,var(--tertiary)_15%,transparent)] text-[var(--tertiary)]",
      pill: { label: "Aproximado", tone: "warn" },
    };
  }
  if (city) {
    return {
      Icon: MapPin,
      PrimaryIcon: Check,
      title: `Selecionado: ${city.name}`,
      subtitle: city.state,
      primaryLabel: "Usar essa cidade",
      borderClass: "border-[var(--primary)]",
      iconTileClass:
        "bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]",
      pill: { label: "Selecionado", tone: "primary" },
    };
  }
  if (gpsStatus === "checking") {
    return {
      Icon: LocateFixed,
      PrimaryIcon: LocateFixed,
      title: "Procurando você...",
      subtitle: "Isso leva alguns segundos",
      primaryLabel: "Buscando",
      borderClass: "border-[var(--outline-variant)]",
      iconTileClass:
        "bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]",
      pill: { label: "Buscando", tone: "primary", pulseDot: true },
    };
  }
  return {
    Icon: LocateFixed,
    PrimaryIcon: LocateFixed,
    title: "Ative sua localização",
    subtitle: "Ou escolha uma cidade abaixo",
    primaryLabel: "Ativar GPS",
    borderClass: "border-[var(--outline-variant)]",
    iconTileClass: "bg-[var(--surface-container-high)] text-[var(--primary)]",
    pill: null,
  };
}

type PillTone = "success" | "warn" | "primary";

function Pill({
  tone,
  children,
  pulseDot,
}: {
  tone: PillTone;
  children: React.ReactNode;
  pulseDot?: boolean;
}) {
  const toneClass = {
    success:
      "bg-[color-mix(in_srgb,var(--secondary)_15%,transparent)] text-[var(--secondary)] border border-[color-mix(in_srgb,var(--secondary)_30%,transparent)]",
    warn: "bg-[color-mix(in_srgb,var(--tertiary)_12%,transparent)] text-[var(--tertiary)] border border-[color-mix(in_srgb,var(--tertiary)_30%,transparent)]",
    primary:
      "bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)] border border-[color-mix(in_srgb,var(--primary)_30%,transparent)]",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 font-[var(--font-headline)] text-[10px] font-bold uppercase tracking-[0.12em]",
        toneClass
      )}
    >
      {pulseDot && (
        <span
          className="pulse-dot"
          style={{ background: "var(--primary)" }}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
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

function CityList({
  cities,
  selectedCityId,
  onSelect,
  max,
}: {
  cities: CityWithCoords[];
  selectedCityId: Id<"cities"> | null;
  onSelect: (id: Id<"cities"> | null) => void;
  max: number;
}) {
  const visible = cities.slice(0, max);
  if (visible.length === 0) return null;

  return (
    <ul className="flex flex-col gap-1.5">
      {visible.map((city) => {
        const selected = selectedCityId === city._id;
        return (
          <li key={city._id}>
            <button
              type="button"
              onClick={() => onSelect(city._id)}
              aria-pressed={selected}
              className={cn(
                "flex w-full cursor-pointer items-center gap-3 rounded-xl border bg-[var(--surface-container)] p-3 text-left transition-colors hover:border-[var(--primary)]",
                selected
                  ? "border-[var(--primary)]"
                  : "border-[var(--outline-variant)]"
              )}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-[var(--surface-container-high)] text-[var(--primary)]">
                <MapPin className="h-[18px] w-[18px]" />
              </span>
              <span className="flex-1 font-[var(--font-headline)] text-sm font-bold text-[var(--on-surface)]">
                {city.name}
                <span className="block text-[11px] font-medium text-[var(--on-surface-variant)]">
                  {city.state}
                </span>
              </span>
              <span className="font-mono text-[11px] text-[var(--outline)]">
                →
              </span>
            </button>
          </li>
        );
      })}
    </ul>
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
