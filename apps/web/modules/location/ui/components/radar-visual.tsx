import { cn } from "@workspace/ui/lib/utils";

interface RadarVisualProps {
  mode?: "idle" | "searching";
  label?: string;
  className?: string;
}

export function RadarVisual({
  mode = "idle",
  label = "186 pontos · num raio de 5km",
  className,
}: RadarVisualProps) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "relative mx-auto aspect-square w-full max-w-sm lg:max-w-md",
        className,
      )}
    >
      <div className="absolute inset-0 rounded-full border border-[var(--primary)]/20 bg-[radial-gradient(circle_at_center,rgba(149,170,255,0.15),transparent_60%)]" />
      <div className="absolute inset-[15%] rounded-full border border-[var(--primary)]/20" />
      <div className="absolute inset-[32%] rounded-full border border-[var(--secondary)]/20" />
      <div className="absolute inset-[50%] rounded-full border border-[var(--tertiary)]/20" />

      <div
        className="radar-sweep"
        data-speed={mode === "searching" ? "fast" : undefined}
        aria-hidden="true"
      />

      <Pin top="22%" left="28%" tone="secondary" />
      <Pin top="38%" left="72%" tone="primary" />
      <Pin top="68%" left="34%" tone="tertiary" />
      <Pin top="74%" left="66%" tone="primary" />

      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="size-4 rounded-full bg-[var(--primary)] shadow-[0_0_12px_rgba(149,170,255,0.7),0_0_24px_rgba(149,170,255,0.35)]" />
      </div>

      <p className="absolute inset-x-0 -bottom-8 text-center text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
        {label}
      </p>
    </div>
  );
}

function Pin({
  top,
  left,
  tone,
}: {
  top: string;
  left: string;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneClass = {
    primary: "bg-[var(--primary)] shadow-[0_0_10px_rgba(149,170,255,0.6)]",
    secondary: "bg-[var(--secondary)] shadow-[0_0_10px_rgba(79,243,37,0.6)]",
    tertiary: "bg-[var(--tertiary)] shadow-[0_0_10px_rgba(255,201,101,0.6)]",
  }[tone];

  return (
    <div
      className={cn("absolute size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full", toneClass)}
      style={{ top, left }}
      aria-hidden="true"
    />
  );
}
