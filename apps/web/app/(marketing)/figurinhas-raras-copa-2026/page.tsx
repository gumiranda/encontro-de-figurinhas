import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Crown,
  Flame,
  Trophy,
  Zap,
  TrendingUp,
  MapPin,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  BASE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateFAQSchema,
  generateCombinedSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/figurinhas-raras-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-27T00:00:00Z";
const MODIFIED_AT = "2026-05-27T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Figurinhas Raras Copa 2026: Quais São, Valor, Como Conseguir e Trocar",
  description:
    "Lista completa das figurinhas raras, especiais e legendárias da Copa 2026: capitães, craques, bola oficial, troféu e mascote. Valores de troca e onde encontrá-las.",
  keywords: [
    "figurinhas raras copa 2026",
    "figurinhas especiais copa 2026",
    "figurinhas legendarias copa 2026",
    "capitanes copa 2026 figurinhas",
    "craques copa 2026 figurinhas",
    "bola oficial copa 2026 figurinha",
    "troféu fifa copa 2026 figurinha",
    "figurinhas mais procuradas copa 2026",
  ],
  openGraph: {
    title: "Figurinhas Raras Copa 2026: Quais São, Valores e Como Conseguir",
    description:
      "Descubra as 68 figurinhas raras, especiais e brilhantes da Copa 2026. Veja capitães, craques, bola oficial e troféu. Como trocar as más raras.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de figurinhas",
      "Figurinhas raras",
      "Colecionismo",
      "Panini",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Figurinhas Raras Copa 2026: Quais São e Valores de Troca",
    description:
      "Confira as 68 figurinhas especiais, raras e brilhantes da Copa 2026 e como conseguir cada uma.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas raras tem o álbum da Copa 2026?",
    answer:
      "O álbum conta com 68 figurinhas especiais e brilhantes. Essas são as raras de verdade: capitães, craques do torneio, mascote, bola oficial, troféu da FIFA e estadios-sede. Todas têm efeito brilhante que as diferencia das figurinhas base.",
  },
  {
    question: "Qual é a figurinha mais rara da Copa 2026?",
    answer:
      "A bola oficial (Adidas Brazuca da Copa 2026) e o troféu da FIFA são consideradas as mais raras. Historicamente, mascotes também costumam ter alta raridade. Capitães das principais seleções (Brasil, Argentina, França) também estão no topo das mais procuradas.",
  },
  {
    question: "Quanto vale uma figurinha rara em troca?",
    answer:
      "O valor depende da raridade e demanda. Capitães e craques valem 5-10 figurinhas normais cada. A bola oficial pode valer 30-50 figurinhas. O troféu, 40-80. Quanto mais próximo do fim do torneio, mais se pede em troca.",
  },
  {
    question: "Qual é o melhor momento para conseguir figurinhas raras trocando?",
    answer:
      "No fim do torneio (julho), muitos colecionadores desistem e aceitam ofertas generosas. Mas alguns esperam até depois do torneio terminar para comercializar coleções com foco em lucro. A melhor janela para trocar é durante os jogos finais.",
  },
  {
    question: "Existem figurinhas raras que têm muita oferta?",
    answer:
      "Sim. As figurinhas especiais de seleções menos populares têm mais oferta e menor demanda. Exploradores de mercado tendem a ter estoque delas. Foco em capitães e craques de grandes seleções para trocas mais valiosas.",
  },
];

