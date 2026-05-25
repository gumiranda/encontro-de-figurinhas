"use client";

import { useEffect, useRef, useState } from "react";
import { useMutation } from "convex/react";
import {
  ArrowLeft,
  ChevronRight,
  Edit3,
  ExternalLink,
  MapPin,
  Share2,
  Star,
  Swords,
} from "lucide-react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { cn } from "@workspace/ui/lib/utils";
import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
import { CommunityShell, type CommunityTab } from "./community-shell";
import { CommunityStateBlock } from "./community-state-block";
import { ComposerCard } from "./composer-card";
import { CreatePostDialog } from "./create-post-dialog";
import { FeedCityFilters } from "./feed-city-filters";
import { PostCard, type CommunityPost } from "./post-card";
import { StickerCard, type CommunitySticker } from "./sticker-card";
import { TradeModal } from "./trade-modal";
import {
  type CityFilter,
  type CommunityProfileData,
  type FeedSort,
  useCommunityTabData,
} from "./use-community-tab-data";

type StickerPager = ReturnType<typeof useCommunityTabData>["profileDuplicates"];

type MatchesData = {
  matches: {
    matchedUserId: string;
    tradePointId: string;
  }[];
};

function numberFromCode(displayCode?: string, absoluteNum?: number) {
  if (!displayCode) return String(absoluteNum ?? 0).padStart(3, "0");
  const parsed = Number.parseInt(displayCode.split("-").at(-1) ?? "", 10);
  if (Number.isFinite(parsed)) return String(parsed).padStart(3, "0");
  return String(absoluteNum ?? 0).padStart(3, "0");
}

function displayName(profile: CommunityProfileData | null | undefined) {
  return (
    profile?.displayNickname?.trim() || profile?.nickname || "colecionador"
  );
}

function formatJoinedAt(timestamp?: number) {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "2-digit",
  })
    .format(new Date(timestamp))
    .replace(".", "");
}

function LoadMoreSentinel({
  hasMore,
  isLoading,
  onLoadMore,
}: {
  hasMore: boolean;
  isLoading?: boolean;
  onLoadMore: () => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!hasMore || isLoading || !ref.current) return;
    const node = ref.current;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) onLoadMore();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore]);

  if (!hasMore) return null;

  return (
    <div ref={ref} className="py-3">
      <Button
        variant="outline"
        className="w-full border-outline-variant/70 bg-surface-container"
        disabled={isLoading}
        onClick={onLoadMore}
      >
        {isLoading ? "Carregando..." : "Carregar mais"}
      </Button>
    </div>
  );
}

