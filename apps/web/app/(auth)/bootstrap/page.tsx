"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { api } from "@workspace/backend/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { redirect } from "next/navigation";
import { useEffect, useRef } from "react";

export default function BootstrapPage() {
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const hasAnyUsers = useQuery(api.users.hasAnyUsers);
  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const bootstrapSuperadmin = useMutation(api.users.bootstrapSuperadmin);
  const called = useRef(false);

  useEffect(() => {
    if (isAuthenticated && hasAnyUsers === false && !called.current) {
      called.current = true;
      bootstrapSuperadmin();
    }
  }, [isAuthenticated, hasAnyUsers, bootstrapSuperadmin]);

  // Middleware handles auth redirect
  if (authLoading || !isAuthenticated || hasAnyUsers === undefined) {
    return <FullPageLoader />;
  }

  // Users already exist - redirect to complete-profile (creates user there)
  if (hasAnyUsers && currentUser === null) {
    redirect("/complete-profile");
  }

  // User exists - redirect based on onboarding status
  if (currentUser) {
    if (currentUser.hasCompletedOnboarding) {
      redirect("/dashboard");
    } else {
      redirect("/complete-profile");
    }
  }

  // Wait for superadmin to be created
  return <FullPageLoader />;
}
