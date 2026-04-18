"use client";

import { Button } from "@workspace/ui/components/button";
import { Heading, Text } from "@workspace/ui/components/typography";
import { Info } from "lucide-react";
import { RadarVisual } from "./radar-visual";

interface GpsPermissionScreenProps {
  status:
    | "idle"
    | "prompting"
    | "checking"
    | "granted"
    | "denied"
    | "timeout"
    | "unavailable";
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
  const hasStatusMessage =
    status === "timeout" ||
    status === "denied" ||
    status === "unavailable" ||
    (status === "granted" && !!detectedCityLabel);

  const radarMode =
    status === "checking" || status === "prompting" ? "searching" : "idle";
  const radarLabel =
    status === "granted" && detectedCityLabel
      ? `Detectamos ${detectedCityLabel}`
      : status === "checking"
        ? "Procurando sua localização..."
        : "Pontos ativos perto de você";

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-2 min-h-[400px]">
      <div className="relative z-10 mb-16 flex w-full max-w-sm items-center justify-center">
        <RadarVisual mode={radarMode} label={radarLabel} />
      </div>

      <div className="relative z-10 max-w-md text-center">
        <Heading
          level={2}
          className="border-0 pb-0 mb-4 font-headline text-3xl font-bold uppercase tracking-tight text-[var(--landing-on-surface)]"
        >
          Encontre seu <span className="sm:hidden"><br /></span>ponto de troca
        </Heading>
        <Text
          variant="p"
          className="mb-8 text-base text-[var(--landing-on-surface-variant)] leading-relaxed [&:not(:first-child)]:mt-0"
        >
          Para mostrar os pontos de troca mais próximos em tempo real, precisamos acessar sua localização.
        </Text>

        {hasStatusMessage && (
          <div aria-live="polite" role="status" className="mb-4">
            {status === "timeout" && (
              <Text variant="small" className="font-normal text-[var(--landing-tertiary)]">
                GPS demorou. Tente novamente ou busque manualmente.
              </Text>
            )}
            {status === "denied" && (
              <Text variant="small" className="font-normal text-[var(--landing-on-surface-variant)]">
                Localização negada. Libere nas configurações ou busque manualmente.
              </Text>
            )}
            {status === "unavailable" && (
              <Text variant="small" className="font-normal text-[var(--landing-tertiary)]">
                GPS não disponível no seu dispositivo.
              </Text>
            )}
            {status === "granted" && detectedCityLabel && (
              <Text variant="small" className="font-normal text-[var(--landing-secondary)]">
                Cidade sugerida: <span className="font-semibold">{detectedCityLabel}</span>.
                Confirme abaixo ou troque manualmente.
              </Text>
            )}
          </div>
        )}

        <div className="mx-auto flex w-full max-w-md flex-col gap-3">
          {status === "checking" ? (
            <Button type="button" disabled className="h-14 rounded-xl">
              Verificando...
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={onRequestPermission}
              className="btn-primary-gradient w-full"
            >
              Ativar localização
            </Button>
          )}
          <Button
            type="button"
            variant="outline"
            onClick={onSkipToManual}
            className="h-14 w-full rounded-xl border-[var(--landing-outline-variant)]/30 bg-transparent text-[var(--landing-on-surface)] font-headline font-semibold uppercase tracking-wide text-sm hover:border-[var(--landing-outline)]/50 hover:bg-transparent"
          >
            Buscar manualmente
          </Button>
        </div>

        <div className="mt-8 flex items-center justify-center gap-2 text-[var(--landing-on-surface-variant)]/60">
          <Info className="h-4 w-4" />
          <Text variant="small" className="font-normal uppercase tracking-widest text-xs">
            Você pode mudar isso a qualquer momento
          </Text>
        </div>
      </div>
    </div>
  );
}
