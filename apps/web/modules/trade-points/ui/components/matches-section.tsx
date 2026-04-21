"use client";

import { memo } from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Pill } from "@workspace/ui/components/kibo-ui/pill";
import { Text } from "@workspace/ui/components/typography";
import { cn } from "@workspace/ui/lib/utils";

type MatchesSectionProps = {
  tradePointId: string;
  /** Quando a API de matches por ponto existir, passar o total. */
  matchCount?: number;
  className?: string;
};

export const MatchesSection = memo(function MatchesSection({
  tradePointId,
  matchCount = 0,
  className,
}: MatchesSectionProps) {
  void tradePointId;
  const hasMatches = matchCount > 0;

  return (
    <Card
      className={cn(
        "rounded-2xl border border-outline-variant/10 bg-surface-container-low shadow-xl",
        className
      )}
    >
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
            <Sparkles className="h-5 w-5 shrink-0" aria-hidden />
            Matches de figurinhas
          </CardTitle>
          {hasMatches ? (
            <Pill variant="secondary">{matchCount} oportunidades</Pill>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!hasMatches ? (
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <Sparkles
              className="h-10 w-10 shrink-0 text-primary"
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="space-y-3">
              <Text variant="small" className="text-muted-foreground">
                Cadastre suas figurinhas repetidas e faltantes para encontrar
                matches neste ponto.
              </Text>
              <Button asChild variant="outline" size="sm">
                <Link href="/cadastrar-figurinhas/quick">
                  Cadastrar figurinhas
                </Link>
              </Button>
            </div>
          </div>
        ) : (
          <ul className="list-none space-y-3">
            <li className="rounded-xl border border-secondary p-4">
              <Text variant="small" className="text-muted-foreground">
                Há oportunidades de troca com base no seu álbum e neste ponto.
                Lista detalhada em breve.
              </Text>
            </li>
          </ul>
        )}
      </CardContent>
    </Card>
  );
});