const rareCategories = [
  {
    category: "Capitães",
    count: "48 (1 por seleção)",
    examples: ["Vinicius Jr. - Brasil", "Messi - Argentina", "Benzema - França"],
    rarity: "Alta",
    tradingValue: "5-8 figurinhas",
    icon: Crown,
  },
  {
    category: "Craques do Torneio",
    count: "~30 selecionados",
    examples: [
      "Pelé (homenagem)",
      "Maradona (homenagem)",
      "Neymar - Brasil",
    ],
    rarity: "Muito Alta",
    tradingValue: "8-15 figurinhas",
    icon: Flame,
  },
  {
    category: "Bola Oficial + Troféu",
    count: "2 especiais",
    examples: ["Adidas Brazuca 2026", "Troféu FIFA World Cup"],
    rarity: "Raríssima",
    tradingValue: "30-80 figurinhas",
    icon: Trophy,
  },
  {
    category: "Mascote da Copa",
    count: "1 oficial",
    examples: ["Mascote Oficial 2026"],
    rarity: "Muito Alta",
    tradingValue: "20-40 figurinhas",
    icon: Sparkles,
  },
  {
    category: "Estadios",
    count: "16 estádios",
    examples: ["MetLife Stadium", "Estadio Azteca", "BC Place"],
    rarity: "Média-Alta",
    tradingValue: "3-6 figurinhas",
    icon: MapPin,
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  {
    name: "Álbum da Copa 2026",
    url: `${BASE_URL}/album-copa-do-mundo-2026`,
  },
  { name: "Figurinhas Raras", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Figurinhas Raras Copa 2026: Quais São, Valor, Como Conseguir e Trocar",
  description:
    "Guia completo das 68 figurinhas raras, especiais e brilhantes da Copa 2026. Capitães, craques, bola oficial, troféu e como conseguir em trocas.",
  image: `${BASE_URL}/opengraph-image`,
  datePublished: PUBLISHED_AT,
  dateModified: MODIFIED_AT,
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.svg`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": ARTICLE_URL,
  },
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

const tipsForGetting = [
  {
    title: "Busque em grupos grandes",
    description:
      "Quanto maior a rede, mais chances de alguém ter a rara que você quer. Grupos de 50+ pessoas têm raras circulando constantemente.",
  },
  {
    title: "Ofereça muitas figurinhas",
    description:
      "Quem tem raras não precisa delas. Ofereça 10, 20 figurinhas por uma rara. O volume de troca é a moeda de cambio.",
  },
  {
    title: "Espere pelo final do torneio",
    description:
      "Muitos colecionadores desistem após os jogos. É quando as raras aparecem nas trocas com mais frequência e aceitam ofertas melhores.",
  },
  {
    title: "Priorize por categoria",
    description:
      "Vá por ordem de importância: troféu e bola, mascote, capitães, craques, estadios. Deixe as menos raras para o final.",
  },
];

export default function FigurinhasRarasPage() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main id="main-content" className="pt-24 min-h-screen text-[var(--on-surface)]">
        {/* Hero */}
        <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-[var(--outline)]"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/album-copa-do-mundo-2026"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Álbum da Copa 2026
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--on-surface)] font-medium">
                Figurinhas Raras
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              As 68 Figurinhas Especiais
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Figurinhas Raras da Copa 2026:{" "}
              <span className="text-gradient-primary">
                Quais são, valores e como conseguir
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              O álbum da Copa 2026 tem <strong>68 figurinhas especiais</strong>{" "}
              com efeito brilhante que as diferenciam. Vinicius Jr., capitães,
              bola oficial, troféu da FIFA e mascote são as mais raras. Neste
              guia, descubra <strong>quais são as raras</strong>,{" "}
              <strong>quanto valem em troca</strong> e as melhores estratégias
              para conseguir cada uma sem gastar uma fortuna.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 27/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 7 min</span>
            </div>
          </div>
        </section>

        {/* Rarity stats */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-[var(--primary)]" />
                  <CardDescription className="text-[10px] uppercase tracking-widest">
                    Figurinhas Especiais
                  </CardDescription>
                </div>
                <CardTitle className="text-2xl">68</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Com efeito brilhante
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-yellow-600" />
                  <CardDescription className="text-[10px] uppercase tracking-widest">
                    Capitães
                  </CardDescription>
                </div>
                <CardTitle className="text-2xl">48</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  1 por seleção
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-orange-600" />
                  <CardDescription className="text-[10px] uppercase tracking-widest">
                    Mais Raras
                  </CardDescription>
                </div>
                <CardTitle className="text-2xl">2</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Troféu + Bola
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            As 68 figurinhas especiais do álbum 2026
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Das 980 figurinhas totais, <strong>68 são especiais e brilhantes</strong>.
              Essas figurinhas se destacam visualmente (têm brilho/foil) e também
              em demanda — são as mais procuradas entre colecionadores. Nem todas
              são fáceis de encontrar em pacotinhos, e algumas têm raridade tão
              alta que precisam ser trocadas.
            </p>
            <p>
              A boa notícia: a maioria delas circula entre colecionadores. A má
              notícia: custam caro em troca. Uma figurinha rara pode valer de 5
              a 80 figurinhas comuns, dependendo de quão rara ela é.
            </p>
          </div>
        </section>

        {/* Categorias de raras */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Categorias de figurinhas especiais
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {rareCategories.map((cat) => {
              const Icon = cat.icon;
              return (
                <Card
                  key={cat.category}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                          <Icon
                            className="h-5 w-5 text-[var(--primary)]"
                            aria-hidden="true"
                          />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {cat.category}
                          </CardTitle>
                          <p className="text-xs text-[var(--outline)] mt-1">
                            {cat.count}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className="ml-auto"
                        variant={
                          cat.rarity === "Raríssima"
                            ? "destructive"
                            : "secondary"
                        }
                      >
                        {cat.rarity}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[var(--outline)] mb-2">
                        Exemplos
                      </p>
                      <ul className="space-y-1 text-sm text-[var(--on-surface-variant)]">
                        {cat.examples.map((ex) => (
                          <li key={ex}>• {ex}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-[var(--outline-variant)]/20">
                      <p className="text-xs uppercase tracking-widest text-[var(--outline)] mb-1">
                        Valor em Troca
                      </p>
                      <p className="font-bold text-[var(--primary)]">
                        {cat.tradingValue}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Ranking de raridade */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Ranking das figurinhas mais raras
          </h2>
          <div className="space-y-3">
            {[
              {
                pos: "1º",
                name: "Troféu da FIFA",
                value: "80-100 figurinhas",
                color: "from-yellow-600 to-yellow-500",
              },
              {
                pos: "2º",
                name: "Bola Oficial (Adidas Brazuca 2026)",
                value: "60-80 figurinhas",
                color: "from-yellow-500 to-orange-500",
              },
              {
                pos: "3º",
                name: "Mascote Oficial da Copa",
                value: "40-60 figurinhas",
                color: "from-orange-500 to-orange-400",
              },
              {
                pos: "4º",
                name: "Capitão Brasil (Vinicius Jr.)",
                value: "10-20 figurinhas",
                color: "from-green-600 to-green-500",
              },
              {
                pos: "5º",
                name: "Capitão Argentina",
                value: "10-20 figurinhas",
                color: "from-blue-600 to-blue-500",
              },
            ].map((item) => (
              <div key={item.pos} className="flex items-center gap-4">
                <div
                  className={`flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-lg`}
                >
                  {item.pos}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[var(--on-surface)]">
                    {item.name}
                  </p>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Dicas para conseguir */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como conseguir figurinhas raras: 4 dicas essenciais
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {tipsForGetting.map((tip, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center text-[var(--primary)] font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {tip.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Estratégia de preços ao longo do torneio */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Evolução dos preços de raras durante a Copa
          </h2>
          <div className="space-y-4">
            {[
              {
                phase: "Antes do torneio (mai-jun)",
                price: "Alto",
                reason:
                  "Todos querem completar antes dos jogos começarem. Preços em alta.",
              },
              {
                phase: "Fase de grupos (jun-jul)",
                price: "Médio-Alto",
                reason:
                  "Alguns colecionadores desistem, mas maioria ainda coleciona.",
              },
              {
                phase: "Finais (jul)",
                price: "Médio",
                reason:
                  "Muitos desistem. Preços começam a cair em trocas.",
              },
              {
                phase: "Pós-torneio (ago+)",
                price: "Baixo-Médio",
                reason:
                  "Mercado especulativo surge. Algumas raras ficam mais caras, outras caem.",
              },
            ].map((stage) => (
              <div
                key={stage.phase}
                className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-[var(--on-surface)]">
                    {stage.phase}
                  </h4>
                  <span
                    className={`px-3 py-1 rounded text-xs font-bold ${
                      stage.price === "Alto"
                        ? "bg-red-500/20 text-red-600"
                        : stage.price === "Médio-Alto"
                          ? "bg-orange-500/20 text-orange-600"
                          : stage.price === "Médio"
                            ? "bg-yellow-500/20 text-yellow-600"
                            : "bg-green-500/20 text-green-600"
                    }`}
                  >
                    {stage.price}
                  </span>
                </div>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  {stage.reason}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-3xl px-4 sm:px-6 py-12"
        >
          <h2
            id="faq-heading"
            className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8"
          >
            Perguntas frequentes sobre raras
          </h2>
          <div className="space-y-4">
            {FAQS.map((item) => (
              <Card
                key={item.question}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)]">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
              <TrendingUp className="w-4 h-4 text-purple-600" aria-hidden="true" />
              <span className="text-purple-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                Encontre suas raras
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Negocie raras na maior comunidade de trocadores
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              No Figurinha Fácil, encontre colecionadores que têm as raras que
              você precisa. Troque presencialmente, seguro e grátis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Cadastrar grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/como-completar-album-copa-2026-barato">
                  Ver estratégia de economia
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
