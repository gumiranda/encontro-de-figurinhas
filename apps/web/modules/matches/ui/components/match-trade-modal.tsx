"use client";

import { useQuery, useMutation } from "convex/react";
import { ArrowRight, ArrowUpRight, ArrowDownLeft, Check, Search, X, Repeat } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import type { StickerWithQty } from "@workspace/backend/convex/matches";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
} from "@workspace/ui/components/dialog";
import { Input } from "@workspace/ui/components/input";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Spinner } from "@workspace/ui/components/kibo-ui/spinner";
import { cn } from "@workspace/ui/lib/utils";

import { MatchDicebearAvatar } from "./match-dicebear-avatar";

type Fairness = "ok" | "warn" | "none";

function calcFairness(give: number, receive: number): Fairness {
  if (give === 0 || receive === 0) return "none";
  const diff = Math.abs(give - receive);
  if (diff <= 1) return "ok";
  return "warn";
}

type Section = {
  code: string;
  name: string;
  startNumber: number;
  endNumber: number;
  goldenNumbers: number[];
  legendNumbers: number[];
};

function buildSectionMap(sections: Section[]): Map<number, Section> {
  const map = new Map<number, Section>();
  for (const s of sections) {
    for (let n = s.startNumber; n <= s.endNumber; n++) {
      map.set(n, s);
    }
  }
  return map;
}

function StickerSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 p-6 md:grid-cols-[1fr_auto_1fr]">
      <div className="space-y-3 rounded-2xl border border-border/50 bg-card/30 p-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-full" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </div>
      <div className="flex items-center justify-center">
        <Skeleton className="h-24 w-28 rounded-xl" />
      </div>
      <div className="space-y-3 rounded-2xl border border-border/50 bg-card/30 p-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-9 w-full" />
        <div className="grid grid-cols-5 gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[3/4] rounded-lg" />
          ))}
        </div>
      </div>
    </div>
  );
}

type StickerCardProps = {
  sticker: StickerWithQty;
  section: Section | undefined;
  selected: boolean;
  onToggle: () => void;
  variant: "give" | "receive";
};

