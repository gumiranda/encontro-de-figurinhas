import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, MapPin, Megaphone, Store } from "lucide-react";
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
import { LOCAL_LINK_TARGETS } from "@/lib/seo-campaigns";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";

const PAGE_URL = `${BASE_URL}/pontos-de-troca-figurinhas-copa-2026`;

export const metadata: Metadata = {
  title: "Pontos de troca de figurinhas da Copa 2026 por cidade",
  description:
    "Encontre pontos de troca de figurinhas da Copa 2026 por cidade e cadastre gratuitamente shopping, banca, escola ou evento no Figurinha Facil.",
  alternates: { canonical: PAGE_URL },
  openGraph: {
    title: "Pontos de troca de figurinhas da Copa 2026 por cidade",
    description:
      "Mapa editorial para colecionadores e imprensa local encontrarem pontos de troca da Copa 2026.",
    url: PAGE_URL,
  },
};

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Inicio", url: BASE_URL },
  { name: "Pontos de troca Copa 2026", url: PAGE_URL },
]);

const pageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Pontos de troca de figurinhas da Copa 2026 por cidade",
  url: PAGE_URL,
  description:
    "Pagina para descobrir e cadastrar pontos de troca de figurinhas da Copa 2026 por cidade.",
};

const placeTypes = [
  {
    title: "Shoppings",
    description:
      "Use a pagina da cidade como agenda publica do ponto de troca, com horario, local e regras.",
    Icon: Building2,
  },
  {
    title: "Bancas",
    description:
      "Transforme o fluxo de compra de pacotinhos em encontro recorrente de colecionadores.",
    Icon: Store,
  },
  {
    title: "Escolas e eventos",
    description:
      "Cadastre encontros seguros, com ponto publico e comunicacao facil para familias.",
    Icon: Megaphone,
  },
] as const;

export default function TradePointsByCityPage() {
  return (
    <>
      <JsonLd data={generateCombinedSchema([breadcrumbSchema, pageSchema])} />
      <LandingHeader />
      <main className="min-h-screen pt-24">
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <Badge className="mb-5">Copa 2026 por cidade</Badge>
              <h1 className="mb-6 font-headline text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
                Pontos de troca de figurinhas da Copa 2026 por cidade
              </h1>
              <p className="max-w-3xl text-lg leading-relaxed text-muted-foreground md:text-xl">
                Encontre colecionadores perto de voce e ajude sua cidade a ter
                uma agenda publica de trocas. Shoppings, bancas, escolas e
                eventos podem cadastrar um ponto gratis.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/cidades">
                    Ver cidades
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="secondary">
                  <Link href="/ponto/solicitar">Cadastrar ponto gratis</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="mb-10 max-w-3xl">
              <h2 className="mb-4 font-headline text-3xl font-bold">
                Quem pode aparecer no guia
              </h2>
              <p className="text-muted-foreground">
                A pagina foi feita para virar referencia local e facilitar
                citacoes em blogs, agendas culturais e materias de bairro.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {placeTypes.map(({ title, description, Icon }) => (
                <Card key={title}>
                  <CardHeader>
                    <div className="mb-3 flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Icon className="size-5" />
                    </div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
              <div>
                <h2 className="mb-4 font-headline text-3xl font-bold">
                  Pauta pronta para blogs locais
                </h2>
                <p className="mb-6 max-w-3xl text-muted-foreground">
                  Quando uma materia local fala de ponto de troca, o Figurinha
                  Facil pode complementar com mapa, cadastro gratuito e lista de
                  colecionadores por cidade. O pedido de link deve apontar para
                  esta pagina ou para a pagina especifica da cidade.
                </p>
                <div className="rounded-lg border bg-card p-5 text-sm leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground">
                    Sugestao de abordagem
                  </p>
                  <p className="mt-2">
                    Vi a materia sobre troca de figurinhas em [cidade]. O
                    Figurinha Facil esta reunindo pontos de troca gratuitos por
                    cidade para ajudar colecionadores da Copa 2026. Voces podem
                    incluir o link como servico para leitores encontrarem ou
                    cadastrarem novos pontos?
                  </p>
                </div>
              </div>
              <Card>
                <CardHeader>
                  <MapPin className="mb-3 size-5 text-primary" />
                  <CardTitle>Materias para outreach</CardTitle>
                  <CardDescription>
                    Primeiros alvos editoriais ja encontrados.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {LOCAL_LINK_TARGETS.map((target) => (
                    <a
                      key={target.href}
                      href={target.href}
                      className="block rounded-lg border p-3 text-sm transition-colors hover:border-primary/50"
                    >
                      <span className="block font-medium text-foreground">
                        {target.name}
                      </span>
                      <span className="mt-1 block text-muted-foreground">
                        {target.city}: {target.angle}
                      </span>
                    </a>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
