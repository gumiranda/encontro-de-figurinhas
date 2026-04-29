"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";

type DuplicateItem = {
  displayCode: string;
  flagEmoji: string;
};

type Props = {
  duplicates: DuplicateItem[];
  totalCount: number;
};

export function DuplicatesSection({ duplicates, totalCount }: Props) {
  const remaining = totalCount - duplicates.length;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Repetidas disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        {duplicates.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma figurinha repetida disponível
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {duplicates.map((dup) => (
              <Badge key={dup.displayCode} variant="secondary" className="text-sm">
                {dup.flagEmoji} {dup.displayCode}
              </Badge>
            ))}
            {remaining > 0 && (
              <Badge variant="outline" className="text-sm">
                +{remaining}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
