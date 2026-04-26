"use client";

import { useMutation } from "convex/react";
import { ArrowRight, Check } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { cn } from "@workspace/ui/lib/utils";

import { useSectionLookup } from "@/modules/stickers/lib/section-lookup-context";
import { formatStickerNumber } from "@/modules/stickers/lib/sticker-parser";

export type MatchTradeDrawerProps = {
  matchedUserId: Id<"users">;
  matchedUserNickname: string;
  tradePointId: Id<"tradePoints">;
  theyHaveINeed: number[];
  iHaveTheyNeed: number[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

function StickerGrid({
  numbers,
  selected,
  onToggle,
  label,
}: {
  numbers: number[];
  selected: Set<number>;
  onToggle: (n: number) => void;
  label: string;
}) {
  const lookup = useSectionLookup();
  const allSelected = numbers.length > 0 && numbers.every((n) => selected.has(n));

  const handleSelectAll = () => {
    if (allSelected) {
      for (const n of numbers) onToggle(n);
    } else {
      for (const n of numbers) {
        if (!selected.has(n)) onToggle(n);
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        {numbers.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSelectAll}
            className="h-7 text-xs"
          >
            {allSelected ? "Desmarcar todas" : "Selecionar todas"}
          </Button>
        )}
      </div>
      {numbers.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nenhuma figurinha disponível</p>
      ) : (
        <div className="grid grid-cols-3 gap-1.5 sm:grid-cols-4">
          {numbers.map((n) => {
            const isSelected = selected.has(n);
            const { display, fullName } = formatStickerNumber(n, lookup);
            return (
              <button
                key={n}
                type="button"
                onClick={() => onToggle(n)}
                aria-label={`Figurinha ${display} (${fullName})${isSelected ? ", selecionada" : ""}`}
                className={cn(
                  "flex h-10 items-center justify-center rounded-md border px-2 text-xs font-mono font-semibold transition-colors",
                  isSelected
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card hover:border-primary/50"
                )}
              >
                {isSelected ? <Check className="size-4" /> : display}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function MatchTradeDrawer({
  matchedUserId,
  matchedUserNickname,
  tradePointId,
  theyHaveINeed,
  iHaveTheyNeed,
  open,
  onOpenChange,
  onSuccess,
}: MatchTradeDrawerProps) {
  const [stickersIGive, setStickersIGive] = useState<Set<number>>(new Set());
  const [stickersIReceive, setStickersIReceive] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initiateTrade = useMutation(api.trades.initiate);

  const toggleGive = useCallback((n: number) => {
    setStickersIGive((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }, []);

  const toggleReceive = useCallback((n: number) => {
    setStickersIReceive((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }, []);

  const handleSubmit = async () => {
    if (stickersIGive.size === 0 || stickersIReceive.size === 0) {
      toast.error("Selecione pelo menos uma figurinha em cada seção");
      return;
    }

    setIsSubmitting(true);
    try {
      await initiateTrade({
        matchedUserId,
        tradePointId,
        stickersIGive: [...stickersIGive],
        stickersIReceive: [...stickersIReceive],
      });
      toast.success("Proposta de troca enviada!");
      onOpenChange(false);
      setStickersIGive(new Set());
      setStickersIReceive(new Set());
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("TOO_MANY_PENDING")
          ? "Você já tem muitas trocas pendentes"
          : err instanceof Error && err.message.includes("ALREADY_PENDING")
            ? "Já existe uma proposta pendente com este usuário"
            : err instanceof Error && err.message.includes("NO_MATCH")
              ? "Não foi possível validar o match. Confira se ainda estão no mesmo ponto."
              : err instanceof Error && err.message.includes("INVALID_STICKER")
                ? "Figurinha inválida para esta troca"
                : err instanceof Error && err.message.includes("STICKERS_CHANGED")
                  ? "Algumas figurinhas já foram trocadas"
                  : "Erro ao enviar proposta";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      setStickersIGive(new Set());
      setStickersIReceive(new Set());
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent side="bottom" className="h-[85vh] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Propor troca com {matchedUserNickname}</SheetTitle>
          <SheetDescription>
            Selecione as figurinhas que deseja trocar
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <StickerGrid
            numbers={iHaveTheyNeed}
            selected={stickersIGive}
            onToggle={toggleGive}
            label="Figurinhas que vou dar"
          />

          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2 rounded-full bg-muted px-4 py-2 text-sm">
              <span className="font-medium">{stickersIGive.size}</span>
              <ArrowRight className="size-4" />
              <span className="font-medium">{stickersIReceive.size}</span>
            </div>
          </div>

          <StickerGrid
            numbers={theyHaveINeed}
            selected={stickersIReceive}
            onToggle={toggleReceive}
            label="Figurinhas que vou receber"
          />
        </div>

        <SheetFooter>
          <Button
            variant="outline"
            onClick={() => handleClose(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              isSubmitting ||
              stickersIGive.size === 0 ||
              stickersIReceive.size === 0
            }
          >
            {isSubmitting && <Spinner className="mr-2 size-4" />}
            Enviar proposta
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
