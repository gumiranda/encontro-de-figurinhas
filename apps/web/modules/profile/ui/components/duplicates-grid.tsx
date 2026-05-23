"use client";

import { ChevronRight, Sparkles } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

export interface DuplicateSticker {
  code: string;
  flag: string;
  num: string;
  rare?: boolean;
}

interface DuplicatesGridProps {
  duplicates: DuplicateSticker[];
  totalCount: number;
  maxVisible?: number;
  onViewAll?: () => void;
}

export function DuplicatesGrid({
  duplicates,
  totalCount,
  maxVisible = 8,
  onViewAll,
}: DuplicatesGridProps) {
  const visible = duplicates.slice(0, maxVisible);
  const remaining = totalCount - visible.length;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-sm font-semibold">
            Repetidas para troca
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {totalCount} disponíveis · toque para detalhes
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 gap-1 px-2 text-xs"
          onClick={onViewAll}
        >
          Ver todas <ChevronRight className="h-3.5 w-3.5" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-2">
          {visible.map((d) => (
            <div
              key={`${d.code}-${d.num}`}
              className={`flex flex-col justify-between rounded-lg border p-2 ${
                d.rare
                  ? "border-amber-400/30 bg-amber-400/5"
                  : "border-emerald-400/30 bg-emerald-400/5"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-base">{d.flag}</span>
                {d.rare && (
                  <Sparkles className="h-2.5 w-2.5 text-amber-400" />
                )}
              </div>
              <div className="mt-1">
                <div className="font-mono text-sm font-bold">{d.num}</div>
                <div className="font-mono text-[9px] text-muted-foreground">
                  {d.code}
                </div>
              </div>
            </div>
          ))}

          {remaining > 0 && (
            <div className="grid place-items-center rounded-lg border border-dashed border-border bg-transparent">
              <div className="text-center">
                <div className="font-mono text-lg font-bold">+{remaining}</div>
                <div className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground">
                  mais
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
