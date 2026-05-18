"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Search, Check, Calendar, Paperclip } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card } from "@workspace/ui/components/card";
import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";

type PostType = "need" | "have" | "swap";

interface ComposerCardProps {
  userNick: string;
  userAvatar?: string;
  onPublish: (data: { text: string; type: PostType }) => void;
}

const POST_TYPES: { id: PostType; label: string; icon: typeof Search }[] = [
  { id: "need", label: "Preciso", icon: Search },
  { id: "have", label: "Tenho", icon: Check },
  { id: "swap", label: "Encontro", icon: Calendar },
];

export function ComposerCard({ userNick, userAvatar, onPublish }: ComposerCardProps) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [type, setType] = useState<PostType>("need");

  const handlePublish = () => {
    if (!text.trim()) return;
    onPublish({ text: text.trim(), type });
    setText("");
    setOpen(false);
  };

  const handleCancel = () => {
    setText("");
    setOpen(false);
  };

  if (!open) {
    return (
      <Card className="p-3 border-white/10 bg-surface-container">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="w-full flex items-center gap-2.5 text-left"
        >
          <MatchDicebearAvatar
            seed={userAvatar || userNick}
            size={36}
            fallbackInitials={userNick.slice(0, 2).toUpperCase()}
          />
          <div
            className={cn(
              "flex-1 bg-surface-container-high border border-white/10 rounded-full",
              "px-3.5 py-2.5 text-muted-foreground text-sm"
            )}
          >
            Quais figurinhas você precisa, @{userNick}?
          </div>
        </button>
      </Card>
    );
  }

  return (
    <Card className="p-3 border-white/10 bg-surface-container">
      <div className="flex gap-2.5">
        <MatchDicebearAvatar
          seed={userAvatar || userNick}
          size={36}
          fallbackInitials={userNick.slice(0, 2).toUpperCase()}
        />
        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Conte o que você precisa ou tem para trocar..."
          className={cn(
            "flex-1 bg-surface-container-high border border-white/10 rounded-xl",
            "px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground",
            "focus:outline-none focus:border-primary/50",
            "min-h-[70px] resize-y"
          )}
        />
      </div>

      <div className="flex flex-wrap gap-1.5 mt-2.5">
        {POST_TYPES.map((t) => {
          const Icon = t.icon;
          const isSelected = type === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setType(t.id)}
              className={cn(
                "inline-flex items-center gap-1.5 h-7 px-2.5",
                "rounded-lg text-[11px] font-semibold",
                "transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground border border-primary"
                  : "bg-transparent text-muted-foreground border border-white/10 hover:border-white/20"
              )}
            >
              <Icon className="size-3" />
              {t.label}
            </button>
          );
        })}

        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1.5 h-7 px-2.5 ml-auto",
            "rounded-lg text-[11px] font-semibold",
            "bg-transparent text-muted-foreground border border-dashed border-white/10",
            "hover:border-white/20"
          )}
        >
          <Paperclip className="size-3" />
          Anexar figurinhas
        </button>
      </div>

      <div className="flex gap-1.5 mt-2.5 justify-end">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCancel}
          className="h-8 px-3 text-xs"
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          disabled={!text.trim()}
          onClick={handlePublish}
          className="h-8 px-3.5 text-xs"
        >
          Publicar
        </Button>
      </div>
    </Card>
  );
}
