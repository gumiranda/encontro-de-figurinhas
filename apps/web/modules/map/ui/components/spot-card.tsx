"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { derivePointStatus } from "../../lib/derive-point-status";
import { formatDistance } from "../../../shared/lib/format-distance";
import type { TradePointMapItem } from "../../lib/use-arena-map";
import { FavoriteButton } from "./favorite-button";
import { StatusPill } from "./status-pill";

type SpotCardProps = {
  point: TradePointMapItem;
  index: number;
  selected: boolean;
  isFavorite: boolean;
  canFavorite: boolean;
  onSelect: () => void;
};

export function SpotCard({
  point,
  index,
  selected,
  isFavorite,
  canFavorite,
  onSelect,
}: SpotCardProps) {
  const router = useRouter();
  const status = derivePointStatus(point);
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${point.lat},${point.lng}`;

  const handleClick = () => {
    if (selected) {
      router.push(`/points/${point._id}`);
    } else {
      onSelect();
    }
  };

  return (
    <article
      className={cn(
        "flex min-w-[260px] snap-start flex-col gap-2 rounded-2xl border bg-surface-container p-3 transition-colors",
        selected
          ? "border-primary"
          : "border-outline-variant hover:border-outline",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={handleClick}
          className="flex flex-1 cursor-pointer flex-col items-start gap-0.5 text-left"
          aria-pressed={selected}
        >
          <span className="font-headline text-sm font-bold leading-tight text-on-surface">
            <span className="text-primary">{index}.</span> {point.name}
          </span>
          <span className="font-mono text-[11px] text-on-surface-variant">
            {formatDistance(point.distanceKm)} · {point.address}
          </span>
        </button>
        <div className="flex shrink-0 items-center gap-1">
          <StatusPill status={status} />
          {canFavorite && (
            <FavoriteButton
              tradePointId={point._id as Id<"tradePoints">}
              isFavorite={isFavorite}
              pointName={point.name}
            />
          )}
        </div>
      </div>

      <div className="flex gap-3 text-[11px] text-on-surface-variant">
        <span>
          <b className="font-headline font-bold text-secondary">
            {point.activeCheckinsCount ?? 0}
          </b>{" "}
          ativos
        </span>
        <span>
          Confiança{" "}
          <b className="font-headline font-bold text-on-surface">
            {point.confidenceScore.toFixed(1)}
          </b>
        </span>
      </div>

      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="flex-1">
          <Link href={`/points/${point._id}`}>Ver</Link>
        </Button>
        <Button asChild size="sm" className="flex-1">
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Abrir rotas para ${point.name} no Google Maps`}
          >
            Rotas
          </a>
        </Button>
      </div>
    </article>
  );
}
