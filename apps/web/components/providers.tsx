"use client";

import * as React from "react";
import { useRef, useEffect } from "react";
import { ConvexReactClient, useMutation } from "convex/react";
import { useConvexAuth } from "convex/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";

function EnsureUser() {
  const { isAuthenticated } = useConvexAuth();
  const getOrCreate = useMutation(api.users.getOrCreateUser);
  const called = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !called.current) {
      called.current = true;
      getOrCreate();
    }
  }, [isAuthenticated, getOrCreate]);

  return null;
}

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file");
}
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#3C82F6",
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
          <EnsureUser />
          {children}
        </NextThemesProvider>
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
