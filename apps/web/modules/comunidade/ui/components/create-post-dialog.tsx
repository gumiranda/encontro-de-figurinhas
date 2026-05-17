"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
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
  RadioGroup,
  RadioGroupItem,
} from "@workspace/ui/components/radio-group";
import { Textarea } from "@workspace/ui/components/textarea";
import { cn } from "@workspace/ui/lib/utils";

type CreatePostDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function CreatePostDialog({ open, onOpenChange }: CreatePostDialogProps) {
  const [type, setType] = useState<"need" | "have">("need");
  const [message, setMessage] = useState("");
  const [stickerInput, setStickerInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const createPost = useMutation(api.communityPosts.create);

  const parseStickers = (input: string): number[] => {
    const nums = input
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .map((s) => {
        const match = s.match(/\d+/);
        return match ? parseInt(match[0], 10) : NaN;
      })
      .filter((n) => !isNaN(n) && n > 0 && n <= 980);

    return [...new Set(nums)];
  };

  const handleSubmit = async () => {
    const stickers = parseStickers(stickerInput);

    if (stickers.length === 0) {
      toast.error("Adicione pelo menos uma figurinha");
      return;
    }

    if (stickers.length > 20) {
      toast.error("Máximo de 20 figurinhas por post");
      return;
    }

    setIsSubmitting(true);
    try {
      await createPost({
        type,
        stickers,
        message: message.trim() || undefined,
      });
      toast.success("Post criado!");
      onOpenChange(false);
      setType("need");
      setMessage("");
      setStickerInput("");
    } catch (error: any) {
      toast.error(error.message || "Erro ao criar post");
    } finally {
      setIsSubmitting(false);
    }
  };

  const parsedStickers = parseStickers(stickerInput);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Novo post</DialogTitle>
          <DialogDescription>
            Compartilhe figurinhas que você tem ou precisa
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <RadioGroup
              value={type}
              onValueChange={(v) => setType(v as "need" | "have")}
              className="grid grid-cols-2 gap-2"
            >
              <Label
                htmlFor="type-need"
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 transition-colors",
                  type === "need"
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                <RadioGroupItem value="need" id="type-need" className="sr-only" />
                Preciso
              </Label>
              <Label
                htmlFor="type-have"
                className={cn(
                  "flex cursor-pointer items-center justify-center gap-2 rounded-lg border p-3 transition-colors",
                  type === "have"
                    ? "border-secondary bg-secondary/10 text-secondary"
                    : "border-white/10 hover:border-white/20"
                )}
              >
                <RadioGroupItem value="have" id="type-have" className="sr-only" />
                Tenho
              </Label>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="stickers">
              Números das figurinhas
              {parsedStickers.length > 0 && (
                <span className="ml-2 text-muted-foreground">
                  ({parsedStickers.length})
                </span>
              )}
            </Label>
            <Textarea
              id="stickers"
              placeholder="Ex: 42, 123, 456 ou 42 123 456"
              value={stickerInput}
              onChange={(e) => setStickerInput(e.target.value)}
              className="min-h-[80px] font-mono"
            />
            <p className="text-xs text-muted-foreground">
              Separe por vírgula, espaço ou quebra de linha. Máx 20.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              placeholder="Ex: Troco na região central"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              maxLength={200}
              className="min-h-[60px]"
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
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || parsedStickers.length === 0}
          >
            {isSubmitting ? "Publicando..." : "Publicar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
