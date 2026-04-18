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
  baseTheme: dark,
  variables: {
    colorPrimary: BRAND_COLORS.primaryDim,
    colorBackground: BRAND_COLORS.surfaceContainer,
    colorText: BRAND_COLORS.onSurface,
    colorTextSecondary: BRAND_COLORS.onSurfaceVariant,
    colorInputBackground: BRAND_COLORS.surfaceContainerHighest,
    colorInputText: BRAND_COLORS.onSurface,
    fontFamily: "var(--font-headline)",
    borderRadius: "12px",
  },
  elements: {
    cardBox:
      "rounded-2xl! border! border-outline-variant/30! shadow-none! bg-surface-container!",
    formButtonPrimary:
      "bg-gradient-to-r from-primary to-primary-dim! text-primary-foreground! uppercase! tracking-wider! font-bold!",
    socialButtonsBlockButton:
      "border-outline-variant/40! hover:bg-surface-variant!",
  },
};
