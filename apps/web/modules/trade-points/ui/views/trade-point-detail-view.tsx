"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { ConvexError } from "convex/values";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ArrowLeft, Flag, Share2 } from "lucide-react";
import { toast } from "sonner";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog";
import { Label } from "@workspace/ui/components/label";
import { RadioGroup, RadioGroupItem } from "@workspace/ui/components/radio-group";
import { FullPageLoader } from "@/components/full-page-loader";
import { useShare } from "../../lib/use-share";
import { useStableValue } from "../../lib/use-stable-value";
import { useTradePoint } from "../../lib/use-trade-point";
import { BannedState } from "../components/banned-state";
import { ConfidenceGaugeCard } from "../components/confidence-gauge-card";
import { MatchesSection } from "../components/matches-section";
import { PresentMatchesSection } from "../components/present-matches-section";
import { PeakHoursChart } from "../components/peak-hours-chart";
import { PointActions } from "../components/point-actions";
import { PointDetailIdentity } from "../components/point-detail-identity";
import { PointHero } from "../components/point-hero";
import { PointLifecycleCard } from "../components/point-lifecycle-card";
import { PointStatsStrip } from "../components/point-stats-strip";
import { WhatsappButton } from "../components/whatsapp-button";

const REPORT_CATEGORIES = [
  "suspicious_behavior",
  "private_contact_attempt",
  "minor_approach",
  "inappropriate_content",
  "broken_whatsapp_link",
  "inactive_point",
  "other",
] as const;

type ReportCategory = (typeof REPORT_CATEGORIES)[number];

const REPORT_CATEGORY_LABEL: Record<ReportCategory, string> = {
  suspicious_behavior: "Comportamento suspeito",
  private_contact_attempt: "Tentativa de contato privado",
  minor_approach: "Abordagem a menores",
  inappropriate_content: "Conteúdo inadequado",
  broken_whatsapp_link: "Link do WhatsApp quebrado",
  inactive_point: "Ponto inativo",
  other: "Outro",
};

function reportErrorCode(error: unknown): string | undefined {
  if (error instanceof ConvexError && typeof error.data === "string") {
    return error.data;
  }
  return undefined;
}

type Props = {
  tradePointId: Id<"tradePoints">;
};

