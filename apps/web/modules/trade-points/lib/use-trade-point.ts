import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

export function useTradePoint(tradePointId: Id<"tradePoints">) {
  return useQuery(api.tradePoints.getById, { id: tradePointId });
}
