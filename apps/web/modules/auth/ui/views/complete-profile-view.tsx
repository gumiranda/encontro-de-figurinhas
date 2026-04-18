"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { CompleteProfileForm } from "../components/complete-profile-form";
import { OnboardingStepper } from "../components/onboarding-stepper";
import { SignOutButton } from "../components/sign-out-button";

export function CompleteProfileView() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const createUser = useMutation(api.users.createUser);
  const called = useRef(false);

  // Create user if authenticated but doesn't exist in Convex
  useEffect(() => {
    if (isAuthenticated && currentUser === null && !called.current) {
      called.current = true;
      createUser();
    }
  }, [isAuthenticated, currentUser, createUser]);

  // Already onboarded - redirect to dashboard
  useEffect(() => {
    if (currentUser?.hasCompletedOnboarding) {
      router.replace("/cadastrar-figurinhas");
    }
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
      <OnboardingStepper currentStep={2} />

      <div className="flex min-w-0 flex-col overflow-x-clip">
        <header className="flex min-w-0 items-center gap-2 px-4 py-6 sm:px-6">
          <Button
            variant="ghost"
            className="group shrink-0 flex items-center gap-2 p-0 text-[var(--on-surface)] hover:text-[var(--primary)]"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-6 w-6 shrink-0" />
            <span className="font-label text-sm font-medium">Voltar</span>
          </Button>
          <p className="min-w-0 flex-1 truncate text-center text-xs uppercase tracking-widest text-[var(--on-surface-variant)] lg:text-right">
            Passo 02 / 03
          </p>
          <div className="shrink-0 lg:hidden">
            <SignOutButton iconOnly variant="outline" label="Sair da conta" />
          </div>
        </header>

        <div className="px-6 lg:px-10">
          <div
            className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-container-high)]"
            role="progressbar"
            aria-valuenow={66}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progresso do onboarding"
          >
            <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--secondary)]" />
          </div>
        </div>

        <section className="mx-auto flex w-full min-w-0 max-w-[560px] flex-1 flex-col px-6 pb-12 pt-8 lg:px-10">
          <div className="mb-8 min-w-0">
            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tight text-[var(--on-surface)] lg:text-4xl">
              Como te chamamos?
            </h1>
            <p className="mt-3 break-words text-pretty text-[var(--on-surface-variant)]">
              Escolha seu nome e @username. Eles vão aparecer para outros
              colecionadores quando você agendar trocas.
            </p>
          </div>

          <CompleteProfileForm />
        </section>
      </div>
    </main>
  );
}
