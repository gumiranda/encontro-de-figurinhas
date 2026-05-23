import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { WeeklyClient } from "./client";

interface Props {
  params: Promise<{ weekNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { weekNumber } = await params;
  const week = parseInt(weekNumber, 10);

  if (isNaN(week) || week < 1 || week > 7) {
    return { title: "Capítulo não encontrado" };
  }

  return {
    title: `Capítulo ${week} - Gepeto vs Humanos | Figurinha Fácil`,
    description: `Semana ${week} da Copa 2026. Veja como o Gepeto se saiu contra os humanos nos palpites.`,
    openGraph: {
      title: `Capítulo ${week} - Gepeto vs Humanos`,
      description: `Semana ${week} da Copa 2026. Quem acertou mais?`,
    },
  };
}

export default async function WeeklyPage({ params }: Props) {
  const { weekNumber } = await params;
  const week = parseInt(weekNumber, 10);

  if (isNaN(week) || week < 1 || week > 7) {
    notFound();
  }

  const year = new Date().getFullYear();

  let narrative;
  try {
    narrative = await fetchQuery(api.gepeto.getWeeklyNarrative, {
      weekNumber: week,
      year,
    });
  } catch {
    narrative = null;
  }

  return (
    <>
      <LandingHeader />
      <main className="container mx-auto max-w-2xl px-4 py-10">
        <WeeklyClient weekNumber={week} year={year} initialNarrative={narrative} />
      </main>
      <LandingFooter />
    </>
  );
}
