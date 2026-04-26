"use client";

import type { ReactNode } from "react";
import { Info, AlertTriangle } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";

interface CalloutProps {
  variant?: "info" | "warn";
  title?: string;
  children: ReactNode;
}

export function Callout({ variant = "info", title, children }: CalloutProps) {
  return (
    <aside
      role="note"
      className={cn(
        "grid grid-cols-[2.5rem_1fr] gap-4 p-5 rounded-2xl border my-8",
        variant === "warn"
          ? "bg-amber-500/5 border-amber-500/15"
          : "bg-primary/5 border-primary/15"
      )}
    >
      <div
        className={cn(
          "w-10 h-10 rounded-lg grid place-items-center flex-shrink-0",
          variant === "warn" ? "bg-amber-500/10" : "bg-primary/10"
        )}
      >
        {variant === "warn" ? (
          <AlertTriangle className="w-5 h-5 text-amber-600" />
        ) : (
          <Info className="w-5 h-5 text-primary" />
        )}
      </div>
      <div>
        {title && (
          <h4 className="font-headline font-bold text-base mb-1.5">{title}</h4>
        )}
        <div className="text-sm text-muted-foreground">{children}</div>
      </div>
    </aside>
  );
}
