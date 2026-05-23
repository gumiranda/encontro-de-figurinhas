"use client";

import { MapPin, Calendar, Star, Swords, Share2, Pencil } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { ProfileAvatar } from "./profile-avatar";
import { QRCanvas } from "./qr-canvas";

export interface ProfileUser {
  nickname: string;
  displayNickname: string;
  city: string;
  state: string;
  flag: string;
  joined: string;
  cardCode: string;
  cardNumber: string;
  rating: number;
  ratingCount: number;
  totalTrades: number;
  pasted: number;
  total: number;
  duplicatesCount: number;
  missingCount: number;
  distance?: string;
  matchCount?: number;
}

interface HeroProps {
  user: ProfileUser;
  variant?: "tradingCard" | "banner" | "credential";
  isPublic?: boolean;
  onShare?: () => void;
  onEdit?: () => void;
  onProposeTrade?: () => void;
}

function StatCell({
  label,
  value,
  accentClass,
}: {
  label: string;
  value: React.ReactNode;
  accentClass: string;
}) {
  return (
    <div className="border-r border-border p-2.5 text-center last:border-r-0">
      <div className={`font-mono text-xl font-bold ${accentClass}`}>{value}</div>
      <div className="mt-0.5 font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
    </div>
  );
}

export function TradingCardHero({
  user,
  variant = "tradingCard",
  isPublic = false,
  onShare,
  onEdit,
  onProposeTrade,
}: HeroProps) {
  if (variant === "banner") {
    return <BannerHero user={user} isPublic={isPublic} onShare={onShare} onEdit={onEdit} onProposeTrade={onProposeTrade} />;
  }
  if (variant === "credential") {
    return <CredentialHero user={user} isPublic={isPublic} onShare={onShare} onEdit={onEdit} onProposeTrade={onProposeTrade} />;
  }

  const albumPct = Math.round((user.pasted / user.total) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-slate-800/80 to-slate-900/90 p-5">
      {/* Background grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-5"
        style={{
          backgroundImage:
            "linear-gradient(rgba(149,170,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(149,170,255,0.3) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative z-10">
        {/* Top row: code + number */}
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
              COPA 2026
            </div>
            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-2xl">{user.flag}</span>
              <span className="font-mono text-xl tracking-wider">{user.cardCode}</span>
            </div>
          </div>
          <div className="shrink-0 text-right">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              N°
            </div>
            <div className="mt-0.5 font-display text-3xl font-bold leading-none text-amber-400">
              {user.cardNumber}
            </div>
          </div>
        </div>

        {/* Avatar */}
        <div className="mt-3.5 flex justify-center">
          <ProfileAvatar seed={user.nickname} size={104} />
        </div>

        {/* Name */}
        <div className="mt-3 text-center">
          <div className="font-display text-xl font-bold">@{user.displayNickname}</div>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {user.city}, {user.state}
            </span>
            <span className="h-1 w-1 rounded-full bg-border" />
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> Desde {user.joined}
            </span>
          </div>
        </div>

        {/* Stat strip */}
        <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-xl border border-border bg-slate-950/55">
          <StatCell
            label="Álbum"
            value={`${albumPct}%`}
            accentClass="text-primary"
          />
          <StatCell
            label="Trocas"
            value={user.totalTrades}
            accentClass="text-emerald-400"
          />
          <StatCell
            label="Reputação"
            value={
              <span className="inline-flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {user.rating}
              </span>
            }
            accentClass="text-amber-400"
          />
        </div>

        {/* Actions */}
        <div className="mt-3.5 flex gap-2">
          {isPublic ? (
            <>
              <Button className="flex-1 gap-1.5" onClick={onProposeTrade}>
                <Swords className="h-4 w-4" /> Propor troca
              </Button>
              <Button variant="outline" size="icon" onClick={onShare}>
                <Share2 className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button className="flex-1 gap-1.5" onClick={onShare}>
                <Share2 className="h-4 w-4" /> Compartilhar perfil
              </Button>
              <Button variant="outline" size="icon" onClick={onEdit}>
                <Pencil className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BannerHero({ user, isPublic, onShare, onEdit }: HeroProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-border">
      {/* Banner */}
      <div className="relative h-24 bg-gradient-to-br from-primary/40 to-slate-900">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(225,228,250,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(225,228,250,0.06) 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }}
        />
        <div className="absolute left-3.5 top-3 font-mono text-xs text-white/80">
          {user.cardCode} · #{user.cardNumber}
        </div>
        <div className="absolute right-3 top-3 flex gap-1.5">
          <Button
            variant="outline"
            size="sm"
            className="h-8 bg-slate-950/50 px-2.5"
            onClick={onShare}
          >
            <Share2 className="h-3.5 w-3.5" />
          </Button>
          {!isPublic && (
            <Button
              variant="outline"
              size="sm"
              className="h-8 bg-slate-950/50 px-2.5"
              onClick={onEdit}
            >
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="-mt-9 flex items-end gap-3.5 px-4 pb-4">
        <ProfileAvatar seed={user.nickname} size={72} />
        <div className="flex-1 pb-1">
          <div className="font-display text-lg font-bold">@{user.displayNickname}</div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <MapPin className="h-3 w-3" /> {user.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <Star className="h-3 w-3 text-amber-400" /> {user.rating}
            </span>
            <span>{user.totalTrades} trocas</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function CredentialHero({ user, isPublic, onEdit, onProposeTrade }: HeroProps) {
  const albumPct = Math.round((user.pasted / user.total) * 100);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-slate-800/80 to-slate-900/90">
      <div className="grid grid-cols-[auto_1fr] items-center gap-3.5 p-4">
        <div className="rounded-lg border border-border bg-white p-2">
          <QRCanvas
            size={70}
            text={`https://figurinhafacil.com.br/u/${user.nickname}`}
          />
        </div>
        <div className="min-w-0">
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-amber-400">
            CREDENCIAL · COPA 2026
          </div>
          <div className="mt-1 font-display text-lg font-bold">
            @{user.displayNickname}
          </div>
          <div className="mt-0.5 font-mono text-sm text-muted-foreground">
            {user.cardCode} · N° {user.cardNumber}
          </div>
        </div>
      </div>

      <div className="border-t border-dashed border-border" />

      <div className="flex items-center justify-between gap-2.5 p-3">
        <div className="flex items-center gap-3.5">
          <ProfileAvatar seed={user.nickname} size={44} ring={false} />
          <div>
            <div className="text-xs text-muted-foreground">Álbum</div>
            <div className="font-mono text-base font-bold">{albumPct}%</div>
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Trocas</div>
            <div className="font-mono text-base font-bold">{user.totalTrades}</div>
          </div>
        </div>
        <Button size="sm" onClick={isPublic ? onProposeTrade : onEdit}>
          {isPublic ? (
            <>
              <Swords className="mr-1.5 h-3.5 w-3.5" /> Trocar
            </>
          ) : (
            <>
              <Pencil className="mr-1.5 h-3.5 w-3.5" /> Editar
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
