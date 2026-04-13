"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { api } from "@workspace/backend/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SetupPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const createUser = useMutation(api.users.createUser);
  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const called = useRef(false);

  useEffect(() => {
    if (isAuthenticated && currentUser === null && !called.current) {
      called.current = true;
      createUser();
    }
  }, [isAuthenticated, currentUser, createUser]);

  // Middleware handles auth redirect
  if (authLoading || !isAuthenticated) {
    return <FullPageLoader />;
  }

  // Wait for user to be created
  if (currentUser === undefined || currentUser === null) {
    return <FullPageLoader />;
  }

  // User exists - redirect based on onboarding status
  if (currentUser.hasCompletedOnboarding) {
    redirect("/dashboard");
  } else {
    redirect("/complete-profile");
  }
}
