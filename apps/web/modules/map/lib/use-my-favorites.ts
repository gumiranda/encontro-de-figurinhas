"use client";
import { useMemo } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

export type FavoriteSet = ReadonlySet<Id<"tradePoints">>;

export function useMyFavorites(): FavoriteSet {
  const ids = useQuery(api.users.getMyFavoriteTradePointIds);
  return useMemo(
    () => new Set<Id<"tradePoints">>(ids ?? []),
    [ids],
  );
}
