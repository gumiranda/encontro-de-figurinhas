"use client";

import { useMutation, usePaginatedQuery } from "convex/react";
import { MapPin, Plus, Users } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { CreatePostDialog } from "./create-post-dialog";
import { PostCard, type CommunityPost } from "./post-card";

export function FeedScreen() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const { results, status, loadMore } = usePaginatedQuery(
    api.communityPosts.listByCityPaginated,
    {},
    { initialNumItems: 10 }
  );

  const deletePost = useMutation(api.communityPosts.remove);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost({ postId: postId as any });
      toast.success("Post deletado");
    } catch {
      toast.error("Erro ao deletar post");
    }
  };

  const handleTrade = (post: CommunityPost) => {
    toast.info(`Abrindo conversa com @${post.author?.displayNickname ?? "usuário"}`);
  };

  if (status === "LoadingFirstPage") {
    return (
      <div className="space-y-4">
        <FeedHeader onCreateClick={() => setShowCreateDialog(true)} />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  const posts = results as CommunityPost[];

  return (
    <div className="space-y-4">
      <FeedHeader onCreateClick={() => setShowCreateDialog(true)} />

      {posts.length === 0 ? (
        <EmptyFeed onCreateClick={() => setShowCreateDialog(true)} />
      ) : (
        <>
          <div className="space-y-3">
            {posts.map((post) => (
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

      <CreatePostDialog
        open={showCreateDialog}
        onOpenChange={setShowCreateDialog}
      />
    </div>
  );
}

function FeedHeader({ onCreateClick }: { onCreateClick: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="font-headline text-2xl font-bold">Feed da cidade</h1>
        <p className="text-sm text-muted-foreground flex items-center gap-1">
          <MapPin className="size-3.5" />
          Posts de colecionadores na sua cidade
        </p>
      </div>
      <Button onClick={onCreateClick} className="gap-2">
        <Plus className="size-4" />
        Postar
      </Button>
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
