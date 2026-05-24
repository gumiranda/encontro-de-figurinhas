"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { api } from "@workspace/backend/_generated/api";
import { cn } from "@workspace/ui/lib/utils";
import type { Id } from "@workspace/backend/_generated/dataModel";

type ReactionType = "love" | "fire" | "hand";
type ReactionCounts = { love: number; fire: number; hand: number };

interface ReactionRowProps {
  postId: string;
  initialCounts?: ReactionCounts;
}

const REACTIONS: { id: ReactionType; emoji: string; label: string }[] = [
  { id: "love", emoji: "❤️", label: "curtir" },
  { id: "fire", emoji: "🔥", label: "fogo" },
  { id: "hand", emoji: "🤝", label: "tenho!" },
];

export function ReactionRow({ postId, initialCounts }: ReactionRowProps) {
  const fetchedCounts = useQuery(
    api.postReactions.getReactionCounts,
    initialCounts ? "skip" : { postId: postId as Id<"communityPosts"> }
  );
  const counts = initialCounts ?? fetchedCounts;
  const userReaction = useQuery(api.postReactions.getUserReaction, {
    postId: postId as Id<"communityPosts">,
  });
  const toggleReaction = useMutation(api.postReactions.toggleReaction);

  const [optimisticCounts, setOptimisticCounts] = useState<Record<string, number> | null>(null);
  const [optimisticType, setOptimisticType] = useState<ReactionType | null | undefined>(undefined);

  const handleReact = async (type: ReactionType) => {
    const prevType = optimisticType !== undefined ? optimisticType : userReaction;
    const baseCounts = optimisticCounts ?? counts ?? { love: 0, fire: 0, hand: 0 };
    const newCounts = { ...baseCounts };

    if (prevType === type) {
      newCounts[type] = Math.max(0, (newCounts[type] ?? 0) - 1);
      setOptimisticType(null);
    } else {
      if (prevType) {
        newCounts[prevType] = Math.max(0, (newCounts[prevType] ?? 0) - 1);
      }
      newCounts[type] = (newCounts[type] ?? 0) + 1;
      setOptimisticType(type);
    }
    setOptimisticCounts(newCounts);

    try {
      await toggleReaction({ postId: postId as Id<"communityPosts">, type });
    } catch {
      setOptimisticCounts(null);
      setOptimisticType(undefined);
    }
  };

  const displayCounts = optimisticCounts ?? counts ?? { love: 0, fire: 0, hand: 0 };
  const activeType = optimisticType !== undefined ? optimisticType : userReaction;

  return (
    <div className="flex gap-1.5">
      {REACTIONS.map((r) => {
        const isActive = activeType === r.id;
        const count = displayCounts[r.id] ?? 0;

        return (
          <button
            key={r.id}
            type="button"
            onClick={() => handleReact(r.id)}
            title={r.label}
            className={cn(
              "inline-flex items-center gap-1 h-7 px-2.5",
              "rounded-full font-mono text-xs font-bold",
              "transition-all",
              isActive
                ? "border border-primary bg-primary/15 text-primary"
                : "border border-white/10 bg-transparent text-muted-foreground hover:border-white/20"
            )}
          >
            <span
              className={cn(
                "text-sm leading-none",
                !isActive && "grayscale-[20%]"
              )}
            >
              {r.emoji}
            </span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
