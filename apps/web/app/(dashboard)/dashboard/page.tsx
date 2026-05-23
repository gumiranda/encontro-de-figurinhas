"use client";

import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { useQuery } from "convex/react";
import {
  ArrowLeftRight,
  ArrowUpRight,
  Book,
  Bot,
  Flame,
  ListPlus,
  MapPin,
  MessageSquare,
  Settings,
  Star,
  Trophy,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";

const ALBUM_TOTAL = 980;

const primaryShortcuts = [
  {
    href: "/dashboard/gepeto",
    icon: Bot,
    eyebrow: "Humano x IA",
    title: "Bata o Gepeto hoje",
    description: "Streak vs Gepeto",
    meta: "6 palpites",
    accent: "gold",
    featured: true,
  },
  {
    href: "/propostas",
    icon: MessageSquare,
    eyebrow: "Trocas",
    title: "Propostas",
    description: "Negocie sem perder o fio",
    meta: "abrir fila",
    accent: "green",
  },
  {
    href: "/mapa",
    icon: MapPin,
    eyebrow: "Perto de você",
    title: "Mapa",
    description: "Pontos seguros para trocar",
    meta: "ver rota",
    accent: "blue",
  },
  {
    href: "/jogo-mais-chato",
    icon: Trophy,
    eyebrow: "Rodada",
    title: "Jogo Mais Chato",
    description: "Vote na partida mais morna",
    meta: "votar",
    accent: "gold",
  },
] as const;

const secondaryShortcuts = [
  {
    href: "/album",
    icon: Book,
    title: "Álbum",
  },
  {
    href: "/cadastrar-figurinhas/troca",
    icon: ArrowLeftRight,
    title: "Modo troca",
  },
  {
    href: "/comunidade",
    icon: Users,
    title: "Comunidade",
  },
  {
    href: "/perfil",
    icon: User,
    title: "Perfil",
  },
  {
    href: "/ajustes",
    icon: Settings,
    title: "Ajustes",
  },
] as const;

const adminShortcuts = [
  {
    href: "/admin/matches",
    icon: Bot,
    title: "Gepeto: placares",
  },
  {
    href: "/admin/jogo-mais-chato",
    icon: Trophy,
    title: "Jogo Mais Chato",
  },
] as const;

const sampleDuplicates = [
  { code: "BRA-10", team: "BRA", tilt: "-rotate-6", tone: "gold" },
  { code: "ARG-7", team: "ARG", tilt: "-rotate-2", tone: "gold" },
  { code: "FRA-8", team: "FRA", tilt: "rotate-2", tone: "green" },
  { code: "ESP-9", team: "ESP", tilt: "rotate-6", tone: "green" },
] as const;

function formatPercent(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    maximumFractionDigits: value % 1 === 0 ? 0 : 1,
  }).format(value);
}

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.min(100, Math.max(0, value));
}

function Overline({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-mono text-[0.7rem] font-bold uppercase tracking-[0.32em] text-primary">
      {children}
    </div>
  );
}

function StickerPreview({
  code,
  team,
  tilt,
  tone,
}: (typeof sampleDuplicates)[number]) {
  return (
    <div
      className={cn(
        "relative h-24 w-16 shrink-0 rounded-[1.1rem] border p-3 shadow-[0_16px_28px_rgb(0_0_0/0.28)]",
        "bg-[linear-gradient(145deg,var(--surface-container-highest),var(--surface-container-low))]",
        tilt,
        tone === "green" ? "border-secondary/50" : "border-tertiary/55",
      )}
    >
      <div
        className={cn(
          "mb-7 h-2 w-5 rounded-full",
          tone === "green" ? "bg-secondary/80" : "bg-tertiary/80",
        )}
      />
      <div
        className={cn(
          "font-[var(--font-headline)] text-xl font-bold leading-none",
          tone === "green" ? "text-secondary" : "text-tertiary",
        )}
      >
        {code}
      </div>
      <div className="mt-1 font-mono text-[0.62rem] uppercase tracking-[0.18em] text-on-surface-variant">
        {team}
      </div>
    </div>
  );
}

