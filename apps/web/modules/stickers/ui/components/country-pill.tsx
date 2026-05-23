"use client";

import { cn } from "@workspace/ui/lib/utils";
import { ProgressRing } from "./progress-ring";

interface CountryPillProps {
  code: string;
  flag: string;
  total: number;
  have: number;
  dupeCount: number;
  active?: boolean;
  onClick?: () => void;
}

export function CountryPill({
  code,
  flag,
  total,
  have,
  dupeCount,
  active,
  onClick,
}: CountryPillProps) {
  const pct = total > 0 ? have / total : 0;
  const isComplete = pct >= 1;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-1 w-16 p-2 rounded-xl shrink-0 transition-colors",
        active
          ? "bg-surface-container-highest border border-primary"
          : "bg-transparent border border-transparent hover:bg-surface-container"
      )}
    >
      <div className="relative grid place-items-center w-9 h-9">
        <ProgressRing
          size={36}
          strokeWidth={3}
          value={pct}
          color={isComplete ? "stroke-tertiary" : "stroke-secondary"}
        />
        <span className="absolute text-lg">{flag}</span>
        {dupeCount > 0 && (
          <span className="absolute -top-0.5 -right-1 min-w-3.5 h-3.5 px-0.5 rounded-full bg-secondary text-on-secondary font-mono text-[9px] font-bold grid place-items-center border-[1.5px] border-surface-dim">
            +{dupeCount > 9 ? "9+" : dupeCount}
          </span>
        )}
      </div>
      <span
        className={cn(
          "font-mono text-[9px] font-bold tracking-wider",
          active ? "text-primary" : "text-muted-foreground"
        )}
      >
        {code}
      </span>
      <span
        className={cn(
          "font-mono text-[9px]",
          isComplete ? "text-tertiary" : "text-muted-foreground"
        )}
      >
        {have}/{total}
      </span>
    </button>
  );
}
