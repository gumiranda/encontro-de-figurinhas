"use client";

import { CalendarDays, MapPin, Star } from "lucide-react";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";
import { Badge } from "@workspace/ui/components/badge";
import { QRCode } from "@workspace/ui/components/kibo-ui/qr-code";
import { cn } from "@workspace/ui/lib/utils";

export type HeroVariant = "trading-card" | "banner" | "credential";

type ProfileHeroProps = {
  variant: HeroVariant;
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
  isVerified?: boolean;
  profileUrl?: string;
};

function formatJoinedAt(timestamp: number | undefined) {
  if (!timestamp) return null;
  return new Intl.DateTimeFormat("pt-BR", {
    month: "short",
    year: "numeric",
  })
    .format(new Date(timestamp))
    .replace(".", "");
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

function HeroMeta({
  city,
  joinedAt,
}: {
  city?: { name: string; state: string } | null;
  joinedAt?: number;
}) {
  const joined = formatJoinedAt(joinedAt);
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
      {city && (
        <span className="inline-flex items-center gap-1">
          <MapPin className="size-3.5" />
          {city.name}, {city.state}
        </span>
      )}
      {joined && (
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="size-3.5" />
          desde {joined}
        </span>
      )}
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

function HeroTradingCard(props: ProfileHeroProps) {
  const name = displayName(props);

  return (
    <div className="relative overflow-hidden rounded-[22px] isolate">
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

      <div className="p-5">
        {/* Top row: code + number */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="min-w-0">
            <div className="font-mono text-xs font-semibold uppercase tracking-wider text-tertiary">
              COPA 2026
            </div>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-xl">{props.flag}</span>
              <span className="font-mono text-lg font-semibold tracking-wider text-foreground">
                {props.cardCode}
              </span>
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">N°</div>
            <div className="font-headline text-3xl font-bold text-tertiary leading-none mt-0.5">
              {props.cardNumber}
            </div>
          </div>
        </div>

        {/* Avatar + name */}
        <div className="flex items-center gap-4 mb-4">
          <div
            className="shrink-0 rounded-full p-[3px] shadow-[0_0_32px_rgba(149,170,255,0.25)]"
            style={{
              background: "radial-gradient(circle, #95aaff 0%, #3766ff 100%)",
            }}
          >
            <MatchDicebearAvatar
              seed={props.avatarSeed}
              size={72}
              fallbackInitials={initialsFromName(name)}
              className="border-2 border-[#0d1323]"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="font-headline text-xl font-bold truncate">@{name}</h2>
            <HeroMeta city={props.city} joinedAt={props.joinedAt} />
          </div>
        </div>

        {/* Badges row */}
        <div className="flex flex-wrap items-center gap-2">
          <RatingBadge ratingAvg={props.ratingAvg} ratingCount={props.ratingCount} />
          <Badge variant="outline" className="border-white/10">
            {props.totalTrades} trocas
          </Badge>
        </div>
      </div>
    </div>
  );
}

function HeroBannerSocial(props: ProfileHeroProps) {
  const name = displayName(props);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-high border border-white/10 p-5">
      <div className="flex items-center gap-4">
        <div
          className="shrink-0 rounded-full p-[3px] shadow-[0_0_24px_rgba(79,243,37,0.2)]"
          style={{
            background: "radial-gradient(circle, #4ff325 0%, #3ee40c 100%)",
          }}
        >
          <MatchDicebearAvatar
            seed={props.avatarSeed}
            size={80}
            fallbackInitials={initialsFromName(name)}
            className="border-2 border-background"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-headline text-2xl font-bold truncate">@{name}</h2>
            <span className="text-xl">{props.flag}</span>
          </div>
          <HeroMeta city={props.city} joinedAt={props.joinedAt} />
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <RatingBadge ratingAvg={props.ratingAvg} ratingCount={props.ratingCount} />
            <Badge variant="outline" className="border-white/10">
              {props.totalTrades} trocas
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroCredential(props: ProfileHeroProps) {
  const name = displayName(props);
  const qrUrl = props.profileUrl || `https://figurinhafacil.com.br/u/${props.nickname}`;

  return (
    <div className="relative overflow-hidden rounded-2xl bg-surface-container-high border border-white/10">
      {/* Top accent bar */}
      <div
        className="h-2"
        style={{
          background: "linear-gradient(90deg, #95aaff, #4ff325, #ffc965)",
        }}
      />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* QR Code */}
          <div className="shrink-0 rounded-xl bg-white p-3">
            <QRCode
              data={qrUrl}
              foreground="#0d1323"
              background="#ffffff"
              robustness="M"
            />
          </div>

          {/* Profile info */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{props.flag}</span>
              <span className="font-mono text-sm font-semibold text-tertiary">
                {props.cardCode}
              </span>
            </div>

            <div
              className="shrink-0 rounded-full p-[2px] w-fit mb-2"
              style={{
                background: "radial-gradient(circle, #ffc965 0%, #ecaa00 100%)",
              }}
            >
              <MatchDicebearAvatar
                seed={props.avatarSeed}
                size={48}
                fallbackInitials={initialsFromName(name)}
                className="border-2 border-background"
              />
            </div>

            <h2 className="font-headline text-lg font-bold truncate">@{name}</h2>
            <HeroMeta city={props.city} joinedAt={props.joinedAt} />

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <RatingBadge ratingAvg={props.ratingAvg} ratingCount={props.ratingCount} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileHero(props: ProfileHeroProps) {
  switch (props.variant) {
    case "banner":
      return <HeroBannerSocial {...props} />;
    case "credential":
      return <HeroCredential {...props} />;
    default:
      return <HeroTradingCard {...props} />;
  }
}
