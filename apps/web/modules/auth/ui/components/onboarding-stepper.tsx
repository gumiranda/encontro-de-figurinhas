import { Check, Landmark } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

type StepState = "done" | "active" | "pending";

interface Step {
  index: number;
  title: string;
  state: StepState;
}

export function OnboardingStepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  const steps: Step[] = [
    {
      index: 1,
      title: "Conta criada",
      state: currentStep > 1 ? "done" : "active",
    },
    {
      index: 2,
      title: "Seu perfil",
      state: currentStep === 2 ? "active" : currentStep > 2 ? "done" : "pending",
    },
    {
      index: 3,
      title: "Cidade",
      state: currentStep === 3 ? "active" : "pending",
    },
  ];

  return (
    <aside
      aria-label="Progresso do onboarding"
      className="hidden border-r border-[var(--outline-variant)]/30 bg-[var(--surface-container-low)] p-8 lg:block"
    >
      <div className="flex items-center gap-3 pb-10">
        <span
          className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dim)]"
          aria-hidden="true"
        >
          <Landmark className="size-5 text-[var(--on-primary)]" strokeWidth={2.5} />
        </span>
        <span className="font-[var(--font-headline)] text-lg font-bold text-[var(--on-surface)]">
          Figurinha Fácil
        </span>
      </div>

      <p className="mb-4 text-xs uppercase tracking-widest text-[var(--on-surface-variant)]">
        Onboarding
      </p>

      <ol className="space-y-3">
        {steps.map((step) => (
          <li
            key={step.index}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-4 transition-colors",
              step.state === "done" &&
                "border-[var(--secondary)]/30 bg-[var(--secondary)]/10 text-[var(--secondary)]",
              step.state === "active" &&
                "border-[var(--primary)]/40 bg-[var(--primary)]/10 text-[var(--on-surface)]",
              step.state === "pending" &&
                "border-[var(--outline-variant)]/30 text-[var(--on-surface-variant)]",
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                "flex size-7 items-center justify-center rounded-full font-bold",
                step.state === "done" &&
                  "bg-[var(--secondary)] text-[var(--on-secondary)]",
                step.state === "active" &&
                  "bg-[var(--primary)] text-[var(--on-primary)]",
                step.state === "pending" &&
                  "bg-[var(--surface-container-high)] text-[var(--on-surface-variant)]",
              )}
            >
              {step.state === "done" ? (
                <Check className="size-4" strokeWidth={3} />
              ) : (
                step.index
              )}
            </span>
            <span className="font-[var(--font-headline)] text-sm font-bold uppercase tracking-wider">
              {step.title}
            </span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
