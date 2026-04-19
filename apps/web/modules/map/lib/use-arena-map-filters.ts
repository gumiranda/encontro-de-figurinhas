"use client";
import { useMemo, useState } from "react";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { derivePointStatus } from "./derive-point-status";
import type { TradePointMapItem } from "./use-arena-map";
import type { FavoriteSet } from "./use-my-favorites";

export type ArenaFilter = "all" | "active" | "favorites";

export function useArenaMapFilters(
  points: TradePointMapItem[],
  favorites: FavoriteSet,
) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ArenaFilter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return points.filter((p) => {
      if (q && !`${p.name} ${p.address}`.toLowerCase().includes(q)) {
        return false;
      }
      if (filter === "active") return derivePointStatus(p) === "active";
      if (filter === "favorites") return favorites.has(p._id as Id<"tradePoints">);
      return true;
    });
  }, [points, query, filter, favorites]);

  const activeCount = useMemo(
    () => points.filter((p) => derivePointStatus(p) === "active").length,
    [points],
  );

  return { query, setQuery, filter, setFilter, filtered, activeCount };
}
