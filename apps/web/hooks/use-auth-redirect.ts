"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type AuthRedirectOptions = {
  whenApproved?: string;
  whenPending?: string;
  whenRejected?: string;
  /** Optional redirect when there is no Convex user row (default: none; use EnsureAppUser for creation). */
  whenNoUser?: string;
  whenNoSuperadmin?: string;
  whenNeedsOnboarding?: string;
};

const defaultOptions: AuthRedirectOptions = {
  whenApproved: "/",
  whenPending: "/pending-approval",
  whenRejected: "/rejected",
  whenNoSuperadmin: "/bootstrap",
  whenNeedsOnboarding: "/complete-profile",
};

export function useAuthRedirect(options: AuthRedirectOptions = {}) {
  const router = useRouter();
  const { isSignedIn, isLoaded: clerkLoaded } = useAuth();
  const { isLoading: convexAuthLoading, isAuthenticated } = useConvexAuth();

  const convexReady =
    clerkLoaded && isSignedIn && !convexAuthLoading && isAuthenticated;

  const currentUser = useQuery(
    api.users.getCurrentUser,
    convexReady ? {} : "skip",
  );
  const hasSuperadmin = useQuery(
    api.users.hasSuperadmin,
    convexReady ? {} : "skip",
  );

  const opts = useMemo(
    () => ({ ...defaultOptions, ...options }),
    [
      options.whenApproved,
      options.whenPending,
      options.whenRejected,
      options.whenNoUser,
      options.whenNoSuperadmin,
      options.whenNeedsOnboarding,
    ],
  );

  useEffect(() => {
    if (!convexReady) return;
    if (currentUser === undefined || hasSuperadmin === undefined) return;

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

    if (
      currentUser?.status === "approved" &&
      !currentUser.hasCompletedOnboarding &&
      opts.whenNeedsOnboarding
    ) {
      router.push(opts.whenNeedsOnboarding);
      return;
    }

    if (
      currentUser?.status === "approved" &&
      currentUser.hasCompletedOnboarding &&
      opts.whenApproved
    ) {
      router.push(opts.whenApproved);
    }
  }, [convexReady, currentUser, hasSuperadmin, router, opts]);

  const isLoading =
    !clerkLoaded ||
    (isSignedIn &&
      (!convexReady ||
        currentUser === undefined ||
        hasSuperadmin === undefined));

  return {
    currentUser,
    hasSuperadmin,
    isLoading,
  };
}
