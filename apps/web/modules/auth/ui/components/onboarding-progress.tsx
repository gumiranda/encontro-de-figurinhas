import { cn } from "@workspace/ui/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

type SegmentState = "done" | "active" | "pending";

function getSegmentState(
  index: number,
  currentStep: number,
): SegmentState {
  if (index < currentStep) return "done";
  if (index === currentStep) return "active";
  return "pending";
}

export function OnboardingProgress({
  currentStep,
  totalSteps,
  label = "Progresso do onboarding",
}: OnboardingProgressProps) {
  const percent = Math.round((currentStep / totalSteps) * 100);
  const stepLabel = `PASSO ${String(currentStep).padStart(2, "0")} / ${String(
    totalSteps,
  ).padStart(2, "0")}`;

  return (
    <div
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
      className="w-full"
    >
      <div className="flex gap-1.5 lg:hidden" aria-hidden="true">
        {Array.from({ length: totalSteps }, (_, i) => {
          const state = getSegmentState(i + 1, currentStep);
          return (
            <div
              key={i}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                state === "done" && "bg-[var(--secondary)]",
                state === "active" &&
                  "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]",
                state === "pending" && "bg-[var(--surface-container-high)]",
              )}
            />
          );
        })}
      </div>

      <div className="hidden items-center gap-4 lg:flex">
        <span className="shrink-0 font-mono text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
          {stepLabel}
        </span>
        <div
          className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-container-high)]"
          aria-hidden="true"
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
