"use client";

import { Popup } from "react-map-gl/mapbox";
import { Clock, User } from "lucide-react";
import type { Doc } from "@workspace/backend/_generated/dataModel";
import { SpotActions } from "./spot-actions";

export function formatTimeRemaining(expiresAt: number): string {
  const remaining = expiresAt - Date.now();
  if (remaining <= 0) return "Expirado";
  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) return `${hours}h ${minutes}min restantes`;
  return `${minutes}min restantes`;
}

export function SpotPopup({
  spot,
  onClose,
  myVote,
}: {
  spot: Doc<"spots">;
  onClose: () => void;
  myVote?: number;
}) {
  const ageMinutes = (Date.now() - spot.createdAt) / (1000 * 60);
  const freshness =
    ageMinutes < 30 ? "Acabou de ser criado" : ageMinutes < 120 ? "Recente" : "";

  return (
    <Popup
      latitude={spot.latitude}
      longitude={spot.longitude}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      maxWidth="280px"
      className="spot-popup"
    >
      <div className="p-1 min-w-[200px]">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-sm leading-tight">{spot.title}</h3>
          {freshness && (
            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full whitespace-nowrap shrink-0">
              {freshness}
            </span>
          )}
        </div>

        {spot.description && (
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {spot.description}
          </p>
        )}

        <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-2">
          <span className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {spot.createdByName}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatTimeRemaining(spot.expiresAt)}
          </span>
        </div>

        <div className="border-t pt-2">
          <SpotActions spot={spot} myVote={myVote} />
        </div>
      </div>
    </Popup>
  );
}
