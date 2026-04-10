"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { CompleteProfileForm } from "../components/complete-profile-form";
import { useProfileRedirect } from "@/hooks/use-profile-redirect";
import { FullPageLoader } from "@/components/full-page-loader";

export function CompleteProfileView() {
  const router = useRouter();
  const { isLoading, currentUser } = useProfileRedirect();

  if (isLoading || !currentUser) {
    return <FullPageLoader />;
  }

  return (
    <main className="landing-theme relative flex min-h-screen flex-col bg-[var(--landing-background)] stadium-gradient">
      <header className="flex items-center px-6 py-8">
        <Button
          variant="ghost"
          className="text-[var(--landing-on-surface)] hover:text-[var(--landing-primary)] flex items-center gap-2 group p-0"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="font-label text-sm font-medium">Voltar</span>
        </Button>
      </header>

      <section className="flex flex-1 flex-col px-6 pb-12 max-w-[480px] mx-auto w-full">
        <div className="mb-10">
          <h1 className="font-headline text-4xl font-bold leading-tight tracking-tight text-[var(--landing-on-surface)] uppercase italic">
            Finalize seu <br />
            <span className="text-[var(--landing-primary)]">Perfil</span>
          </h1>
          <p className="text-[var(--landing-on-surface-variant)] mt-3 text-base">
            Crie sua identidade na arena digital e comece a trocar.
          </p>
        </div>

        <CompleteProfileForm />
      </section>

      <div className="mt-auto overflow-hidden opacity-30 select-none pointer-events-none">
        <div className="flex justify-between items-end px-4 gap-1 h-24">
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[20%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[40%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[60%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[30%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[80%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[50%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[90%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[40%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[100%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[70%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[50%] rounded-t-sm" />
          <div className="w-8 bg-[var(--landing-surface-container-high)] h-[30%] rounded-t-sm" />
        </div>
      </div>
    </main>
  );
}
