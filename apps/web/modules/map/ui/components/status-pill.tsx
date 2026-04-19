import { Pill, PillIndicator } from "@workspace/ui/components/kibo-ui/pill";
import { cn } from "@workspace/ui/lib/utils";
import type { PinStatus } from "../../lib/derive-point-status";

const COPY: Record<PinStatus, string> = {
  active: "Ativo agora",
  idle: "Sem gente",
};

export function StatusPill({
  status,
  className,
}: {
  status: PinStatus;
  className?: string;
}) {
  if (status === "active") {
    return (
      <Pill
        className={cn(
          "border border-secondary/40 bg-secondary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-secondary",
          className,
        )}
      >
        <PillIndicator variant="success" pulse />
        {COPY.active}
      </Pill>
    );
  }
  return (
    <Pill
      className={cn(
        "border border-outline-variant bg-surface-container-high px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wider text-on-surface-variant",
        className,
      )}
    >
      {COPY.idle}
    </Pill>
  );
}
