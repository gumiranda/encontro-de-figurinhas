"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { FullPageLoader } from "@/components/full-page-loader";

export default function BootstrapPage() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();
  const [error, setError] = useState<string | null>(null);
  const bootstrapAttempted = useRef(false);
  const redirected = useRef(false);

  const convexReady =
    isSignedIn && !convexAuthLoading && isAuthenticated;

  const hasAnyUsers = useQuery(api.users.hasAnyUsers, convexReady ? {} : "skip");
  const currentUser = useQuery(
    api.users.getCurrentUser,
    convexReady ? {} : "skip",
  );
  const bootstrap = useMutation(api.users.bootstrap);

  // Effect 1: Not signed in -> sign-in (Clerk lifecycle)
  useEffect(() => {
    if (!isLoaded || isSignedIn || redirected.current) return;
    redirected.current = true;
    router.push("/sign-in");
  }, [isLoaded, isSignedIn, router]);

  // Effect 2: Has user -> home (query lifecycle)
  useEffect(() => {
    if (!isLoaded || !isSignedIn || redirected.current) return;
    if (convexAuthLoading || !isAuthenticated) return;
    if (currentUser === undefined) return;
    if (currentUser) {
      redirected.current = true;
      router.push("/");
    }
  }, [
    isLoaded,
    isSignedIn,
    convexAuthLoading,
    isAuthenticated,
    currentUser,
    router,
  ]);

  const handleAutoBootstrap = useCallback(async () => {
    if (bootstrapAttempted.current) return;
    bootstrapAttempted.current = true;
    try {
      await bootstrap();
      router.push("/");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Error creating superadmin",
      );
    }
  }, [bootstrap, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    if (convexAuthLoading || !isAuthenticated) return;
    if (hasAnyUsers !== false) return;
    if (currentUser === undefined) return;
    if (currentUser) return;
    if (error) return;
    if (bootstrapAttempted.current) return;
    void handleAutoBootstrap();
  }, [
    isLoaded,
    isSignedIn,
    convexAuthLoading,
    isAuthenticated,
    hasAnyUsers,
    currentUser,
    error,
    handleAutoBootstrap,
  ]);

  if (!isLoaded || hasAnyUsers === undefined) {
    return <FullPageLoader />;
  }

  if (!isSignedIn) {
    return <FullPageLoader />;
  }

  if (currentUser) {
    return <FullPageLoader />;
  }

  if (hasAnyUsers === false && !error) {
    return <FullPageLoader message="Creating superadmin..." />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="p-4 bg-destructive/10 text-destructive rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return null;
}
