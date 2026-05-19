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
      <CardContent className="space-y-4">
        {displayNations.map((nation) => {
          const pct = (nation.got / nation.total) * 100;
          const isComplete = nation.got === nation.total;

          return (
            <div key={nation.code} className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-xl leading-none">{nation.flag}</span>
                <span className="font-headline text-sm font-bold text-foreground flex-1">
                  {nation.name}
                </span>
                <span
                  className={cn(
                    "font-mono text-sm font-semibold",
                    isComplete ? "text-secondary" : "text-muted-foreground"
                  )}
                >
                  {nation.got}/{nation.total}
                </span>
                {isComplete && (
                  <Badge className="bg-secondary/15 text-secondary border-secondary/30 text-[10px] px-2 py-0.5">
                    FULL
                  </Badge>
                )}
              </div>
              <div className="h-2 rounded-full bg-surface-container-highest overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full transition-all duration-500",
                    isComplete ? "bg-secondary" : "bg-primary"
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
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
