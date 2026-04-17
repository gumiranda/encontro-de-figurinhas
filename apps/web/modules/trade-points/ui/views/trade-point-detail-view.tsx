"use client";

import { useEffect } from "react";
import { notFound, useRouter } from "next/navigation";
import { ArrowLeft, Share2 } from "lucide-react";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { FullPageLoader } from "@/components/full-page-loader";
import { useShare } from "../../lib/use-share";
import { useStableValue } from "../../lib/use-stable-value";
import { useTradePoint } from "../../lib/use-trade-point";
import { BannedState } from "../components/banned-state";
import { MatchesSection } from "../components/matches-section";
import { PeakHoursChart } from "../components/peak-hours-chart";
import { PointActions } from "../components/point-actions";
import { PointHeader } from "../components/point-header";
import { PointHero } from "../components/point-hero";
import { WhatsappButton } from "../components/whatsapp-button";

type Props = {
  tradePointId: Id<"tradePoints">;
};

export function TradePointDetailView({ tradePointId }: Props) {
  const data = useTradePoint(tradePointId);
  const router = useRouter();
  const share = useShare();

  useEffect(() => {
    if (data?.state === "needs-auth") {
      router.replace("/sign-in");
    } else if (data?.state === "needs-onboarding") {
      router.replace("/complete-profile");
    }
  }, [data?.state, router]);

  // Always call hooks in same order — useStableValue runs even when data is loading.
  const stablePeakHours = useStableValue(
    data?.state === "ready" ? data.point.peakHours : undefined
  );

  if (!data) return <FullPageLoader />;
  if (data.state === "needs-auth" || data.state === "needs-onboarding") {
    return null;
  }
  if (data.state === "banned") return <BannedState />;
  if (data.state === "not-found") notFound();

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
    const url = typeof window !== "undefined" ? window.location.href : "";
    await share({
      title: point.name,
      text: `Confira o ponto de troca ${point.name}`,
      url,
    });
  }

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4 pb-24">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-border/40 bg-background/80 px-4 py-3 backdrop-blur">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          aria-label="Voltar"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h2 className="line-clamp-1 flex-1 text-center text-base font-semibold uppercase tracking-tight">
          {point.name}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          aria-label="Compartilhar"
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      <PointHero
        name={point.name}
        lat={point.lat}
        lng={point.lng}
        confidenceScore={point.confidenceScore}
      />

      <PointHeader
        name={point.name}
        address={point.address}
        suggestedHours={point.suggestedHours}
        cityName={city?.name ?? null}
      />

      <div className="px-4">
        <WhatsappButton whatsapp={whatsapp} />
      </div>

      <div className="px-4">
        <PointActions
          tradePointId={point._id}
          isParticipant={isParticipant}
          hasActiveCheckin={hasActiveCheckin}
          activeCheckinsCount={activeCheckinsCount}
          participantCount={participantCount}
          pointLat={point.lat}
          pointLng={point.lng}
        />
      </div>

      <div className="px-4">
        <PeakHoursChart peakHours={stablePeakHours} />
      </div>

      <div className="px-4">
        <MatchesSection tradePointId={point._id} />
      </div>
    </div>
  );
}
