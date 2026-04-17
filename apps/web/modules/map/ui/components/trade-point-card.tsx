"use client";
import Link from "next/link";
import { MapPin, Clock, CheckCircle2 } from "lucide-react";
import { cn } from "@workspace/ui/lib/utils";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Text } from "@workspace/ui/components/typography";
import type { TradePointMapItem } from "../../lib/use-arena-map";
import { formatRelativeTime } from "../../lib/format-relative-time";
import { ConfidenceBar } from "./confidence-bar";
import { useMapSelection } from "../views/map-arena-view";

type TradePointCardProps = {
  point: TradePointMapItem;
};

export function TradePointCard({ point }: TradePointCardProps) {
  const { selectedId, setSelectedId } = useMapSelection();
  const selected = selectedId === point._id;

  return (
    <Card
      aria-current={selected ? "location" : undefined}
      onClick={() => setSelectedId(point._id)}
      className={cn(
        "cursor-pointer transition-all",
        selected && "ring-2 ring-primary"
      )}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{point.name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-start gap-2 text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
          <Text variant="small">{point.address}</Text>
        </div>
        {point.suggestedHours && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4 shrink-0" />
            <Text variant="small">{point.suggestedHours}</Text>
          </div>
        )}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Text variant="small" className="text-muted-foreground">
              Confiança
            </Text>
            <Text variant="small" className="font-medium">
              {point.confidenceScore.toFixed(1)}/10
            </Text>
          </div>
          <ConfidenceBar score={point.confidenceScore} />
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>{point.confirmedTradesCount} trocas confirmadas</span>
          </div>
          <Text variant="small" className="text-muted-foreground">
            {formatRelativeTime(point.lastActivityAt)}
          </Text>
        </div>
        {point.distanceKm > 0 && (
          <Text variant="small" className="text-muted-foreground">
            {point.distanceKm < 1
              ? `${Math.round(point.distanceKm * 1000)}m de distância`
              : `${point.distanceKm.toFixed(1)}km de distância`}
          </Text>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild size="sm" variant="outline" className="w-full">
          <Link
            href={`/points/${point._id}`}
            onClick={(e) => e.stopPropagation()}
          >
            Ver detalhes
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
