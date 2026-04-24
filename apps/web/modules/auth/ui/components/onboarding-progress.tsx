import { cn } from "@workspace/ui/lib/utils";

interface OnboardingProgressProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
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
          const step = i + 1;
          return (
            <div
              key={`step-${step}-of-${totalSteps}`}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                step < currentStep && "bg-[var(--secondary)]",
                step === currentStep &&
                  "bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]",
                step > currentStep && "bg-[var(--surface-container-high)]",
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
