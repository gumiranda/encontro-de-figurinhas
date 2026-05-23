"use client";

import { useMemo } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface ProfileAvatarProps {
  seed: string;
  size?: number;
  ring?: boolean;
  className?: string;
}

export function ProfileAvatar({
  seed,
  size = 56,
  ring = true,
  className,
}: ProfileAvatarProps) {
  const hue = useMemo(() => {
    let h = 0;
    for (let i = 0; i < seed.length; i++) {
      h = (h * 31 + seed.charCodeAt(i)) % 360;
    }
    return h;
  }, [seed]);

  const initials = useMemo(() => {
    const s = seed.replace(/[^a-z0-9]/gi, "");
    return (s[0] || "?").toUpperCase() + (s[1] || "").toUpperCase();
  }, [seed]);

  const url = `https://api.dicebear.com/7.x/lorelei/svg?seed=${encodeURIComponent(seed)}&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

  return (
    <div
      className={cn("shrink-0", className)}
      style={{
        width: size,
        height: size,
        borderRadius: 999,
        padding: ring ? 3 : 0,
        background: ring
          ? "conic-gradient(from 180deg, var(--primary), var(--secondary), var(--tertiary), var(--primary))"
          : "transparent",
      }}
    >
      <div
        className="relative grid h-full w-full place-items-center overflow-hidden rounded-full"
        style={{ backgroundColor: `hsl(${hue} 40% 30%)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={url}
          alt=""
          width={size}
          height={size}
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="h-full w-full object-cover"
        />
        <span
          className="absolute inset-0 -z-10 grid place-items-center font-display font-bold text-white"
          style={{ fontSize: size * 0.36 }}
        >
          {initials}
        </span>
      </div>
    </div>
  );
}