function StickerCard({ sticker, section, selected, onToggle, variant }: StickerCardProps) {
  const isRare =
    section?.goldenNumbers.includes(sticker.num) ||
    section?.legendNumbers.includes(sticker.num);

  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        "group relative flex aspect-[3/4] flex-col items-center justify-center rounded-xl border-[1.5px] font-mono text-sm font-semibold transition-all duration-150",
        "hover:-translate-y-0.5 hover:shadow-md",
        "overflow-hidden",
        selected && variant === "give" &&
          "border-tertiary bg-tertiary/10 shadow-[0_0_0_3px_rgba(255,201,101,0.1)]",
        selected && variant === "receive" &&
          "border-primary bg-primary/10 shadow-[0_0_0_3px_rgba(149,170,255,0.1)]",
        !selected && "border-transparent bg-muted/50 hover:border-primary/30",
        isRare && !selected && "bg-gradient-to-br from-tertiary/10 to-secondary/5"
      )}
    >
      {/* Top gradient band */}
      <div className="absolute inset-x-[3px] top-[3px] h-[22%] rounded bg-gradient-to-br from-primary/20 to-primary/5" />

      {/* Type badge */}
      {section && (
        <span
          className={cn(
            "absolute right-1 top-0.5 text-[9px] font-bold tracking-wide",
            isRare ? "text-tertiary" : "text-muted-foreground"
          )}
        >
          {section.code}
        </span>
      )}

      {/* Number */}
      <span className="relative mt-2 text-base font-bold text-foreground">{sticker.num}</span>

      {/* Quantity */}
      {sticker.qty > 1 && (
        <span className="absolute bottom-0.5 right-1 text-[9px] font-bold text-tertiary">
          ×{sticker.qty}
        </span>
      )}

      {/* Selected checkmark */}
      {selected && (
        <span
          className={cn(
            "absolute -left-1 -top-1 flex size-4 items-center justify-center rounded-full border-2 border-background text-[10px]",
            variant === "give" ? "bg-tertiary text-tertiary-foreground" : "bg-primary text-primary-foreground"
          )}
        >
          <Check className="size-2.5" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}

type FilterChip = "all" | "rare" | "legend";

type StickerColumnProps = {
  title: string;
  subtitle: string;
  stickers: StickerWithQty[];
  selected: Set<number>;
  onToggle: (num: number) => void;
  sections: Section[];
  sectionMap: Map<number, Section>;
  variant: "give" | "receive";
};

function StickerColumn({
  title,
  subtitle,
  stickers,
  selected,
  onToggle,
  sectionMap,
  variant,
}: StickerColumnProps) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterChip>("all");

  const filteredStickers = useMemo(() => {
    let result = stickers;

    // Apply search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => {
        if (String(s.num).includes(q)) return true;
        const sec = sectionMap.get(s.num);
        if (sec?.code.toLowerCase().includes(q)) return true;
        if (sec?.name.toLowerCase().includes(q)) return true;
        return false;
      });
    }

    // Apply filter
    if (filter === "rare") {
      result = result.filter((s) => {
        const sec = sectionMap.get(s.num);
        return sec?.goldenNumbers.includes(s.num);
      });
    } else if (filter === "legend") {
      result = result.filter((s) => {
        const sec = sectionMap.get(s.num);
        return sec?.legendNumbers.includes(s.num);
      });
    }

    return result;
  }, [stickers, search, filter, sectionMap]);

  const rareCount = useMemo(() =>
    stickers.filter((s) => sectionMap.get(s.num)?.goldenNumbers.includes(s.num)).length,
    [stickers, sectionMap]
  );

  const legendCount = useMemo(() =>
    stickers.filter((s) => sectionMap.get(s.num)?.legendNumbers.includes(s.num)).length,
    [stickers, sectionMap]
  );

  const handleSelectAll = () => {
    const allSelected = filteredStickers.every((s) => selected.has(s.num));
    for (const s of filteredStickers) {
      if (allSelected && selected.has(s.num)) {
        onToggle(s.num);
      } else if (!allSelected && !selected.has(s.num)) {
        onToggle(s.num);
      }
    }
  };

  return (
    <div className="flex min-h-[380px] flex-col gap-3.5 rounded-2xl border border-border/50 bg-card/30 p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div
            className={cn(
              "flex size-8 items-center justify-center rounded-lg",
              variant === "give" ? "bg-tertiary/15 text-tertiary" : "bg-primary/15 text-primary"
            )}
          >
            {variant === "give" ? (
              <ArrowUpRight className="size-[18px]" />
            ) : (
              <ArrowDownLeft className="size-[18px]" />
            )}
          </div>
          <div>
            <p className="text-[15px] font-bold tracking-tight">{title}</p>
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <button
          onClick={handleSelectAll}
          className="rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-bold text-primary transition-colors hover:bg-primary/20"
        >
          Todas
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 px-3 py-2">
        <Search className="size-4 text-muted-foreground" />
        <input
          placeholder="Buscar nº ou time..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors",
            filter === "all"
              ? "bg-primary/15 text-primary ring-1 ring-primary/30"
              : "bg-muted/50 text-muted-foreground hover:bg-muted"
          )}
        >
          Todas · {stickers.length}
        </button>
        {rareCount > 0 && (
          <button
            onClick={() => setFilter("rare")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors",
              filter === "rare"
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Raras · {rareCount}
          </button>
        )}
        {legendCount > 0 && (
          <button
            onClick={() => setFilter("legend")}
            className={cn(
              "rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-colors",
              filter === "legend"
                ? "bg-primary/15 text-primary ring-1 ring-primary/30"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
          >
            Legendas · {legendCount}
          </button>
        )}
      </div>

      {/* Sticker Grid */}
      <div className="flex-1 overflow-y-auto pr-1">
        {filteredStickers.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            {search || filter !== "all" ? "Nenhuma figurinha encontrada" : "Nenhuma figurinha disponível"}
          </p>
        ) : (
          <div className="grid grid-cols-[repeat(auto-fill,minmax(54px,1fr))] gap-2">
            {filteredStickers.map((sticker) => (
              <StickerCard
                key={sticker.num}
                sticker={sticker}
                section={sectionMap.get(sticker.num)}
                selected={selected.has(sticker.num)}
                onToggle={() => onToggle(sticker.num)}
                variant={variant}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

type ExchangeWidgetProps = {
  giveCount: number;
  receiveCount: number;
};

function ExchangeWidget({ giveCount, receiveCount }: ExchangeWidgetProps) {
  const fairness = calcFairness(giveCount, receiveCount);

  return (
    <div className="flex flex-row items-center justify-center gap-3 py-2 md:flex-col md:gap-3.5 md:py-0">
      {/* Balance */}
      <div className="rounded-xl border border-border/50 bg-muted/30 px-3.5 py-3 text-center md:min-w-[130px]">
        <div className="flex items-baseline justify-center gap-1.5 font-bold">
          <span className="text-2xl tracking-tight text-tertiary">{giveCount}</span>
          <span className="text-base text-muted-foreground">→</span>
          <span className="text-2xl tracking-tight text-primary">{receiveCount}</span>
        </div>
        <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
          Balanço
        </p>
      </div>

      {/* Swap icon */}
      <div className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-tertiary to-primary text-white shadow-lg shadow-primary/30 md:size-14 md:rotate-0 rotate-90">
        <Repeat className="size-5 md:size-6" />
      </div>

      {/* Fairness */}
      <div
        className={cn(
          "rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide",
          fairness === "ok" && "bg-secondary/15 text-secondary",
          fairness === "warn" && "bg-tertiary/15 text-tertiary",
          fairness === "none" && "bg-muted/50 text-muted-foreground"
        )}
      >
        {fairness === "ok" && "✓ Troca justa"}
        {fairness === "warn" && "Desbalanceada"}
        {fairness === "none" && "Selecione"}
      </div>
    </div>
  );
}

export type MatchTradeModalProps = {
  matchedUserId: Id<"users">;
  matchedUserNickname: string;
  tradePointId: Id<"tradePoints">;
  distanceKm: number;
  albumPct: number;
  tradesCount: number;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
};

function MatchTradeModalContent({
  matchedUserId,
  matchedUserNickname,
  tradePointId,
  distanceKm,
  albumPct,
  tradesCount,
  onOpenChange,
  onSuccess,
}: Omit<MatchTradeModalProps, "open">) {
  const [stickersIGive, setStickersIGive] = useState<Set<number>>(new Set());
  const [stickersIReceive, setStickersIReceive] = useState<Set<number>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const data = useQuery(api.matches.getFullStickerOverlap, {
    matchedUserId,
    tradePointId,
  });

  const initiateTrade = useMutation(api.trades.initiate);

  const sectionMap = useMemo(() => {
    if (!data?.sections) return new Map<number, Section>();
    return buildSectionMap(data.sections);
  }, [data?.sections]);

  const toggleGive = useCallback((n: number) => {
    setStickersIGive((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }, []);

  const toggleReceive = useCallback((n: number) => {
    setStickersIReceive((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n);
      else next.add(n);
      return next;
    });
  }, []);

  useEffect(() => {
    if (data === null) {
      toast.error("Não foi possível carregar a proposta");
      onOpenChange(false);
    }
  }, [data, onOpenChange]);

  const handleSubmit = async () => {
    if (stickersIGive.size === 0 || stickersIReceive.size === 0) {
      toast.error("Selecione pelo menos uma figurinha em cada seção");
      return;
    }

    setIsSubmitting(true);
    try {
      await initiateTrade({
        matchedUserId,
        tradePointId,
        stickersIGive: [...stickersIGive],
        stickersIReceive: [...stickersIReceive],
      });
      toast.success("Proposta de troca enviada!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err) {
      const message =
        err instanceof Error && err.message.includes("TOO_MANY_PENDING")
          ? "Você já tem muitas trocas pendentes"
          : err instanceof Error && err.message.includes("ALREADY_PENDING")
            ? "Já existe uma proposta pendente com este usuário"
            : err instanceof Error && err.message.includes("NO_MATCH")
              ? "Não foi possível validar o match. Confira se ainda estão no mesmo ponto."
              : err instanceof Error && err.message.includes("INVALID_STICKER")
                ? "Figurinha inválida para esta troca"
                : err instanceof Error && err.message.includes("STICKERS_CHANGED")
                  ? "Algumas figurinhas já foram trocadas"
                  : "Erro ao enviar proposta";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (data === undefined) {
    return <StickerSkeleton />;
  }

  if (data === null) {
    return null;
  }

  const giveCount = stickersIGive.size;
  const receiveCount = stickersIReceive.size;
  const canSubmit = giveCount > 0 && receiveCount > 0 && !isSubmitting;

  // Count rare stickers being received
  const rareReceiveCount = [...stickersIReceive].filter((num) => {
    const sec = sectionMap.get(num);
    return sec?.goldenNumbers.includes(num) || sec?.legendNumbers.includes(num);
  }).length;

  // Match percentage calculation
  const matchPct = Math.round(
    (Math.min(data.theyHaveINeed.length, data.iHaveTheyNeed.length) /
      Math.max(data.theyHaveINeed.length, data.iHaveTheyNeed.length, 1)) *
      100
  );

  const firstName = matchedUserNickname.split(" ")[0];

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-border/50 px-5 py-4 md:px-7">
        <div className="relative">
          <MatchDicebearAvatar seed={data.matchedUser.avatarSeed} size={52} className="rounded-2xl" />
          <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full border-2 border-background bg-secondary" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-base font-bold tracking-tight">{data.matchedUser.displayNickname}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <span>{distanceKm.toFixed(1)} km</span>
            <span className="size-0.5 rounded-full bg-muted-foreground" />
            <span>⭐ 4.9 · {tradesCount} trocas</span>
          </div>
        </div>
        <div className="rounded-xl border border-secondary/30 bg-secondary/10 px-3 py-1.5 text-center">
          <p className="text-xl font-extrabold leading-none tracking-tight text-secondary">{matchPct}%</p>
          <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.12em] text-secondary">match</p>
        </div>
        <button
          onClick={() => onOpenChange(false)}
          className="flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 md:overflow-visible md:p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr]">
          <StickerColumn
            title="Você oferece"
            subtitle={`Repetidas que ${firstName} precisa`}
            stickers={data.iHaveTheyNeed}
            selected={stickersIGive}
            onToggle={toggleGive}
            sections={data.sections}
            sectionMap={sectionMap}
            variant="give"
          />

          <ExchangeWidget giveCount={giveCount} receiveCount={receiveCount} />

          <StickerColumn
            title="Você recebe"
            subtitle={`Repetidas de ${firstName} que faltam`}
            stickers={data.theyHaveINeed}
            selected={stickersIReceive}
            onToggle={toggleReceive}
            sections={data.sections}
            sectionMap={sectionMap}
            variant="receive"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="flex flex-col gap-3 border-t border-border/50 bg-background/50 px-5 py-4 backdrop-blur-sm sm:flex-row sm:items-center sm:justify-between md:px-7">
        <div className="flex flex-wrap items-center justify-center gap-3.5 text-sm text-muted-foreground sm:justify-start">
          <span className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded bg-tertiary/15 text-tertiary">
              <ArrowUpRight className="size-3" />
            </span>
            Dando <strong className="font-bold text-foreground">{giveCount} figurinhas</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="flex size-5 items-center justify-center rounded bg-primary/15 text-primary">
              <ArrowDownLeft className="size-3" />
            </span>
            Recebendo <strong className="font-bold text-foreground">{receiveCount} figurinhas</strong>
            {rareReceiveCount > 0 && (
              <span className="text-tertiary">({rareReceiveCount} raras)</span>
            )}
          </span>
        </div>
        <div className="flex justify-center gap-2 sm:justify-end">
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={!canSubmit} className="gap-2">
            {isSubmitting && <Spinner className="size-4" />}
            Enviar proposta
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function MatchTradeModal({
  open,
  onOpenChange,
  ...props
}: MatchTradeModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="flex h-full max-h-dvh w-full max-w-[980px] flex-col overflow-hidden rounded-none border-0 p-0 md:h-auto md:max-h-[min(92vh,820px)] md:rounded-3xl md:border"
        showCloseButton={false}
      >
        {open && (
          <MatchTradeModalContent {...props} onOpenChange={onOpenChange} />
        )}
      </DialogContent>
    </Dialog>
  );
}
