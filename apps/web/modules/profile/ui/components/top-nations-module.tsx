"use client";

import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

export type NationProgress = {
  flag: string;
  name: string;
  code: string;
  got: number;
  total: number;
};

type TopNationsModuleProps = {
  nations: NationProgress[];
  maxDisplay?: number;
};

export function TopNationsModule({ nations, maxDisplay = 5 }: TopNationsModuleProps) {
  const displayNations = nations.slice(0, maxDisplay);

  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-base">Top seleções</CardTitle>
        <CardDescription>Onde seu álbum está mais cheio</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayNations.map((nation) => {
          const pct = (nation.got / nation.total) * 100;
          const isComplete = nation.got === nation.total;

          return (
            <div
              key={nation.code}
              className="grid grid-cols-[26px_1fr_auto] gap-3 items-center"
            >
              <span className="text-lg leading-none">{nation.flag}</span>

              <div className="min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {nation.code}
                  </span>
                  <span className="font-mono text-[10px] text-muted-foreground">
                    {nation.got}/{nation.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-surface-container-highest overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all duration-500",
                      isComplete ? "bg-secondary" : "bg-primary"
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              {isComplete && (
                <Badge className="bg-secondary/15 text-secondary border-secondary/30 text-[10px] px-2 py-0.5">
                  FULL
                </Badge>
              )}
            </div>
          );
        })}

        {nations.length === 0 && (
          <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-sm text-muted-foreground">
            Nenhuma seleção ainda
          </div>
        )}
      </CardContent>
    </Card>
  );
}