export function TradePointDetailView({ tradePointId }: Props) {
  const data = useTradePoint(tradePointId);
  const router = useRouter();
  const share = useShare();
  const joinButtonRef = useRef<HTMLButtonElement>(null);

  const [reportOpen, setReportOpen] = useState(false);
  const [reportCategory, setReportCategory] = useState<ReportCategory | null>(
    null
  );
  const [reportBusy, setReportBusy] = useState(false);
  const [cancelBusy, setCancelBusy] = useState(false);

  const cancelPendingPoint = useMutation(api.tradePoints.cancelPendingPoint);
  const submitReport = useMutation(api.tradePoints.submitReport);

  useEffect(() => {
    if (data?.state === "needs-auth") {
      router.replace("/sign-in");
    } else if (data?.state === "needs-onboarding") {
      router.replace("/complete-profile");
    }
  }, [data?.state, router]);

  const stablePeakHours = useStableValue(
    data?.state === "ready" ? data.point.peakHours : undefined
  );

  if (!data) return <FullPageLoader />;
  if (data.state === "needs-auth" || data.state === "needs-onboarding") {
    return null;
  }
  if (data.state === "banned") return <BannedState />;

  if (data.state === "pending-owner") {
    const { point } = data;
    const submittedAgo = formatDistanceToNow(point.createdAt, {
      addSuffix: true,
      locale: ptBR,
    });

    async function handleCancelPending() {
      setCancelBusy(true);
      try {
        await cancelPendingPoint({ tradePointId });
        router.push("/meus-pontos");
      } catch {
        toast.error("Não foi possível cancelar. Tente novamente.");
      } finally {
        setCancelBusy(false);
      }
    }

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-24 sm:px-6 xl:max-w-6xl 2xl:max-w-[90rem]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-outline-variant/20 bg-[color:var(--surface-container-low)] px-6 shadow-lg shadow-blue-950/25 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="line-clamp-1 flex-1 text-center font-headline text-base font-semibold uppercase tracking-tight text-primary">
            {point.name}
          </h2>
          <span className="size-10 shrink-0" aria-hidden />
        </header>

        <div className="rounded-xl border border-border bg-muted/40 px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            Sua solicitação está aguardando análise.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Enviada {submittedAgo}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              variant="destructive"
              disabled={cancelBusy}
              onClick={() => void handleCancelPending()}
            >
              {cancelBusy ? "Cancelando…" : "Cancelar solicitação"}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/meus-pontos">Ver meus pontos</Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-outline-variant mt-20 pb-4 text-center">
          Ponto de Troca © 2024
        </p>
      </div>
    );
  }

  if (data.state === "expired-owner") {
    const { point } = data;

    return (
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-4 px-4 pb-24 sm:px-6 xl:max-w-6xl 2xl:max-w-[90rem]">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-outline-variant/20 bg-[color:var(--surface-container-low)] px-6 shadow-lg shadow-blue-950/25 backdrop-blur-xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="Voltar"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="line-clamp-1 flex-1 text-center font-headline text-base font-semibold uppercase tracking-tight text-primary">
            {point.name}
          </h2>
          <span className="size-10 shrink-0" aria-hidden />
        </header>

        <div className="rounded-xl border border-border bg-muted/40 px-4 py-4">
          <p className="text-sm font-medium text-foreground">
            Este ponto expirou e não aparece mais no mapa.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Envie uma nova solicitação para voltar a participar.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                href={`/ponto/solicitar?fromExpired=${tradePointId}`}
              >
                Re-submeter
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/meus-pontos">Ver meus pontos</Link>
            </Button>
          </div>
        </div>

        <p className="text-xs text-outline-variant mt-20 pb-4 text-center">
          Ponto de Troca © 2024
        </p>
      </div>
    );
  }

  if (data.state === "not-found") {
    notFound();
  }

  if (data.state !== "ready") {
    notFound();
  }

  const {
    point,
    city,
    participantCount,
    isParticipant,
    activeCheckinsCount,
    hasActiveCheckin,
    whatsapp,
  } = data;

  async function handleShare() {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const url = `${origin}/ponto/${point.slug}`;
    await share({
      title: point.name,
      text: `Confira o ponto de troca ${point.name}`,
      url,
    });
  }

  async function handleReport() {
    if (!reportCategory) return;
    setReportBusy(true);
    try {
      await submitReport({
        tradePointId: point._id,
        category: reportCategory,
      });
      if (reportCategory === "minor_approach") {
        toast.success("Nossa equipe revisará em até 24h");
      } else {
        toast.success(
          "Denúncia enviada. Obrigado por ajudar a comunidade."
        );
      }
      setReportOpen(false);
      setReportCategory(null);
    } catch (err) {
      const code = reportErrorCode(err);
      switch (code) {
        case "already-reported":
          toast.error("Você já denunciou este ponto recentemente.");
          break;
        case "reliability-too-low":
          toast.error("Sua conta ainda não tem histórico suficiente");
          break;
        case "minor-approach-extra-requirement":
          toast.error(
            "Esta categoria exige conta com mais histórico"
          );
          break;
        default:
          toast.error("Não foi possível enviar a denúncia. Tente novamente.");
      }
    } finally {
      setReportBusy(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-4 pb-24 sm:px-6 xl:max-w-6xl 2xl:max-w-[90rem]">
      <Dialog
        open={reportOpen}
        onOpenChange={(open) => {
          setReportOpen(open);
          if (!open) setReportCategory(null);
        }}
      >
        <DialogContent className="max-h-[min(90vh,560px)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Denunciar ponto</DialogTitle>
            <DialogDescription>
              Escolha o motivo. Denúncias falsas podem afetar sua conta.
            </DialogDescription>
          </DialogHeader>
          <RadioGroup
            className="gap-3"
            value={reportCategory ?? undefined}
            onValueChange={(v) => setReportCategory(v as ReportCategory)}
          >
            {REPORT_CATEGORIES.map((cat) => (
              <div key={cat} className="flex items-center gap-3">
                <RadioGroupItem value={cat} id={`report-${cat}`} />
                <Label
                  htmlFor={`report-${cat}`}
                  className="cursor-pointer font-normal leading-snug"
                >
                  {REPORT_CATEGORY_LABEL[cat]}
                </Label>
              </div>
            ))}
          </RadioGroup>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReportOpen(false)}
              disabled={reportBusy}
            >
              Fechar
            </Button>
            <Button
              onClick={() => void handleReport()}
              disabled={reportBusy || !reportCategory}
            >
              {reportBusy ? "Enviando…" : "Enviar denúncia"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-outline-variant/20 bg-[color:var(--surface-container-low)] px-6 shadow-lg shadow-blue-950/25 backdrop-blur-xl">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="line-clamp-1 flex-1 text-center font-headline text-base font-semibold uppercase tracking-tight text-primary">
          {point.name}
        </h2>
        <div className="flex shrink-0 items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
            onClick={() => void handleShare()}
            aria-label="Compartilhar"
          >
            <Share2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-primary hover:bg-primary/10"
            onClick={() => setReportOpen(true)}
            aria-label="Denunciar"
          >
            <Flag className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <PointHero
        name={point.name}
        lat={point.lat}
        lng={point.lng}
        confidenceScore={point.confidenceScore}
        coverImageUrl={point.coverImageUrl}
      />

      <PointDetailIdentity
        name={point.name}
        address={point.address}
        cityName={city?.name ?? null}
        suggestedHours={point.suggestedHours}
      />

      {whatsapp.state === "blocked-not-participant" && (
        <div className="flex flex-col gap-3 rounded-2xl border border-outline-variant/30 bg-surface-container-low/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-foreground">
            Participe deste ponto para acessar o link do WhatsApp.
          </p>
          <Button
            type="button"
            className="shrink-0"
            onClick={() =>
              joinButtonRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
              })
            }
          >
            Participar agora
          </Button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <div className="space-y-6 md:col-span-8">
          <PointLifecycleCard />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:items-start xl:grid-cols-[minmax(0,1.12fr)_minmax(0,1fr)] xl:gap-6">
            <PeakHoursChart peakHours={stablePeakHours} />
            <div className="min-w-0 space-y-4">
              <PresentMatchesSection tradePointId={point._id} />
              <MatchesSection tradePointId={point._id} />
            </div>
          </div>
          <PointStatsStrip
            confidenceScore={point.confidenceScore}
            activeCheckinsCount={activeCheckinsCount}
            lastActivityAt={point.lastActivityAt}
            participantCount={participantCount}
          />
        </div>
        <div className="space-y-6 md:col-span-4">
          <ConfidenceGaugeCard confidenceScore={point.confidenceScore} />
          <WhatsappButton whatsapp={whatsapp} layout="card" />
        </div>
      </div>

      <PointActions
        tradePointId={point._id}
        isParticipant={isParticipant}
        hasActiveCheckin={hasActiveCheckin}
        pointLat={point.lat}
        pointLng={point.lng}
        joinButtonRef={joinButtonRef}
      />

      <p className="mt-12 pb-4 text-center text-xs text-outline-variant">
        Ponto de Troca © 2024
      </p>
    </div>
  );
}
