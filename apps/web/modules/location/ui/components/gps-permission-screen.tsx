"use client";

import { Button } from "@workspace/ui/components/button";
import { Heading, Text } from "@workspace/ui/components/typography";
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
        <Heading level={2} className="border-0 pb-0 text-xl">
          Para encontrar colecionadores perto de você
        </Heading>
        <Text variant="muted">
          Precisamos da sua localização para mostrar pontos de troca na sua região.
        </Text>
      </div>

      {status === "timeout" && (
        <Text variant="small" className="text-warning font-normal">
          GPS demorou para responder. Tente novamente ou busque manualmente.
        </Text>
      )}

      {status === "denied" && (
        <Text variant="small" className="text-destructive font-normal">
          Localização negada. Libere nas configurações do navegador ou busque
          manualmente.
        </Text>
      )}

      {status === "unavailable" && (
        <Text variant="small" className="text-destructive font-normal">
          GPS não disponível no seu dispositivo.
        </Text>
      )}

      {status === "granted" && (
        <Text variant="small" className="text-success font-normal">
          {detectedCityLabel ? (
            <>
              Cidade sugerida:{" "}
              <span className="font-medium">{detectedCityLabel}</span>. Confirme abaixo ou
              use a busca manual para trocar.
            </>
          ) : (
            "Localização obtida. Confirme abaixo ou use a busca manual."
          )}
        </Text>
      )}

      <div className="flex flex-col gap-3 w-full max-w-xs">
        {status === "checking" && <Button disabled>Verificando...</Button>}
        {(status === "idle" ||
          status === "prompting" ||
          status === "timeout" ||
          status === "denied") && (
          <Button onClick={onRequestPermission}>Ativar localização</Button>
        )}
        <Button variant="outline" onClick={onSkipToManual}>
          Buscar arena manualmente
        </Button>
      </div>
    </div>
  );
}
