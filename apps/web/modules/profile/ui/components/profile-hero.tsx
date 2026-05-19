"use client";

import Link from "next/link";
import { CalendarDays, MapPin, Pencil, Share2, Star } from "lucide-react";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
import { Button } from "@workspace/ui/components/button";

type ProfileHeroProps = {
  nickname: string;
  displayNickname?: string;
  avatarSeed: string;
  flag: string;
  cardCode: string;
  cardNumber: string;
  city?: { name: string; state: string } | null;
  joinedAt?: number;
  ratingAvg?: number;
  ratingCount: number;
  totalTrades: number;
  albumCompletionPct: number;
  isVerified?: boolean;
  profileUrl?: string;
  isPublic?: boolean;
  onShare?: () => void;
};

function formatJoinedAt(timestamp: number | undefined) {
  if (!timestamp) return null;
  const formatted = new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "2-digit",
  })
    .format(new Date(timestamp))
    .replace(".", "");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

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

function formatPercent(value: number) {
  return `${value.toFixed(value % 1 === 0 ? 0 : 1)}%`;
}

export function ProfileHero(props: ProfileHeroProps) {
  const name = displayName(props);
  const joinedAt = formatJoinedAt(props.joinedAt);

  return (
    <div className="relative rounded-[22px] isolate w-full overflow-hidden" style={{ maxWidth: "calc(100vw - 48px)" }}>
      {/* Gradient background */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background: `
            radial-gradient(80% 60% at 80% 10%, rgba(149,170,255,0.35), transparent 60%),
            radial-gradient(60% 50% at 10% 90%, rgba(79,243,37,0.18), transparent 60%),
            linear-gradient(160deg, #1a2547 0%, #13192b 60%, #0d1323 100%)
          `,
        }}
      />

      {/* Foil shimmer effect */}
      <div
        className="absolute inset-0 -z-10 opacity-70 mix-blend-screen"
        style={{
          background: `conic-gradient(from 220deg at 30% 30%,
            rgba(255,201,101,0.0) 0deg,
            rgba(149,170,255,0.18) 90deg,
            rgba(79,243,37,0.12) 180deg,
            rgba(255,201,101,0.18) 270deg,
            rgba(255,201,101,0.0) 360deg
          )`,
        }}
      />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(149,170,255,0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(149,170,255,0.06) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          backgroundPosition: "-1px -1px",
          maskImage: "radial-gradient(110% 80% at 50% 30%, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(110% 80% at 50% 30%, black 30%, transparent 80%)",
        }}
      />

      {/* Shimmer animation overlay */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-[-20%] left-0 w-[30%] h-[140%] animate-shimmer-foil"
          style={{
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
          }}
        />
      </div>

      <div className="px-3 py-4 sm:p-5">
        {/* Top row: code + number */}
        <div className="flex justify-between items-start gap-2 mb-4 sm:mb-6">
          <div className="min-w-0">
            <div className="font-mono text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-tertiary">
              COPA 2026
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 mt-1">
              <span className="text-lg sm:text-xl">{props.flag}</span>
              <span className="font-mono text-base sm:text-lg font-semibold tracking-wider text-foreground">
                {props.cardCode}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-mono text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground">N°</div>
            <div className="font-headline text-2xl sm:text-3xl font-bold text-tertiary leading-none mt-0.5">
              {props.cardNumber}
            </div>
          </div>
        </div>

        {/* Centered avatar */}
        <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
          <div
            className="shrink-0 rounded-full p-[3px] sm:p-[4px] shadow-[0_0_32px_rgba(79,243,37,0.25)] sm:shadow-[0_0_40px_rgba(79,243,37,0.3)]"
            style={{
              background: "conic-gradient(from 180deg, #4ff325 0deg, #ffc965 180deg, #4ff325 360deg)",
            }}
          >
            <MatchDicebearAvatar
              seed={props.avatarSeed}
              size={88}
              fallbackInitials={initialsFromName(name)}
              className="border-[3px] border-[#0d1323] sm:size-[100px]"
            />
          </div>

          {/* Username */}
          <h2 className="font-headline text-xl sm:text-2xl font-bold mt-3 sm:mt-4 truncate max-w-full px-2">
            @{name}
          </h2>

          {/* Location + joined date */}
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs sm:text-sm text-muted-foreground mt-1">
            {props.city && (
              <span className="inline-flex items-center gap-1">
                <MapPin className="size-3 sm:size-3.5" />
                {props.city.name}, {props.city.state}
              </span>
            )}
            {props.city && joinedAt && (
              <span className="text-muted-foreground/50">•</span>
            )}
            {joinedAt && (
              <span className="inline-flex items-center gap-1">
                <CalendarDays className="size-3 sm:size-3.5" />
                Desde {joinedAt}
              </span>
            )}
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 rounded-lg border border-white/10 bg-surface-container/50 overflow-hidden">
          <div className="py-2.5 text-center border-r border-white/10">
            <p className="font-headline text-lg font-bold text-primary">
              {formatPercent(props.albumCompletionPct)}
            </p>
            <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">
              Álbum
            </p>
          </div>
          <div className="py-2.5 text-center border-r border-white/10">
            <p className="font-headline text-lg font-bold text-secondary">
              {props.totalTrades}
            </p>
            <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">
              Trocas
            </p>
          </div>
          <div className="py-2.5 text-center">
            <p className="font-headline text-lg font-bold text-tertiary flex items-center justify-center gap-0.5">
              <Star className="size-3 fill-current" />
              {props.ratingAvg?.toFixed(1) ?? "—"}
            </p>
            <p className="font-mono text-[8px] uppercase tracking-wider text-muted-foreground mt-0.5">
              Reputação
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-4">
          <Button
            className="flex-1 gap-2 bg-primary/90 text-primary-foreground hover:bg-primary text-sm sm:text-base"
            onClick={props.onShare}
            disabled={!props.isPublic}
          >
            <Share2 className="size-4 shrink-0" />
            <span className="truncate">Compartilhar perfil</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-white/10 bg-white/5 hover:bg-white/10"
            asChild
          >
            <Link href="/perfil/editar">
              <Pencil className="size-4" />
              <span className="sr-only">Editar perfil</span>
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
