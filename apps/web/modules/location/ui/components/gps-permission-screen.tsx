"use client";

import type { CSSProperties } from "react";
import { Button } from "@workspace/ui/components/button";
import { Heading, Text } from "@workspace/ui/components/typography";
import { MapPin, LandPlot, Info } from "lucide-react";

/** Heights in px — symmetric equalizer; animation adds scaleY via .bar-wave */
const RADAR_BARS: readonly { readonly style: CSSProperties }[] = [
  { style: { height: 11, opacity: 0.45, animationDelay: "0s" } },
  { style: { height: 17, opacity: 0.65, animationDelay: "0.12s" } },
  { style: { height: 26, opacity: 1, animationDelay: "0.24s" } },
  { style: { height: 17, opacity: 0.65, animationDelay: "0.36s" } },
  { style: { height: 11, opacity: 0.45, animationDelay: "0.48s" } },
] as const;

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

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-2 min-h-[400px]">
      <div className="relative z-10 mb-10 w-80 h-80 flex items-center justify-center">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 stadium-glow"
        />
        <div className="relative w-64 h-64">
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-[var(--landing-surface-container-high)] opacity-20 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pulse-ring pointer-events-none absolute inset-8 rounded-full bg-[var(--landing-secondary)]/10 blur-xl z-0"
          />

          <div className="relative z-[1] flex h-full w-full items-center justify-center overflow-hidden rounded-full border border-[var(--landing-outline-variant)]/20 bg-[var(--landing-surface-container-highest)] shadow-2xl">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle, var(--landing-primary) 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            <div className="relative z-10 flex flex-col items-center">
              <MapPin
                className="-mb-1 h-24 w-24 text-[var(--landing-secondary)]"
                strokeWidth={1.5}
                aria-hidden
              />
              <div
                className="flex h-[26px] shrink-0 items-end justify-center gap-[3px] rounded-full bg-[var(--landing-secondary)]/[0.08] px-2.5"
                aria-hidden
              >
                {RADAR_BARS.map((bar, i) => (
                  <div
                    key={i}
                    className="w-1.5 shrink-0 rounded-full bg-[var(--landing-secondary)] bar-wave"
                    style={bar.style}
                  />
                ))}
              </div>
            </div>

            <div
              aria-hidden="true"
              className="absolute bottom-0 h-1/4 w-full bg-gradient-to-t from-[var(--landing-surface-container-highest)]/80 to-transparent"
            />
          </div>

          <div className="absolute -right-2 -top-2 flex items-center gap-2 rounded-full border border-[var(--landing-outline-variant)]/20 bg-[var(--landing-surface-container-high)] px-4 py-2 shadow-xl">
            <LandPlot className="h-4 w-4 text-[var(--landing-primary)]" />
            <Text
              variant="small"
              className="font-headline font-bold uppercase tracking-widest text-[var(--landing-primary)]"
            >
              Pontos Ativos
            </Text>
          </div>
        </div>
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
