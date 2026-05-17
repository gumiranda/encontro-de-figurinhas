"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { Check, MessageCircle, MoreHorizontal, Share2, Star, Swords, Trash2 } from "lucide-react";
import { PostStickersGrid } from "./post-stickers-grid";
import { ReactionRow } from "./reaction-row";
import { CommentsThread } from "./comments-thread";
import { FeedAvatar } from "./feed-avatar";

import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
} from "@workspace/ui/components/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";

type PostSticker = {
  absoluteNum: number;
  displayCode: string;
  flagEmoji: string;
  name: string;
};

type PostAuthor = {
  _id: string;
  nickname: string;
  displayNickname: string;
  avatarSeed: string;
  rating?: number;
};

export type CommunityPost = {
  _id: string;
  type: "need" | "have";
  message?: string;
  createdAt: number;
  stickers: PostSticker[];
  author: PostAuthor | null;
  isOwn: boolean;
};

type PostCardProps = {
  post: CommunityPost;
  onTrade?: () => void;
  onDelete?: () => void;
};

export function PostCard({ post, onTrade, onDelete }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const timeAgo = formatDistanceToNow(post.createdAt, {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="flex-row items-start gap-3 space-y-0 pb-3">
        <FeedAvatar
          seed={post.author?.avatarSeed ?? "anon"}
          size={40}
          fallbackInitials={post.author?.displayNickname?.slice(0, 2).toUpperCase() ?? "??"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="truncate font-semibold text-[13px]">
              @{post.author?.displayNickname ?? "Anônimo"}
            </span>
            {post.author?.rating !== undefined && post.author.rating > 0 && (
              <span className="inline-flex items-center gap-0.5 text-[11px] text-muted-foreground">
                <Star className="size-3 fill-tertiary text-tertiary" />
                {post.author.rating.toFixed(1)}
              </span>
            )}
            {post.isOwn && (
              <span className="px-1.5 py-0.5 rounded bg-primary/15 text-primary font-headline text-[8px] font-bold tracking-widest">
                VOCÊ
              </span>
            )}
            <Badge
              className={cn(
                "text-[9px] px-2 py-0.5 font-headline font-bold tracking-wider inline-flex items-center gap-1",
                post.type === "have"
                  ? "bg-secondary/12 text-secondary border-secondary/30"
                  : "bg-primary/12 text-primary border-primary/30"
              )}
            >
              {post.type === "have" ? (
                <>
                  <Check className="size-2.5" />
                  TENHO
                </>
              ) : (
                <>
                  <Star className="size-2.5" />
                  PRECISO
                </>
              )}
            </Badge>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-muted-foreground">
            <span>{timeAgo}</span>
          </div>
        </div>

        {post.isOwn && onDelete && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="size-8">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="size-4 mr-2" />
                Deletar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        {post.message && (
          <p className="text-[13px] text-foreground leading-relaxed">{post.message}</p>
        )}

        <PostStickersGrid
          stickers={post.stickers}
          postType={post.type}
        />

        <div className="flex items-center justify-between pt-2.5 border-t border-white/10 gap-2 flex-wrap">
          <ReactionRow postId={post._id} />

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setShowComments(!showComments)}
              className="inline-flex items-center gap-1.5 px-2 py-1 text-[11px] font-semibold text-muted-foreground hover:text-foreground"
            >
              <MessageCircle className="size-3.5" />
            </button>

            <button
              type="button"
              className="p-1 text-muted-foreground hover:text-foreground"
            >
              <Share2 className="size-3.5" />
            </button>

            {!post.isOwn && post.type === "need" && (
              <Button
                variant="secondary"
                size="sm"
                className="h-7 px-2.5 text-[11px] gap-1.5"
                onClick={onTrade}
              >
                <Check className="size-3" />
                Eu tenho!
              </Button>
            )}

            {post.isOwn && (
              <Button
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-[11px] border-white/10"
              >
                Editar
              </Button>
            )}
          </div>
        </div>

        {showComments && (
          <CommentsThread postId={post._id} />
        )}
      </CardContent>
    </Card>
  );
}
