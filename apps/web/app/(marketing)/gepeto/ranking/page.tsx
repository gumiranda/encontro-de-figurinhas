import type { Metadata } from "next";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { RankingClient } from "./client";

export const metadata: Metadata = {
  title: "Ranking vs Gepeto | Figurinha Fácil",
  description: "Veja quem mais venceu a IA Gepeto nos palpites da Copa 2026.",
  openGraph: {
    title: "Ranking: Humanos vs IA",
    description: "Quem acerta mais palpites na Copa 2026?",
  },
};

export default function GepetoRankingPage() {
  return (
    <>
      <LandingHeader />
      <main className="container mx-auto max-w-2xl px-4 py-10">
        <h1 className="text-2xl font-bold mb-6">Ranking vs Gepeto</h1>
        <RankingClient />
      </main>
      <LandingFooter />
    </>
  );
}
