"use client";

import { useAuth } from "@clerk/nextjs";
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
  const { isLoaded: clerkLoaded, isSignedIn } = useAuth();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  // Clerk define sessão; a query pode retornar null enquanto o JWT Convex sincroniza.
  // Não usar `isAuthenticated` no skip — senão `undefined` + loader bloqueado por `authLoading`.
  const currentUser = useQuery(
    api.users.getCurrentUser,
    clerkLoaded && isSignedIn ? {} : "skip"
  );
  const createUser = useMutation(api.users.createUser);

  // Cria linha em `users` só quando o JWT Convex está pronto; antes disso `createUser` pode
  // retornar null (sem identity no mutation) e o efeito reexecuta quando `isAuthenticated` estabiliza.
  useEffect(() => {
    if (
      !clerkLoaded ||
      !isSignedIn ||
      authLoading ||
      !isAuthenticated ||
      currentUser !== null ||
      currentUser === undefined
    ) {
      return;
    }

    void createUser().catch(() => {});
  }, [
    clerkLoaded,
    isSignedIn,
    authLoading,
    isAuthenticated,
    currentUser,
    createUser,
  ]);

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

  // Middleware handles auth redirect to /sign-in.
  // Não condicionar o loader a `useConvexAuth`: após router.back o token pode re-sync com
  // authLoading true por tempo indefinido enquanto Clerk já está logado → loader eterno.
  // A mutação createUser continua guardada por !authLoading && isAuthenticated.
  if (
    !clerkLoaded ||
    !isSignedIn ||
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
