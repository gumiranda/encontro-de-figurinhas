"use client";

import { memo } from "react";
import { Clock, MapPin } from "lucide-react";
import { Text } from "@workspace/ui/components/typography";

type PointHeaderProps = {
  name: string;
  address: string;
  suggestedHours?: string;
  cityName: string | null;
};

export const PointHeader = memo(function PointHeader({
  name,
  address,
  suggestedHours,
  cityName,
}: PointHeaderProps) {
  return (
    <div className="space-y-3 px-4">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">{name}</h1>
        {cityName && (
          <Text variant="small" className="text-muted-foreground">
            {cityName}
          </Text>
        )}
      </div>
      <div className="flex items-start gap-2 text-muted-foreground">
        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
        <Text variant="small">{address}</Text>
      </div>
      {suggestedHours && (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Clock className="h-4 w-4 shrink-0" />
          <Text variant="small">{suggestedHours}</Text>
        </div>
      )}
    </div>
  );
});
