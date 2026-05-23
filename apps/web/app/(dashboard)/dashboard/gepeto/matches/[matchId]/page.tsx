import { GepetoMatchDashboardView } from "@/modules/gepeto";
import type { Id } from "@workspace/backend/_generated/dataModel";

interface PageProps {
  params: Promise<{ matchId: string }>;
}

export default async function GepetoMatchPage({ params }: PageProps) {
  const { matchId } = await params;
  return (
    <GepetoMatchDashboardView
      matchId={matchId as Id<"worldCupMatches">}
    />
  );
}
