"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import { ChevronRight, Inbox, MessageCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import type { ListMyTradeRow } from "@workspace/backend/convex/trades";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";

import { SectionLookupProvider } from "@/modules/stickers/lib/section-lookup-context";

import { mapTradeError } from "../../lib/format";

import { ProposalDetailFooter } from "../components/proposal-detail-footer";
import { ProposalDetailHero } from "../components/proposal-detail-hero";
import { ProposalDetailInsights } from "../components/proposal-detail-insights";
import { ProposalDetailTradeGrid } from "../components/proposal-detail-trade-grid";

export function ProposalDetailView({ id }: { id: Id<"trades"> }) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const trade = useQuery(
    api.trades.getTradeById,
    isAuthenticated ? { tradeId: id } : "skip"
  );
  const sections = useQuery(api.album.getSections, {});

  const confirmTrade = useMutation(api.trades.confirm);
  const declineTrade = useMutation(api.trades.decline);
  const cancelTrade = useMutation(api.trades.cancel);

  const [isPending, setIsPending] = useState(false);

  const breadcrumbName = useMemo(() => {
    if (!trade) return "";
    return (
      trade.counterparty.nickname?.trim() ||
      trade.counterparty.name ||
      "Colecionador"
    );
  }, [trade]);

  if (authLoading || trade === undefined) return <DetailSkeleton />;
  if (trade === null) return <ProposalUnavailable />;

  const ratio = `${trade.stickersIGive.length}:${trade.stickersIReceive.length}`;

  const run = async (
    fn: () => Promise<unknown>,
    successMsg: string
  ) => {
    if (isPending) return;
    setIsPending(true);
    try {
      await fn();
      toast.success(successMsg);
      router.push("/propostas");
    } catch (err) {
      const { message, code } = mapTradeError(err);
      toast.error(message, {
        action:
          code === "STATE_CHANGED"
            ? { label: "Recarregar", onClick: () => router.refresh() }
            : undefined,
      });
      console.error(err);
    } finally {
      setIsPending(false);
    }
  };

  const handleAccept = () =>
    run(
      () => confirmTrade({ tradeId: trade._id }),
      "Proposta aceita. Combine o encontro pelo chat."
    );
  const handleDecline = () =>
    run(() => declineTrade({ tradeId: trade._id }), "Proposta recusada.");
  const handleCancel = () =>
    run(() => cancelTrade({ tradeId: trade._id }), "Proposta cancelada.");

  return (
    <SectionLookupProvider sections={sections ?? []}>
      <div className="space-y-5 pb-24">
        <h1 className="sr-only">
          Proposta com {breadcrumbName} — {ratio}
        </h1>
        <Breadcrumb name={breadcrumbName} ratio={ratio} />
        <ProposalDetailHero trade={trade} />
        <ProposalDetailInsights trade={trade} />
        {trade.initiatorMessage && (
          <Message text={trade.initiatorMessage} from={breadcrumbName} />
        )}
        <ProposalDetailTradeGrid trade={trade} />
        <ProposalDetailFooter
          trade={trade}
          isPending={isPending}
          onAccept={handleAccept}
          onDecline={handleDecline}
          onCancel={handleCancel}
        />
      </div>
    </SectionLookupProvider>
  );
}

function Breadcrumb({ name, ratio }: { name: string; ratio: string }) {
  return (
    <nav
      aria-label="Trilha"
      className="flex items-center gap-1.5 text-xs text-on-surface-variant"
    >
      <Link href="/" className="hover:text-on-surface">
        Início
      </Link>
      <ChevronRight className="size-3 opacity-40" aria-hidden />
      <Link href="/propostas" className="hover:text-on-surface">
        Propostas
      </Link>
      <ChevronRight className="size-3 opacity-40" aria-hidden />
      <span className="font-headline font-bold text-on-surface truncate">
        {name} · {ratio}
      </span>
    </nav>
  );
}

function Message({ text, from }: { text: string; from: string }) {
  return (
    <section className="rounded-2xl border border-outline-variant/15 bg-surface-container-low p-4 sm:p-5">
      <div className="mb-2 flex items-center gap-2">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <MessageCircle className="size-4" aria-hidden />
        </span>
        <p className="font-headline text-sm font-bold tracking-tight">
          Mensagem de {from}
        </p>
      </div>
      <p className="pl-9 text-sm italic text-on-surface-variant">
        &ldquo;{text}&rdquo;
      </p>
    </section>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true">
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <Skeleton className="h-24 rounded-2xl" />
      <div className="grid gap-3 lg:grid-cols-[1fr_auto_1fr]">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-32 w-20 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

function ProposalUnavailable() {
  return (
    <div className="grid place-items-center rounded-2xl border border-outline-variant/15 bg-surface-container-low px-6 py-16 text-center">
      <span className="grid size-12 place-items-center rounded-2xl bg-surface-container text-on-surface-variant">
        <Inbox className="size-6" aria-hidden />
      </span>
      <h1 className="mt-4 font-headline text-xl font-extrabold tracking-tight">
        Proposta não disponível
      </h1>
      <p className="mt-1 max-w-sm text-sm text-on-surface-variant">
        Pode ter sido cancelada, recusada ou removida — ou você não tem acesso a
        ela.
      </p>
      <Button asChild className="mt-5" size="sm">
        <Link href="/propostas">Voltar para propostas</Link>
      </Button>
    </div>
  );
}

export type { ListMyTradeRow };
