import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  DollarSign,
  TrendingDown,
  Users,
  Zap,
  BarChart3,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Calculator,
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

const ARTICLE_PATH = "/como-completar-album-copa-2026-barato";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-27T00:00:00Z";
const MODIFIED_AT = "2026-05-27T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Completar Álbum Copa 2026 Barato: Guia com Estratégias de Economia",
  description:
    "Descubra as melhores estratégias para completar o álbum da Copa 2026 gastando menos. Dicas de troca, matemática de custo e como economizar até 80% trocando figurinhas com colecionadores.",
  keywords: [
    "como completar album copa 2026 barato",
    "album copa 2026 mais economico",
    "como gastar menos com figurinhas copa 2026",
    "estrategia para completar album copa 2026",
    "troca de figurinhas copa 2026",
    "economizar figurinhas copa 2026",
    "album copa 2026 sem gastar muito",
    "como completar album copa barato",
  ],
  openGraph: {
    title:
      "Como Completar Álbum Copa 2026 Barato: Estratégias e Dicas de Economia",
    description:
      "Guia completo com estratégias para completar o álbum da Copa 2026 gastando menos de R$ 600. Aprenda trocas, matemática e dicas de colecionadores.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de figurinhas",
      "Dicas de economia",
      "Troca de figurinhas",
      "Colecionismo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Como Completar Álbum Copa 2026 Barato: Estratégias de Economia e Troca",
    description:
      "Aprenda a economizar até 80% completando o álbum da Copa 2026 com trocas inteligentes.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quanto custa completar o álbum da Copa 2026 sem trocar?",
    answer:
      "Comprando apenas pacotinhos sem trocar, o custo fica em torno de R$ 7.000 a R$ 8.000. Isso porque nas últimas figurinhas, a lei das repetidas faz o custo explodir exponencialmente. Para 980 figurinhas, você precisaria de cerca de 1.045 pacotes em média.",
  },
  {
    question: "Qual é o custo real trocando figurinhas?",
    answer:
      "Com trocas planejadas, o custo cai drasticamente. Em grupos pequenos (10 pessoas), gasta-se em torno de R$ 630. Em redes maiores com 100+ colecionadores, o custo pode chegar a apenas R$ 60 adicional às figurinhas base. Usando plataformas como Figurinha Fácil, a economia é significativa.",
  },
  {
    question: "Qual é a melhor estratégia para economizar na Copa 2026?",
    answer:
      "A melhor estratégia combina: (1) Comprar apenas alguns pacotinhos iniciais, (2) Cadastrar repetidas e faltantes em plataforma de troca, (3) Buscar matches com colecionadores da sua cidade, (4) Fazer trocas presenciais para evitar frete, (5) Deixar figurinhas especiais para o final quando tiver mais estoque de repetidas.",
  },
  {
    question: "Vale a pena comprar figurinhas soltas?",
    answer:
      "Comprar figurinhas soltas direto no site da Panini (após 15 de julho) vale para pouquíssimas figurinhas faltantes no final. Mas sai mais caro: R$ 0,50 a R$ 2,00 por cromo dependendo da raridade. O melhor é trocar até o final e usar a compra direta apenas para 1-2 figurinhas raras que não conseguir trocar.",
  },
  {
    question: "Quanto custa para fechar as últimas 20 figurinhas?",
    answer:
      "As últimas 20 figurinhas podem custar R$ 500 a R$ 1.500 dependendo de quantas forem especiais. Se todas forem raras, pode chegar a R$ 2.000+. Por isso trocas são essenciais. Em um grupo organizado, essas últimas 20 saem por R$ 100 a R$ 300.",
  },
];

const strategies = [
  {
    number: 1,
    title: "Compre apenas 2-3 boxes iniciais",
    description:
      "Não comece comprando muitos pacotinhos. Com 15-21 figurinhas iniciais, você já tem base para começar trocas. Cada pacotinho depois fica cada vez mais caro por figurinha nova.",
    savings: "Economiza R$ 1.500+",
  },
  {
    number: 2,
    title: "Cadastre-se em plataforma de troca antes de comprar mais",
    description:
      "Insira seus números no Figurinha Fácil e veja quantos matches você tem. Isso guia suas próximas compras: compre apenas figurinhas que ninguém da sua rede tem repetida.",
    savings: "Economiza R$ 2.000+",
  },
  {
    number: 3,
    title: "Organize trocas em grupo na sua cidade",
    description:
      "Forme grupos de 5-10 colecionadores para trocas semanais. Em grupo, a diversidade de repetidas aumenta, permitindo trocas mais eficientes. Shoppings, praças e parques são bons pontos de encontro.",
    savings: "Economiza R$ 1.000+",
  },
  {
    number: 4,
    title: "Deixe as especiais para o final",
    description:
      "Não gaste comprando pacotinhos para caçar especiais no início. Espere ter um grande estoque de figurinhas repetidas para oferecer em troca. No final do torneio, colecionadores que faltam especiais aceitam ofertas generosas.",
    savings: "Economiza R$ 800+",
  },
];

