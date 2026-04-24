import { cn } from "@workspace/ui/lib/utils";
import { DEFAULT_NEARBY_RADIUS_KM } from "../../lib/location-constants";

type RadarMode = "idle" | "searching";
type PinTone = "primary" | "secondary" | "tertiary";

interface PinConfig {
  id: string;
  tone: PinTone;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
}

interface RadarConfig {
  containerClass: string;
  ringInsets: number[];
  meDotClass: string;
  pinSizeClass: string;
  pins: PinConfig[];
}

const MOBILE: RadarConfig = {
  containerClass: "mx-auto h-60 w-60",
  ringInsets: [70, 40],
  meDotClass: "h-4 w-4 shadow-radar-me-mobile",
  pinSizeClass: "h-2 w-2",
  pins: [
    { id: "mobile-tl", tone: "secondary", top: "30%", left: "22%" },
    { id: "mobile-tr", tone: "secondary", top: "20%", right: "30%" },
    { id: "mobile-br", tone: "tertiary", bottom: "25%", right: "18%" },
    { id: "mobile-bl", tone: "secondary", bottom: "30%", left: "30%" },
  ],
};

const DESKTOP: RadarConfig = {
  containerClass: "h-[420px] w-[420px]",
  ringInsets: [75, 50, 25],
  meDotClass: "h-6 w-6 shadow-radar-me",
  pinSizeClass: "h-3 w-3",
  pins: [
    { id: "desktop-tl", tone: "secondary", top: "25%", left: "28%" },
    { id: "desktop-tr", tone: "tertiary", top: "22%", right: "30%" },
    { id: "desktop-br", tone: "secondary", bottom: "20%", right: "20%" },
    { id: "desktop-bl", tone: "primary", bottom: "28%", left: "22%" },
  ],
};

const PIN_TONE_CLASS: Record<PinTone, string> = {
  primary: "bg-primary shadow-pin-primary",
  secondary: "bg-secondary shadow-pin-success",
  tertiary: "bg-tertiary shadow-pin-tertiary",
};

interface RadarProps {
  variant: "mobile" | "desktop";
  mode?: RadarMode;
  pointsCount?: number;
  className?: string;
}

export function Radar({ variant, mode = "idle", pointsCount, className }: RadarProps) {
  const cfg = variant === "mobile" ? MOBILE : DESKTOP;

  return (
    <div
      role="img"
      aria-label="Radar de localização"
      className={cn("relative", cfg.containerClass, className)}
    >
      <div className="absolute inset-0 rounded-full border border-[var(--primary)]/20 bg-[radial-gradient(circle_at_center,rgba(149,170,255,0.12),transparent_65%)]" />
      {cfg.ringInsets.map((pct) => (
        <div
          key={pct}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--primary)]/15"
          style={{ width: `${pct}%`, height: `${pct}%` }}
        />
      ))}

      <div
        className="radar-sweep"
        data-speed={mode === "searching" ? "fast" : undefined}
        aria-hidden="true"
      />

      {cfg.pins.map((pin) => (
        <div
          key={pin.id}
          className={cn("absolute rounded-full", cfg.pinSizeClass, PIN_TONE_CLASS[pin.tone])}
          style={{ top: pin.top, left: pin.left, right: pin.right, bottom: pin.bottom }}
          aria-hidden="true"
        />
      ))}

      <div
        className={cn(
          "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--primary)]",
          cfg.meDotClass
        )}
      />

      {pointsCount != null && variant === "desktop" && (
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 text-center">
          <div className="font-[var(--font-headline)] text-xl font-extrabold text-[var(--secondary)]">
            {pointsCount} pontos
          </div>
          <div className="font-mono text-xs text-[var(--on-surface-variant)]">
            num raio de {DEFAULT_NEARBY_RADIUS_KM}km
          </div>
        </div>
      )}
    </div>
  );
}
