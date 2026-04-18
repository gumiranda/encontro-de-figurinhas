"use client";
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { AuthPitchPanel } from "@/modules/auth/ui/components/auth-pitch-panel";

const clerkAppearance = {
  baseTheme: dark,
  variables: {
    colorPrimary: "#3766ff",
    colorBackground: "#13192b",
    colorText: "#e1e4fa",
    fontFamily: "var(--font-headline)",
    borderRadius: "12px",
  },
  elements: {
    cardBox: "rounded-2xl! border! border-[var(--landing-outline-variant)]/30! shadow-none! bg-[var(--landing-surface-container)]!",
    formButtonPrimary:
      "bg-gradient-to-r from-[var(--landing-primary)] to-[var(--landing-primary-dim)]! text-[var(--landing-on-primary)]! uppercase! tracking-wider! font-bold!",
    socialButtonsBlockButton:
      "border-[var(--landing-outline-variant)]/40! hover:bg-[var(--landing-surface-variant)]!",
  },
};

export const SignUpView = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthPitchPanel />
      <section className="flex items-center justify-center p-6 lg:p-10">
        <SignUp routing="hash" appearance={clerkAppearance} />
      </section>
    </div>
  );
};
