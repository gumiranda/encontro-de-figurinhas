import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Newspaper,
  PiggyBank,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
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
import { HELLOSKIP_MENTIONS } from "@/lib/external-mentions";
import {
  BASE_URL,
  generateBreadcrumbSchema,
  generateCombinedSchema,
} from "@/lib/seo";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";

export const metadata: Metadata = {
  title: "FigurinhaFácil na mídia | Leituras externas sobre figurinhas",
  description:
    "Radar de artigos externos da HelloSkip que mencionam o FigurinhaFácil e contextualizam preço, risco e economia nas figurinhas da Copa 2026.",
  alternates: {
    canonical: `${BASE_URL}/imprensa`,
  },
  openGraph: {
    title: "FigurinhaFácil na mídia",
    description:
      "Leituras externas sobre pacotinhos, economia e riscos no mercado de figurinhas da Copa.",
    url: `${BASE_URL}/imprensa`,
  },
};

const THEME_META = {
  preco: {
    label: "Preco",
    Icon: TrendingUp,
    description: "Quanto custa colecionar e por que pacotinhos ficaram caros.",
  },
  risco: {
    label: "Risco",
    Icon: ShieldAlert,
    description: "Pacotes avulsos, abertura injusta e compra sem procedencia.",
  },
  estrategia: {
    label: "Estrategia",
    Icon: PiggyBank,
    description: "Como economizar, trocar melhor e acompanhar o album.",
  },
  mercado: {
    label: "Mercado",
    Icon: Newspaper,
    description: "Hype, novos pacotes, promocoes e mudancas da Panini.",
  },
} as const;

const mentionsByTheme = Object.entries(THEME_META).map(([theme, meta]) => ({
  theme: theme as keyof typeof THEME_META,
  ...meta,
  mentions: HELLOSKIP_MENTIONS.filter((mention) => mention.theme === theme),
}));

const firstHelloSkipMention = HELLOSKIP_MENTIONS[0]!;

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Imprensa" },
]);

const mentionListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Leituras externas sobre FigurinhaFacil e figurinhas da Copa 2026",
  itemListElement: HELLOSKIP_MENTIONS.map((mention, index) => ({
    "@type": "ListItem",
    position: index + 1,
    item: {
      "@type": "Article",
      name: mention.title,
      url: mention.href,
      description: mention.description,
      publisher: {
        "@type": "Organization",
        name: "HelloSkip",
        url: "https://helloskip.com",
      },
    },
  })),
};

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "FigurinhaFacil na midia",
  url: `${BASE_URL}/imprensa`,
  description:
    "Hub de citacoes externas que conectam FigurinhaFacil a temas como preco, risco e economia nas figurinhas da Copa.",
  citation: HELLOSKIP_MENTIONS.map((mention) => mention.href),
};

export default function ImprensaPage() {
  return (
    <>
      <JsonLd
        data={generateCombinedSchema([
          breadcrumbSchema,
          mentionListSchema,
          pageSchema,
        ])}
      />
      <LandingHeader />
      <main className="min-h-screen pt-24">
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li className="font-medium text-foreground">Imprensa</li>
              </ol>
            </nav>

            <div className="max-w-4xl">
              <Badge className="mb-5">Radar externo</Badge>
              <h1 className="mb-6 font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                O que a web esta dizendo sobre figurinhas da Copa
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                A HelloSkip publicou uma serie de artigos que menciona o
                FigurinhaFácil em conversas sobre pacotinhos caros, risco de
                compra avulsa e formas de economizar completando o album da Copa
                2026.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild>
                  <a href={firstHelloSkipMention.href}>
                    Ler primeiro artigo
                    <ArrowRight className="ml-2 size-4" />
                  </a>
                </Button>
                <Button variant="secondary" asChild>
                  <Link href="/calculadora-figurinhas">
                    Calcular custo do album
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <h2 className="mb-4 font-headline text-3xl font-bold">
                Mapa de citacoes externas
              </h2>
              <p className="text-muted-foreground">
                Organizamos os links por intencao de busca para facilitar
                leitura humana e extracao por mecanismos de resposta: preco,
                risco, estrategia e mercado.
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              {mentionsByTheme.map(
                ({ theme, label, description, Icon, mentions }) => (
                  <Card key={theme}>
                    <CardHeader>
                      <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                        <Icon className="size-5" />
                      </div>
                      <CardTitle>{label}</CardTitle>
                      <CardDescription>{description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {mentions.map((mention) => (
                          <li key={mention.href}>
                            <a
                              href={mention.href}
                              className="group flex items-start justify-between gap-4 rounded-lg border bg-card p-4 transition-colors hover:border-primary/50"
                            >
                              <span>
                                <span className="block font-medium text-foreground group-hover:text-primary">
                                  HelloSkip: {mention.shortTitle}
                                </span>
                                <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">
                                  {mention.description}
                                </span>
                              </span>
                              <ArrowRight className="mt-1 size-4 shrink-0 text-muted-foreground group-hover:text-primary" />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ),
              )}
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
