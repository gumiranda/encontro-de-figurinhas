import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import type { PillTone, StateCardSpec } from "../../lib/state-card-spec";

interface StateCardProps {
  size: "mobile" | "desktop";
  spec: StateCardSpec;
  onPrimary: () => void;
  primaryDisabled: boolean;
  refreshSlot?: React.ReactNode;
}

export function StateCard({
  size,
  spec,
  onPrimary,
  primaryDisabled,
  refreshSlot,
}: StateCardProps) {
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
