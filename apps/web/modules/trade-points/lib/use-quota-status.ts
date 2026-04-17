"use client";

import { useQuery } from "convex/react";
import { useMemo } from "react";
import { api } from "@workspace/backend/_generated/api";

export type QuotaData = {
  remaining: number;
  limit: number;
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
      isBlocked:
        quota != null && !quota.unlimited && quota.remaining === 0,
    }),
    [quota]
  );
}
