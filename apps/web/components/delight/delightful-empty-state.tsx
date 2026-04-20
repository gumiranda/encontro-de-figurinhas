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
    iconBg: "bg-gradient-to-br from-secondary/20 to-secondary-dim/30",
    iconColor: "text-secondary",
    titleColor: "text-on-surface",
    glow: "shadow-[0_0_30px_rgba(79,243,37,0.15)]",
  },
  playful: {
    iconBg: "bg-gradient-to-br from-tertiary/20 to-tertiary-dim/30",
    iconColor: "text-tertiary",
    titleColor: "text-on-surface",
    glow: "shadow-[0_0_30px_rgba(255,201,101,0.15)]",
  },
  calm: {
    iconBg: "bg-gradient-to-br from-primary/15 to-primary-dim/25",
    iconColor: "text-primary",
    titleColor: "text-on-surface",
    glow: "shadow-[0_0_30px_rgba(149,170,255,0.15)]",
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
        "flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up",
        className
      )}
    >
      <div
        className={cn(
          "mb-6 flex h-24 w-24 items-center justify-center rounded-3xl",
          styles.iconBg,
          styles.glow
        )}
      >
        <Icon
          className={cn("h-12 w-12", styles.iconColor)}
          strokeWidth={1.5}
          aria-hidden="true"
        />
      </div>

      <h3 className={cn("font-headline text-2xl font-bold mb-3", styles.titleColor)}>
        {title}
      </h3>

      <p className="text-on-surface-variant max-w-md mb-8 leading-relaxed">
        {description}
      </p>

      {ctaHref && ctaLabel && (
        <Button
          asChild
          className="btn-primary-gradient animate-bounce-in"
          style={{ animationDelay: "200ms" }}
        >
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button>
      )}

      {secondaryAction && (
        <div className="mt-4 animate-fade-in-up" style={{ animationDelay: "300ms" }}>
          {secondaryAction}
        </div>
      )}
    </div>
  );
}

export function getEncouragingPhrase(): string {
  return ENCOURAGING_PHRASES[Math.floor(Math.random() * ENCOURAGING_PHRASES.length)] as string;
}
