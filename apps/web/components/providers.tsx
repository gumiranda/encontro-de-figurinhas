"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { ClerkProvider } from "@clerk/nextjs";
import { clerkAuthAppearance } from "@/modules/auth/lib/clerk-appearance";

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
    <ClerkProvider appearance={clerkAuthAppearance}>
      <ConvexClerkBridge>{children}</ConvexClerkBridge>
    </ClerkProvider>
  );
}
