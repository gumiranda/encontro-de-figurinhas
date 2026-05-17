"use client";

import { useState } from "react";
import { cn } from "@workspace/ui/lib/utils";
import { Star, Check } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";

export interface Comment {
  id: string;
  nick: string;
  text: string;
  when: string;
  rating?: number;
  online?: boolean;
  hasMatch?: boolean;
  isMe?: boolean;
}

interface CommentsThreadProps {
  comments: Comment[];
  currentUserNick: string;
  currentUserAvatar?: string;
  onReply?: (text: string) => void;
}

function CommentItem({ comment }: { comment: Comment }) {
  return (
    <div className="flex gap-2 pt-2.5">
      <div className="relative flex-shrink-0">
        <MatchDicebearAvatar
          seed={comment.nick}
          size={26}
          fallbackInitials={comment.nick.slice(0, 2).toUpperCase()}
        />
        {comment.online && (
          <span className="absolute -right-0.5 -bottom-0.5 size-2 rounded-full bg-secondary border-2 border-surface-container" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold">@{comment.nick}</span>

          {comment.isMe && (
            <span className="px-1 py-px rounded bg-primary/15 text-primary font-headline text-[7px] font-bold tracking-widest">
              VOCÊ
            </span>
          )}

          {comment.rating && (
            <span className="text-[10px] text-muted-foreground inline-flex items-center gap-0.5">
              <Star className="size-2.5 fill-tertiary text-tertiary" />
              {comment.rating}
            </span>
          )}

          {comment.hasMatch && (
            <span className="inline-flex items-center gap-1 px-1.5 py-px rounded-full bg-secondary/10 text-secondary font-headline text-[8px] font-bold tracking-widest">
              <Check className="size-2" /> MATCH
            </span>
          )}

          <span className="text-[10px] text-muted-foreground ml-auto">
            {comment.when}
          </span>
        </div>

        <p className="text-xs text-foreground mt-0.5 leading-relaxed">
          {comment.text}
        </p>

        <div className="flex gap-3 mt-1">
          <button
            type="button"
            className="text-[10px] font-semibold text-muted-foreground hover:text-foreground"
          >
            Responder
          </button>
          {!comment.isMe && (
            <button
              type="button"
              className="text-[10px] font-semibold text-primary hover:text-primary/80"
            >
              Mensagem privada
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function CommentsThread({
  comments,
  currentUserNick,
  currentUserAvatar,
  onReply,
}: CommentsThreadProps) {
  const [expanded, setExpanded] = useState(false);
  const [replyText, setReplyText] = useState("");

  if (comments.length === 0 && !expanded) return null;

  const visible = expanded ? comments : comments.slice(0, 2);
  const hiddenCount = comments.length - 2;

  const handleSubmit = () => {
    if (!replyText.trim()) return;
    onReply?.(replyText.trim());
    setReplyText("");
  };

  return (
    <div className="mt-2.5 pt-1 border-t border-dashed border-white/10">
      {visible.map((c) => (
        <CommentItem key={c.id} comment={c} />
      ))}

      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="text-primary text-[11px] font-semibold pt-2 pl-8 hover:underline"
        >
          Ver mais {hiddenCount} comentário{hiddenCount > 1 ? "s" : ""} →
        </button>
      )}

      {expanded && (
        <div className="flex gap-2 mt-3 pt-2.5 border-t border-white/10">
          <MatchDicebearAvatar
            seed={currentUserAvatar || currentUserNick}
            size={26}
            fallbackInitials={currentUserNick.slice(0, 2).toUpperCase()}
          />
          <div className="flex-1 flex gap-1.5">
            <input
              type="text"
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Comente ou ofereça uma troca..."
              className={cn(
                "flex-1 bg-surface-container-high border border-white/10 rounded-full",
                "px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground",
                "focus:outline-none focus:border-primary/50"
              )}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <Button
              size="sm"
              disabled={!replyText.trim()}
              onClick={handleSubmit}
              className="h-7 px-3 text-[11px]"
            >
              Enviar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
