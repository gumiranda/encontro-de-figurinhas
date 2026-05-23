"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

export function useMatchDetail(matchId: Id<"worldCupMatches">) {
  return useQuery(api.gepeto.getDashboardMatch, { matchId });
}

export function useUserStats() {
  const hub = useQuery(api.gepeto.getDashboardHub);
  return hub?.stats;
}
