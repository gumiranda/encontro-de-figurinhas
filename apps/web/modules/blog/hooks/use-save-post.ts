"use client";

import { useCallback, useEffect, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("blog_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("blog_visitor_id", id);
  }
  return id;
}

interface Options {
  initialCounts: { likes: number; saves: number };
}

export function usePostMetrics(
  postId: Id<"blogPosts">,
  { initialCounts }: Options
) {
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const [counts, setCounts] = useState(initialCounts);
  const [userState, setUserState] = useState({ liked: false, saved: false });
  const toggleMetric = useMutation(api.blog.toggleMetric);

  const metrics = useQuery(
    api.blog.getMetrics,
    visitorId ? { postId, visitorId } : "skip"
  );

  useEffect(() => {
    setVisitorId(getVisitorId());
  }, []);

  useEffect(() => {
    if (metrics) {
      setCounts({ likes: metrics.likes, saves: metrics.saves });
      setUserState({ liked: metrics.userLiked, saved: metrics.userSaved });
    }
  }, [metrics]);

  const toggle = useCallback(
    async (metric: "likes" | "saves") => {
      if (!visitorId) return;
      const stateKey = metric === "likes" ? "liked" : "saved";
      const wasActive = userState[stateKey];
      const delta = wasActive ? -1 : 1;

      setUserState((s) => ({ ...s, [stateKey]: !wasActive }));
      setCounts((c) => ({ ...c, [metric]: Math.max(0, c[metric] + delta) }));

      try {
        await toggleMetric({ postId, visitorId, metric });
      } catch {
        setUserState((s) => ({ ...s, [stateKey]: wasActive }));
        setCounts((c) => ({ ...c, [metric]: c[metric] - delta }));
      }
    },
    [postId, visitorId, userState, toggleMetric]
  );

  return { counts, userState, toggle };
}
