"use client";

import { cn } from "@workspace/ui/lib/utils";

interface ConfidenceMeterProps {
  value: number;
  className?: string;
}

export function ConfidenceMeter({ value, className }: ConfidenceMeterProps) {
  const clampedValue = Math.min(100, Math.max(0, value));
  
  const getColor = () => {
    if (clampedValue >= 75) return "bg-green-500";
    if (clampedValue >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className={cn("space-y-1", className)}>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Confiança</span>
        <span className="font-medium">{clampedValue}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", getColor())}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
