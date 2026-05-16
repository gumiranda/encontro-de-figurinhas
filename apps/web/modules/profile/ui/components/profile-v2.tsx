"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useState } from "react";
import {
  ArrowLeftRight,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Copy,
  ExternalLink,
  Globe2,
  History,
  Lock,
  Mail,
  MapPin,
  MessageCircle,
  QrCode,
  Repeat2,
  Search,
  Share2,
  Star,
} from "lucide-react";
import { toast } from "sonner";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Switch } from "@workspace/ui/components/switch";
import { Progress } from "@workspace/ui/components/progress";
import { QRCode } from "@workspace/ui/components/kibo-ui/qr-code";
import { Skeleton } from "@workspace/ui/components/skeleton";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";

import {
  AchievementsModule,
  deriveAchievements,
} from "./achievements-module";
import { HeroVariantSelector } from "./hero-variant-selector";
import { ProfileHero, type HeroVariant } from "./profile-hero";
import { TopNationsModule, type NationProgress } from "./top-nations-module";

export type ProfileStickerItem = {
  absoluteNum: number;
  displayCode: string;
  flagEmoji: string;
  name: string;
  isGolden: boolean;
  isLegend: boolean;
  quantity: number;
};

type ProfileCity = {
  name: string;
  state: string;
} | null;

export type ProfileSettingsV2 = {
  nickname: string;
  displayNickname?: string;
  avatarSeed?: string;
  isProfilePublic: boolean;
  acceptsMail: boolean;
  isVerified: boolean;
  city: ProfileCity;
  createdAt: number;
  albumCompletionPct: number;
  albumOwnedCount: number;
  albumTotal: number;
  totalTrades: number;
  ratingAvg?: number;
  ratingCount: number;
  duplicatesCount: number;
  missingCount: number;
  duplicatesSample: ProfileStickerItem[];
  missingSample: ProfileStickerItem[];
  topNations?: NationProgress[];
  cardCode?: string;
  cardNumber?: string;
  flag?: string;
};

export type PublicProfileV2 = Omit<
  ProfileSettingsV2,
  "isProfilePublic" | "avatarSeed"
> & {
  avatarSeed: string;
};

export type ProfileTradeRow = {
  _id: string;
  status: string;
  role: "incoming" | "outgoing";
  createdAt: number;
  confirmedAt: number | null;
  stickersIGive: number[];
  stickersIReceive: number[];
  counterparty: {
    name: string;
    nickname: string | null;
    totalTrades: number;
  };
  tradePoint: {
    name: string;
  } | null;
};

type ToggleHandler = (checked: boolean) => void | Promise<void>;

function displayName(profile: { displayNickname?: string; nickname: string }) {
  return profile.displayNickname?.trim() || profile.nickname;
}

function initialsFromName(name: string) {
  const parts = name
    .replace(/^@/, "")
    .split(/[._\-\s]+/)
    .filter(Boolean);
  return (parts[0]?.[0] ?? "?").concat(parts[1]?.[0] ?? "").toUpperCase();
}

function formatJoinedAt(timestamp: number | undefined) {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  })
    .format(new Date(timestamp))
    .replace(".", "");
}

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
  })
    .format(new Date(timestamp))
    .replace(".", "");
}

function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

function stickerRemaining(totalCount: number, stickers: ProfileStickerItem[]) {
  const visibleCount = stickers.reduce((sum, item) => sum + item.quantity, 0);
  return Math.max(0, totalCount - visibleCount);
}

function buildProfileShareText({
  displayNickname,
  duplicatesCount,
  albumCompletionPct,
  url,
}: {
  displayNickname: string;
  duplicatesCount: number;
  albumCompletionPct: number;
  url: string;
}) {
  return [
    `Figurinhas do @${displayNickname}`,
    `Álbum: ${formatPercent(albumCompletionPct)} completo`,
    `${duplicatesCount} repetidas disponíveis`,
    "",
    `Veja: ${url}`,
  ].join("\n");
}

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    toast.success("Link copiado");
  } catch {
    toast.error("Não foi possível copiar o link");
  }
}

