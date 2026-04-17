"use client";

import { memo } from "react";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Card } from "@workspace/ui/components/card";

type PointHeroProps = {
  name: string;
  lat: number;
  lng: number;
  confidenceScore: number;
};

export const PointHero = memo(function PointHero({
  name,
  lat,
  lng,
  confidenceScore,
}: PointHeroProps) {
  const verified = confidenceScore >= 7;
  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${lat},${lng}&zoom=16&size=600x300&markers=${lat},${lng},red`;

  return (
    <Card className="relative h-64 overflow-hidden border-0 p-0">
      <img
        src={mapUrl}
        alt={`Mapa de ${name}`}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
      {verified && (
        <Badge className="absolute right-4 top-4" variant="secondary">
          <ShieldCheck className="mr-1 h-3.5 w-3.5" />
          Ponto Verificado
        </Badge>
      )}
    </Card>
  );
});
