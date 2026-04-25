"use client";

import { memo, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";
import { formatDistanceToNowStrict } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  ArrowDownLeft,
  ArrowUpRight,
  BadgeCheck,
  Clock,
  Crown,
  Handshake,
  MessageCircle,
  Sparkles,
  Sticker,
  Users,
} from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@workspace/ui/components/tabs";
import { cn } from "@workspace/ui/lib/utils";
import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
import { initials } from "@/modules/propostas/lib/format";
import {
  buildSectionLookup,
  formatStickerNumber,
  type Section,
} from "@/modules/stickers/lib/sticker-parser";

const WHATSAPP_GROUP_RE =
  /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,24}$/;

function safeWhatsAppHref(raw: string | null): string | null {
  return raw && WHATSAPP_GROUP_RE.test(raw) ? raw : null;
}

function appendWhatsAppText(href: string, message: string): string {
  const sep = href.includes("?") ? "&" : "?";
  return `${href}${sep}text=${encodeURIComponent(message)}`;
}

type FilterKey = "todos" | "match" | "raras";

type MatchRow = {
  checkinId: Id<"checkins">;
  userId: Id<"users">;
  displayNickname: string;
  avatarSeed: string;
  checkinAt: number;
  distanceMeters: number;
  matchingStickers: number[];
  totalMatches: number;
  myMatchingStickers: number[];
  myMatchingTotal: number;
  albumCompletionPct: number;
  totalTrades: number;
  isPremium: boolean;
  isVerified: boolean;
  hasProfileData: boolean;
};

type PresentMatchesSectionProps = {
  tradePointId: Id<"tradePoints">;
  whatsappHref: string | null;
  className?: string;
};

export function PresentMatchesSection({
  tradePointId,
  whatsappHref,
  className,
}: PresentMatchesSectionProps) {
  const data = useQuery(api.checkins.listPresentMatchesAtPoint, {
    tradePointId,
  });
  const sectionsData = useQuery(api.album.getSections);
  const [filter, setFilter] = useState<FilterKey>("todos");

  useEffect(() => {
    if (data && process.env.NODE_ENV === "development") {
      console.log("[analytics] present_matches_viewed", {
        state: data.state,
        matches_count: data.state === "ready" ? data.matches.length : 0,
        truncated: data.state === "ready" ? data.truncated : false,
      });
    }
  }, [data]);

  const sections: Section[] = useMemo(
    () => (sectionsData ?? []) as Section[],
    [sectionsData]
  );
  const lookup = useMemo(
    () => (sections.length > 0 ? buildSectionLookup(sections) : null),
    [sections]
  );
  const legendSet = useMemo(() => {
    const s = new Set<number>();
    type LegendCarrier = { legendNumbers?: { number: number }[] };
    for (const sec of (sectionsData ?? []) as LegendCarrier[]) {
      if (sec.legendNumbers) {
        for (const l of sec.legendNumbers) s.add(l.number);
      }
    }
    return s;
  }, [sectionsData]);

  const safeHref = safeWhatsAppHref(whatsappHref);

  if (data === undefined) {
    return <PresentMatchesSkeleton className={className} />;
  }

  if (data.state === "needs-auth" || data.state === "banned") return null;
  if (data.state === "not-found") return null;

  if (data.state === "no-stickers") {
    return (
      <SectionShell className={className}>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <Sticker
            className="h-10 w-10 shrink-0 text-primary"
            strokeWidth={1.5}
            aria-hidden
          />
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Cadastre suas figurinhas para ver quem tem o que você precisa.
            </p>
            <Button asChild variant="outline" size="sm">
              <Link href="/cadastrar-figurinhas/quick">
                Cadastrar figurinhas
              </Link>
            </Button>
          </div>
        </div>
      </SectionShell>
    );
  }

  if (data.state === "no-needs") {
    return (
      <SectionShell className={className}>
        <p className="text-sm text-muted-foreground">
          Você já tem todas as figurinhas que precisa! Parabéns pelo álbum
          completo.
        </p>
      </SectionShell>
    );
  }

  const { matches, truncated, myMissingCount } = data;

  if (matches.length === 0) {
    return (
      <SectionShell className={className}>
        <p className="text-sm text-muted-foreground">
          Ninguém aqui tem figurinhas que você precisa agora.
        </p>
      </SectionShell>
    );
  }

  return (
    <PresentMatchesView
      matches={matches}
      truncated={truncated}
      myMissingCount={myMissingCount}
      filter={filter}
      setFilter={setFilter}
      lookup={lookup}
      legendSet={legendSet}
      whatsappHref={safeHref}
      className={className}
    />
  );
}