export function ProfilePageSkeletonV2() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <Card className="overflow-hidden border-white/10 bg-surface-container-high">
        <CardHeader className="flex flex-row items-start gap-4">
          <Skeleton className="size-20 rounded-full" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <Skeleton className="h-9 w-full max-w-sm" />
          </div>
        </CardHeader>
      </Card>
      <Card className="border-white/10 bg-surface-container">
        <CardContent className="space-y-4 p-5">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-full" />
          <div className="grid gap-3 sm:grid-cols-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileAvatar({
  seed,
  name,
  isPublic,
}: {
  seed: string;
  name: string;
  isPublic?: boolean;
}) {
  return (
    <div
      className={cn(
        "shrink-0 rounded-full p-[3px] shadow-[0_0_32px_rgba(149,170,255,0.25)]",
        isPublic
          ? "bg-[radial-gradient(circle,#ffc965_0%,#ecaa00_100%)]"
          : "bg-[radial-gradient(circle,#95aaff_0%,#3766ff_100%)]"
      )}
    >
      <MatchDicebearAvatar
        seed={seed}
        size={80}
        fallbackInitials={initialsFromName(name)}
        className="border-2 border-background"
      />
    </div>
  );
}

function RatingBadge({
  ratingAvg,
  ratingCount,
}: {
  ratingAvg?: number;
  ratingCount: number;
}) {
  if (ratingAvg === undefined || ratingCount <= 0) {
    return (
      <Badge variant="outline" className="border-white/10 text-muted-foreground">
        Sem avaliações
      </Badge>
    );
  }

  return (
    <Badge className="gap-1 border-tertiary/30 bg-tertiary/15 text-tertiary">
      <Star className="size-3 fill-current" />
      {ratingAvg.toFixed(1)}
      <span className="text-tertiary/75">· {ratingCount}</span>
    </Badge>
  );
}

function ProfileMetric({
  label,
  value,
  tone = "primary",
}: {
  label: string;
  value: string | number;
  tone?: "primary" | "secondary" | "tertiary";
}) {
  const toneClass = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
  }[tone];

  return (
    <div className="min-w-0 text-center">
      <p className={cn("font-headline text-xl font-bold", toneClass)}>{value}</p>
      <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

function HeroMeta({
  city,
  createdAt,
}: {
  city: ProfileCity;
  createdAt: number;
}) {
  const joinedAt = formatJoinedAt(createdAt);

  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {city && (
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {city.name}, {city.state}
        </span>
      )}
      {joinedAt && (
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          desde {joinedAt}
        </span>
      )}
    </div>
  );
}

