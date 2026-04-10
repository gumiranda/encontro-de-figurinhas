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

    if (currentUser.hasCompletedOnboarding) {
      router.push("/dashboard");
      return;
    }
  }, [currentUser, router]);

  return { currentUser, isLoading: currentUser === undefined };
}
