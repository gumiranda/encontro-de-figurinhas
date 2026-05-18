"use client";

import { useMutation, usePaginatedQuery } from "convex/react";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { cn } from "@workspace/ui/lib/utils";

import { ComposerCard } from "./composer-card";
import { CreatePostDialog } from "./create-post-dialog";
import { PostCard, type CommunityPost } from "./post-card";
import { TradeModal } from "./trade-modal";

export function FeedScreen() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "need" | "have">("recent");
  const [tradePost, setTradePost] = useState<CommunityPost | null>(null);

  const { results, status, loadMore } = usePaginatedQuery(
    api.communityPosts.listByCityPaginated,
    {},
    { initialNumItems: 10 }
  );

  const cityName = (results as any)?.cityName ?? null;

  const deletePost = useMutation(api.communityPosts.remove);
  const createPost = useMutation(api.communityPosts.create);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost({ postId: postId as any });
      toast.success("Post deletado");
    } catch {
      toast.error("Erro ao deletar post");
    }
  };

  const handleTrade = (post: CommunityPost) => {
    setTradePost(post);
  };

  const handlePublish = async (data: { text: string; type: "need" | "have" | "swap" }) => {
    try {
      await createPost({
        type: data.type === "swap" ? "have" : data.type,
        message: data.text,
        stickers: [],
      });
      toast.success("Post publicado!");
    } catch {
      toast.error("Erro ao publicar");
    }
  };

  if (status === "LoadingFirstPage") {
    return (
      <div className="space-y-4 px-4">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const posts = (results ?? []) as CommunityPost[];
  const filteredPosts = posts.filter((p) => {
    if (sortBy === "need" && p.type !== "need") return false;
    if (sortBy === "have" && p.type !== "have") return false;
    return true;
  });

  return (
    <div className="space-y-0">
      <div className="px-4 pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-headline">
            {filteredPosts.length} POSTS · {cityName ?? "SUA CIDADE"}
          </span>
          <div className="flex gap-1 p-1 bg-surface-container-high rounded-lg border border-white/10">
            {(["recent", "need", "have"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSortBy(s)}
                className={cn(
                  "px-2 py-1 rounded text-[10px] font-semibold transition-colors",
                  sortBy === s
                    ? "bg-foreground text-background"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {s === "recent" ? "Recente" : s === "need" ? "Preciso" : "Tenho"}
              </button>
            ))}
          </div>
        </div>

        <ComposerCard
          userNick="user"
          onPublish={handlePublish}
        />

        {filteredPosts.length === 0 ? (
          <EmptyFeed onCreateClick={() => setShowCreateDialog(true)} />
        ) : (
          <>
            <div className="space-y-3">
              {filteredPosts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  onTrade={() => handleTrade(post)}
                  onDelete={post.isOwn ? () => handleDelete(post._id) : undefined}
                />
              ))}
            </div>

            {status === "CanLoadMore" && (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => loadMore(10)}
              >
                Carregar mais
              </Button>
            )}
          </>
        )}
      </div>

      <CreatePostDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />

      {tradePost && (
        <TradeModal
          open={!!tradePost}
          onClose={() => setTradePost(null)}
          authorNick={tradePost.author?.displayNickname ?? "user"}
          authorCity="São Paulo, SP"
          theirStickers={tradePost.stickers.map((s) => ({
            code: s.displayCode,
            flag: s.flagEmoji,
            num: s.displayCode.split("-")[1] || String(s.absoluteNum),
          }))}
          myStickers={[]}
          onSend={(data) => {
            toast.success("Proposta enviada!");
            setTradePost(null);
          }}
        />
      )}
    </div>
  );
}


function EmptyFeed({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-surface-container-low p-10 text-center">
      <div className="mb-4 grid size-16 place-items-center rounded-full bg-primary/10">
        <Users className="size-8 text-primary" />
      </div>
      <h3 className="font-headline text-lg font-semibold">
        Nenhum post ainda
      </h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">
        Seja o primeiro a compartilhar suas figurinhas com a comunidade local.
      </p>
      <Button onClick={onCreateClick} className="mt-4 gap-2">
        <Plus className="size-4" />
        Criar primeiro post
      </Button>
    </div>
  );
}
