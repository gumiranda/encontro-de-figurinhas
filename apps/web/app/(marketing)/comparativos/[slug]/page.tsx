import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CheckCircle2, MessageCircle, Table2 } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { JsonLd } from "@/components/json-ld";
import {
  BASE_URL,
  generateBreadcrumbSchema,
  generateCombinedSchema,
} from "@/lib/seo";
import { COMPARISON_PAGES, type ComparisonSlug } from "@/lib/seo-campaigns";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";

type PageProps = {
  params: Promise<{ slug: string }>;
};

const DETAILS: Record<
  ComparisonSlug,
  {
    h1: string;
    intro: string;
    alternatives: { name: string; verdict: string; Icon: typeof Table2 }[];
    bestFor: string[];
  }
> = {
  "figurinha-facil-vs-planilha": {
    h1: "Figurinha Facil vs planilha: qual controla melhor o album da Copa 2026?",
    intro:
      "Planilha resolve o controle individual, mas nao encontra colecionador perto, nao cruza repetidas com faltantes e nao vira ponto de encontro por cidade.",
    alternatives: [
      {
        name: "Planilha",
        verdict: "Boa para anotar; fraca para negociar e atualizar no celular.",
        Icon: Table2,
      },
      {
        name: "Figurinha Facil",
        verdict:
          "Melhor para transformar repetidas em matches com colecionadores reais.",
        Icon: CheckCircle2,
      },
    ],
    bestFor: [
      "Quem quer trocar, nao apenas marcar figurinhas.",
      "Familias que precisam achar colecionadores por cidade.",
      "Colecionadores com muitas repetidas e pouco tempo.",
    ],
  },
  "figurinha-facil-vs-grupo-whatsapp": {
    h1: "Figurinha Facil vs grupo de WhatsApp: onde a troca rende mais?",
    intro:
      "Grupo de WhatsApp ajuda a juntar pessoas, mas listas somem no chat. O Figurinha Facil organiza faltantes, repetidas e cidade antes da conversa.",
    alternatives: [
      {
        name: "Grupo de WhatsApp",
        verdict:
          "Rapido para combinar, confuso para buscar figurinha especifica.",
        Icon: MessageCircle,
      },
      {
        name: "Figurinha Facil",
        verdict:
          "Melhor para descobrir quem tem a figurinha certa antes de chamar.",
        Icon: CheckCircle2,
      },
    ],
    bestFor: [
      "Quem nao quer rolar centenas de mensagens.",
      "Administradores de grupos locais.",
      "Trocas com ponto publico e menos desencontro.",
    ],
  },
  "melhores-apps-controlar-figurinhas-copa-2026": {
    h1: "Melhores apps para controlar figurinhas da Copa 2026",
    intro:
      "O melhor app depende do objetivo: controle simples, compartilhamento ou troca real por cidade. O criterio principal deve ser reduzir repetidas paradas.",
    alternatives: [
      {
        name: "Apps de checklist",
        verdict: "Bons para marcar o album; limitados para encontrar troca.",
        Icon: Table2,
      },
      {
        name: "Figurinha Facil",
        verdict:
          "Focado em controle com intencao de troca, cidade e ponto seguro.",
        Icon: CheckCircle2,
      },
    ],
    bestFor: [
      "Quem quer completar gastando menos.",
      "Quem troca presencialmente em cidade ou bairro.",
      "Quem precisa compartilhar faltantes e repetidas com clareza.",
    ],
  },
};

function getPage(slug: string) {
  return COMPARISON_PAGES.find((page) => page.slug === slug);
}

export function generateStaticParams() {
  return COMPARISON_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) return { title: "Comparativo nao encontrado" };

  return {
    title: `${page.title} | Copa 2026`,
    description: page.description,
    alternates: { canonical: `${BASE_URL}/comparativos/${page.slug}` },
    openGraph: {
      title: page.title,
      description: page.description,
      url: `${BASE_URL}/comparativos/${page.slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getPage(slug);
  if (!page) notFound();

  const detail = DETAILS[page.slug];
  const pageUrl = `${BASE_URL}/comparativos/${page.slug}`;
  const schema = generateCombinedSchema([
    generateBreadcrumbSchema([
      { name: "Inicio", url: BASE_URL },
      { name: "Comparativos", url: `${BASE_URL}/comparativos/${page.slug}` },
      { name: page.title, url: pageUrl },
    ]),
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: detail.h1,
      description: page.description,
      url: pageUrl,
      inLanguage: "pt-BR",
    },
  ]);

  return (
    <>
      <JsonLd data={schema} />
      <LandingHeader />
      <main className="min-h-screen pt-24">
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Badge className="mb-5">Comparativo Copa 2026</Badge>
              <h1 className="mb-6 font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                {detail.h1}
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                {detail.intro}
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-6 md:grid-cols-2">
              {detail.alternatives.map(({ name, verdict, Icon }) => (
                <Card key={name}>
                  <CardHeader>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{name}</CardTitle>
                    <CardDescription>{verdict}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Quando o Figurinha Facil faz mais sentido</CardTitle>
                <CardDescription>
                  Cenario em que controle simples deixa dinheiro parado em
                  repetidas.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="grid gap-3 md:grid-cols-3">
                  {detail.bestFor.map((item) => (
                    <li key={item} className="rounded-lg border p-4 text-sm">
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <div className="mt-10 flex flex-wrap gap-3">
              <Button asChild>
                <Link href="/sign-up">
                  Comecar gratis
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary">
                <Link href="/pontos-de-troca-figurinhas-copa-2026">
                  Ver pontos por cidade
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
