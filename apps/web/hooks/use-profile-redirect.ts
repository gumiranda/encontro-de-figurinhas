"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

export function useProfileRedirect() {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);

  useEffect(() => {
    if (currentUser === undefined) return;
    if (currentUser === null) {
      router.push("/sign-in");
      return;
    }

    // Respect existing approval flow
    if (currentUser.status === "pending") {
      router.push("/pending-approval");
      return;
    }

    if (currentUser.status === "rejected") {
      router.push("/rejected");
      return;
    }

    // Only check onboarding for approved users
    if (currentUser.status === "approved" && currentUser.hasCompletedOnboarding) {
      router.push("/dashboard");
      return;
    }
  }, [currentUser, router]);

  return { currentUser, isLoading: currentUser === undefined };
}
