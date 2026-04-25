"use client";

import { cn } from "@workspace/ui/lib/utils";

const GRADIENTS = [
  "from-primary to-primary/70",
  "from-[#ff9a5a] to-[#e55b3c]",
  "from-[#7c5cff] to-[#4b2dcb]",
  "from-tertiary to-tertiary/70",
  "from-[#3edce1] to-[#0f8c8f]",
  "from-[#ff6e84] to-[#b81d3b]",
] as const;

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (parts.length >= 2 && first?.[0] && last?.[0]) {
    return (first[0] + last[0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getGradientIndex(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % GRADIENTS.length;
}

type MatchInitialsAvatarProps = {
  name: string;
  seed?: string;
  size?: number;
  isOnline?: boolean;
  className?: string;
};

export function MatchInitialsAvatar({
  name,
  seed,
  size = 48,
  isOnline = false,
  className,
}: MatchInitialsAvatarProps) {
  const initials = getInitials(name);
  const gradientIdx = getGradientIndex(seed ?? name);
  const gradient = GRADIENTS[gradientIdx];

  return (
    <div
      className={cn(
        "relative shrink-0 rounded-xl bg-gradient-to-br font-headline font-bold text-white",
        gradient,
        className
      )}
      style={{
        width: size,
        height: size,
        fontSize: size * 0.38,
      }}
    >
      <span className="absolute inset-0 flex items-center justify-center">
        {initials}
      </span>
      <span
        className={cn(
          "absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-surface-container",
          isOnline ? "bg-secondary" : "bg-outline"
        )}
      />
    </div>
  );
}
