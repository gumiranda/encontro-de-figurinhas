"use client";

import { memo } from "react";
import { Sparkles } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Text } from "@workspace/ui/components/typography";

type MatchesSectionProps = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  tradePointId: string;
};

// TODO(matches): wire api.matches.forTradePoint quando a tela de Matches for entregue (PRD F14)
export const MatchesSection = memo(function MatchesSection({
  tradePointId: _tradePointId,
}: MatchesSectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          Matches de figurinhas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Text variant="small" className="text-muted-foreground">
          Em breve: encontre matches do seu álbum disponíveis neste ponto.
        </Text>
      </CardContent>
    </Card>
  );
});
