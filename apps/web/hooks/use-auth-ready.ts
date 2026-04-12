"use client";

import { useMemo } from "react";
import { useAuth } from "@clerk/nextjs";
import { useConvexAuth } from "convex/react";

/**
 * Returns auth readiness state combining Clerk and Convex auth.
 * Uses useMemo to prevent unnecessary re-renders.
 */
export function useAuthReady() {
  const { isLoaded, isSignedIn } = useAuth();
  const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();

  const isReady = isLoaded && isSignedIn && !convexAuthLoading && isAuthenticated;
  const isLoading = !isLoaded || convexAuthLoading;

  return useMemo(
    () => ({
      isReady,
      isLoading,
      isSignedIn: isSignedIn ?? false,
      isAuthenticated,
    }),
    [isReady, isLoading, isSignedIn, isAuthenticated]
  );
}
