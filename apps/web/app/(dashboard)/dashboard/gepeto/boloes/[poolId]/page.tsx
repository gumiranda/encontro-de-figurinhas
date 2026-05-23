import { GepetoPoolDetailView } from "@/modules/gepeto";
import type { Id } from "@workspace/backend/_generated/dataModel";

interface PageProps {
  params: Promise<{ poolId: string }>;
}

export default async function GepetoPoolPage({ params }: PageProps) {
  const { poolId } = await params;
  return <GepetoPoolDetailView poolId={poolId as Id<"gepetoPools">} />;
}
