"use client";

import { type ReactNode, type ElementType } from "react";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";

interface DelightfulEmptyStateProps {
  icon: ElementType;
  title: string;
  description: string;
  personality?: "encouraging" | "playful" | "calm";
  ctaLabel?: string;
  ctaHref?: string;
  secondaryAction?: ReactNode;
  className?: string;
}

const PERSONALITY_STYLES = {
  encouraging: {
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
    titleColor: "text-on-surface",
  },
  playful: {
    iconBg: "bg-tertiary/10",
    iconColor: "text-tertiary",
    titleColor: "text-on-surface",
  },
  calm: {
    iconBg: "bg-primary/8",
    iconColor: "text-primary",
    titleColor: "text-on-surface",
  },
};

const ENCOURAGING_PHRASES = [
  "Ainda não, mas logo!",
  "O começo de algo incrível.",
  "Uma página em branco cheia de possibilidades.",
  "Tudo grande começa pequeno.",
];

export function DelightfulEmptyState({
  icon: Icon,
  title,
  description,
  personality = "encouraging",
  ctaLabel,
  ctaHref,
  secondaryAction,
  className,
}: DelightfulEmptyStateProps) {
  const styles = PERSONALITY_STYLES[personality];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        className
      )}
    >
      <div
        className={cn(
          "mb-5 flex h-16 w-16 items-center justify-center rounded-xl",
          styles.iconBg
        )}
      >
        <Icon
          className={cn("h-8 w-8", styles.iconColor)}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      <h3 className={cn("font-headline text-xl font-semibold mb-2", styles.titleColor)}>
        {title}
      </h3>

      <p className="text-on-surface-variant max-w-md mb-6 text-sm leading-relaxed">
        {description}
      </p>

      {ctaHref && ctaLabel && (
        <Button asChild className="btn-primary-gradient">
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}

      {secondaryAction && (
        <div className="mt-3">
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export function getEncouragingPhrase(): string {
  return ENCOURAGING_PHRASES[Math.floor(Math.random() * ENCOURAGING_PHRASES.length)] as string;
}
