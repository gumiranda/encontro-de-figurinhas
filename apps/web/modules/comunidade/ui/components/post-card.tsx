"use client";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
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
  const timeAgo = formatDistanceToNow(post.createdAt, {
    addSuffix: true,
    locale: ptBR,
  });

  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="flex-row items-start gap-3 space-y-0 pb-3">
        <MatchDicebearAvatar
          seed={post.author?.avatarSeed ?? "anon"}
          size={40}
          fallbackInitials={post.author?.displayNickname?.slice(0, 2).toUpperCase() ?? "??"}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate font-semibold">
              @{post.author?.displayNickname ?? "Anônimo"}
            </span>
            <Badge
              className={cn(
                "text-[10px] px-2 py-0.5",
                post.type === "have"
                  ? "bg-secondary/15 text-secondary border-secondary/30"
                  : "bg-primary/15 text-primary border-primary/30"
              )}
            >
              {post.type === "have" ? "Tenho" : "Preciso"}
            </Badge>
          </div>
          <span className="text-xs text-muted-foreground">{timeAgo}</span>
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

      <CardContent className="space-y-3">
        {post.message && (
          <p className="text-sm text-foreground">{post.message}</p>
        )}

        <div className="flex flex-wrap gap-1.5">
          {post.stickers.map((sticker) => (
            <span
              key={sticker.absoluteNum}
              className={cn(
                "inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-mono",
                post.type === "have"
                  ? "bg-secondary/10 text-secondary"
                  : "bg-primary/10 text-primary"
              )}
              title={sticker.name}
            >
              <span>{sticker.flagEmoji}</span>
              <span>{sticker.displayCode}</span>
            </span>
          ))}
        </div>

        {!post.isOwn && (
          <Button
            variant="outline"
            size="sm"
            className="w-full gap-2 border-white/10 mt-2"
            onClick={onTrade}
          >
            <MessageCircle className="size-4" />
            Propor troca
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
