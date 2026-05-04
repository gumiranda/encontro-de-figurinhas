"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { api } from "@workspace/backend/_generated/api";
import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export default function BootstrapPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();
  const hasAnyUsers = useQuery(api.users.hasAnyUsers);
  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");
  const bootstrapSuperadmin = useMutation(api.users.bootstrapSuperadmin);
  const called = useRef(false);

  // Bootstrap superadmin if no users exist
  useEffect(() => {
    if (isAuthenticated && hasAnyUsers === false && !called.current) {
      called.current = true;
      bootstrapSuperadmin();
    }
  }, [isAuthenticated, hasAnyUsers, bootstrapSuperadmin]);

  // Redirect based on user state
  useEffect(() => {
    if (hasAnyUsers === undefined) return;

    // Users already exist but current user not in Convex - go to complete-profile
    if (hasAnyUsers && currentUser === null) {
      router.replace("/complete-profile");
      return;
    }

    // User exists - redirect based on onboarding status
    if (currentUser) {
      if (!currentUser.hasCompletedOnboarding) {
        router.replace("/complete-profile");
      } else if (!currentUser.locationSource) {
        router.replace("/selecionar-localizacao");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [hasAnyUsers, currentUser, router]);

  // Wait for data
  return <FullPageLoader />;
}
