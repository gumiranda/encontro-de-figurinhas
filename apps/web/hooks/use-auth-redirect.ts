"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type AuthRedirectOptions = {
  whenApproved?: string;
  whenPending?: string;
  whenRejected?: string;
  whenNoUser?: string;
  whenNoSuperadmin?: string;
  whenNeedsOnboarding?: string;
};

const defaultOptions: AuthRedirectOptions = {
  whenApproved: "/",
  whenPending: "/pending-approval",
  whenRejected: "/rejected",
  whenNoUser: "/register",
  whenNoSuperadmin: "/bootstrap",
  whenNeedsOnboarding: "/complete-profile",
};

export function useAuthRedirect(options: AuthRedirectOptions = {}) {
  const router = useRouter();
  const currentUser = useQuery(api.users.getCurrentUser);
  const hasSuperadmin = useQuery(api.users.hasSuperadmin);

  const opts = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [options.whenApproved, options.whenPending, options.whenRejected, options.whenNoUser, options.whenNoSuperadmin, options.whenNeedsOnboarding]
  );

  useEffect(() => {
    if (hasSuperadmin === false && opts.whenNoSuperadmin) {
      router.push(opts.whenNoSuperadmin);
      return;
    }

    if (currentUser === null && hasSuperadmin === true && opts.whenNoUser) {
      router.push(opts.whenNoUser);
      return;
    }

    if (currentUser?.status === "pending" && opts.whenPending) {
      router.push(opts.whenPending);
      return;
    }

    if (currentUser?.status === "rejected" && opts.whenRejected) {
      router.push(opts.whenRejected);
      return;
    }

    // Check if approved user needs to complete onboarding
    if (currentUser?.status === "approved" && !currentUser.hasCompletedOnboarding && opts.whenNeedsOnboarding) {
      router.push(opts.whenNeedsOnboarding);
      return;
    }

    if (currentUser?.status === "approved" && currentUser.hasCompletedOnboarding && opts.whenApproved) {
      router.push(opts.whenApproved);
    }
  }, [currentUser, hasSuperadmin, router, opts]);

  const isLoading = currentUser === undefined || hasSuperadmin === undefined;

  return {
    currentUser,
    hasSuperadmin,
    isLoading,
  };
}
