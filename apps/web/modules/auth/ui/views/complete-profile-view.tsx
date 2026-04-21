"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { api } from "@workspace/backend/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";
import { CompleteProfileForm } from "../components/complete-profile-form";
import { OnboardingProgress } from "../components/onboarding-progress";
import { OnboardingStepper } from "../components/onboarding-stepper";
import { SignOutButton } from "../components/sign-out-button";

const CURRENT_STEP = 2;
const TOTAL_STEPS = 3;

export function CompleteProfileView() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const createUser = useMutation(api.users.createUser);

  // Create user if authenticated but doesn't exist in Convex. Retries with backoff:
  // a primeira chamada pode retornar null se a identidade Clerk ainda não estiver
  // visível no mutation handler (comum após router.back / transição de rota).
  // O ref antigo `called` impedia qualquer nova tentativa → loading infinito.
  useEffect(() => {
    if (!isAuthenticated || currentUser !== null || currentUser === undefined) {
      return;
    }

    let cancelled = false;

    const run = async () => {
      const maxAttempts = 6;
      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        if (cancelled) return;
        try {
          await createUser();
        } catch {
          // Convex refetch; próxima tentativa cobre identity delay
        }
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
      }
    };

    void run();
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, currentUser, createUser]);

  // Perfil já completo — alinhar ao dashboard-shell (próximo passo do funil ou dashboard).
  // useLayoutEffect reduz flash de loader antes do replace.
  useLayoutEffect(() => {
    if (!currentUser?.hasCompletedOnboarding) return;

    const next =
      currentUser.hasCompletedStickerSetup !== true
        ? "/cadastrar-figurinhas"
        : !currentUser.locationSource
          ? "/selecionar-localizacao"
          : "/dashboard";

    router.replace(next);
  }, [currentUser, router]);

  // Middleware handles auth redirect to /sign-in
  // Wait for auth and user data
  if (
    authLoading ||
    !isAuthenticated ||
    currentUser === undefined ||
    !currentUser ||
    currentUser.hasCompletedOnboarding
  ) {
    return <FullPageLoader />;
  }

  return (
    <main className="relative grid min-h-screen min-w-0 bg-background stadium-gradient lg:grid-cols-[340px_1fr]">
      <OnboardingStepper currentStep={CURRENT_STEP} />

      <div className="flex min-w-0 flex-col overflow-x-clip">
        <div className="mx-auto w-full max-w-[700px] px-6 pt-14 lg:px-20 lg:pt-20">
          <header className="flex items-center justify-between lg:justify-end">
            <SignOutButton iconOnly className="lg:hidden" label="Sair da conta" />
            <span className="font-mono text-xs text-[var(--landing-on-surface-variant)] lg:hidden">
              {CURRENT_STEP} / {TOTAL_STEPS}
            </span>
          </header>

          <div className="mt-6">
            <OnboardingProgress currentStep={CURRENT_STEP} totalSteps={TOTAL_STEPS} />
          </div>

          <div className="mb-8 mt-10 min-w-0">
            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tight text-[var(--on-surface)] lg:text-4xl">
              Como te{" "}
              <span className="bg-gradient-to-r from-[var(--primary)] to-[var(--tertiary)] bg-clip-text text-transparent">
                chamamos?
              </span>
            </h1>
            <p className="mt-3 break-words text-pretty text-[var(--on-surface-variant)]">
              Escolha um apelido único e confirme sua idade. Ele aparece nas propostas de
              troca combinadas com outros colecionadores.
            </p>
          </div>

          <CompleteProfileForm />
        </div>
      </div>
    </main>
  );
}
