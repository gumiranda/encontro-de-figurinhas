"use client";

import { cn } from "@workspace/ui/lib/utils";
import { Lightbulb } from "lucide-react";

interface ReasoningCardProps {
  reasoning: string[];
  className?: string;
}

export function ReasoningCard({ reasoning, className }: ReasoningCardProps) {
  if (!reasoning.length) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-dashed border-amber-500/50 bg-amber-500/5 p-4",
        className
      )}
    >
      <div className="flex items-center gap-2 mb-3 text-amber-500">
        <Lightbulb className="h-4 w-4" />
        <span className="text-sm font-medium">Análise</span>
      </div>
      <ul className="space-y-2">
        {reasoning.map((item, i) => (
          <li key={i} className="text-sm text-muted-foreground flex gap-2">
            <span className="text-amber-500">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
