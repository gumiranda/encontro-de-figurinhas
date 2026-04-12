"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useAuthReady } from "./use-auth-ready";

/**
 * When a superadmin exists but the signed-in Clerk user has no Convex row yet,
 * creates the pending user (replaces the former /register flow).
 */
export function useEnsureAppUser() {
  const router = useRouter();
  const { isReady: convexReady } = useAuthReady();

  const currentUser = useQuery(
    api.users.getCurrentUser,
    convexReady ? {} : "skip",
  );
  const hasSuperadmin = useQuery(
    api.users.hasSuperadmin,
    convexReady ? {} : "skip",
  );
  const addUser = useMutation(api.users.add);
  const attempted = useRef(false);

  useEffect(() => {
    if (!convexReady) return;
    if (currentUser === undefined || hasSuperadmin === undefined) return;
    if (hasSuperadmin !== true) return;
    if (currentUser !== null) return;
    if (attempted.current) return;

    attempted.current = true;
    void (async () => {
      try {
        await addUser({});
        router.push("/pending-approval");
      } catch {
        attempted.current = false;
      }
    })();
  }, [convexReady, currentUser, hasSuperadmin, addUser, router]);
}
