"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { X, ArrowLeftRight, MapPin, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
import { MiniStickerFigure } from "./mini-sticker-figure";

interface Sticker {
  code: string;
  flag: string;
  num: string;
  rare?: boolean;
}

interface TradeModalProps {
  open: boolean;
  onClose: () => void;
  authorNick: string;
  authorCity: string;
  theirStickers: Sticker[];
  myStickers: Sticker[];
  onSend: (data: {
    pickedTheirs: string[];
    pickedMine: string[];
    message: string;
  }) => void;
}

const MEET_SUGGESTIONS = [
  "Shopping Eldorado · sab 15h",
  "Metrô Faria Lima",
  "Correio (PAC)",
];

export function TradeModal({
  open,
  onClose,
  authorNick,
  authorCity,
  theirStickers,
  myStickers,
  onSend,
}: TradeModalProps) {
  const [pickedTheirs, setPickedTheirs] = useState<string[]>(
    theirStickers.slice(0, 1).map((s) => s.code + s.num)
  );
  const [pickedMine, setPickedMine] = useState<string[]>(
    myStickers.map((s) => s.code + s.num)
  );
  const [message, setMessage] = useState("");

  const toggle = (
    list: string[],
    setter: (v: string[]) => void,
    key: string
  ) => {
    setter(
      list.includes(key) ? list.filter((x) => x !== key) : [...list, key]
    );
  };

  const isFair = pickedMine.length > 0 && pickedTheirs.length > 0;
  const balanceLabel =
    pickedMine.length === pickedTheirs.length
      ? "Troca equilibrada"
      : `${pickedMine.length}×${pickedTheirs.length} · desbalanceada`;

  const handleSend = () => {
    onSend({ pickedTheirs, pickedMine, message });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v: boolean) => !v && onClose()}>
      <DialogContent className="max-w-[400px] p-0 gap-0 bg-surface-container border-white/10">
        <DialogHeader className="p-4 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <MatchDicebearAvatar
              seed={authorNick}
              size={36}
              fallbackInitials={authorNick.slice(0, 2).toUpperCase()}
            />
            <div className="flex-1 min-w-0">
              <DialogTitle className="font-headline text-sm">
                Propor troca
              </DialogTitle>
              <p className="text-[11px] text-muted-foreground">
                com @{authorNick} · {authorCity}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onClose}
            >
              <X className="size-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-4 max-h-[55vh] overflow-y-auto space-y-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-secondary mb-1.5">
              → Você recebe ({pickedTheirs.length})
            </p>
            {theirStickers.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                Sem repetidas confirmadas — envie sua proposta e aguarde
                resposta.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {theirStickers.map((s) => {
                  const key = s.code + s.num;
                  return (
                    <MiniStickerFigure
                      key={key}
                      {...s}
                      selected={pickedTheirs.includes(key)}
                      onClick={() => toggle(pickedTheirs, setPickedTheirs, key)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex-1 h-px bg-white/10" />
            <div className="size-7 rounded-full bg-primary text-primary-foreground grid place-items-center">
              <ArrowLeftRight className="size-3.5" />
            </div>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1.5">
              ← Você oferece ({pickedMine.length})
            </p>
            {myStickers.length === 0 ? (
              <p className="text-xs text-muted-foreground py-2">
                Você ainda não tem repetidas que correspondam — envie uma
                mensagem.
              </p>
            ) : (
              <div className="grid grid-cols-4 gap-1.5">
                {myStickers.map((s) => {
                  const key = s.code + s.num;
                  return (
                    <MiniStickerFigure
                      key={key}
                      {...s}
                      variant="dupe"
                      selected={pickedMine.includes(key)}
                      onClick={() => toggle(pickedMine, setPickedMine, key)}
                    />
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Mensagem
            </p>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Combine ponto de encontro, horário ou correio..."
              className={cn(
                "w-full bg-surface-container-high border border-white/10 rounded-lg",
                "px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:border-primary/50",
                "min-h-[50px] resize-y"
              )}
            />
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1.5">
              Sugestões de encontro
            </p>
            <div className="flex flex-wrap gap-1.5">
              {MEET_SUGGESTIONS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setMessage((m) => m + (m ? " " : "") + suggestion)}
                  className={cn(
                    "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full",
                    "bg-surface-container-high border border-white/10",
                    "text-[11px] font-semibold text-foreground",
                    "hover:border-white/20 transition-colors"
                  )}
                >
                  <MapPin className="size-2.5" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-white/10 bg-surface-container-high flex items-center gap-2.5">
          <div className="flex-1 text-[11px]">
            <span
              className={cn(
                "inline-flex items-center gap-1 font-bold",
                isFair ? "text-secondary" : "text-muted-foreground"
              )}
            >
              {isFair ? (
                <Check className="size-3" />
              ) : (
                <ArrowLeftRight className="size-3" />
              )}
              {balanceLabel}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 px-3 text-xs"
          >
            Cancelar
          </Button>
          <Button
            size="sm"
            disabled={!isFair && myStickers.length > 0}
            onClick={handleSend}
            className="h-8 px-3.5 text-xs"
          >
            Enviar proposta
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
