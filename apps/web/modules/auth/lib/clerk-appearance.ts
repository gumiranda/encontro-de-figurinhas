import type { ComponentProps } from "react";
import type { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { BRAND_COLORS } from "@workspace/ui/lib/design-tokens";

type ClerkAppearance = NonNullable<ComponentProps<typeof SignIn>["appearance"]>;

/**
 * Tema único para Clerk alinhado ao styleguide MD3 Arena (dark).
 * Use em <SignIn appearance={clerkAuthAppearance} /> e equivalentes.
 */
export const clerkAuthAppearance: ClerkAppearance = {
  theme: dark,
  variables: {
    colorPrimary: BRAND_COLORS.primary,
    colorBackground: BRAND_COLORS.surfaceContainer,
    colorForeground: BRAND_COLORS.onSurface,
    colorText: BRAND_COLORS.onSurface,
    colorTextSecondary: BRAND_COLORS.onSurfaceVariant,
    colorInputBackground: BRAND_COLORS.surfaceContainerHighest,
    colorInputText: BRAND_COLORS.onSurface,
    fontFamily: "var(--font-headline)",
    borderRadius: "12px",
  },
  elements: {
    cardBox:
      "rounded-2xl! border! border-outline-variant/40! bg-surface-container! shadow-[0_24px_80px_rgba(0,0,0,0.35)]!",
    headerTitle: "text-on-surface!",
    headerSubtitle: "text-on-surface-variant!",
    socialButtonsBlockButton:
      "border-outline-variant/40! bg-surface-container-high! text-on-surface! hover:bg-surface-container-highest!",
    socialButtonsBlockButtonText: "text-on-surface!",
    dividerLine: "bg-outline-variant!",
    dividerText: "text-on-surface-variant!",
    formFieldLabel: "text-on-surface-variant!",
    formFieldInput:
      "border-outline-variant/60! bg-surface-container-highest! text-on-surface! placeholder:text-on-surface-variant!",
    formButtonPrimary:
      "bg-gradient-to-r from-primary to-primary-dim! text-primary-foreground! uppercase! tracking-wider! font-bold!",
    footerActionText: "text-on-surface-variant!",
    footerActionLink: "text-primary!",
  },
};