function ProfileHeroCard({
  profile,
  stickers,
  publicMode,
  onShare,
}: {
  profile: CommunityProfileData;
  stickers: CommunitySticker[];
  publicMode?: boolean;
  onShare?: () => void;
}) {
  const firstSticker = profile.heroSticker ?? stickers[0];
  const name = displayName(profile);
  const joinedAt = formatJoinedAt(profile.createdAt);
  const cardCode = firstSticker?.displayCode ?? "BRA-10";
  const flag = firstSticker?.flagEmoji ?? "🇧🇷";

  return (
    <Card className="overflow-hidden rounded-[1.6rem] border-outline-variant/70 bg-[linear-gradient(160deg,#1d2b52,#11182b_58%,#182017)] p-0">
      <CardContent className="relative p-5">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(149,170,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(149,170,255,0.08)_1px,transparent_1px)] bg-[size:34px_34px]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-sm font-black uppercase tracking-[0.28em] text-tertiary">
                Copa 2026
              </p>
              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl">{flag}</span>
                <span className="font-mono text-4xl font-black tracking-wide">
                  {cardCode}
                </span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs font-bold uppercase tracking-widest text-muted-foreground">
                N°
              </p>
              <p className="mt-2 font-headline text-6xl font-black leading-none text-tertiary">
                {numberFromCode(cardCode, firstSticker?.absoluteNum)}
              </p>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center text-center">
            <div className="rounded-full bg-[conic-gradient(from_180deg,var(--secondary),var(--tertiary),var(--secondary))] p-1 shadow-[0_0_48px_rgba(79,243,37,0.25)]">
              <MatchDicebearAvatar
                seed={profile.avatarSeed ?? profile.nickname ?? name}
                size={104}
                fallbackInitials={name.slice(0, 2).toUpperCase()}
                className="border-4 border-background"
              />
            </div>
            <h2 className="mt-5 max-w-full truncate px-2 font-headline text-4xl font-black leading-none">
              @{name}
            </h2>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-lg text-muted-foreground">
              {profile.city && (
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-5" />
                  {profile.city.name}, {profile.city.state}
                </span>
              )}
              {profile.city && joinedAt && <span>·</span>}
              {joinedAt && <span>Desde {joinedAt}</span>}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-3 overflow-hidden rounded-2xl border border-outline-variant/70 bg-background/35 text-center">
            <div className="border-r border-outline-variant/70 px-2 py-4">
              <p className="font-headline text-4xl font-black text-primary">
                {profile.albumCompletionPct?.toFixed(0) ?? 0}%
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Álbum
              </p>
            </div>
            <div className="border-r border-outline-variant/70 px-2 py-4">
              <p className="font-headline text-4xl font-black text-secondary">
                {profile.totalTrades ?? 0}
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Trocas
              </p>
            </div>
            <div className="px-2 py-4">
              <p className="inline-flex items-center justify-center gap-1 font-headline text-4xl font-black text-tertiary">
                <Star className="size-5 fill-current" />
                {profile.ratingAvg?.toFixed(1) ?? "4.9"}
              </p>
              <p className="mt-1 font-mono text-xs font-bold uppercase tracking-[0.22em] text-muted-foreground">
                Reputação
              </p>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <Button
              className="h-16 flex-1 gap-3 rounded-2xl bg-primary text-lg font-bold text-primary-foreground hover:bg-primary/90"
              onClick={onShare}
              disabled={!publicMode && profile.isProfilePublic === false}
            >
              <Share2 className="size-6" />
              Compartilhar perfil
            </Button>
            {!publicMode && (
              <Button
                variant="outline"
                size="icon"
                className="size-16 rounded-2xl border-outline-variant/70 bg-background/35"
              >
                <Edit3 className="size-6" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StickerGridPanel({
  title,
  subtitle,
  stickers,
  totalCount,
  hasMore,
  isLoadingMore,
  onLoadMore,
}: {
  title: string;
  subtitle: string;
  stickers: CommunitySticker[];
  totalCount: number;
  hasMore?: boolean;
  isLoadingMore?: boolean;
  onLoadMore?: () => void;
}) {
  return (
    <Card className="rounded-[1.5rem] border-outline-variant/70 bg-surface-container">
      <CardContent className="p-4">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h3 className="font-headline text-2xl font-black">{title}</h3>
            <p className="mt-1 text-lg text-muted-foreground">{subtitle}</p>
          </div>
          <span className="font-mono text-sm font-bold text-muted-foreground">
            {totalCount}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-3 lg:grid-cols-6 xl:grid-cols-7">
          {stickers.map((sticker) => (
            <StickerCard
              key={`${sticker.absoluteNum}-${sticker.displayCode}`}
              sticker={sticker}
              variant="duplicate"
            />
          ))}
        </div>
        {onLoadMore && (
          <LoadMoreSentinel
            hasMore={hasMore ?? false}
            isLoading={isLoadingMore}
            onLoadMore={onLoadMore}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ProfileTab({
  profile,
  duplicates,
}: {
  profile: CommunityProfileData | null | undefined;
  duplicates: StickerPager;
}) {
  if (profile === undefined || duplicates.isLoading) {
    return <CommunityStateBlock loading title="Carregando perfil" />;
  }

  if (profile === null) {
    return (
      <CommunityStateBlock
        title="Complete seu perfil"
        description="Finalize cadastro e figurinhas para entrar na comunidade."
      />
    );
  }

  const profileUrl = `https://figurinhafacil.com.br/u/${profile.nickname}`;

  const shareProfile = () => {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`Veja meu perfil: ${profileUrl}`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <ProfileHeroCard
        profile={profile}
        stickers={duplicates.stickers}
        onShare={shareProfile}
      />

      <Card className="rounded-2xl border-primary/35 bg-surface-container">
        <CardContent className="flex items-center gap-4 p-4">
          <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
            <ExternalLink className="size-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-headline text-lg font-black">
              Como outros veem seu perfil
            </p>
            <p className="truncate font-mono text-sm font-bold text-muted-foreground">
              figurinhafacil.com.br/u/{profile.nickname}
            </p>
          </div>
          <ChevronRight className="size-6 text-muted-foreground" />
        </CardContent>
      </Card>

      <Card className="rounded-2xl border-outline-variant/70 bg-surface-container">
        <CardContent className="p-5">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="font-headline text-2xl font-black">
              Progresso do álbum
            </h3>
            <span className="font-mono text-lg font-black text-muted-foreground">
              {profile.albumOwnedCount} / {profile.albumTotal}
            </span>
          </div>
          <div className="flex items-end gap-4">
            <p className="font-headline text-6xl font-black text-primary">
              {profile.albumCompletionPct?.toFixed(1) ?? 0}%
            </p>
            <p className="pb-2 text-xl text-muted-foreground">colado</p>
          </div>
          <Progress
            value={profile.albumCompletionPct ?? 0}
            className="mt-5 h-3"
          />
        </CardContent>
      </Card>

      <StickerGridPanel
        title="Repetidas para troca"
        subtitle={`${profile.duplicatesCount} disponíveis · toque para detalhes`}
        stickers={duplicates.stickers}
        totalCount={duplicates.totalCount}
        hasMore={duplicates.hasMore}
        isLoadingMore={duplicates.isLoadingMore}
        onLoadMore={duplicates.loadMore}
      />
    </div>
  );
}

function PublicTab({
  matches,
  publicProfile,
  setActiveTab,
}: {
  matches: MatchesData | undefined;
  publicProfile: CommunityProfileData | null | undefined;
  setActiveTab: (tab: CommunityTab) => void;
}) {
  if (matches === undefined || publicProfile === undefined) {
    return <CommunityStateBlock loading title="Buscando melhor match" />;
  }

  if (!publicProfile) {
    return (
      <div className="space-y-5 p-4 lg:p-6">
        <button
          type="button"
          onClick={() => setActiveTab("profile")}
          className="inline-flex items-center gap-3 text-lg font-bold text-muted-foreground"
        >
          <ArrowLeft className="size-5" />
          Voltar ao meu perfil
        </button>
        <CommunityStateBlock
          title="Nenhum match disponível"
          description="Quando aparecer alguém compatível, o perfil público entra aqui."
        />
      </div>
    );
  }

  const stickerPage = publicProfile.stickersPage;
  if (!matches || !stickerPage) {
    return <CommunityStateBlock loading title="Carregando perfil público" />;
  }

  return (
    <div className="space-y-5 p-4 lg:p-6">
      <button
        type="button"
        onClick={() => setActiveTab("profile")}
        className="inline-flex items-center gap-3 text-lg font-bold text-muted-foreground"
      >
        <ArrowLeft className="size-5" />
        Voltar ao meu perfil
      </button>

      <Card className="rounded-[1.6rem] border-0 bg-[linear-gradient(90deg,rgba(79,243,37,0.22),rgba(13,18,35,0.96))]">
        <CardContent className="flex items-center gap-5 p-5">
          <div className="grid size-16 place-items-center rounded-2xl bg-secondary/20 text-secondary">
            <Swords className="size-8" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-headline text-2xl font-black">
              <span className="text-secondary">
                {matches.matches.length} matches
              </span>{" "}
              com você
            </p>
            <p className="mt-1 text-lg text-muted-foreground">
              {(publicProfile.distanceKm ?? 0).toFixed(1)} km de você ·{" "}
              {publicProfile.totalTrades} trocas
            </p>
          </div>
          <Button className="h-14 rounded-2xl bg-secondary px-7 text-xl font-black text-secondary-foreground hover:bg-secondary/90">
            Ver
          </Button>
        </CardContent>
      </Card>

      <ProfileHeroCard
        profile={{
          ...publicProfile,
          nickname: publicProfile.displayNickname,
        }}
        stickers={stickerPage.stickers}
        publicMode
      />

      <StickerGridPanel
        title="Repetidas para troca"
        subtitle={`${publicProfile.duplicatesCount} disponíveis`}
        stickers={stickerPage.stickers}
        totalCount={stickerPage.totalCount}
      />
    </div>
  );
}

function FeedTabView({
  data,
  profile,
  selectedCity,
  setSelectedCity,
  feedSort,
  setFeedSort,
  onCreatePost,
  onTrade,
  onDelete,
}: {
  data: ReturnType<typeof useCommunityTabData>["feed"];
  profile: CommunityProfileData | null | undefined;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  feedSort: FeedSort;
  setFeedSort: (sort: FeedSort) => void;
  onCreatePost: () => void;
  onTrade: (post: CommunityPost) => void;
  onDelete: (postId: string) => void;
}) {
  const selectedCityLabel =
    data.cityFilters.find((c: CityFilter) => c.id === selectedCity)?.label ??
    "São Paulo, SP";
  const userNick = displayName(profile);
  const userAvatar = profile?.avatarSeed;

  return (
    <>
      {data.cityFilters.length > 0 && (
        <FeedCityFilters
          cities={data.cityFilters}
          value={selectedCity}
          onChange={setSelectedCity}
        />
      )}

      <div className="space-y-5 p-4 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-sm font-black uppercase tracking-[0.22em] text-muted-foreground">
            {data.posts.length} posts · {selectedCityLabel}
          </span>
          <div className="flex rounded-xl border border-outline-variant/70 bg-surface-container-high p-1">
            {(["recent", "need", "have"] as const).map((sort) => (
              <button
                key={sort}
                type="button"
                onClick={() => setFeedSort(sort)}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-bold transition-colors",
                  feedSort === sort
                    ? "bg-[#e4e7fb] text-background"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {sort === "recent"
                  ? "Recente"
                  : sort === "need"
                    ? "Preciso"
                    : "Tenho"}
              </button>
            ))}
          </div>
        </div>

        <ComposerCard
          userNick={userNick}
          userAvatar={userAvatar}
          onPublish={onCreatePost}
          onOpenCreate={onCreatePost}
        />

        {data.status === "LoadingFirstPage" ? (
          <CommunityStateBlock loading title="Carregando posts" />
        ) : data.posts.length === 0 ? (
          <CommunityStateBlock
            title="Nenhum post nessa seleção"
            description="Troque o filtro ou publique uma nova busca."
          />
        ) : (
          <div className="space-y-5">
            {data.posts.map((post: CommunityPost) => (
              <PostCard
                key={post._id}
                post={post}
                onTrade={() => onTrade(post)}
                onDelete={post.isOwn ? () => onDelete(post._id) : undefined}
              />
            ))}
          </div>
        )}

        {data.status === "CanLoadMore" && (
          <Button
            variant="outline"
            className="w-full border-outline-variant/70 bg-surface-container"
            onClick={() => data.loadMore(10)}
          >
            Carregar mais posts
          </Button>
        )}
      </div>
    </>
  );
}

export function FeedScreen() {
  const [activeTab, setActiveTab] = useState<CommunityTab>("feed");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [feedSort, setFeedSort] = useState<FeedSort>("recent");
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [tradePost, setTradePost] = useState<CommunityPost | null>(null);
  const data = useCommunityTabData({ activeTab, selectedCity, feedSort });

  const deletePost = useMutation(api.communityPosts.remove);

  const handleDelete = async (postId: string) => {
    try {
      await deletePost({ postId: postId as Id<"communityPosts"> });
      toast.success("Post deletado");
    } catch {
      toast.error("Erro ao deletar post");
    }
  };

  return (
    <CommunityShell activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === "profile" && (
        <ProfileTab
          profile={data.profile}
          duplicates={data.profileDuplicates}
        />
      )}

      {activeTab === "public" && (
        <PublicTab
          matches={data.matches}
          publicProfile={data.publicProfile}
          setActiveTab={setActiveTab}
        />
      )}

      {activeTab === "feed" && (
        <FeedTabView
          data={data.feed}
          profile={data.profile}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          feedSort={feedSort}
          setFeedSort={setFeedSort}
          onCreatePost={() => setShowCreateDialog(true)}
          onTrade={setTradePost}
          onDelete={handleDelete}
        />
      )}

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
            num: numberFromCode(s.displayCode, s.absoluteNum),
            rare: s.rare,
          }))}
          onSend={() => {
            toast.success("Proposta enviada!");
            setTradePost(null);
          }}
        />
      )}
    </CommunityShell>
  );
}
