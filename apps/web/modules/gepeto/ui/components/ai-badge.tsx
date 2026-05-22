"use client";

import { Trophy } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

interface AIBadgeProps {
  matchName?: string;
  isNew?: boolean;
  className?: string;
}

export function AIBadge({ matchName, isNew, className }: AIBadgeProps) {
  return (
    <Badge
      variant="default"
      className={cn(
        "bg-amber-500 hover:bg-amber-600 flex items-center gap-1",
        isNew && "animate-bounce-in",
        className
      )}
    >
      <Trophy className="h-3 w-3" />
      <span>Bati a IA</span>
      {matchName && (
        <span className="text-[10px] opacity-75">({matchName})</span>
      )}
    </Badge>
  );
}
