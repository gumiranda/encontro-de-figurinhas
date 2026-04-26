"use client";

import { useEffect, useState } from "react";

import { cn } from "@workspace/ui/lib/utils";

type MatchDicebearAvatarProps = {
  seed: string;
  size?: number;
  className?: string;
  fallbackInitials?: string;
};

/**
 * Dicebear avataaars (aligned with avatar picker "Kibo-style" generated look).
 * Explicitly avoids grayscale so faces stay vivid in match lists.
 *
 * Three render states: loading skeleton → image → failed initials block.
 * Dynamic-import or generation errors flip into the initials path so the
 * skeleton never spins indefinitely.
 */
export function MatchDicebearAvatar({
  seed,
  size = 40,
  className,
  fallbackInitials,
}: MatchDicebearAvatarProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const safeSeed = seed.slice(0, 64);
    void (async () => {
      try {
        const [{ createAvatar }, { avataaars }] = await Promise.all([
          import("@dicebear/core"),
          import("@dicebear/collection"),
        ]);
        const raw = createAvatar(avataaars, { seed: safeSeed, size }).toString();
        const svg =
          typeof raw === "string" ? raw : await (raw as Promise<string>);
        if (cancelled) return;
        setDataUrl(
          `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
        );
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [seed, size]);

  if (failed) {
    return (
      <div
        className={cn(
          "shrink-0 grid place-items-center rounded-full bg-surface-container-high font-headline font-bold uppercase text-on-surface-variant",
          className
        )}
        style={{ width: size, height: size, fontSize: Math.max(10, size / 2.6) }}
        aria-hidden
      >
        {fallbackInitials ?? "?"}
      </div>
    );
  }

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
