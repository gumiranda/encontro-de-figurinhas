"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Check, Star } from "lucide-react";
import type { ListKind } from "../../lib/use-stickers";

interface StickerTabsProps {
  active: ListKind;
  onChange: (tab: ListKind) => void;
  counts: { have: number; need: number };
  variant?: "mobile" | "desktop-inline";
  className?: string;
}

export function StickerTabs({
  active,
  onChange,
  counts,
  variant = "mobile",
  className,
}: StickerTabsProps) {
  const tabs: Array<{
    key: ListKind;
    label: string;
    icon: typeof Check;
    count: number;
    activeClass: string;
  }> = [
    {
      key: "duplicates",
      label: "Tenho",
      icon: Check,
      count: counts.have,
      activeClass: "bg-secondary text-on-secondary",
    },
    {
      key: "missing",
      label: "Preciso",
      icon: Star,
      count: counts.need,
      activeClass: "bg-tertiary text-on-tertiary",
    },
  ];

  return (
    <div
      role="tablist"
      aria-label="Filtrar figurinhas"
      className={cn(
        "flex items-center gap-1 rounded-xl border border-outline-variant/40 bg-surface-container p-1",
        variant === "desktop-inline" ? "w-auto" : "w-full",
        className
      )}
    >
      {tabs.map(({ key, label, icon: Icon, count, activeClass }) => {
        const isActive = active === key;
        return (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(key)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-lg font-headline text-[11px] font-bold uppercase tracking-widest transition-colors",
              variant === "desktop-inline" ? "px-3 py-1.5" : "px-3 py-2.5",
              isActive
                ? activeClass
                : "text-on-surface-variant hover:text-on-surface"
            )}
          >
            <Icon
              className={cn(
                variant === "desktop-inline" ? "size-3.5" : "size-4"
              )}
              strokeWidth={isActive ? 2.5 : 2}
            />
            {label} · {count}
          </button>
        );
      })}
    </div>
  );
}
