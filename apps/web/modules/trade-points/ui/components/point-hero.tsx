"use client";

import { memo, useMemo } from "react";
import { MapPin } from "lucide-react";
import {
  Status,
  StatusIndicator,
  StatusLabel,
} from "@workspace/ui/components/kibo-ui/status";
import type { ConfidenceStatus } from "@workspace/backend/lib/confidence-status";
import { resolveConfidenceStatus } from "@workspace/backend/lib/confidence-status";

type PointHeroProps = {
  name: string;
  lat: number;
  lng: number;
  confidenceScore: number;
};

function kiboStatusFromConfidence(
  confidence: ConfidenceStatus
): "online" | "offline" | "maintenance" | "degraded" {
  switch (confidence) {
    case "verified":
    case "high":
      return "online";
    case "moderate":
      return "maintenance";
    case "low":
      return "degraded";
    case "unverified":
    default:
      return "offline";
  }
}

const CONFIDENCE_LABEL_PT = {
  unverified: "Novo",
  low: "Inicial",
  moderate: "Em crescimento",
  high: "Forte",
  verified: "Verificado",
} satisfies Record<ConfidenceStatus, string>;

function confidenceLabelPt(confidence: ConfidenceStatus): string {
  return CONFIDENCE_LABEL_PT[confidence];
}

export const PointHero = memo(function PointHero({
  name,
  lat,
  lng,
  confidenceScore,
}: PointHeroProps) {
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=16&size=600x300&markers=${lat},${lng},red`;

  const confidence = useMemo(
    () => resolveConfidenceStatus(confidenceScore),
    [confidenceScore]
  );
  const badgeStatus = kiboStatusFromConfidence(confidence);
  const badgeLabel = confidenceLabelPt(confidence);

  return (
    <div className="group relative h-64 overflow-hidden rounded-2xl">
      {/* External OSM static map — dynamic query string; next/image adds little value */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={mapUrl}
        alt={`Mapa de ${name}`}
        className="absolute inset-0 h-full w-full object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="rounded-full bg-background/80 p-2 shadow-lg ring-1 ring-border backdrop-blur-sm">
          <MapPin
            className="size-8 animate-pulse text-primary"
            strokeWidth={2.25}
            aria-hidden
          />
        </div>
      </div>
      <Status
        status={badgeStatus}
        className="absolute bottom-4 left-4 border-border/60 bg-background/90 text-foreground shadow-sm backdrop-blur-sm"
      >
        <StatusIndicator />
        <StatusLabel>{badgeLabel}</StatusLabel>
      </Status>
    </div>
  );
});
