import type { Metadata } from "next";

import type { Id } from "@workspace/backend/_generated/dataModel";

import { ProposalDetailView } from "@/modules/propostas/ui/views/proposal-detail-view";

export const metadata: Metadata = {
  title: "Detalhe da proposta",
  description: "Veja, aceite ou recuse uma proposta de troca.",
  robots: { index: false, follow: false },
};

export default async function PropostaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProposalDetailView id={id as Id<"trades">} />;
}
