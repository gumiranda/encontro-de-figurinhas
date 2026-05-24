"use client";

import { useEffect, useMemo, useState } from "react";
import { usePaginatedQuery, useQuery } from "convex/react";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import type { CommunityTab } from "./community-shell";
import type { CommunityPost } from "./post-card";
import type { CommunitySticker } from "./sticker-card";

export type FeedSort = "recent" | "need" | "have";
export type CityFilter = { id: string; label: string; count: number };
export type CommunityProfileData = {
  nickname?: string;
  displayNickname?: string;
  avatarSeed?: string;
  city?: { name: string; state: string } | null;
  createdAt?: number;
  albumCompletionPct?: number;
  albumOwnedCount?: number;
  albumTotal?: number;
  totalTrades?: number;
  ratingAvg?: number;
  ratingCount?: number;
  duplicatesCount?: number;
  isProfilePublic?: boolean;
  heroSticker?: CommunitySticker | null;
  stickersPage?: {
    stickers: CommunitySticker[];
    totalCount: number;
    nextCursor: string | null;
  };
  distanceKm?: number;
};

const STICKER_PAGE_LIMIT = 48;

function useCommunityStickerPager(
  kind: "duplicates" | "missing",
  enabled: boolean,
) {
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loadedCursor, setLoadedCursor] = useState<string | null>(null);
  const [stickers, setStickers] = useState<CommunitySticker[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState<string | null>(null);

  const cursorKey = cursor ?? "";
  const page = useQuery(
    api.users.getCommunityStickerPage,
    enabled ? { kind, cursor, limit: STICKER_PAGE_LIMIT } : "skip",
  );

  useEffect(() => {
    setCursor(undefined);
    setLoadedCursor(null);
    setStickers([]);
    setTotalCount(0);
    setNextCursor(null);
  }, [kind, enabled]);

  useEffect(() => {
    if (!page || loadedCursor === cursorKey) return;

    setStickers((current) =>
      cursorKey === "" ? page.stickers : [...current, ...page.stickers],
    );
    setTotalCount(page.totalCount);
    setNextCursor(page.nextCursor);
    setLoadedCursor(cursorKey);
  }, [cursorKey, loadedCursor, page]);

  return {
    stickers,
    totalCount,
    hasMore: nextCursor !== null,
    isLoading: enabled && page === undefined && stickers.length === 0,
    isLoadingMore: enabled && page === undefined && stickers.length > 0,
    loadMore: () => {
      if (nextCursor !== null) setCursor(nextCursor);
    },
  };
}

export function useCommunityTabData({
  activeTab,
  selectedCity,
  feedSort,
}: {
  activeTab: CommunityTab;
  selectedCity: string;
  feedSort: FeedSort;
}) {
  const profile = useQuery(
    api.users.getProfileSettings,
    activeTab === "profile" ? {} : "skip",
  );
  const profileDuplicates = useCommunityStickerPager(
    "duplicates",
    activeTab === "profile",
  );

  const cityFilters = useQuery(api.communityPosts.getCityFilterCounts);
  const feedType = feedSort === "recent" ? undefined : feedSort;
  const feedArgs = useMemo(
    () => ({
      cityId:
        selectedCity === "all"
          ? ("all" as const)
          : (selectedCity as Id<"cities">),
      type: feedType,
    }),
    [feedType, selectedCity],
  );
  const feed = usePaginatedQuery(
    api.communityPosts.listFeed,
    activeTab === "feed" ? feedArgs : "skip",
    { initialNumItems: 10 },
  );

  const matches = useQuery(
    api.matches.listMyMatches,
    activeTab === "public" ? { layer: null, bidirectionalOnly: false } : "skip",
  );
  const bestMatch = matches?.matches[0] ?? null;
  const publicProfile = useQuery(
    api.matches.getCommunityBestMatchProfile,
    activeTab === "public" && matches !== undefined
      ? bestMatch
        ? {
            matchedUserId: bestMatch.matchedUserId,
            tradePointId: bestMatch.tradePointId,
            stickerKind: "duplicates",
            stickerLimit: STICKER_PAGE_LIMIT,
          }
        : {}
      : "skip",
  );

  return {
    profile,
    profileDuplicates,
    feed: {
      cityFilters: (cityFilters ?? []) as CityFilter[],
      posts: (feed.results ?? []) as CommunityPost[],
      status: feed.status,
      loadMore: feed.loadMore,
    },
    matches,
    bestMatch,
    publicProfile,
  };
}
