"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Textarea } from "@workspace/ui/components/textarea";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";

type ReportCategory = "safety" | "fake_stickers" | "no_show" | "spam" | "other";

const CATEGORY_LABELS: Record<ReportCategory, string> = {
  safety: "Comportamento inadequado",
  fake_stickers: "Figurinhas falsas",
  no_show: "Faltou ao encontro",
  spam: "Spam ou propaganda",
  other: "Outro",
};

export type MatchReportDialogProps = {
  matchedUserId: Id<"users">;
  matchedUserNickname: string;
  tradePointId?: Id<"tradePoints">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function MatchReportDialog({
  matchedUserId,
  matchedUserNickname,
  tradePointId,
  open,
  onOpenChange,
}: MatchReportDialogProps) {
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createReport = useMutation(api.reports.create);

  const handleSubmit = async () => {
    if (!category) {
      toast.error("Selecione uma categoria");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReport({
        targetUserId: matchedUserId,
        tradePointId,
        category,
        description: description.trim() || undefined,
      });
      toast.success("Denúncia enviada");
      onOpenChange(false);
      setCategory("");
      setDescription("");
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("DAILY_LIMIT")
          ? "Limite diário de denúncias atingido"
          : err instanceof Error && err.message.includes("DUPLICATE_REPORT")
            ? "Você já denunciou este usuário recentemente"
            : "Erro ao enviar denúncia";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Denunciar {matchedUserNickname}</DialogTitle>
          <DialogDescription>
            Sua denúncia será analisada pela equipe de moderação.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="category">Motivo</Label>
            <Select
              value={category}
              onValueChange={(v) => setCategory(v as ReportCategory)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CATEGORY_LABELS) as ReportCategory[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Detalhes (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o que aconteceu..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || !category}>
            {isSubmitting && <Spinner className="mr-2 size-4" />}
            Enviar denúncia
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
