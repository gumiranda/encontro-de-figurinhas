"use client";

import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@workspace/ui/components/card";

type CommunityStateBlockProps = {
  title: string;
  description?: string;
  loading?: boolean;
};

export function CommunityStateBlock({
  title,
  description,
  loading,
}: CommunityStateBlockProps) {
  return (
    <Card className="border-outline-variant/70 bg-surface-container">
      <CardContent className="flex min-h-36 flex-col items-center justify-center gap-3 p-6 text-center">
        {loading && (
          <Loader2 className="size-5 animate-spin text-muted-foreground" />
        )}
        <div>
          <p className="font-headline text-base font-bold text-foreground">
            {title}
          </p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