type ViewProps = {
  matches: MatchRow[];
  truncated: boolean;
  myMissingCount: number;
  filter: FilterKey;
  setFilter: (k: FilterKey) => void;
  lookup: ReturnType<typeof buildSectionLookup> | null;
  legendSet: Set<number>;
  whatsappHref: string | null;
  className?: string;
};

function PresentMatchesView({
  matches,
  truncated,
  myMissingCount,
  filter,
  setFilter,
  lookup,
  legendSet,
  whatsappHref,
  className,
}: ViewProps) {
  const counts = useMemo(() => {
    let comMatch = 0;
    let raras = 0;
    for (const m of matches) {
      if (m.totalMatches > 0 && m.myMatchingTotal > 0) comMatch += 1;
      const hasRare =
        m.matchingStickers.some((n) => legendSet.has(n)) ||
        m.myMatchingStickers.some((n) => legendSet.has(n));
      if (hasRare) raras += 1;
    }
    return { todos: matches.length, match: comMatch, raras };
  }, [matches, legendSet]);

  const filtered = useMemo(() => {
    if (filter === "todos") return matches;
    if (filter === "match") {
      return matches.filter(
        (m) => m.totalMatches > 0 && m.myMatchingTotal > 0
      );
    }
    return matches.filter(
      (m) =>
        m.matchingStickers.some((n) => legendSet.has(n)) ||
        m.myMatchingStickers.some((n) => legendSet.has(n))
    );
  }, [matches, filter, legendSet]);

  const featuredCutoff = useMemo(() => {
    const scores = matches
      .map((m) => m.totalMatches + m.myMatchingTotal)
      .sort((a, b) => b - a);
    return scores[1] ?? 0;
  }, [matches]);

  const countLabel = truncated
    ? `${matches.length}+`
    : String(matches.length);

  return (
    <Card
      className={cn(
        "rounded-2xl border-outline-variant/10 bg-surface-container-low shadow-lg",
        className
      )}
    >
      <CardHeader className="gap-3 pb-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <Users className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <CardTitle className="text-base font-semibold sm:text-lg">
                Quem está aqui agora
              </CardTitle>
              <p className="text-xs text-muted-foreground sm:text-sm">
                {countLabel}{" "}
                {Number(countLabel.replace("+", "")) === 1
                  ? "colecionador ativo"
                  : "colecionadores ativos"}{" "}
                · ordenados por compatibilidade
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tabs
              value={filter}
              onValueChange={(v) => setFilter(v as FilterKey)}
            >
              <TabsList className="h-auto gap-1 bg-surface-container p-1">
                <TabsTrigger
                  value="todos"
                  className="h-auto px-3 py-1 text-xs data-[state=active]:bg-surface-container-high"
                >
                  Todos
                  <span className="ml-1 font-mono text-[10px] opacity-60">
                    {counts.todos}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="match"
                  className="h-auto px-3 py-1 text-xs data-[state=active]:bg-surface-container-high"
                >
                  Com match
                  <span className="ml-1 font-mono text-[10px] opacity-60">
                    {counts.match}
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="raras"
                  className="h-auto px-3 py-1 text-xs data-[state=active]:bg-surface-container-high"
                >
                  Raras
                  <span className="ml-1 font-mono text-[10px] opacity-60">
                    {counts.raras}
                  </span>
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Badge
              variant="secondary"
              className="gap-1.5 rounded-full bg-secondary/10 text-secondary"
            >
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-secondary" />
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Ao vivo
              </span>
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Nenhum colecionador nesse filtro.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {filtered.map((match) => {
              const score = match.totalMatches + match.myMatchingTotal;
              const featured =
                featuredCutoff > 0 && score >= featuredCutoff && score >= 4;
              return (
                <PresentMatchCard
                  key={match.checkinId}
                  match={match}
                  myMissingCount={myMissingCount}
                  lookup={lookup}
                  legendSet={legendSet}
                  featured={featured}
                  whatsappHref={whatsappHref}
                />
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type PresentMatchCardProps = {
  match: MatchRow;
  myMissingCount: number;
  lookup: ReturnType<typeof buildSectionLookup> | null;
  legendSet: Set<number>;
  featured: boolean;
  whatsappHref: string | null;
};

const PresentMatchCard = memo(function PresentMatchCard({
  match,
  myMissingCount,
  lookup,
  legendSet,
  featured,
  whatsappHref,
}: PresentMatchCardProps) {
  const give = match.totalMatches;
  const get = match.myMatchingTotal;
  const rares = match.matchingStickers.filter((n) => legendSet.has(n)).length;
  const score =
    myMissingCount > 0
      ? Math.min(100, Math.round((give / myMissingCount) * 100))
      : 0;
  const timeAgo = formatDistanceToNowStrict(match.checkinAt, {
    locale: ptBR,
  });
  const ready = give > 0 && get > 0;
  const nickname = match.displayNickname.slice(0, 40);
  const level =
    match.totalTrades >= 100
      ? "TOP"
      : match.totalTrades >= 50
        ? "PRO"
        : null;

  return (
    <article
      className={cn(
        "relative flex flex-col gap-4 rounded-2xl border bg-surface-container/60 p-4 transition-colors",
        featured
          ? "border-secondary/40 bg-gradient-to-br from-secondary/5 via-surface-container/60 to-surface-container/60"
          : "border-outline-variant/15 hover:bg-surface-container"
      )}
      aria-label={`Trocar com ${nickname}, ${give} figurinhas pra você, ${get} pra ela`}
    >
      {featured && (
        <span
          className="absolute inset-y-0 left-0 w-[3px] rounded-l-2xl bg-secondary"
          aria-hidden
        />
      )}

      <header className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
        <div className="relative">
          <MatchDicebearAvatar
            seed={match.avatarSeed}
            size={52}
            fallbackInitials={initials(nickname)}
            className={cn(
              featured &&
                "ring-2 ring-secondary/50 ring-offset-2 ring-offset-surface-container-low"
            )}
          />
          <span
            className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-secondary ring-[2.5px] ring-surface-container-low"
            aria-hidden
          />
          {featured && (
            <span className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-secondary text-on-secondary shadow-sm">
              <Sparkles className="h-3 w-3" aria-hidden />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <p className="truncate font-headline text-base font-bold tracking-tight">
              {nickname}
            </p>
            {match.isVerified && (
              <BadgeCheck
                className="h-4 w-4 shrink-0 text-primary"
                aria-label="Verificado"
              />
            )}
            {match.isPremium && (
              <Crown
                className="h-4 w-4 shrink-0 text-tertiary"
                aria-label="Premium"
              />
            )}
            {level && (
              <span className="rounded-full bg-tertiary/15 px-2 py-0.5 font-mono text-[10px] font-bold tracking-widest text-tertiary">
                {level}
              </span>
            )}
          </div>
          <MetaRow
            ratingAvg={undefined}
            ratingCount={0}
            totalTrades={match.totalTrades}
            albumCompletionPct={match.albumCompletionPct}
            hasProfileData={match.hasProfileData}
          />
          <p className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-secondary">
            <Clock className="h-3 w-3" aria-hidden />
            Aqui há {timeAgo}
            {ready && (
              <span className="font-normal text-secondary/80">
                · pronta pra trocar
              </span>
            )}
          </p>
        </div>
        <MatchScorePill score={score} featured={featured} />
      </header>

      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        <LaneCard
          variant="give"
          label="Tem · você precisa"
          count={give}
          icon={<ArrowDownLeft className="h-3 w-3" />}
        >
          <StickerList
            numbers={match.matchingStickers}
            variant="give"
            lookup={lookup}
            legendSet={legendSet}
            totalCount={give}
          />
        </LaneCard>
        <LaneCard
          variant="get"
          label="Precisa · você tem"
          count={get}
          icon={<ArrowUpRight className="h-3 w-3" />}
        >
          <StickerList
            numbers={match.myMatchingStickers}
            variant="get"
            lookup={lookup}
            legendSet={legendSet}
            totalCount={get}
          />
        </LaneCard>
      </div>

      <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/10 pt-3">
        <p className="text-xs text-muted-foreground">
          {buildSummary(give, get, rares)}
        </p>
        <WhatsAppActions
          href={whatsappHref}
          nickname={nickname}
          give={give}
          get={get}
        />
      </footer>
    </article>
  );
});

function MetaRow({
  ratingAvg,
  ratingCount,
  totalTrades,
  albumCompletionPct,
  hasProfileData,
}: {
  ratingAvg: number | undefined;
  ratingCount: number;
  totalTrades: number;
  albumCompletionPct: number;
  hasProfileData: boolean;
}) {
  const showRating = ratingCount >= 3 && ratingAvg !== undefined;
  const albumLabel = hasProfileData ? `${albumCompletionPct}%` : "—";
  return (
    <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
      {showRating && (
        <>
          <span className="text-tertiary">
            ★ <b className="font-headline text-foreground">{ratingAvg!.toFixed(1)}</b>
          </span>
          <Dot />
        </>
      )}
      <span>
        <b className="font-headline text-foreground">{totalTrades}</b> trocas
      </span>
      <Dot />
      <span>
        álbum <b className="font-headline text-foreground">{albumLabel}</b>
      </span>
    </div>
  );
}

function Dot() {
  return (
    <span
      className="inline-block h-[3px] w-[3px] rounded-full bg-outline-variant/60"
      aria-hidden
    />
  );
}

function MatchScorePill({
  score,
  featured,
}: {
  score: number;
  featured: boolean;
}) {
  const tone =
    score >= 75
      ? "border-secondary/30 bg-secondary/10 text-secondary"
      : score >= 50
        ? "border-primary/30 bg-primary/10 text-primary"
        : score >= 25
          ? "border-outline-variant/30 bg-surface-container-high text-on-surface"
          : "border-outline-variant/20 bg-surface-container text-muted-foreground";
  return (
    <div
      className={cn(
        "shrink-0 rounded-xl border px-2.5 py-1.5 text-center",
        tone,
        featured && "shadow-[0_0_18px_-6px_rgba(79,243,37,0.6)]"
      )}
      aria-label={`Compatibilidade ${score}%`}
    >
      <div className="font-headline text-xl font-extrabold leading-none tracking-tight">
        {score}%
      </div>
      <div className="mt-0.5 text-[9px] font-bold uppercase tracking-widest opacity-80">
        Match
      </div>
    </div>
  );
}

type LaneVariant = "give" | "get";

function LaneCard({
  variant,
  label,
  count,
  icon,
  children,
}: {
  variant: LaneVariant;
  label: string;
  count: number;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  const tones =
    variant === "give"
      ? "border-tertiary/20 bg-tertiary/5"
      : "border-primary/20 bg-primary/5";
  const labelTone =
    variant === "give" ? "text-tertiary" : "text-primary";
  const iconBg =
    variant === "give"
      ? "bg-tertiary/15 text-tertiary"
      : "bg-primary/15 text-primary";
  return (
    <div className={cn("rounded-xl border p-3", tones)}>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className={cn(
            "flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest",
            labelTone
          )}
        >
          <span className={cn("grid h-4 w-4 place-items-center rounded", iconBg)}>
            {icon}
          </span>
          {label}
        </span>
        <span className="rounded bg-surface-container-high px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          {count} fig.
        </span>
      </div>
      {children}
    </div>
  );
}

const FIG_LIMIT = 6;

function StickerList({
  numbers,
  variant,
  lookup,
  legendSet,
  totalCount,
}: {
  numbers: number[];
  variant: LaneVariant;
  lookup: ReturnType<typeof buildSectionLookup> | null;
  legendSet: Set<number>;
  totalCount: number;
}) {
  if (numbers.length === 0) {
    return (
      <p className="py-1 text-[11px] italic text-muted-foreground">
        Sem figurinhas neste sentido.
      </p>
    );
  }
  const visible = numbers.slice(0, FIG_LIMIT);
  const hidden = Math.max(0, totalCount - visible.length);
  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((n) => (
        <StickerFig
          key={n}
          n={n}
          variant={variant}
          lookup={lookup}
          isLegend={legendSet.has(n)}
        />
      ))}
      {hidden > 0 && (
        <div className="grid min-w-[44px] place-items-center rounded-md border border-dashed border-outline-variant/30 px-1.5 py-1 font-mono text-[11px] text-muted-foreground">
          +{hidden}
        </div>
      )}
    </div>
  );
}

function StickerFig({
  n,
  variant,
  lookup,
  isLegend,
}: {
  n: number;
  variant: LaneVariant;
  lookup: ReturnType<typeof buildSectionLookup> | null;
  isLegend: boolean;
}) {
  const info = lookup ? formatStickerNumber(n, lookup) : null;
  const code = info?.code ?? "?";
  const rel = info?.relativeNum ?? n;
  const tone =
    variant === "give"
      ? "border-tertiary/30 bg-tertiary/15 text-tertiary"
      : "border-primary/30 bg-primary/15 text-primary";
  return (
    <div
      className={cn(
        "flex min-w-[48px] flex-col items-center justify-center rounded-md border px-1.5 py-1 leading-none",
        tone,
        isLegend &&
          "ring-1 ring-tertiary/60 shadow-[0_0_8px_-2px_rgba(255,201,101,0.55)]"
      )}
      aria-label={`Figurinha ${code}-${rel}${isLegend ? " lendária" : ""}`}
    >
      <span className="font-mono text-[11px] font-bold tracking-tight">
        {code}-{rel}
      </span>
      {isLegend && (
        <span className="mt-0.5 font-mono text-[8px] font-bold tracking-widest opacity-80">
          LGD
        </span>
      )}
    </div>
  );
}

function buildSummary(give: number, get: number, rares: number): string {
  const raresStr =
    rares > 0
      ? ` · +${rares} lendária${rares > 1 ? "s" : ""} pra você`
      : "";
  if (give >= 4 && get >= 4 && Math.abs(give - get) <= 2) {
    return `Mão dupla ${Math.min(give, get)}:${Math.min(give, get)}${raresStr}`;
  }
  if (get === 0 && give > 0) {
    return `Você só recebe — ${give} fig.${raresStr}`;
  }
  if (give === 0) {
    return `Você dá +${get}`;
  }
  if (give > get) {
    return `Mais a receber: +${give - get}${raresStr}`;
  }
  if (get > give) {
    return `Você dá +${get - give}`;
  }
  return `Mão dupla ${give}:${get}${raresStr}`;
}

function WhatsAppActions({
  href,
  nickname,
  give,
  get,
}: {
  href: string | null;
  nickname: string;
  give: number;
  get: number;
}) {
  if (!href) {
    return (
      <span className="text-[11px] italic text-muted-foreground">
        Configure WhatsApp do ponto
      </span>
    );
  }
  const proposeHref = appendWhatsAppText(
    href,
    `Olá, ${nickname}! Quero propor uma troca de ${give} por ${get} figurinhas.`
  );
  return (
    <div className="flex items-center gap-1.5">
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        asChild
      >
        <a href={href} target="_blank" rel="noopener noreferrer" aria-label="Abrir WhatsApp do grupo">
          <MessageCircle className="h-4 w-4" />
        </a>
      </Button>
      <Button size="sm" className="h-8 gap-1.5 px-3" asChild>
        <a href={proposeHref} target="_blank" rel="noopener noreferrer">
          <Handshake className="h-3.5 w-3.5" />
          Propor troca
        </a>
      </Button>
    </div>
  );
}

function SectionShell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-outline-variant/10 bg-surface-container-low",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-semibold sm:text-lg">
          <Users className="h-5 w-5 shrink-0" aria-hidden />
          Quem está aqui agora
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function PresentMatchesSkeleton({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "rounded-2xl border-outline-variant/10 bg-surface-container-low shadow-lg",
        className
      )}
    >
      <CardHeader className="gap-3 pb-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {Array.from({ length: 2 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full rounded-2xl" />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
