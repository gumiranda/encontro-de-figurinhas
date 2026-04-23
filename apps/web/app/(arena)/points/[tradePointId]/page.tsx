import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { TradePointDetailView } from "@/modules/trade-points/ui/views/trade-point-detail-view";
import { FullPageLoader } from "@/components/full-page-loader";

export const metadata: Metadata = {
  title: "Ponto de Troca",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ tradePointId: string }>;
};

export default async function TradePointPage({ params }: Props) {
  await connection();
  const { tradePointId } = await params;
  return (
    <Suspense fallback={<FullPageLoader />}>
      <TradePointDetailView tradePointId={tradePointId as Id<"tradePoints">} />
    </Suspense>
  );
}
