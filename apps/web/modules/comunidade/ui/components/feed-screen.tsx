"use client";

import { useMutation, usePaginatedQuery, useQuery } from "convex/react";
import { Plus, Users } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { cn } from "@workspace/ui/lib/utils";
import { FeedCityFilters } from "./feed-city-filters";

type FeedTab = "profile" | "public" | "feed";

const FEED_TABS: { id: FeedTab; label: string }[] = [
  { id: "profile", label: "Meu perfil" },
  { id: "public", label: "Público" },
  { id: "feed", label: "Feed" },
];

import { ComposerCard } from "./composer-card";
import { CreatePostDialog } from "./create-post-dialog";
import { PostCard, type CommunityPost } from "./post-card";
import { TradeModal } from "./trade-modal";

export function FeedScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<FeedTab>("feed");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [sortBy, setSortBy] = useState<"recent" | "need" | "have">("recent");
  const [tradePost, setTradePost] = useState<CommunityPost | null>(null);
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const cityFilters = useQuery(api.communityPosts.getCityFilterCounts) ?? [];

  const handleTabChange = (tab: FeedTab) => {
    if (tab === "profile") {
      router.push("/dashboard/perfil");
      return;
    }
    setActiveTab(tab);
  };

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

  const selectedCityLabel = cityFilters.find((c) => c.id === selectedCity)?.label ?? "SUA CIDADE";

  return (
    <div className="mx-auto max-w-[420px] space-y-0">
      <div className="px-4 pt-3">
        <div className="flex p-1 bg-surface-container-high rounded-lg border border-white/10">
          {FEED_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={cn(
                "flex-1 px-3 py-2 rounded-md text-sm font-semibold transition-colors",
                activeTab === tab.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {cityFilters.length > 0 && (
        <FeedCityFilters
          cities={cityFilters}
          value={selectedCity}
          onChange={setSelectedCity}
        />
      )}

      <div className="px-4 pt-3 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground font-headline">
            {filteredPosts.length} POSTS · {selectedCityLabel}
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
          postId={tradePost._id}
          authorNick={tradePost.author?.displayNickname ?? "user"}
          authorCity={tradePost.authorCity ?? ""}
          theirStickers={tradePost.stickers.map((s) => ({
            code: s.displayCode,
            flag: s.flagEmoji,
            num: s.displayCode.split("-")[1] || String(s.absoluteNum),
          }))}
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
