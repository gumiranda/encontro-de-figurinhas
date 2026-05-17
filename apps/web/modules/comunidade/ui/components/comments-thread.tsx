"use client";

import { useMutation, usePaginatedQuery } from "convex/react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Star } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import { FeedAvatar } from "./feed-avatar";

interface CommentsThreadProps {
  postId: string;
}

interface CommentData {
  _id: Id<"postComments">;
  message: string;
  createdAt: number;
  author: {
    _id: Id<"users">;
    nickname: string;
    avatarSeed: string;
    rating: number;
  } | null;
}

function CommentItem({ comment }: { comment: CommentData }) {
  const timeAgo = formatDistanceToNow(comment.createdAt, {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <div className="flex gap-2 pt-2.5">
      <div className="flex-shrink-0">
        <FeedAvatar
          seed={comment.author?.avatarSeed ?? "anon"}
          size={26}
          fallbackInitials={comment.author?.nickname?.slice(0, 2).toUpperCase() ?? "??"}
          showRing={false}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-bold">
            @{comment.author?.nickname ?? "Anônimo"}
          </span>

          {comment.author?.rating !== undefined && comment.author.rating > 0 && (
            <span className="text-[10px] text-muted-foreground inline-flex items-center gap-0.5">
              <Star className="size-2.5 fill-tertiary text-tertiary" />
              {comment.author.rating.toFixed(1)}
            </span>
          )}

          <span className="text-[10px] text-muted-foreground ml-auto">
            {timeAgo}
          </span>
        </div>

        <p className="text-xs text-foreground mt-0.5 leading-relaxed">
          {comment.message}
        </p>
      </div>
    </div>
  );
}

export function CommentsThread({ postId }: CommentsThreadProps) {
  const [replyText, setReplyText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.postComments.listComments,
    { postId: postId as Id<"communityPosts"> },
    { initialNumItems: 3 }
  );

  const addComment = useMutation(api.postComments.addComment);

  const comments = (results ?? []) as CommentData[];

  const handleSubmit = async () => {
    if (!replyText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await addComment({
        postId: postId as Id<"communityPosts">,
        message: replyText.trim(),
      });
      setReplyText("");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao comentar");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-2.5 pt-1 border-t border-dashed border-white/10">
      {comments.map((c) => (
        <CommentItem key={c._id} comment={c} />
      ))}

      {status === "CanLoadMore" && (
        <button
          type="button"
          onClick={() => loadMore(5)}
          className="text-primary text-[11px] font-semibold pt-2 pl-8 hover:underline"
        >
          Ver mais comentários →
        </button>
      )}

      <div className="flex gap-2 mt-3 pt-2.5 border-t border-white/10">
        <div className="flex-1 flex gap-1.5">
          <input
            type="text"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Comente ou ofereça uma troca..."
            maxLength={300}
            className={cn(
              "flex-1 bg-surface-container-high border border-white/10 rounded-full",
              "px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:border-primary/50"
            )}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <Button
            size="sm"
            disabled={!replyText.trim() || isSubmitting}
            onClick={handleSubmit}
            className="h-7 px-3 text-[11px]"
          >
            {isSubmitting ? "..." : "Enviar"}
          </Button>
        </div>
      </div>
    </div>
  );
}
