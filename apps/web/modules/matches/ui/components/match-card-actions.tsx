"use client";

import { useMutation } from "convex/react";
import { Copy, EyeOff, Flag, MoreVertical } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";

import { MatchReportDialog } from "./match-report-dialog";

export type MatchCardActionsProps = {
  matchedUserId: Id<"users">;
  matchedUserNickname: string;
  tradePointId: Id<"tradePoints">;
  tradePointSlug: string;
};

export function MatchCardActions({
  matchedUserId,
  matchedUserNickname,
  tradePointId,
  tradePointSlug,
}: MatchCardActionsProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const toggleHidden = useMutation(api.userMatchInteractions.toggleHidden);

  const handleCopyLink = useCallback(async () => {
    const url = `${window.location.origin}/ponto/${tradePointSlug}`;
    await navigator.clipboard.writeText(url);
    toast.success("Link copiado!");
  }, [tradePointSlug]);

  const handleHide = useCallback(async () => {
    try {
      await toggleHidden({ matchedUserId, tradePointId });
      toast.success("Match escondido");
    } catch {
      toast.error("Erro ao esconder match");
    }
  }, [toggleHidden, matchedUserId, tradePointId]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 shrink-0"
            aria-label="Ações"
          >
            <MoreVertical className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={handleCopyLink}>
            <Copy className="size-4" />
            Copiar link do ponto
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleHide}>
            <EyeOff className="size-4" />
            Esconder match
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => setReportOpen(true)}
            className="text-destructive focus:text-destructive"
          >
            <Flag className="size-4" />
            Denunciar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MatchReportDialog
        matchedUserId={matchedUserId}
        matchedUserNickname={matchedUserNickname}
        tradePointId={tradePointId}
        open={reportOpen}
        onOpenChange={setReportOpen}
      />
    </>
  );
}
