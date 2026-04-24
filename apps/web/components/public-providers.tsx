"use client";

import * as React from "react";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function PublicProviders({ children }: { children: React.ReactNode }) {
  return (
    <ConvexProvider client={convex}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
        enableColorScheme
      >
        {children}
      </NextThemesProvider>
    </ConvexProvider>
  );
}
