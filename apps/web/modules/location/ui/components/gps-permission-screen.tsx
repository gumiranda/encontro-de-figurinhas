"use client";

import { Button } from "@workspace/ui/components/button";
import { MapPin } from "lucide-react";

interface GpsPermissionScreenProps {
  status:
    | "idle"
    | "prompting"
    | "checking"
    | "granted"
    | "denied"
    | "timeout"
    | "unavailable";
  /** When GPS already suggested a city, show name + hint to confirm below. */
  detectedCityLabel?: string | null;
  onRequestPermission: () => void;
  onSkipToManual: () => void;
}

export function GpsPermissionScreen({
  status,
  detectedCityLabel,
  onRequestPermission,
  onSkipToManual,
}: GpsPermissionScreenProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-6 flex-1 justify-center">
      <div className="w-64 h-64 rounded-full bg-primary/10 flex items-center justify-center">
        <MapPin className="w-24 h-24 text-primary" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">
          Para encontrar colecionadores perto de você
        </h2>
        <p className="text-muted-foreground">
          Precisamos da sua localização para mostrar pontos de troca na sua região.
        </p>
      </div>

      {status === "timeout" && (
        <p className="text-amber-600">
          GPS demorou para responder. Tente novamente ou busque manualmente.
        </p>
      )}

      {status === "unavailable" && (
        <p className="text-red-600">GPS não disponível no seu dispositivo.</p>
      )}

      {status === "granted" && detectedCityLabel && (
        <p className="text-green-600 text-sm">
          Cidade sugerida: <span className="font-medium">{detectedCityLabel}</span>.
          Confirme abaixo ou use a busca manual para trocar.
        </p>
      )}
      {status === "granted" && !detectedCityLabel && (
        <p className="text-green-600 text-sm">
          Localização obtida. Confirme abaixo ou use a busca manual.
        </p>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {status === "checking" && <Button disabled>Verificando...</Button>}
        {(status === "prompting" || status === "timeout") && (
          <Button onClick={onRequestPermission}>Ativar localização</Button>
        )}
        <Button variant="outline" onClick={onSkipToManual}>
          Buscar arena manualmente
        </Button>
      </div>
    </div>
  );
}
