"use client";

import { ListChecks } from "lucide-react";
import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

interface MissingListShortcutProps {
  missingCount: number;
  className?: string;
}

export function MissingListShortcut({
  missingCount,
  className,
}: MissingListShortcutProps) {
  return (
    <Button
      asChild
      variant="outline"
      size="sm"
      className={cn("h-auto w-full justify-between px-3 py-2", className)}
    >
      <Link href="/cadastrar-figurinhas/troca">
        <span className="inline-flex items-center gap-2">
          <ListChecks className="size-4" aria-hidden="true" />
          Ver minhas faltantes
        </span>
        <span className="font-mono text-xs text-muted-foreground">
          {missingCount}
        </span>
      </Link>
    </Button>
  );
}
