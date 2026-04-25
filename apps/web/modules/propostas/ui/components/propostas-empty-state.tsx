"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  className?: string;
};

export function PropostasEmptyState({
  icon: Icon,
  title,
  description,
  ctaHref,
  ctaLabel,
  className,
}: Props) {
  return (
    <Card className={cn("border-dashed bg-surface-container-low", className)}>
      <CardContent className="flex flex-col items-center justify-center py-12 text-center">
        <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-primary/10">
          <Icon className="size-7 text-primary" strokeWidth={1.5} />
        </div>
        <h3 className="font-headline text-base font-bold">{title}</h3>
        <p className="mt-1.5 max-w-sm text-sm text-on-surface-variant">
          {description}
        </p>
        {ctaHref && ctaLabel && (
          <Button asChild className="mt-5">
            <Link href={ctaHref}>{ctaLabel}</Link>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
