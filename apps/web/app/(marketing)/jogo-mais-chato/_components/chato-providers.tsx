"use client";

import { ClerkProvider, useAuth } from "@clerk/nextjs";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { clerkAuthAppearance } from "@/modules/auth/lib/clerk-appearance";
import { browserConvex } from "@/lib/convex-browser-client";

export function ChatoProviders({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider appearance={clerkAuthAppearance}>
      <ConvexProviderWithClerk client={browserConvex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
