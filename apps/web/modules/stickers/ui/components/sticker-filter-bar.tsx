"use client";

import { cn } from "@workspace/ui/lib/utils";

export type StickerFilter = "all" | "missing" | "have" | "dupe";

interface FilterOption {
  id: StickerFilter;
  label: string;
}

const FILTERS: FilterOption[] = [
  { id: "all", label: "Todas" },
  { id: "missing", label: "Faltam" },
  { id: "have", label: "Tenho" },
  { id: "dupe", label: "Repetidas" },
];

interface StickerFilterBarProps {
  value: StickerFilter;
  onChange: (filter: StickerFilter) => void;
  counts?: {
    all: number;
    missing: number;
    have: number;
    dupe: number;
  };
}

export function StickerFilterBar({ value, onChange, counts }: StickerFilterBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none">
      {FILTERS.map((f) => {
        const isActive = value === f.id;
        const count = counts?.[f.id];

        return (
          <button
            key={f.id}
            type="button"
            onClick={() => onChange(f.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
              isActive
                ? "bg-primary text-on-primary"
                : "bg-surface-container-highest text-muted-foreground hover:text-on-surface"
            )}
          >
            {f.label}
            {count !== undefined && (
              <span
                className={cn(
                  "font-mono text-[10px]",
                  isActive ? "opacity-80" : "opacity-60"
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
