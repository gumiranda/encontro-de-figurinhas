import { cn } from "@workspace/ui/lib/utils";
import { Check, Landmark } from "lucide-react";

import { SignOutButton } from "./sign-out-button";

const STEPS = [
  { index: 1, title: "Conta criada", description: "Pronto para começar" },
  { index: 2, title: "Seu perfil", description: "Como outros te veem" },
  { index: 3, title: "Sua cidade", description: "Encontrar trocas perto" },
] as const;

type StepState = "done" | "active" | "pending";

function stepState(stepIndex: 1 | 2 | 3, currentStep: 1 | 2 | 3): StepState {
  if (stepIndex === 1) return currentStep > 1 ? "done" : "active";
  if (stepIndex === 2) {
    if (currentStep === 2) return "active";
    if (currentStep > 2) return "done";
    return "pending";
  }
  return currentStep === 3 ? "active" : "pending";
}

export function OnboardingStepper({ currentStep }: { currentStep: 1 | 2 | 3 }) {
  return (
    <aside
      aria-label="Progresso do onboarding"
      className="hidden min-h-screen border-r border-[var(--landing-outline-variant)]/30 bg-[var(--landing-surface-container-low)] p-8 lg:flex lg:flex-col"
    >
      <div className="flex items-center gap-3 pb-10">
        <span
          className="flex size-9 items-center justify-center rounded-xl bg-[var(--landing-primary)]"
          aria-hidden="true"
        >
          <Landmark
            className="size-5 text-[var(--landing-on-primary)]"
            strokeWidth={2.5}
          />
        </span>
        <span className="text-lg font-bold text-[var(--landing-on-surface)] [font-family:var(--font-headline)]">
          Figurinha Fácil
        </span>
      </div>

      <p className="mb-4 text-xs uppercase tracking-widest text-[var(--landing-on-surface-variant)]">
        Onboarding
      </p>

      <ol className="space-y-3">
        {STEPS.map((step) => {
          const state = stepState(step.index, currentStep);
          return (
            <li
              key={step.index}
              aria-current={state === "active" ? "step" : undefined}
              className={cn(
                "flex gap-3 rounded-xl p-4 transition-colors",
                state === "active" &&
                  "border border-[var(--landing-outline-variant)] bg-[var(--landing-surface-container)]"
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-bold",
                  state === "pending" &&
                    "bg-[var(--landing-surface-container-high)] text-[var(--landing-on-surface-variant)]",
                  state === "active" &&
                    "bg-[var(--landing-primary)] text-[var(--landing-on-primary)]",
                  state === "done" &&
                    "bg-[var(--landing-secondary)] text-[var(--landing-on-secondary)]"
                )}
              >
                {state === "done" ? (
                  <Check className="size-4" strokeWidth={3} />
                ) : (
                  step.index
                )}
              </span>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-[var(--landing-on-surface)] [font-family:var(--font-headline)]">
                  {step.title}
                </div>
                <div className="text-xs text-[var(--landing-on-surface-variant)]">
                  {step.description}
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <div className="mt-auto border-t border-[var(--landing-outline-variant)]/30 pt-8">
        <SignOutButton className="w-full justify-center" variant="outline" />
      </div>
    </aside>
  );
}
