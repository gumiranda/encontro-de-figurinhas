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
      className={cn(
        "group h-auto w-full justify-start rounded-xl border-tertiary/40 bg-tertiary/10 px-3 py-3 text-left shadow-sm hover:bg-tertiary/15 hover:text-foreground",
        className,
      )}
    >
      <Link href="/cadastrar-figurinhas/troca" aria-label="Abrir Modo Troca">
        <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-tertiary text-[color:var(--on-tertiary)]">
          <ListChecks className="size-5" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-tertiary">
            Modo Troca
            <span className="rounded-full border border-tertiary/30 bg-background/80 px-1.5 py-0.5 text-[9px] text-tertiary">
              Exclusivo
            </span>
          </span>
          <span className="mt-1 block truncate font-headline text-base font-black tracking-tight text-foreground">
            Ver faltantes no ponto
          </span>
          <span className="mt-0.5 block text-xs font-normal leading-snug text-muted-foreground">
            Lista rápida para conferir e marcar durante a troca.
          </span>
        </span>
        <span className="ml-auto rounded-full bg-background px-2 py-1 font-mono text-sm font-bold text-tertiary">
          {missingCount}
        </span>
      </Link>
    </Button>
  );
}
