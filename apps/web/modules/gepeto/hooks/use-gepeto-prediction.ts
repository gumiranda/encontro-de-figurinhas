"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

export function useGepetoPrediction(matchId: Id<"worldCupMatches">) {
  return useQuery(api.gepeto.getAIPrediction, { matchId });
}

export function useUserPrediction(matchId: Id<"worldCupMatches">) {
  return useQuery(api.gepeto.getUserPrediction, { matchId });
}

export function useLeaderboard(limit = 50) {
  return useQuery(api.gepeto.getLeaderboard, { limit });
}

export function useWeeklyNarrative(weekNumber: number, year: number) {
  return useQuery(api.gepeto.getWeeklyNarrative, { weekNumber, year });
}
