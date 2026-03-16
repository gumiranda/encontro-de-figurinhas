"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "@workspace/ui/components/button";
import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@workspace/ui/lib/utils";
import type { Doc } from "@workspace/backend/_generated/dataModel";

export function SpotActions({
  spot,
  myVote: myVoteProp,
}: {
  spot: Doc<"spots">;
  myVote?: number;
}) {
  const { isSignedIn } = useUser();
  const router = useRouter();
  const castVote = useMutation(api.votes.castVote);

  // When myVote is provided via prop (from SpotsMap batch query), skip self-fetch.
  // When undefined (spot detail page), self-fetch as before.
  const selfVotes = useQuery(
    api.votes.getMyVotes,
    myVoteProp !== undefined ? "skip" : { spotIds: [spot._id] }
  );
  const myVote =
    myVoteProp !== undefined
      ? myVoteProp
      : (selfVotes?.find((v) => v.spotId === spot._id)?.value ?? 0);

  const handleVote = async (value: 1 | -1) => {
    if (!isSignedIn) {
      router.push("/sign-in?redirect_url=/mapa");
      return;
    }
    try {
      await castVote({ spotId: spot._id, value });
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao votar"
      );
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/spot/${spot._id}`;
    const n = spot.upvotes;
    const label = `${spot.title} - ${n} ${n === 1 ? "confirmação" : "confirmações"} de troca de figurinhas!`;

    if (navigator.share) {
      try {
        await navigator.share({ title: spot.title, text: label, url });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast.error("Erro ao compartilhar");
        }
      }
    } else {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(`${label} ${url}`)}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7 px-2 gap-1", myVote === 1 && "text-green-600 bg-green-50")}
          onClick={(e) => { e.stopPropagation(); handleVote(1); }}
        >
          <ThumbsUp className="h-3.5 w-3.5" />
          <span className="text-xs">{spot.upvotes}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7 px-2 gap-1", myVote === -1 && "text-red-600 bg-red-50")}
          onClick={(e) => { e.stopPropagation(); handleVote(-1); }}
        >
          <ThumbsDown className="h-3.5 w-3.5" />
          <span className="text-xs">{spot.downvotes}</span>
        </Button>
      </div>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 px-2 gap-1"
        onClick={(e) => { e.stopPropagation(); handleShare(); }}
      >
        <Share2 className="h-3.5 w-3.5" />
        <span className="text-xs">Compartilhar</span>
      </Button>
    </div>
  );
}
