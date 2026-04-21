"use client";

import { useEffect, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";

type MatchDicebearAvatarProps = {
  seed: string;
  size?: number;
  className?: string;
};

/**
 * Dicebear avataaars (aligned with avatar picker “Kibo-style” generated look).
 * Explicitly avoids grayscale so faces stay vivid in match lists.
 */
export function MatchDicebearAvatar({
  seed,
  size = 40,
  className,
}: MatchDicebearAvatarProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const [{ createAvatar }, { avataaars }] = await Promise.all([
        import("@dicebear/core"),
        import("@dicebear/collection"),
      ]);
      const raw = createAvatar(avataaars, { seed, size }).toString();
      const svg =
        typeof raw === "string" ? raw : await (raw as Promise<string>);
      if (cancelled) return;
      setDataUrl(
        `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
      );
    })();
    return () => {
      cancelled = true;
    };
  }, [seed, size]);

  if (!dataUrl) {
    return (
      <div
        className={cn(
          "shrink-0 animate-pulse rounded-full bg-muted",
          className
        )}
        style={{ width: size, height: size }}
        aria-hidden
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- inline generated SVG data URL
    <img
      src={dataUrl}
      alt=""
      width={size}
      height={size}
      className={cn(
        "shrink-0 rounded-full object-cover grayscale-0",
        className
      )}
      loading="lazy"
      decoding="async"
    />
  );
}