function MetricStrip({
  rating,
  ratingCount,
  totalTrades,
  missingCount,
}: {
  rating?: number;
  ratingCount: number;
  totalTrades: number;
  missingCount: number;
}) {
  return (
    <Card className="overflow-hidden border-outline-variant/70 bg-surface-container py-0 shadow-none">
      <CardContent className="grid grid-cols-3 divide-x divide-outline-variant/70 px-0 py-5 text-center">
        <div className="px-3">
          <div className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.28em] text-on-surface-variant">
            Faltam
          </div>
          <div className="mt-2 font-[var(--font-headline)] text-3xl font-bold text-primary">
            {missingCount}
          </div>
          <div className="mt-1 text-sm text-on-surface-variant">no álbum</div>
        </div>
        <div className="px-3">
          <div className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.28em] text-on-surface-variant">
            Reputação
          </div>
          <div className="mt-2 inline-flex items-center justify-center gap-1 font-[var(--font-headline)] text-3xl font-bold text-tertiary">
            {rating ? rating.toFixed(1) : "0.0"}
            <Star className="size-5 fill-current" />
          </div>
          <div className="mt-1 text-sm text-on-surface-variant">
            {ratingCount} avaliações
          </div>
        </div>
        <div className="px-3">
          <div className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.28em] text-on-surface-variant">
            Trocas
          </div>
          <div className="mt-2 font-[var(--font-headline)] text-3xl font-bold text-secondary">
            {totalTrades}
          </div>
          <div className="mt-1 text-sm text-on-surface-variant">concluídas</div>
        </div>
      </CardContent>
    </Card>
  );
}

