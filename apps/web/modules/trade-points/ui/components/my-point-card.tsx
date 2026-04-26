"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Clock,
  Handshake,
  LogIn,
  MapPin,
  Navigation,
  Repeat2,
  Sparkles,
  Star,
  Store,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type { Doc, Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import {
  Pill,
  PillIndicator,
} from "@workspace/ui/components/kibo-ui/pill";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { cn } from "@workspace/ui/lib/utils";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";

export type MyPointCardData = {
  _id: Id<"tradePoints">;
  slug: string;
  name: string;
  address: string;
  cityName: string | null;
  status: Doc<"tradePoints">["status"];
  confidenceScore: number;
  activeCheckinsCount: number;
  peakHourBuckets: number[];
  lastActivityAt: number;
  joinedAt: number;
  tradesCount: number;
  lastVisitAt: number | null;
  badge: "organizer" | "frequent" | "new" | "visited";
  isFavorite: boolean;
  presence: {
    count: number;
    sample: Array<{ nickname: string | null; avatarSeed: string | null }>;
  };
};

type MyPointCardProps = {
  point: MyPointCardData;
  layout?: "grid" | "list";
};

export const MyPointCard = memo(function MyPointCard({
  point,
  layout = "grid",
}: MyPointCardProps) {
  const stars = useMemo(
    () => Math.max(0, Math.min(5, point.confidenceScore / 2)),
    [point.confidenceScore]
  );

  const isFeatured = point.badge === "organizer";
  const live = point.activeCheckinsCount > 0;

  return (
    <Card
      className={cn(
        "group relative gap-0 overflow-hidden rounded-2xl border-outline-variant/10 bg-surface-container-low p-0 transition-colors hover:border-primary/30",
        isFeatured && "border-tertiary/30",
        layout === "list" && "md:grid md:grid-cols-[280px_1fr] md:items-stretch"
      )}
    >
      <Banner
        live={live}
        liveCount={point.activeCheckinsCount}
        badge={point.badge}
      />

      <CardContent className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-headline text-base leading-tight font-bold tracking-tight md:text-lg">
            {point.name}
          </h3>
          <PinBadge badge={point.badge} />
        </div>

        <div className="flex flex-wrap items-center gap-1.5 text-xs text-on-surface-variant">
          <MapPin className="size-3.5 text-outline" aria-hidden />
          <span>
            {point.address}
            {point.cityName ? ` · ${point.cityName}` : ""}
          </span>
        </div>

        <ScoreRow score={point.confidenceScore} stars={stars} />

        <Stats3
          live={live}
          aquiAgora={point.activeCheckinsCount}
          tradesCount={point.tradesCount}
          lastVisitAt={point.lastVisitAt}
        />

        {point.presence.count > 0 && (
          <WhoBlock
            count={point.presence.count}
            sample={point.presence.sample}
          />
        )}

        <Heatmap12 buckets={point.peakHourBuckets} />

        <CardFooter
          slug={point.slug}
          pointId={point._id}
          lastVisitAt={point.lastVisitAt}
          joinedAt={point.joinedAt}
        />
      </CardContent>
    </Card>
  );
});

function Banner({
  live,
  liveCount,
  badge,
}: {
  live: boolean;
  liveCount: number;
  badge: MyPointCardData["badge"];
}) {
  const PinIcon =
    badge === "organizer" ? Store : badge === "new" ? Sparkles : MapPin;
  return (
    <div className="relative h-[120px] overflow-hidden bg-gradient-to-br from-primary-dim/40 via-surface-container to-surface-container-high">
      <svg
        viewBox="0 0 400 120"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 h-full w-full"
        aria-hidden
      >
        <defs>
          <pattern
            id="grid-pattern"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 20 L40 20 M20 0 L20 40"
              stroke="currentColor"
              strokeWidth="1"
              className="text-primary/10"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        <path
          d="M0 70 Q100 50 200 65 T400 60"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-tertiary/30"
        />
        <path
          d="M0 90 Q120 100 220 85 T400 95"
          stroke="currentColor"
          strokeWidth="2"
          fill="none"
          className="text-primary/20"
        />
      </svg>

      <div
        className={cn(
          "absolute left-1/2 top-1/2 grid size-10 -translate-x-1/2 -translate-y-[80%] place-items-center rounded-full",
          badge === "organizer"
            ? "bg-tertiary text-tertiary-foreground shadow-[var(--shadow-glow-tertiary)]"
            : "bg-primary text-primary-foreground shadow-[var(--shadow-glow-primary)]"
        )}
      >
        <PinIcon className="size-5" aria-hidden />
      </div>

      <div className="absolute right-3 top-3">
        {live ? (
          <Pill
            variant="outline"
            className="border-secondary/40 bg-background/70 px-3 py-1 text-[0.65rem] font-bold uppercase tracking-wider text-secondary backdrop-blur"
          >
            <PillIndicator pulse variant="success" />
            Ao vivo · {liveCount} aqui
          </Pill>
        ) : (
          <Pill
            variant="outline"
            className="border-outline-variant/40 bg-background/70 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-wider text-on-surface-variant backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-outline" aria-hidden />
            Tranquilo
          </Pill>
        )}
      </div>
    </div>
  );
}

const BADGE_META: Record<
  MyPointCardData["badge"],
  { label: string; Icon: LucideIcon; cls: string }
> = {
  organizer: {
    label: "Organizador",
    Icon: Star,
    cls: "border-tertiary/20 bg-tertiary/10 text-tertiary",
  },
  frequent: {
    label: "Frequente",
    Icon: Repeat2,
    cls: "border-primary/20 bg-primary/10 text-primary",
  },
  new: {
    label: "Novo",
    Icon: Sparkles,
    cls: "border-destructive/20 bg-destructive/10 text-destructive",
  },
  visited: {
    label: "Visitado",
    Icon: LogIn,
    cls: "border-secondary/20 bg-secondary/10 text-secondary",
  },
};

function PinBadge({ badge }: { badge: MyPointCardData["badge"] }) {
  const meta = BADGE_META[badge];
  return (
    <Pill
      variant="outline"
      className={cn(
        "shrink-0 px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider",
        meta.cls
      )}
    >
      <meta.Icon className="size-3" aria-hidden />
      {meta.label}
    </Pill>
  );
}

function ScoreRow({ score, stars }: { score: number; stars: number }) {
  return (
    <div className="flex items-center gap-3 rounded-xl bg-primary/5 p-3">
      <div className="grid size-8 place-items-center rounded-lg bg-tertiary/10 text-tertiary">
        <Star className="size-4 fill-current" aria-hidden />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[0.62rem] font-bold uppercase tracking-wider text-on-surface-variant">
          Score do ponto
        </div>
        <div className="mt-0.5 flex gap-0.5">
          {[0, 1, 2, 3, 4].map((i) => {
            const filled = stars - i;
            return (
              <Star
                key={i}
                className={cn(
                  "size-3",
                  filled >= 1
                    ? "fill-tertiary text-tertiary"
                    : filled >= 0.5
                      ? "fill-tertiary/50 text-tertiary"
                      : "fill-none text-outline/40"
                )}
                aria-hidden
              />
            );
          })}
        </div>
      </div>
      <div className="font-headline text-base font-bold tabular-nums">
        {(score / 2).toFixed(1)}
        <span className="ml-1 text-xs font-semibold text-on-surface-variant">
          / 5.0
        </span>
      </div>
    </div>
  );
}

function Stat({
  Icon,
  value,
  label,
  highlight,
}: {
  Icon: LucideIcon;
  value: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-2.5 text-center">
      <Icon
        className={cn(
          "mx-auto size-3.5",
          highlight ? "text-secondary" : "text-on-surface-variant"
        )}
        aria-hidden
      />
      <div
        className={cn(
          "mt-1 font-headline text-base font-bold leading-none tabular-nums",
          highlight && "text-secondary"
        )}
      >
        {value}
      </div>
      <div className="mt-1 text-[0.55rem] font-bold uppercase tracking-wider text-on-surface-variant">
        {label}
      </div>
    </div>
  );
}

function Stats3({
  live,
  aquiAgora,
  tradesCount,
  lastVisitAt,
}: {
  live: boolean;
  aquiAgora: number;
  tradesCount: number;
  lastVisitAt: number | null;
}) {
  const lastVisitDisplay = useMemo(() => {
    if (lastVisitAt === null) return "—";
    return formatDistanceToNow(new Date(lastVisitAt), { locale: ptBR })
      .replace("aproximadamente ", "")
      .replace("cerca de ", "");
  }, [lastVisitAt]);

  return (
    <div className="grid grid-cols-3 gap-2">
      <Stat
        Icon={Users}
        value={String(aquiAgora)}
        label="aqui agora"
        highlight={live}
      />
      <Stat Icon={Handshake} value={String(tradesCount)} label="trocas suas" />
      <Stat Icon={Clock} value={lastVisitDisplay} label="última visita" />
    </div>
  );
}

function WhoBlock({
  count,
  sample,
}: {
  count: number;
  sample: MyPointCardData["presence"]["sample"];
}) {
  const visible = sample.slice(0, 4);
  const overflow = Math.max(0, count - visible.length);
  const names = sample
    .map((s) => s.nickname)
    .filter((n): n is string => Boolean(n));
  const head = names[0];
  const second = names[1];
  const trailingCount = Math.max(0, count - (head ? 1 : 0) - (second ? 1 : 0));

  return (
    <div className="rounded-xl border border-outline-variant/10 bg-background/40 p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-[0.62rem] font-bold uppercase tracking-wider text-on-surface-variant">
          <Users className="size-3" aria-hidden />
          Quem está aqui
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="-space-x-2 flex">
          {visible.map((s, i) =>
            s.avatarSeed ? (
              <MatchDicebearAvatar
                key={i}
                seed={s.avatarSeed}
                size={28}
                className="ring-2 ring-surface-container-low"
              />
            ) : (
              <div
                key={i}
                className="grid size-7 place-items-center rounded-full bg-surface-container-high text-[0.6rem] font-bold uppercase text-on-surface-variant ring-2 ring-surface-container-low"
                aria-hidden
              >
                ?
              </div>
            )
          )}
          {overflow > 0 && (
            <div className="grid size-7 place-items-center rounded-full bg-surface-container-high text-[0.6rem] font-bold tabular-nums text-on-surface-variant ring-2 ring-surface-container-low">
              +{overflow}
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1 truncate text-xs text-on-surface-variant">
          {head ? <span className="text-secondary font-bold">{head}</span> : null}
          {second ? <>, {second}</> : null}
          {trailingCount > 0 ? <> e +{trailingCount}</> : null}
        </div>
      </div>
    </div>
  );
}

const HOUR_LABELS = ["10h", "12h", "14h", "agora", "18h", "20h", "22h"];

function Heatmap12({ buckets }: { buckets: number[] }) {
  const max = useMemo(() => Math.max(1, ...buckets), [buckets]);
  const peakBucket = useMemo(() => buckets.indexOf(max), [buckets, max]);
  const nowBucket = useMemo(() => Math.floor(new Date().getHours() / 2), []);
  const peakHour = peakBucket * 2;
  const hasData = buckets.some((b) => b > 0);

  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container p-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[0.62rem] font-bold uppercase tracking-wider text-on-surface-variant">
          Horários movimentados
        </span>
        {hasData && (
          <span className="text-[0.65rem] font-bold tabular-nums text-tertiary">
            Pico: {peakHour}h
          </span>
        )}
      </div>
      <div className="flex h-8 items-end gap-0.5">
        {buckets.map((value, i) => {
          const pct = (value / max) * 100;
          const heightPct = value > 0 ? Math.max(pct, 12) : 6;
          const isPeak = value > 0 && i === peakBucket;
          const isNow = i === nowBucket;
          return (
            <div
              key={i}
              className={cn(
                "flex-1 rounded-t-sm",
                value === 0
                  ? "bg-muted/40"
                  : isPeak
                    ? "bg-secondary"
                    : isNow
                      ? "bg-primary shadow-[0_0_8px_var(--primary)/40]"
                      : "bg-primary/30"
              )}
              style={{ height: `${heightPct}%` }}
              aria-hidden
            />
          );
        })}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[0.55rem] text-outline">
        {HOUR_LABELS.map((l) => (
          <span key={l}>{l}</span>
        ))}
      </div>
    </div>
  );
}

function CardFooter({
  slug,
  pointId,
  lastVisitAt,
  joinedAt,
}: {
  slug: string;
  pointId: Id<"tradePoints">;
  lastVisitAt: number | null;
  joinedAt: number;
}) {
  const stamp = useMemo(() => {
    const ts = lastVisitAt ?? joinedAt;
    const distance = formatDistanceToNow(new Date(ts), {
      locale: ptBR,
      addSuffix: false,
    })
      .replace("aproximadamente ", "")
      .replace("cerca de ", "");
    const verb = lastVisitAt ? "Check-in" : "Adicionado";
    return { verb, distance };
  }, [lastVisitAt, joinedAt]);

  return (
    <div className="flex items-center gap-2 border-t border-outline-variant/10 pt-3">
      <div className="flex flex-1 items-center gap-1.5 text-[0.7rem] text-on-surface-variant">
        <LogIn className="size-3 text-outline" aria-hidden />
        <span>
          {stamp.verb} <strong className="text-on-surface">há {stamp.distance}</strong>
        </span>
      </div>
      <Button asChild size="sm" variant="ghost" className="h-8 gap-1 px-2.5 text-xs">
        <Link href={`/map?point=${slug}`}>
          <Navigation className="size-3.5" aria-hidden />
          Rota
        </Link>
      </Button>
      <Button asChild size="sm" className="h-8 px-3 text-xs">
        <Link href={`/points/${pointId}`}>Ver detalhes</Link>
      </Button>
    </div>
  );
}

export function MyPointCardSkeleton() {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl bg-surface-container-low p-0">
      <Skeleton className="h-[120px] w-full rounded-none" />
      <CardContent className="space-y-3 p-5">
        <div className="flex justify-between">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-12 w-full rounded-xl" />
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-20 w-full rounded-xl" />
      </CardContent>
    </Card>
  );
}
