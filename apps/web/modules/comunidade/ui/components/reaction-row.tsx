"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

type ReactionType = "love" | "fire" | "hand";

interface ReactionCounts {
  love: number;
  fire: number;
  hand: number;
}

interface ReactionRowProps {
  counts?: ReactionCounts;
  onReact?: (type: ReactionType) => void;
}

const REACTIONS: { id: ReactionType; emoji: string; label: string }[] = [
  { id: "love", emoji: "❤️", label: "curtir" },
  { id: "fire", emoji: "🔥", label: "fogo" },
  { id: "hand", emoji: "🤝", label: "tenho!" },
];

export function ReactionRow({ counts = { love: 0, fire: 0, hand: 0 }, onReact }: ReactionRowProps) {
  const [myReaction, setMyReaction] = useState<ReactionType | null>(null);

  const handleReact = (type: ReactionType) => {
    const newReaction = myReaction === type ? null : type;
    setMyReaction(newReaction);
    onReact?.(type);
  };

  return (
    <div className="flex gap-1.5">
      {REACTIONS.map((r) => {
        const isActive = myReaction === r.id;
        const count = (counts[r.id] || 0) + (isActive ? 1 : 0);

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
