"use client";

import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "@workspace/backend/_generated/api";

export type QuotaTier = "available" | "limited" | "blocked";

export type QuotaData = {
  tier: QuotaTier;
  unlimited: boolean;
  lastSubmissionAt: number | null;
} | null;

export type QuotaStatus = {
  quota: QuotaData | undefined;
  isLoading: boolean;
  isBlocked: boolean;
};

export function useQuotaStatus(): QuotaStatus {
  const quota = useQuery(api.tradePoints.getSubmissionQuota);
  return useMemo(
    () => ({
      quota,
      isLoading: quota === undefined,
      isBlocked: quota?.tier === "blocked",
    }),
    [quota]
  );
}
