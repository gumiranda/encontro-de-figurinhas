"use client";

import * as React from "react";
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

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: BRAND_COLORS.primary,
        },
      }}
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
