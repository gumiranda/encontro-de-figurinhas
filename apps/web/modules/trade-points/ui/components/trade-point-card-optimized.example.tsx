"use client";

import { memo, useCallback } from "react";
import type { Id } from "@workspace/backend/_generated/dataModel";
import Link from "next/link";
import { MapPin, Users, Trophy } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";

type TradePointCardProps = {
  id: Id<"tradePoints">;
  slug: string;
  name: string;
  city: string;
  state: string;
  distance?: number;
  participantCount?: number;
  status: "pending" | "approved" | "suspended" | "inactive" | "expired";
  confidenceScore?: number;
  isSelected?: boolean;
  onSelect?: (id: Id<"tradePoints">) => void;
};

/**
 * Optimized Trade Point Card with memoization to prevent re-renders
 * Use this pattern for list items that render frequently
 */
export const TradePointCard = memo(function TradePointCard({
  id,
  slug,
  name,
  city,
  state,
  distance,
  participantCount = 0,
  status,
  confidenceScore = 5,
  isSelected = false,
  onSelect,
}: TradePointCardProps) {
  // Memoize callback to prevent child component re-renders
  const handleSelect = useCallback(() => {
    onSelect?.(id);
  }, [id, onSelect]);

  // Only show if approved
  if (status !== "approved") {
    return null;
  }

  const displayDistance = distance
    ? distance < 1
      ? "< 1 km"
      : `${distance.toFixed(1)} km`
    : undefined;

  const isHighConfidence = confidenceScore >= 4;
  const statusBadgeColor = isHighConfidence
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";

  return (
    <Card
      className={cn(
        "transition-[box-shadow,transform] duration-200 hover:shadow-lg hover:scale-105 active:scale-[0.96]",
        isSelected && "ring-2 ring-primary"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="truncate text-lg">
              <Link
                href={`/ponto/${slug}`}
                className="hover:text-primary hover:underline"
              >
                {name}
              </Link>
            </CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1 text-sm">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">
                {city}, {state}
              </span>
              {displayDistance && (
                <span className="ml-2 font-medium text-foreground">
                  {displayDistance}
                </span>
              )}
            </CardDescription>
          </div>
          {isHighConfidence && (
            <Badge className="flex-shrink-0">
              <Trophy className="h-3 w-3 mr-1" />
              Confiável
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Stats Row */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>
              {participantCount} {participantCount === 1 ? "membro" : "membros"}
            </span>
          </div>
          {confidenceScore && (
            <div className="flex items-center gap-1">
              <span className="text-xs font-medium text-yellow-600">
                ★ {confidenceScore.toFixed(1)}/5
              </span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            asChild
          >
            <Link href={`/ponto/${slug}`}>
              Detalhes
            </Link>
          </Button>
          {onSelect && (
            <Button
              size="sm"
              variant={isSelected ? "default" : "ghost"}
              onClick={handleSelect}
              className="flex-1"
            >
              {isSelected ? "Selecionado" : "Selecionar"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Display name for debugging
TradePointCard.displayName = "TradePointCard";
