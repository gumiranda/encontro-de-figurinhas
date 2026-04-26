import type { Metadata } from "next";

import { MatchesPageView } from "@/modules/matches/ui/views/matches-page-view";

export const metadata: Metadata = {
  title: "Encontrar trocas",
  description: "Encontre colecionadores compatíveis para trocar figurinhas.",
  robots: { index: false, follow: false },
  alternates: {
    canonical: "https://figurinhafacil.com.br/matches",
  },
};

export default function MatchesPage() {
  return <MatchesPageView />;
}
