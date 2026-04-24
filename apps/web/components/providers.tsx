"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ConvexReactClient } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { BRAND_COLORS } from "@workspace/ui/lib/design-tokens";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

/**
 * Remonta o Convex+Clerk ao mudar de rota para reexecutar setAuth após clearAuth na navegação
 * (ex.: router.back), evitando useConvexAuth preso em loading com o mesmo cliente singleton.
 */
function ConvexClerkBridge({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <ConvexProviderWithClerk key={pathname} client={convex} useAuth={useAuth}>
      {children}
    </ConvexProviderWithClerk>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: BRAND_COLORS.primary,
        },
      }}
    >
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        <ConvexClerkBridge>{children}</ConvexClerkBridge>
      </NextThemesProvider>
    </ClerkProvider>
  );
}