function PrivateHero({
  profile,
  profileUrl,
  onCopyLink,
  onShare,
}: {
  profile: ProfileSettingsV2;
  profileUrl: string;
  onCopyLink: () => void;
  onShare: () => void;
}) {
  const name = displayName(profile);
  const avatarSeed = profile.avatarSeed ?? profile.nickname;

  return (
    <Card className="overflow-hidden border-white/10 bg-surface-container-high shadow-xl">
      <CardHeader className="gap-5 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
          <ProfileAvatar seed={avatarSeed} name={name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="truncate font-headline text-2xl">
                @{name}
              </CardTitle>
              {profile.isVerified && (
                <BadgeCheck className="size-5 fill-primary text-background" />
              )}
              <Badge
                variant="outline"
                className={cn(
                  "gap-1 border-white/10",
                  profile.isProfilePublic
                    ? "text-secondary"
                    : "text-muted-foreground"
                )}
              >
                {profile.isProfilePublic ? (
                  <Globe2 className="size-3" />
                ) : (
                  <Lock className="size-3" />
                )}
                {profile.isProfilePublic ? "Público" : "Privado"}
              </Badge>
            </div>
            <HeroMeta city={profile.city} createdAt={profile.createdAt} />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <RatingBadge
                ratingAvg={profile.ratingAvg}
                ratingCount={profile.ratingCount}
              />
              <Badge variant="outline" className="border-white/10">
                {profile.totalTrades} trocas
              </Badge>
              {profile.acceptsMail && (
                <Badge className="gap-1 bg-secondary/15 text-secondary">
                  <Mail className="size-3" />
                  Correio
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            onClick={onShare}
            disabled={!profile.isProfilePublic}
          >
            <Share2 className="size-4" />
            Compartilhar meu perfil
          </Button>
          <Button
            variant="outline"
            className="gap-2 border-white/10 bg-white/5"
            onClick={onCopyLink}
            disabled={!profile.isProfilePublic}
          >
            <Copy className="size-4" />
            Copiar link
          </Button>
          {profile.isProfilePublic ? (
            <Button
              variant="outline"
              className="gap-2 border-white/10 bg-white/5"
              asChild
            >
              <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="size-4" />
                Abrir
              </a>
            </Button>
          ) : (
            <Button
              variant="outline"
              className="gap-2 border-white/10 bg-white/5"
              disabled
            >
              <ExternalLink className="size-4" />
              Abrir
            </Button>
          )}
        </div>
      </CardHeader>
    </Card>
  );
}

function PublicHero({
  profile,
}: {
  profile: PublicProfileV2;
}) {
  const name = displayName(profile);

  return (
    <Card className="overflow-hidden border-white/10 bg-surface-container-high text-center shadow-xl">
      <CardHeader className="items-center gap-4 p-6">
        <ProfileAvatar seed={profile.avatarSeed} name={name} isPublic />
        <div className="min-w-0">
          <div className="flex items-center justify-center gap-2">
            <CardTitle className="truncate font-headline text-2xl">
              @{name}
            </CardTitle>
            {profile.isVerified && (
              <BadgeCheck className="size-5 fill-primary text-background" />
            )}
          </div>
          <div className="flex justify-center">
            <HeroMeta city={profile.city} createdAt={profile.createdAt} />
          </div>
        </div>
        <div className="grid w-full grid-cols-3 gap-3">
          <ProfileMetric
            label={profile.ratingCount === 1 ? "review" : "reviews"}
            value={profile.ratingAvg?.toFixed(1) ?? "—"}
            tone="tertiary"
          />
          <ProfileMetric
            label="trocas"
            value={profile.totalTrades}
            tone="secondary"
          />
          <ProfileMetric
            label="álbum"
            value={formatPercent(profile.albumCompletionPct)}
          />
        </div>
      </CardHeader>
    </Card>
  );
}

export function ProfileProgressCard({
  albumCompletionPct,
  albumOwnedCount,
  albumTotal,
  duplicatesCount,
  missingCount,
}: {
  albumCompletionPct: number;
  albumOwnedCount: number;
  albumTotal: number;
  duplicatesCount: number;
  missingCount: number;
}) {
  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="font-headline text-base">
              Álbum Copa 2026
            </CardTitle>
            <CardDescription>Progresso sincronizado</CardDescription>
          </div>
          <Badge className="gap-1 bg-secondary/15 text-secondary">
            <BookOpen className="size-3" />
            {formatPercent(albumCompletionPct)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between font-mono text-xs text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">
              {albumOwnedCount}
            </span>
            /{albumTotal}
          </span>
          <span>{formatPercent(albumCompletionPct)} completo</span>
        </div>
        <Progress value={albumCompletionPct} className="h-3" />
        <div className="grid gap-2 sm:grid-cols-3">
          <StatPill
            icon={<BookOpen className="size-4" />}
            label="Coladas"
            value={albumOwnedCount}
          />
          <StatPill
            icon={<Repeat2 className="size-4" />}
            label="Repetidas"
            value={duplicatesCount}
            tone="secondary"
          />
          <StatPill
            icon={<Search className="size-4" />}
            label="Faltando"
            value={missingCount}
            tone="tertiary"
          />
        </div>
      </CardContent>
    </Card>
  );
}

function StatPill({
  icon,
  label,
  value,
  tone = "primary",
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone?: "primary" | "secondary" | "tertiary";
}) {
  const toneClass = {
    primary: "text-primary",
    secondary: "text-secondary",
    tertiary: "text-tertiary",
  }[tone];

  return (
    <div className="rounded-lg border border-white/10 bg-surface-container-high p-3">
      <div className="mb-1.5 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        <span className={toneClass}>{icon}</span>
        {label}
      </div>
      <p className={cn("font-headline text-xl font-bold", toneClass)}>
        {value}
      </p>
    </div>
  );
}

function StickerTile({
  sticker,
  kind,
}: {
  sticker: ProfileStickerItem;
  kind: "duplicate" | "missing";
}) {
  const isLegend = sticker.isLegend || sticker.isGolden;
  return (
    <div
      className={cn(
        "relative flex aspect-[3/4] min-h-0 flex-col overflow-hidden rounded-lg border p-2 transition-transform hover:-translate-y-0.5",
        kind === "missing"
          ? "border-dashed border-primary/30 bg-surface-container-low"
          : "border-secondary/25 bg-secondary/10",
        isLegend && "border-tertiary/40 bg-tertiary/10"
      )}
      title={`${sticker.displayCode} · ${sticker.name}`}
    >
      {kind === "duplicate" && sticker.quantity > 1 && (
        <span
          className={cn(
            "absolute right-1.5 top-1.5 rounded-full px-1.5 py-0.5 font-mono text-[10px] font-bold",
            isLegend
              ? "bg-tertiary text-tertiary-foreground"
              : "bg-secondary text-secondary-foreground"
          )}
        >
          ×{sticker.quantity}
        </span>
      )}
      <div className="grid flex-1 place-items-center rounded-md bg-surface-container-high">
        <span className="text-xl" aria-hidden>
          {sticker.flagEmoji}
        </span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-1 font-headline text-[11px] font-bold">
        <span
          className={cn(
            "truncate",
            kind === "missing"
              ? "text-primary"
              : isLegend
                ? "text-tertiary"
                : "text-secondary"
          )}
        >
          {sticker.displayCode}
        </span>
        <span className="shrink-0 text-xs" aria-hidden>
          {kind === "missing" ? "?" : sticker.flagEmoji}
        </span>
      </div>
    </div>
  );
}

export function ProfileStickerGridPanel({
  title,
  description,
  stickers,
  totalCount,
  kind,
}: {
  title: string;
  description: string;
  stickers: ProfileStickerItem[];
  totalCount: number;
  kind: "duplicate" | "missing";
}) {
  const remaining = stickerRemaining(totalCount, stickers);

  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2 font-headline text-lg">
              {kind === "duplicate" ? (
                <Repeat2 className="size-5 text-secondary" />
              ) : (
                <Search className="size-5 text-primary" />
              )}
              {title}
            </CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge
            variant="outline"
            className={cn(
              "font-mono",
              kind === "duplicate" ? "text-secondary" : "text-primary"
            )}
          >
            {totalCount}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {stickers.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-muted-foreground">
            {kind === "duplicate"
              ? "Nenhuma repetida disponível."
              : "Nenhuma faltante cadastrada."}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {stickers.map((sticker) => (
              <StickerTile
                key={`${sticker.absoluteNum}-${sticker.displayCode}`}
                sticker={sticker}
                kind={kind}
              />
            ))}
            {remaining > 0 && (
              <div className="grid aspect-[3/4] place-items-center rounded-lg border border-dashed border-white/15 bg-white/5 font-mono text-sm font-bold text-muted-foreground">
                +{remaining}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TradeHistoryPanel({
  trades,
  isLoading,
}: {
  trades: ProfileTradeRow[];
  isLoading: boolean;
}) {
  const visibleTrades = trades.slice(0, 5);

  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 font-headline text-lg">
          <History className="size-5 text-tertiary" />
          Trocas recentes
        </CardTitle>
        <CardDescription>Histórico dos últimos movimentos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {isLoading ? (
          <>
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </>
        ) : visibleTrades.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 p-5 text-sm text-muted-foreground">
            Nenhuma troca recente.
          </div>
        ) : (
          visibleTrades.map((trade) => (
            <div
              key={trade._id}
              className="flex items-center gap-3 rounded-lg border border-white/10 bg-surface-container-high p-3"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-full bg-primary/15 font-headline text-xs font-bold text-primary">
                {initialsFromName(
                  trade.counterparty.nickname ?? trade.counterparty.name
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-headline text-sm font-semibold">
                  {trade.counterparty.nickname ?? trade.counterparty.name}
                </p>
                <p className="font-mono text-xs text-muted-foreground">
                  <span className="text-secondary">
                    +{trade.stickersIReceive.length}
                  </span>
                  {" · "}
                  <span>-{trade.stickersIGive.length}</span>
                  {trade.tradePoint ? ` · ${trade.tradePoint.name}` : ""}
                </p>
              </div>
              <div className="text-right">
                <Badge variant="outline" className="border-white/10 text-[10px]">
                  {trade.status}
                </Badge>
                <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                  {formatDate(trade.confirmedAt ?? trade.createdAt)}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function ProfileSettingsCard({
  isPublic,
  acceptsMail,
  isUpdating,
  onTogglePublic,
  onToggleMail,
}: {
  isPublic: boolean;
  acceptsMail: boolean;
  isUpdating: boolean;
  onTogglePublic: ToggleHandler;
  onToggleMail: ToggleHandler;
}) {
  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader>
        <CardTitle className="font-headline text-base">Configurações</CardTitle>
        <CardDescription>Controle visibilidade e logística</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="public-profile">Perfil público</Label>
            <p className="text-sm text-muted-foreground">
              Permite que outros colecionadores vejam suas listas por link.
            </p>
          </div>
          <Switch
            id="public-profile"
            checked={isPublic}
            disabled={isUpdating}
            onCheckedChange={(checked) => void onTogglePublic(checked)}
          />
        </div>
        <div className="border-t border-outline-variant" />
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-1">
            <Label htmlFor="accepts-mail">Aceito trocas por correio</Label>
            <p className="text-sm text-muted-foreground">
              Sinaliza disponibilidade fora da sua cidade.
            </p>
          </div>
          <Switch
            id="accepts-mail"
            checked={acceptsMail}
            disabled={isUpdating}
            onCheckedChange={(checked) => void onToggleMail(checked)}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function ProfileLinkCard({
  profileUrl,
  displayNickname,
  duplicatesCount,
  albumCompletionPct,
  showOpenButton,
}: {
  profileUrl: string;
  displayNickname: string;
  duplicatesCount: number;
  albumCompletionPct: number;
  showOpenButton?: boolean;
}) {
  const shareText = buildProfileShareText({
    displayNickname,
    duplicatesCount,
    albumCompletionPct,
    url: profileUrl,
  });
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-base">
          <QrCode className="size-5" />
          QR Code do perfil
        </CardTitle>
        <CardDescription>Compartilhe o link público</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="size-28 shrink-0 rounded-lg bg-white p-3">
            <QRCode
              data={profileUrl}
              foreground="#1a472a"
              background="#ffffff"
              robustness="M"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="mb-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              URL pública
            </p>
            <p className="truncate font-mono text-sm text-foreground">
              {profileUrl.replace("https://", "")}
            </p>
            <div className="mt-3 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 gap-2 border-white/10 bg-white/5"
                onClick={() => void copyText(profileUrl)}
              >
                <Copy className="size-3.5" />
                Copiar
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2 border-white/10 bg-white/5"
                asChild
              >
                <a href={shareUrl} target="_blank" rel="noopener noreferrer">
                  <Share2 className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        {showOpenButton && (
          <Button variant="outline" className="w-full gap-2" asChild>
            <a href={profileUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-4" />
              Abrir perfil público
            </a>
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function PublicCtaCard({
  profile,
  profileUrl,
}: {
  profile: PublicProfileV2;
  profileUrl: string;
}) {
  const name = displayName(profile);
  const shareText = buildProfileShareText({
    displayNickname: name,
    duplicatesCount: profile.duplicatesCount,
    albumCompletionPct: profile.albumCompletionPct,
    url: profileUrl,
  });
  const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <Card className="overflow-hidden border-white/10 bg-surface-container-high text-center">
      <CardContent className="space-y-4 p-5">
        <div>
          <h2 className="font-headline text-lg font-bold">
            Tem o que @{name} procura?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Entre no Figurinha Fácil e encontre um match seguro.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
            asChild
          >
            <Link href="/matches">
              <ArrowLeftRight className="size-4" />
              Buscar match
            </Link>
          </Button>
          <Button
            className="flex-1 gap-2 bg-[var(--whatsapp-brand)] text-white hover:bg-[var(--whatsapp-brand-dark)]"
            asChild
          >
            <a href={shareUrl} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="size-4" />
              WhatsApp
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

const HERO_VARIANT_KEY = "profile-hero-variant";

function useHeroVariant(): [HeroVariant, (v: HeroVariant) => void] {
  const [variant, setVariant] = useState<HeroVariant>("trading-card");

  useEffect(() => {
    const stored = localStorage.getItem(HERO_VARIANT_KEY);
    if (stored === "banner" || stored === "credential" || stored === "trading-card") {
      setVariant(stored);
    }
  }, []);

  const setAndStore = (v: HeroVariant) => {
    setVariant(v);
    localStorage.setItem(HERO_VARIANT_KEY, v);
  };

  return [variant, setAndStore];
}

export function PrivateProfileView({
  profile,
  trades,
  isTradesLoading,
  profileUrl,
  isUpdating,
  onTogglePublic,
  onToggleMail,
  onCopyLink,
  onShare,
}: {
  profile: ProfileSettingsV2;
  trades: ProfileTradeRow[];
  isTradesLoading: boolean;
  profileUrl: string;
  isUpdating: boolean;
  onTogglePublic: ToggleHandler;
  onToggleMail: ToggleHandler;
  onCopyLink: () => void;
  onShare: () => void;
}) {
  const name = displayName(profile);
  const [heroVariant, setHeroVariant] = useHeroVariant();

  const achievements = deriveAchievements({
    totalTrades: profile.totalTrades,
    albumCompletionPct: profile.albumCompletionPct,
    ratingCount: profile.ratingCount,
    ratingAvg: profile.ratingAvg,
  });

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
      <ProfileHero
        variant={heroVariant}
        nickname={profile.nickname}
        displayNickname={profile.displayNickname}
        avatarSeed={profile.avatarSeed ?? profile.nickname}
        flag={profile.flag ?? "🇧🇷"}
        cardCode={profile.cardCode ?? "BRA-10"}
        cardNumber={profile.cardNumber ?? "001"}
        city={profile.city}
        joinedAt={profile.createdAt}
        ratingAvg={profile.ratingAvg}
        ratingCount={profile.ratingCount}
        totalTrades={profile.totalTrades}
        isVerified={profile.isVerified}
        profileUrl={profileUrl}
      />

      <div className="flex flex-wrap gap-2">
        <Button
          className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          onClick={onShare}
          disabled={!profile.isProfilePublic}
        >
          <Share2 className="size-4" />
          Compartilhar
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-white/10 bg-white/5"
          onClick={onCopyLink}
          disabled={!profile.isProfilePublic}
        >
          <Copy className="size-4" />
          Copiar link
        </Button>
        <Button
          variant="outline"
          className="gap-2 border-white/10 bg-white/5"
          asChild
          aria-disabled={!profile.isProfilePublic}
        >
          <a
            href={profile.isProfilePublic ? profileUrl : "#"}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink className="size-4" />
            Abrir
          </a>
        </Button>
      </div>

      <ProfileProgressCard
        albumCompletionPct={profile.albumCompletionPct}
        albumOwnedCount={profile.albumOwnedCount}
        albumTotal={profile.albumTotal}
        duplicatesCount={profile.duplicatesCount}
        missingCount={profile.missingCount}
      />

      {profile.topNations && profile.topNations.length > 0 && (
        <TopNationsModule nations={profile.topNations} />
      )}

      <AchievementsModule achievements={achievements} />

      <Tabs defaultValue="duplicates" className="gap-4">
        <TabsList className="w-full justify-start overflow-x-auto rounded-full bg-surface-container p-1">
          <TabsTrigger value="duplicates" className="gap-2 rounded-full">
            <Repeat2 className="size-4" />
            Repetidas
            <span className="font-mono text-[10px] opacity-70">
              {profile.duplicatesCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="missing" className="gap-2 rounded-full">
            <Search className="size-4" />
            Faltam
            <span className="font-mono text-[10px] opacity-70">
              {profile.missingCount}
            </span>
          </TabsTrigger>
          <TabsTrigger value="trades" className="gap-2 rounded-full">
            <History className="size-4" />
            Trocas
            <span className="font-mono text-[10px] opacity-70">
              {profile.totalTrades}
            </span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="duplicates">
          <ProfileStickerGridPanel
            title="Repetidas disponíveis"
            description="Disponíveis para troca."
            stickers={profile.duplicatesSample}
            totalCount={profile.duplicatesCount}
            kind="duplicate"
          />
        </TabsContent>
        <TabsContent value="missing">
          <ProfileStickerGridPanel
            title="Figurinhas faltando"
            description="Lista que outros colecionadores podem ajudar."
            stickers={profile.missingSample}
            totalCount={profile.missingCount}
            kind="missing"
          />
        </TabsContent>
        <TabsContent value="trades">
          <TradeHistoryPanel trades={trades} isLoading={isTradesLoading} />
        </TabsContent>
      </Tabs>

      <div className="grid gap-5 lg:grid-cols-2">
        <HeroVariantSelector value={heroVariant} onChange={setHeroVariant} />
        <ProfileSettingsCard
          isPublic={profile.isProfilePublic}
          acceptsMail={profile.acceptsMail}
          isUpdating={isUpdating}
          onTogglePublic={onTogglePublic}
          onToggleMail={onToggleMail}
        />
      </div>

      {profile.isProfilePublic ? (
        <ProfileLinkCard
          profileUrl={profileUrl}
          displayNickname={name}
          duplicatesCount={profile.duplicatesCount}
          albumCompletionPct={profile.albumCompletionPct}
          showOpenButton
        />
      ) : (
        <Card className="border-white/10 bg-surface-container">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-headline text-base">
              <Lock className="size-5" />
              Link público desativado
            </CardTitle>
            <CardDescription>
              Ative perfil público para liberar QR code e compartilhamento.
            </CardDescription>
          </CardHeader>
        </Card>
      )}
    </div>
  );
}

export function PublicProfileView({
  profile,
  profileUrl,
}: {
  profile: PublicProfileV2;
  profileUrl: string;
}) {
  const name = displayName(profile);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-5 px-4 py-6 sm:px-6 lg:py-8">
      <PublicHero profile={profile} />

      <ProfileProgressCard
        albumCompletionPct={profile.albumCompletionPct}
        albumOwnedCount={profile.albumOwnedCount}
        albumTotal={profile.albumTotal}
        duplicatesCount={profile.duplicatesCount}
        missingCount={profile.missingCount}
      />

      <ProfileStickerGridPanel
        title="Repetidas disponíveis"
        description="Disponíveis para troca."
        stickers={profile.duplicatesSample}
        totalCount={profile.duplicatesCount}
        kind="duplicate"
      />

      <ProfileStickerGridPanel
        title="Procurando"
        description="Tem alguma? Entre e encontre um match."
        stickers={profile.missingSample}
        totalCount={profile.missingCount}
        kind="missing"
      />

      <PublicCtaCard profile={profile} profileUrl={profileUrl} />

      <ProfileLinkCard
        profileUrl={profileUrl}
        displayNickname={name}
        duplicatesCount={profile.duplicatesCount}
        albumCompletionPct={profile.albumCompletionPct}
      />

      <p className="py-3 text-center text-xs text-muted-foreground">
        Não é seu perfil?{" "}
        <Link href="/dashboard" className="font-semibold text-primary">
          Entrar no Figurinha Fácil
        </Link>
      </p>
    </div>
  );
}
