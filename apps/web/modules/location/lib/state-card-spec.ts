import { Check, LocateFixed, MapPin } from "lucide-react";
import type { CityWithCoords } from "./location-constants";
import type { LocationSource } from "./use-location-flow";

export type StateCardState =
  | "gps"
  | "ip"
  | "manual"
  | "checking"
  | "idle";

export type GpsStatus =
  | "idle"
  | "checking"
  | "prompting"
  | "granted"
  | "denied"
  | "unavailable"
  | "timeout";

export type PillTone = "success" | "warn" | "primary";

export interface StateCardSpec {
  Icon: typeof LocateFixed;
  PrimaryIcon: typeof Check;
  title: string;
  subtitle: string;
  primaryLabel: string;
  borderClass: string;
  iconTileClass: string;
  pill: { label: string; tone: PillTone; pulseDot?: boolean } | null;
  showRefresh: boolean;
  showRetryLink: boolean;
  primaryDisabledByState: boolean;
}

function resolveState(
  city: CityWithCoords | null,
  locationSource: LocationSource,
  gpsStatus: GpsStatus
): StateCardState {
  if (city && locationSource === "gps") return "gps";
  if (city && locationSource === "ip") return "ip";
  if (city) return "manual";
  if (gpsStatus === "checking") return "checking";
  return "idle";
}

export function stateCardSpec(
  city: CityWithCoords | null,
  locationSource: LocationSource,
  gpsStatus: GpsStatus
): StateCardSpec {
  const state = resolveState(city, locationSource, gpsStatus);

  switch (state) {
    case "gps":
      return {
        Icon: LocateFixed,
        PrimaryIcon: Check,
        title: `Detectamos: ${city!.name}`,
        subtitle: `GPS · ${city!.state}`,
        primaryLabel: "Usar essa cidade",
        borderClass: "border-[var(--secondary)]",
        iconTileClass:
          "bg-[color-mix(in_srgb,var(--secondary)_15%,transparent)] text-[var(--secondary)]",
        pill: { label: "Detectado", tone: "success" },
        showRefresh: false,
        showRetryLink: true,
        primaryDisabledByState: false,
      };
    case "ip":
      return {
        Icon: LocateFixed,
        PrimaryIcon: Check,
        title: `Detectamos: ${city!.name}`,
        subtitle: `IP · ${city!.state} · próximo a você`,
        primaryLabel: "Usar essa cidade",
        borderClass: "border-[var(--tertiary)]",
        iconTileClass:
          "bg-[color-mix(in_srgb,var(--tertiary)_15%,transparent)] text-[var(--tertiary)]",
        pill: { label: "Aproximado", tone: "warn" },
        showRefresh: true,
        showRetryLink: true,
        primaryDisabledByState: false,
      };
    case "manual":
      return {
        Icon: MapPin,
        PrimaryIcon: Check,
        title: `Selecionado: ${city!.name}`,
        subtitle: city!.state,
        primaryLabel: "Usar essa cidade",
        borderClass: "border-[var(--primary)]",
        iconTileClass:
          "bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-[var(--primary)]",
        pill: { label: "Selecionado", tone: "primary" },
        showRefresh: false,
        showRetryLink: true,
        primaryDisabledByState: false,
      };
    case "checking":
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
        showRefresh: false,
        showRetryLink: false,
        primaryDisabledByState: true,
      };
    case "idle":
      return {
        Icon: LocateFixed,
        PrimaryIcon: LocateFixed,
        title: "Ative sua localização",
        subtitle: "Ou escolha uma cidade abaixo",
        primaryLabel: "Ativar GPS",
        borderClass: "border-[var(--outline-variant)]",
        iconTileClass:
          "bg-[var(--surface-container-high)] text-[var(--primary)]",
        pill: null,
        showRefresh: true,
        showRetryLink: false,
        primaryDisabledByState: false,
      };
    default: {
      const _exhaustive: never = state;
      return _exhaustive;
    }
  }
}
