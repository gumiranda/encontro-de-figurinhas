import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateBreadcrumbSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { RoundMatchesList } from "../_components/round-matches-list";

type Props = {
  params: Promise<{ rodada: string }>;
};

export async function generateStaticParams() {
  const rounds = await convexServer.query(api.boringGame.listRounds, {});
  if (rounds.length === 0) {
    return [{ rodada: "__placeholder__" }];
  }
  return rounds.map((r) => ({ rodada: r.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { rodada } = await params;
  const url = `${BASE_URL}/jogo-mais-chato/${rodada}`;
  return {
    title: "Jogo Mais Chato — Copa 2026",
    description: "Vote no jogo mais chato da Copa 2026.",
    openGraph: {
      title: "Jogo Mais Chato — Copa 2026",
      description: "Vote no jogo mais chato da Copa 2026.",
      url,
      type: "website",
    },
    alternates: { canonical: url },
  };
}

export default async function RodadaPage({ params }: Props) {
  const { rodada } = await params;
  const round = await convexServer.query(api.boringGame.getRoundBySlug, {
    slug: rodada,
  });
  if (!round) notFound();

  const url = `${BASE_URL}/jogo-mais-chato/${rodada}`;
  const breadcrumb = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Jogo Mais Chato", url: `${BASE_URL}/jogo-mais-chato` },
    { name: round.name },
  ]);

  return (
    <>
      <JsonLd data={generateCombinedSchema([breadcrumb])} />
      <LandingHeader />
      <main
        id="main-content"
        className="container mx-auto max-w-3xl px-4 py-10"
      >
        <RoundMatchesList
          roundId={round._id}
          roundSlug={round.slug}
          roundName={round.name}
          isActive={round.isActive}
        />
      </main>
      <LandingFooter />
    </>
  );
}