function ShortcutCard({
  shortcut,
}: {
  shortcut: (typeof primaryShortcuts)[number];
}) {
  const Icon = shortcut.icon;
  const isFeatured = "featured" in shortcut && shortcut.featured;

  return (
    <Link
      href={shortcut.href}
      className={cn(
        "group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isFeatured && "md:col-span-2",
      )}
    >
      <Card
        className={cn(
          "h-full overflow-hidden py-0 shadow-none transition duration-200 ease-out group-hover:-translate-y-0.5",
          shortcut.accent === "green" &&
            "border-secondary/45 bg-[radial-gradient(circle_at_70%_0%,color-mix(in_srgb,var(--secondary)_18%,transparent),transparent_38%),var(--surface-container)]",
          shortcut.accent === "gold" &&
            "border-tertiary/45 bg-[radial-gradient(circle_at_70%_0%,color-mix(in_srgb,var(--tertiary)_18%,transparent),transparent_38%),var(--surface-container)]",
          shortcut.accent === "blue" &&
            "border-primary/45 bg-[radial-gradient(circle_at_70%_0%,color-mix(in_srgb,var(--primary)_18%,transparent),transparent_38%),var(--surface-container)]",
        )}
      >
        <CardContent className="flex h-full min-h-40 flex-col justify-between p-6">
          <div className="flex items-start justify-between gap-4">
            <div
              className={cn(
                "font-mono text-[0.68rem] font-bold uppercase tracking-[0.28em]",
                shortcut.accent === "green"
                  ? "text-secondary"
                  : shortcut.accent === "gold"
                    ? "text-tertiary"
                    : "text-primary",
              )}
            >
              {shortcut.eyebrow}
            </div>
            <ArrowUpRight
              className={cn(
                "size-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5",
                shortcut.accent === "green"
                  ? "text-secondary"
                  : shortcut.accent === "gold"
                    ? "text-tertiary"
                    : "text-primary",
              )}
            />
          </div>

          <div>
            <Icon
              className={cn(
                "mb-5 size-8",
                shortcut.accent === "green"
                  ? "text-secondary"
                  : shortcut.accent === "gold"
                    ? "text-tertiary"
                    : "text-primary",
              )}
            />
            <h3 className="max-w-sm font-[var(--font-headline)] text-3xl font-bold leading-[1.05] text-on-surface">
              {shortcut.title}
            </h3>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="text-sm text-on-surface-variant">
                {shortcut.description}
              </span>
              <Badge
                className={cn(
                  "rounded-full px-3 py-1 text-sm",
                  shortcut.accent === "green"
                    ? "bg-secondary/15 text-secondary"
                    : shortcut.accent === "gold"
                      ? "bg-tertiary/15 text-tertiary"
                      : "bg-primary/15 text-primary",
                )}
              >
                {shortcut.meta}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);

  const duplicatesCount = currentUser?.duplicates?.length ?? 0;
  const missingCount = currentUser?.missing?.length ?? 0;
  const ownedCount =
    currentUser?.totalStickersOwned ??
    (currentUser?.hasCompletedStickerSetup
      ? Math.max(0, ALBUM_TOTAL - missingCount)
      : 0);
  const albumProgress = clampPercent(
    currentUser?.albumCompletionPct ??
      currentUser?.albumProgress ??
      (ownedCount / ALBUM_TOTAL) * 100,
  );
  const totalTrades = currentUser?.totalTrades ?? 0;
  const ratingCount = currentUser?.ratingCount ?? 0;
  const rating = currentUser?.ratingAvg;
  const hasNoDuplicates = duplicatesCount === 0;
  const isAdmin =
    currentUser?.role === "superadmin" || currentUser?.role === "ceo";

  return (
    <div className="-m-6 min-h-[calc(100vh-3.5rem)] bg-[radial-gradient(circle_at_84%_4%,color-mix(in_srgb,var(--primary)_14%,transparent),transparent_28%),var(--background)] px-4 py-6 pb-28 sm:px-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="space-y-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-on-surface-variant">
                Início
              </p>
              <h1 className="mt-2 font-[var(--font-headline)] text-4xl font-bold leading-tight text-on-surface sm:text-5xl">
                Seu álbum em tempo real
              </h1>
            </div>
            <Button asChild variant="gradient" className="w-fit">
              <Link href="/cadastrar-figurinhas/quick">
                <ListPlus className="size-4" />
                Cadastrar figurinhas
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1.15fr_1fr]">
            <Link href="/album" className="group block">
              <Card className="h-full overflow-hidden border-primary/40 bg-[linear-gradient(145deg,color-mix(in_srgb,var(--primary)_14%,var(--surface-container)),var(--surface-container-low))] py-0 shadow-none transition duration-200 ease-out group-hover:-translate-y-0.5">
                <CardContent className="p-7">
                  <div className="flex items-start justify-between">
                    <Overline>Meu álbum</Overline>
                    <ArrowUpRight className="size-6 text-primary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div className="mt-7 font-[var(--font-headline)] text-7xl font-bold leading-none tracking-tight text-on-surface sm:text-8xl">
                    {formatPercent(albumProgress)}
                    <span className="text-4xl text-primary">%</span>
                  </div>
                  <div className="mt-7 h-3 overflow-hidden rounded-full bg-surface-container-highest">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,var(--primary),var(--secondary),var(--tertiary))]"
                      style={{ width: `${albumProgress}%` }}
                    />
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-4 font-mono text-lg">
                    <span className="font-bold text-on-surface">
                      {ownedCount}
                      <span className="ml-2 font-medium text-on-surface-variant">
                        coladas
                      </span>
                    </span>
                    <span className="font-bold text-tertiary">
                      {missingCount}
                      <span className="ml-2 font-medium text-on-surface-variant">
                        faltam
                      </span>
                    </span>
                  </div>
                  <Badge className="mt-7 gap-2 rounded-full bg-secondary/15 px-4 py-2 text-base font-bold text-secondary">
                    <Flame className="size-4 fill-current" />
                    {hasNoDuplicates
                      ? "Cadastre repetidas"
                      : `${duplicatesCount} prontas pra trocar`}
                  </Badge>
                </CardContent>
              </Card>
            </Link>

            <Link href="/cadastrar-figurinhas/troca" className="group block">
              <Card className="h-full overflow-hidden border-secondary/45 bg-[radial-gradient(circle_at_68%_26%,color-mix(in_srgb,var(--secondary)_22%,transparent),transparent_40%),var(--surface-container-low)] py-0 shadow-none transition duration-200 ease-out group-hover:-translate-y-0.5">
                <CardContent className="flex h-full min-h-80 flex-col justify-between p-7">
                  <div className="flex items-start justify-between gap-3">
                    <Badge className="rounded-full border-secondary/40 bg-secondary/15 px-3 py-1 font-mono text-[0.68rem] font-bold uppercase tracking-[0.28em] text-secondary">
                      Modo troca
                    </Badge>
                    <ArrowUpRight className="size-6 shrink-0 text-secondary transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div>
                    <div className="font-[var(--font-headline)] text-8xl font-bold leading-none text-secondary">
                      {duplicatesCount}
                    </div>
                    <p className="mt-2 font-mono text-sm font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                      repetidas cadastradas
                    </p>
                    <div className="mt-8 flex -space-x-5 pl-2">
                      {sampleDuplicates.map((sticker) => (
                        <StickerPreview key={sticker.code} {...sticker} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 font-[var(--font-headline)] text-2xl font-bold text-secondary">
                    <ArrowLeftRight className="size-6" />
                    Abrir modo troca
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          <MetricStrip
            rating={rating}
            ratingCount={ratingCount}
            totalTrades={totalTrades}
            missingCount={missingCount}
          />
        </section>

        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-on-surface-variant">
                Atalhos
              </p>
              <h2 className="mt-2 font-[var(--font-headline)] text-3xl font-bold text-on-surface">
                Onde você quer ir?
              </h2>
            </div>
            <Button asChild variant="ghost" className="text-primary">
              <Link href="/album">
                Tudo
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {primaryShortcuts.map((shortcut) => (
              <ShortcutCard key={shortcut.href} shortcut={shortcut} />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {secondaryShortcuts.map((shortcut) => {
              const Icon = shortcut.icon;
              return (
                <Link key={shortcut.href} href={shortcut.href}>
                  <Card className="h-full border-outline-variant/60 bg-surface-container py-0 shadow-none transition duration-200 ease-out hover:-translate-y-0.5 hover:border-primary/50">
                    <CardContent className="flex items-center justify-between gap-3 p-4">
                      <div className="flex items-center gap-3">
                        <Icon className="size-5 text-primary" />
                        <span className="font-[var(--font-headline)] text-base font-bold text-on-surface">
                          {shortcut.title}
                        </span>
                      </div>
                      <ArrowUpRight className="size-4 text-on-surface-variant" />
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>

        {isAdmin && (
          <section className="space-y-3">
            <p className="font-mono text-xs font-bold uppercase tracking-[0.32em] text-on-surface-variant">
              Admin
            </p>
            <div className="grid gap-3 sm:grid-cols-2">
              {adminShortcuts.map((shortcut) => {
                const Icon = shortcut.icon;
                return (
                  <Link key={shortcut.href} href={shortcut.href}>
                    <Card className="border-outline-variant/60 bg-surface-container py-0 shadow-none transition duration-200 ease-out hover:-translate-y-0.5 hover:border-tertiary/50">
                      <CardContent className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                          <Icon className="size-5 text-tertiary" />
                          <span className="font-semibold">
                            {shortcut.title}
                          </span>
                        </div>
                        <ArrowUpRight className="size-4 text-tertiary" />
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
