"use client";

import Link from "next/link";
import type { LucideIcon } from "lucide-react";

import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

export type MatchesEmptyPersonality = "encouraging" | "playful" | "calm";

type MatchesEmptyStateProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  onCta?: () => void | Promise<void>;
  personality?: MatchesEmptyPersonality;
  className?: string;
};

const personalityStyles: Record<
  MatchesEmptyPersonality,
  { iconBg: string; iconColor: string }
> = {
  encouraging: {
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
  playful: {
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
  },
  calm: {
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
  },
};

export function MatchesEmptyState({
  icon: Icon,
  title,
  description,
  ctaHref,
  ctaLabel,
  onCta,
  personality = "encouraging",
  className,
}: MatchesEmptyStateProps) {
  const styles = personalityStyles[personality];
  const showCta = Boolean(ctaLabel && (ctaHref || onCta));

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <h1 className="text-3xl font-bold">Matches</h1>
        <p className="text-muted-foreground">
          Usuários com figurinhas compatíveis
        </p>
      </div>

      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div
            className={cn(
              "mb-5 flex h-16 w-16 items-center justify-center rounded-xl",
              styles.iconBg
            )}
          >
            <Icon
              className={cn("size-8", styles.iconColor)}
              strokeWidth={1.5}
            />
          </div>
          <h2 className="text-lg font-headline font-semibold">{title}</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          {showCta && ctaLabel && ctaHref && !onCta && (
            <Button asChild className="mt-6 btn-primary-gradient">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          )}
          {showCta && ctaLabel && onCta && (
            <Button
              type="button"
              className="mt-6 btn-primary-gradient"
              onClick={() => void onCta()}
            >
              {ctaLabel}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