const costComparison = [
  {
    method: "Apenas pacotinhos (loteria)",
    totalCost: "R$ 7.000+",
    figurinhasCompradas: "~7.300",
    repetidas: "Alto (6.320+)",
    rating: "Ruim",
  },
  {
    method: "50% pacotes + 50% trocas",
    totalCost: "R$ 1.500",
    figurinhasCompradas: "~1.050",
    repetidas: "Médio (70+)",
    rating: "Bom",
  },
  {
    method: "30% pacotes + 70% trocas",
    totalCost: "R$ 630",
    figurinhasCompradas: "~630",
    repetidas: "Baixo (40+)",
    rating: "Excelente",
  },
  {
    method: "20% pacotes + 80% trocas (grupo)",
    totalCost: "R$ 300",
    figurinhasCompradas: "~420",
    repetidas: "Mínimo (20+)",
    rating: "Ótimo",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  {
    name: "Álbum da Copa 2026",
    url: `${BASE_URL}/album-copa-do-mundo-2026`,
  },
  { name: "Como Completar Barato", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Como Completar Álbum Copa 2026 Barato: Guia com Estratégias de Economia",
  description:
    "Guia completo com estratégias para completar o álbum da Copa 2026 gastando menos. Matemática de custo, dicas de troca e economia de até 80%.",
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

const tips = [
  {
    icon: Lightbulb,
    title: "Inteligência de compra",
    description:
      "Verifique a rede antes de comprar. Se muita gente tem a figurinha que você quer, não compre pacotinhos — troque.",
  },
  {
    icon: Users,
    title: "Rede é ouro",
    description:
      "Quanto maior sua rede de colecionadores, mais barato fica. 1 pessoa = impossível. 100 pessoas = trivial.",
  },
  {
    icon: TrendingDown,
    title: "Preço cai com tempo",
    description:
      "No final do torneio, colecionadores desistem. Figurinhas raras de mercado caem de preço em trocas.",
  },
  {
    icon: BarChart3,
    title: "Matemática é sua amiga",
    description:
      "980 figurinhas ÷ 7 por pacote = 140 pacotes no melhor cenário (0% repetidas = impossível na prática).",
  },
];

export default function ComoCompletarAlbumBaratoPage() {
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
                Como Completar Barato
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Estratégia de Economia
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Completar Álbum Copa 2026{" "}
              <span className="text-gradient-primary">
                Barato: Economize até 80%
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              A maioria dos colecionadores gasta <strong>R$ 7.000+</strong> para
              completar o álbum da Copa 2026. Mas com as estratégias certas, você
              pode fazer por menos de <strong>R$ 500</strong>. Neste guia,
              mostramos a matemática, as melhores estratégias e como usar trocas
              para economizar 80%.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 27/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
            </div>
          </div>
        </section>

        {/* Quick savings showcase */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-8">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-gradient-to-br from-red-500/10 to-red-600/5 border-red-500/20 text-[var(--on-surface)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-widest text-red-600">
                  Sem Estratégia
                </CardTitle>
                <p className="text-3xl font-bold text-red-600 mt-2">R$ 7.000+</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Apenas comprando pacotinhos na sorte
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-[var(--on-surface)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-widest text-yellow-600">
                  Com Trocas
                </CardTitle>
                <p className="text-3xl font-bold text-yellow-600 mt-2">R$ 630</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Grupo pequeno de 10 colecionadores
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20 text-[var(--on-surface)]">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm uppercase tracking-widest text-green-600">
                  Estratégia Ótima
                </CardTitle>
                <p className="text-3xl font-bold text-green-600 mt-2">R$ 300</p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Rede grande + planejamento
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Matemática da economia */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            A matemática de completar o álbum
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Vamos aos números. O álbum tem{" "}
              <strong>980 figurinhas no total</strong>. Cada pacotinho tem 7
              figurinhas e custa R$ 7,00. Parece simples: 980 ÷ 7 = 140
              pacotinhos = R$ 980.
            </p>

            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)] flex items-center gap-2">
                <Calculator className="h-5 w-5 text-[var(--primary)]" />
                Cálculo Realista
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between items-center pb-3 border-b border-[var(--outline-variant)]/20">
                  <span>980 figurinhas no álbum</span>
                  <span className="font-mono text-[var(--primary)]">980</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-[var(--outline-variant)]/20">
                  <span>Taxa de repetição (sem trocar)</span>
                  <span className="font-mono text-[var(--primary)]">87%</span>
                </li>
                <li className="flex justify-between items-center pb-3 border-b border-[var(--outline-variant)]/20">
                  <span>Total de figurinhas a comprar</span>
                  <span className="font-mono text-[var(--primary)]">~7.315</span>
                </li>
                <li className="flex justify-between items-center font-bold">
                  <span>Custo sem trocar</span>
                  <span className="font-mono text-red-600">R$ 7.315</span>
                </li>
              </ul>

              <div className="mt-6 pt-6 border-t border-[var(--outline-variant)]/20">
                <h4 className="font-semibold mb-3 text-[var(--on-surface)]">
                  Com trocas estratégicas:
                </h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span>Figurinhas a comprar</span>
                    <span className="font-mono text-[var(--primary)]">~500</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Custo aproximado</span>
                    <span className="font-mono text-[var(--primary)]">R$ 500</span>
                  </li>
                  <li className="flex justify-between font-bold text-green-600">
                    <span>Economia</span>
                    <span className="font-mono">93%</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Estratégias principais */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            As 4 estratégias para economizar
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {strategies.map((strategy) => (
              <Card
                key={strategy.number}
                className="relative bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                    {strategy.number}
                  </div>
                  <CardTitle className="text-lg mt-2">{strategy.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {strategy.description}
                  </CardDescription>
                  <div className="pt-3 border-t border-[var(--outline-variant)]/20">
                    <p className="text-sm font-semibold text-green-600">
                      {strategy.savings}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Comparação de métodos */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Comparação de métodos: qual é mais barato?
          </h2>
          <div className="overflow-x-auto rounded-2xl border border-[var(--outline-variant)]/20">
            <table className="w-full text-sm">
              <thead className="bg-[var(--surface-container-high)] border-b border-[var(--outline-variant)]/20">
                <tr>
                  <th className="text-left p-4 font-semibold text-[var(--on-surface)]">
                    Método
                  </th>
                  <th className="text-center p-4 font-semibold text-[var(--on-surface)]">
                    Custo Total
                  </th>
                  <th className="text-center p-4 font-semibold text-[var(--on-surface)]">
                    Fig. Compradas
                  </th>
                  <th className="text-center p-4 font-semibold text-[var(--on-surface)]">
                    Repetidas
                  </th>
                  <th className="text-center p-4 font-semibold text-[var(--on-surface)]">
                    Rating
                  </th>
                </tr>
              </thead>
              <tbody>
                {costComparison.map((row, idx) => (
                  <tr
                    key={idx}
                    className={`border-b border-[var(--outline-variant)]/20 ${
                      idx === costComparison.length - 1
                        ? "bg-green-500/5"
                        : "hover:bg-[var(--surface-container-high)]"
                    }`}
                  >
                    <td className="p-4 text-[var(--on-surface)] font-medium">
                      {row.method}
                    </td>
                    <td className="p-4 text-center font-mono font-bold text-[var(--primary)]">
                      {row.totalCost}
                    </td>
                    <td className="p-4 text-center text-[var(--on-surface-variant)]">
                      {row.figurinhasCompradas}
                    </td>
                    <td className="p-4 text-center text-[var(--on-surface-variant)]">
                      {row.repetidas}
                    </td>
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                          row.rating === "Ótimo" || row.rating === "Excelente"
                            ? "bg-green-500/20 text-green-600"
                            : row.rating === "Bom"
                              ? "bg-yellow-500/20 text-yellow-600"
                              : "bg-red-500/20 text-red-600"
                        }`}
                      >
                        {row.rating}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Dicas práticas */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            4 dicas práticas para economizar mais
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={tip.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center">
                        <Icon
                          className="h-5 w-5 text-[var(--primary)]"
                          aria-hidden="true"
                        />
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
              );
            })}
          </div>
        </section>

        {/* Aviso */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <AlertCircle className="h-6 w-6 text-yellow-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg text-yellow-600 mb-2">
                  Cuidado com mineradores de figurinhas
                </h3>
                <p className="text-[var(--on-surface-variant)] mb-3">
                  Alguns "mineradores" compram milhares de pacotinhos procurando
                  figurinhas raras para vender a preço de mercado. Isso aumenta
                  a inflação de preços para todos. Use trocas em comunidade,
                  não patronos do mercado especulativo.
                </p>
              </div>
            </div>
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
            Perguntas frequentes
          </h2>
          <div className="space-y-4">
            {FAQS.map((item) => (
              <Card
                key={item.question}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-base md:text-lg flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-[var(--primary)] mt-1 flex-shrink-0" />
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
              <Zap className="w-4 h-4 text-green-600" aria-hidden="true" />
              <span className="text-green-600 text-[10px] font-bold tracking-[0.2em] uppercase">
                Comece a economizar
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Estratégia + comunidade = álbum 93% mais barato
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Junte-se a milhares de colecionadores que economizam completando
              seus álbuns com trocas. Cadastre-se grátis no Figurinha Fácil.
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
                <Link href="/album-copa-do-mundo-2026">
                  Ver guia completo
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
