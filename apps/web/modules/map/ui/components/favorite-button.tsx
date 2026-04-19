"use client";
import { Heart } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";

type FavoriteButtonProps = {
  tradePointId: Id<"tradePoints">;
  isFavorite: boolean;
  pointName: string;
  className?: string;
};

export function FavoriteButton({
  tradePointId,
  isFavorite,
  pointName,
  className,
}: FavoriteButtonProps) {
  const toggle = useMutation(api.users.toggleFavoriteTradePoint);

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={
        isFavorite
          ? `Remover ${pointName} dos favoritos`
          : `Marcar ${pointName} como favorito`
      }
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.stopPropagation();
        void toggle({ tradePointId });
      }}
      className={cn("size-8 shrink-0 text-on-surface-variant", className)}
    >
      <Heart
        aria-hidden="true"
        className={cn(
          "size-4 transition-colors",
          isFavorite && "fill-tertiary text-tertiary",
        )}
      />
    </Button>
  );
}
