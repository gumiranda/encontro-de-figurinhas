import type { Metadata } from "next";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { TradePointDetailView } from "@/modules/trade-points/ui/views/trade-point-detail-view";

export const metadata: Metadata = {
  title: "Ponto de Troca",
  robots: { index: false, follow: false },
};

type Props = {
  params: Promise<{ tradePointId: string }>;
};

export default async function TradePointPage({ params }: Props) {
  const { tradePointId } = await params;
  return (
    <TradePointDetailView tradePointId={tradePointId as Id<"tradePoints">} />
  );
}
