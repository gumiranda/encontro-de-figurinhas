/**
 * Design tokens — MD3 Dark "Stadium Arena"
 *
 * Fonte de verdade para consumidores JS/TS (map markers, ImageResponse OG/icon,
 * integração Clerk, Canvas, etc.). Os mesmos valores existem em
 * packages/ui/src/styles/globals.css como CSS variables.
 *
 * Sempre importar daqui em vez de repetir o hex literal no código.
 */

export const BRAND_COLORS = {
  // Primary — stadium blue
  primary: "#95aaff",
  primaryDim: "#3766ff",
  primaryContainer: "#829bff",
  onPrimary: "#00247e",
  onPrimaryContainer: "#001a63",

  // Secondary — pitch green (conquista/repetida/troca ok)
  secondary: "#4ff325",
  secondaryDim: "#3ee40c",
  secondaryContainer: "#176e00",
  onSecondary: "#105500",
  onSecondaryContainer: "#e7ffd8",

  // Tertiary — trophy gold (raridade/premium)
  tertiary: "#ffc965",
  tertiaryDim: "#ecaa00",
  tertiaryContainer: "#feb700",
  onTertiary: "#5f4200",
  onTertiaryContainer: "#533a00",

  // Semântica
  destructive: "#ff6e84",
  error: "#ff6e84",
  warning: "#ffb74d",
  success: "#81c784",

  // Surfaces MD3
  background: "#090e1c",
  surfaceDim: "#090e1c",
  surfaceContainerLow: "#0d1323",
  surfaceContainer: "#13192b",
  surfaceContainerHigh: "#181f33",
  surfaceContainerHighest: "#1e253b",
  surfaceBright: "#242b43",
  surfaceVariant: "#1e253b",

  // Texto sobre superfície
  onSurface: "#e1e4fa",
  onSurfaceVariant: "#a6aabf",
  outline: "#9499ad",
  outlineVariant: "#434759",
} as const;

export type BrandColorKey = keyof typeof BRAND_COLORS;

/**
 * Gradientes reutilizáveis do styleguide (formatos CSS prontos).
 */
export const BRAND_GRADIENTS = {
  /** CTA principal: azul escuro → azul claro. Use em botões/logo. */
  primary: `linear-gradient(135deg, ${BRAND_COLORS.primaryDim} 0%, ${BRAND_COLORS.primary} 100%)`,
  /** Headline hero: primary → primary-dim → pitch green. */
  headlineText: `linear-gradient(to right, ${BRAND_COLORS.primary}, ${BRAND_COLORS.primaryDim}, ${BRAND_COLORS.secondary})`,
  /** Sombra/glow para cards com destaque. */
  stadiumShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.5)",
  primaryGlow: "0 10px 25px -5px rgba(149, 170, 255, 0.25)",
} as const;

/**
 * Preset de aparência para Clerk — MD3 Dark Arena.
 * Use em `<ClerkProvider appearance={CLERK_APPEARANCE}>` para consistência total.
 */
export const CLERK_APPEARANCE_DARK = {
  variables: {
    colorPrimary: BRAND_COLORS.primary,
    colorBackground: BRAND_COLORS.surfaceContainer,
    colorText: BRAND_COLORS.onSurface,
    colorTextSecondary: BRAND_COLORS.onSurfaceVariant,
    colorInputBackground: BRAND_COLORS.surfaceContainerHighest,
    colorInputText: BRAND_COLORS.onSurface,
    borderRadius: "0.475rem",
  },
} as const;
