"use client";
import { useRouter } from "next/navigation";
import { cn } from "@workspace/ui/lib/utils";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { derivePointStatus } from "../../lib/derive-point-status";
import { formatDistance } from "../../lib/format-distance";
import type { TradePointMapItem } from "../../lib/use-arena-map";
import { FavoriteButton } from "./favorite-button";
import { StatusPill } from "./status-pill";

type SpotRowProps = {
  point: TradePointMapItem;
  index: number;
  selected: boolean;
  isFavorite: boolean;
  canFavorite: boolean;
  onSelect: () => void;
};

export function SpotRow({
  point,
  index,
  selected,
  isFavorite,
  canFavorite,
  onSelect,
}: SpotRowProps) {
  const router = useRouter();
  const status = derivePointStatus(point);

  const handleClick = () => {
    if (selected) {
      router.push(`/points/${point._id}`);
    } else {
      onSelect();
    }
  };

  return (
    <div
      className={cn(
        "group flex items-start gap-3 rounded-xl border p-3 transition-colors",
        selected
          ? "border-primary bg-surface-container"
          : "border-transparent hover:border-outline-variant hover:bg-surface-container",
      )}
    >
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={selected}
        aria-label={`Selecionar ${point.name}, ${formatDistance(point.distanceKm)}`}
        className="flex flex-1 cursor-pointer items-start gap-3 text-left"
      >
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-surface-container-high font-headline text-xs font-extrabold text-primary">
          {index}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate font-headline text-sm font-bold leading-tight text-on-surface">
            {point.name}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-on-surface-variant">
            {point.address}
          </span>
          <span className="mt-1.5 flex items-center gap-2 text-[11px] text-on-surface-variant">
            <span>
              <b className="font-headline font-bold text-secondary">
                {point.activeCheckinsCount ?? 0}
              </b>{" "}
              ativos
            </span>
            <span aria-hidden="true">·</span>
            <span>
              Confiança{" "}
              <b className="font-headline font-bold text-on-surface">
                {point.confidenceScore.toFixed(1)}
              </b>
            </span>
            <StatusPill status={status} className="ml-auto" />
          </span>
        </span>
      </button>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="font-mono text-[11px] text-outline">
          {formatDistance(point.distanceKm)}
        </span>
        {canFavorite && (
          <FavoriteButton
            tradePointId={point._id as Id<"tradePoints">}
            isFavorite={isFavorite}
            pointName={point.name}
          />
        )}
      </div>
    </div>
  );
}
