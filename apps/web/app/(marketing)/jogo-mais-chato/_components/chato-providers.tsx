"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { BRAND_COLORS } from "@workspace/ui/lib/design-tokens";
import { browserConvex } from "@/lib/convex-browser-client";

export function ChatoProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: BRAND_COLORS.primary,
        },
      }}
    >
      <ConvexProviderWithClerk client={browserConvex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
