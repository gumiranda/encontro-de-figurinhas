"use client";
import { SignIn } from "@clerk/nextjs";
import { AuthPitchPanel } from "@/modules/auth/ui/components/auth-pitch-panel";
import { clerkAuthAppearance } from "@/modules/auth/lib/clerk-appearance";

export const SignInView = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthPitchPanel />
      <section className="flex items-center justify-center p-6 lg:p-10">
        <SignIn routing="hash" appearance={clerkAuthAppearance} />
      </section>
    </div>
  );
};
