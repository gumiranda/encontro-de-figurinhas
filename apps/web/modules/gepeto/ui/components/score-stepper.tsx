"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface ScoreStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  className?: string;
}

export function ScoreStepper({
  value,
  onChange,
  min = 0,
  max = 20,
  disabled = false,
  className,
}: ScoreStepperProps) {
  const step = (delta: number) => {
    if (disabled) return;
    onChange(Math.min(max, Math.max(min, value + delta)));
  };

  return (
    <div className={cn("flex flex-col items-center gap-1", className)}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
        onClick={() => step(1)}
        disabled={disabled || value >= max}
        aria-label="Aumentar placar"
      >
        <ChevronUp className="size-4" />
      </Button>
      <div className="font-display text-5xl font-bold tabular-nums leading-none">
        {value}
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8 rounded-lg text-muted-foreground hover:text-foreground"
        onClick={() => step(-1)}
        disabled={disabled || value <= min}
        aria-label="Diminuir placar"
      >
        <ChevronDown className="size-4" />
      </Button>
    </div>
  );
}
