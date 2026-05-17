"use client";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";

interface FeedAvatarProps {
  seed: string;
  size?: number;
  fallbackInitials?: string;
  showRing?: boolean;
}

export function FeedAvatar({
  seed,
  size = 40,
  fallbackInitials,
  showRing = true,
}: FeedAvatarProps) {
  if (!showRing) {
    return (
      <MatchDicebearAvatar
        seed={seed}
        size={size}
        fallbackInitials={fallbackInitials}
      />
    );
  }

  const ringWidth = 3;
  const outerSize = size + ringWidth * 2;

  return (
    <div
      className="rounded-full flex-shrink-0"
      style={{
        width: outerSize,
        height: outerSize,
        padding: ringWidth,
        background:
          "conic-gradient(from 180deg, #95aaff, #4ff325, #ffc965, #95aaff)",
      }}
    >
      <div
        className="rounded-full overflow-hidden"
        style={{
          width: size,
          height: size,
          background: "var(--background, #090e1c)",
        }}
      >
        <MatchDicebearAvatar
          seed={seed}
          size={size}
          fallbackInitials={fallbackInitials}
        />
      </div>
    </div>
  );
}
