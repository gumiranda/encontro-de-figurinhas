"use client";

import { useEffect, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useAuthReady } from "./use-auth-ready";

type AuthRedirectOptions = {
  whenApproved?: string;
  whenPending?: string;
  whenRejected?: string;
  /** Optional redirect when there is no Convex user row (default: none; use EnsureAppUser for creation). */
  whenNoUser?: string;
  whenNoSuperadmin?: string;
  whenNeedsOnboarding?: string;
  whenNeedsStickerSetup?: string;
};

const defaultOptions: AuthRedirectOptions = {
  whenApproved: "/",
  whenPending: "/pending-approval",
  whenRejected: "/rejected",
  whenNoSuperadmin: "/bootstrap",
  whenNeedsOnboarding: "/complete-profile",
  whenNeedsStickerSetup: "/cadastrar-figurinhas",
};

export function useAuthRedirect(options: AuthRedirectOptions = {}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isReady: convexReady, isLoading: authLoading, isSignedIn } = useAuthReady();

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
      options.whenNeedsStickerSetup,
    ],
  );

  useEffect(() => {
    if (!convexReady) return;
    if (currentUser === undefined || hasSuperadmin === undefined) return;

    let destination: string | null = null;

    if (hasSuperadmin === false && opts.whenNoSuperadmin) {
      destination = opts.whenNoSuperadmin;
    } else if (currentUser === null && hasSuperadmin === true && opts.whenNoUser) {
      destination = opts.whenNoUser;
    } else if (currentUser?.status === "pending" && opts.whenPending) {
      destination = opts.whenPending;
    } else if (currentUser?.status === "rejected" && opts.whenRejected) {
      destination = opts.whenRejected;
    } else if (
      currentUser?.status === "approved" &&
      !currentUser.hasCompletedOnboarding &&
      opts.whenNeedsOnboarding
    ) {
      destination = opts.whenNeedsOnboarding;
    } else if (
      currentUser?.status === "approved" &&
      currentUser.hasCompletedOnboarding &&
      !currentUser.hasCompletedStickerSetup &&
      opts.whenNeedsStickerSetup
    ) {
      destination = opts.whenNeedsStickerSetup;
    } else if (
      currentUser?.status === "approved" &&
      currentUser.hasCompletedOnboarding &&
      currentUser.hasCompletedStickerSetup &&
      opts.whenApproved
    ) {
      destination = opts.whenApproved;
    }

    // Idempotent: only redirect if not already there
    if (destination && pathname !== destination) {
      router.replace(destination);
    }
  }, [
    convexReady,
    currentUser,
    hasSuperadmin,
    router,
    pathname,
    opts.whenNoSuperadmin,
    opts.whenNoUser,
    opts.whenPending,
    opts.whenRejected,
    opts.whenNeedsOnboarding,
    opts.whenNeedsStickerSetup,
    opts.whenApproved,
  ]);

  const isLoading =
    authLoading ||
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
