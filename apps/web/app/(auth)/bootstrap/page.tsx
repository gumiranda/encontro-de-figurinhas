"use client";

import { useEffect, useRef } from "react";
import { redirect } from "next/navigation";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { FullPageLoader } from "@/components/full-page-loader";

export default function BootstrapPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const getOrCreate = useMutation(api.users.getOrCreateUser);
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );
  const called = useRef(false);

  useEffect(() => {
    if (isAuthenticated && !called.current) {
      called.current = true;
      getOrCreate();
    }
  }, [isAuthenticated, getOrCreate]);

  // Middleware handles auth redirect
  if (authLoading || !isAuthenticated) {
    return <FullPageLoader />;
  }

  // Wait for user to be created
  if (currentUser === undefined) {
    return <FullPageLoader />;
  }

  // User created - redirect based on onboarding status
  if (currentUser?.hasCompletedOnboarding) {
    redirect("/dashboard");
  } else {
    redirect("/complete-profile");
  }
}
