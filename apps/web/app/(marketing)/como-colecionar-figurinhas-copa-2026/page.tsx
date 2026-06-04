import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  DollarSign,
  Gift,
  MapPin,
  Lightbulb,
  Users,
  TrendingDown,
  Calendar,
  ShoppingCart,
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
import { DownloadGuideButton } from "@/components/download-guide-button";
import {
  BASE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateFAQSchema,
  generateCombinedSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/como-colecionar-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-31T00:00:00Z";
const MODIFIED_AT = "2026-05-31T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Colecionar Figurinhas da Copa 2026: Guia Completo com Dicas de Economia",
  description:
    "Guia definitivo sobre como colecionar figurinhas da Copa 2026 em 2026. Descubra como começar, onde comprar, quanto custa, e as melhores estratégias para economizar até R$ 1.500 trocando com colecionadores perto de você.",
  keywords: [
    "como colecionar figurinhas copa 2026",
    "como colecionar figurinhas",
    "colecionar figurinhas copa do mundo 2026",
    "quanto custa completar álbum copa 2026",
    "como economizar em figurinhas copa",
    "onde comprar figurinhas copa 2026",
    "dicas colecionar figurinhas 2026",
    "completar álbum copa 2026 barato",
    "como começar a colecionar figurinhas",
    "figurinhas copa 2026 preço",
  ],
  openGraph: {
    title:
      "Como Colecionar Figurinhas da Copa 2026: Guia com Dicas de Economia",
    description:
      "Saiba como colecionar figurinhas da Copa 2026 economizando até R$ 1.500. Estratégias comprovadas de colecionadores experientes.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas",
      "Colecionar",
      "Dicas",
      "Economia",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Como Colecionar Figurinhas da Copa 2026: Guia com Dicas de Economia",
    description:
      "Descubra como colecionar figurinhas da Copa 2026 gastando menos. Estratégias de colecionadores experientes.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é o custo total para completar o álbum da Copa 2026?",
    answer:
      "Comprando apenas pacotinhos na sorte, o custo ultrapassa R$ 2.500 pela lei das repetidas. Mas quem troca com outros colecionadores consegue completar por R$ 600 a R$ 800. No Figurinha Fácil, você encontra matches exatos com colecionadores perto de você.",
  },
  {
    question: "Como começar a colecionar figurinhas da Copa 2026?",
    answer:
      "Comece comprando um álbum (brochura por R$ 24,90) e um box inicial de 5-10 pacotinhos (R$ 35-70). Isso lhe dá uma base para trocar. Em seguida, cadastre no Figurinha Fácil, registre suas figurinhas repetidas e faltantes, e a plataforma conecta você com trocadores locais.",
  },
  {
    question: "Onde comprar figurinhas da Copa 2026 no Brasil?",
    answer:
      "Figurinhas estão disponíveis em: bancas de jornal, supermercados (Atacadão, Extra, Carrefour), Panini.com.br, Amazon, Magazine Luiza, Mercado Livre, iFood com entregas rápidas, e McDonald's em combos promacionais. Sempre compare preços antes de comprar.",
  },
  {
    question: "Qual é a melhor estratégia para completar o álbum rápido?",
    answer:
      "Combine 70% trocas + 30% compras. Cadastre no Figurinha Fácil desde o começo, faça trocas frequentes, e deixe as especiais/legendárias para o fim. Grupos de troca com 10+ pessoas reduzem custos drasticamente porque você tem mais opções de matches.",
  },
  {
    question: "Vale a pena comprar álbum de capa dura?",
    answer:
      "Sim, se você pretende exibir. O álbum brochura custa R$ 24,90 e é perfeito para trocar. A capa dura custa R$ 49-79,90 e protege melhor as figurinhas, com valor de coleção maior. Escolha conforme seu objetivo: coletar (brochura) ou colecionar como peça (capa dura).",
  },
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum tem 980 figurinhas no total: 912 figurinhas base dos jogadores e times, e 68 figurinhas especiais (brilhantes) com capitães, craques, mascote, bola e troféu. É a maior coleção da história dos álbuns de Copa.",
  },
  {
    question: "Como evitar desperdiçar dinheiro comprando pacotinhos repetidos?",
    answer:
      "Registre cada pacotinho que abre no Figurinha Fácil. A plataforma aprende seu padrão e sugere automaticamente trocas com quem tem exatamente o que você precisa. Assim você minimiza gastos com repetidas e maximiza matches úteis.",
  },
  {
    question: "Posso trocar figurinhas online ou só presencial?",
    answer:
      "No Figurinha Fácil as trocas são presenciais por segurança, mas você encontra trocadores online. Recomendamos pontosde troca públicos (shoppings, praças) para mais segurança. Grupos de WhatsApp e Facebook também são populares para combinar trocas locais.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Como Colecionar Figurinhas da Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Como Colecionar Figurinhas da Copa 2026: Guia Completo com Dicas de Economia",
  description:
    "Guia definitivo sobre como colecionar figurinhas da Copa 2026. Descubra estratégias para economizar, onde comprar, quanto custa completar o álbum, e como maximizar trocas.",
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
  keywords: [
    "como colecionar figurinhas copa 2026",
    "colecionar figurinhas",
    "economia figurinhas",
    "como trocar figurinhas",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

const quickStats = [
  {
    icon: DollarSign,
    label: "Economia com trocas",
    value: "até 70%",
    detail: "vs. só compras",
  },
  {
    icon: TrendingDown,
    label: "Custo por álbum",
    value: "R$ 600-800",
    detail: "trocando ativamente",
  },
  {
    icon: Calendar,
    label: "Tempo pra completar",
    value: "2-3 meses",
    detail: "com trocas semanais",
  },
  {
    icon: Users,
    label: "Colecionadores",
    value: "Milhares",
    detail: "prontos para trocar",
  },
];

const whereToBy = [
  {
    place: "Bancas e Jornacos",
    detail: "Encontre nas bancas tradicionais da sua cidade. Preço: R$ 7/pacote",
    available: true,
  },
  {
    place: "Supermercados",
    detail: "Atacadão, Extra, Carrefour têm estoques maiores. Compare preços.",
    available: true,
  },
  {
    place: "Panini.com.br",
    detail: "Compra direta da editora com promoções e envio para todo Brasil.",
    available: true,
  },
  {
    place: "Amazon & Marketplace",
    detail: "Magazine Luiza, Mercado Livre. Cuidado com preços inflacionados.",
    available: true,
  },
  {
    place: "iFood",
    detail: "Delivery de figurinhas e álbum. Rápido e prático.",
    available: true,
  },
  {
    place: "McDonald's",
    detail: "Promoções e combos com figurinhas inclusos. Vale acompanhar.",
    available: true,
  },
];

const economyTips = [
  {
    icon: Lightbulb,
    title: "Comece com álbum brochura",
    description:
      "R$ 24,90 é o investimento inicial mínimo. Capa dura (R$ 49+) é para depois, quando tiver umas 100 figurinhas já.",
  },
  {
    icon: ShoppingCart,
    title: "Compre boxes inteligentes",
    description:
      "Ao invés de pacotes soltos, compre boxes de 50 envelopes. Cada pacote cai para ~R$ 5,20 (vs R$ 7). Economiza 25%.",
  },
  {
    icon: Gift,
    title: "Troque, não compre",
    description:
      "Cada figurinha repetida é ouro. Use no Figurinha Fácil para encontrar quem quer exatamente ela. Trocas = custo zero.",
  },
  {
    icon: MapPin,
    title: "Grupos locais de troca",
    description:
      "WhatsApp, Facebook e Telegram têm comunidades por cidade. Trocas presenciais são gratuitas e mais rápidas que plataformas.",
  },
  {
    icon: BookOpen,
    title: "Rastreie suas figurinhas",
    description:
      "Use planilha ou app para saber exatamente quais tem/faltam. Evita repetição de compras e acelera trocas.",
  },
  {
    icon: Users,
    title: "Crie grupo de trocadores",
    description:
      "Reúna 5-10 colecionadores. Quanto mais gente, mais matches e menos custo por pessoa. Ganho exponencial.",
  },
];

const collectorStory = [
  {
    step: "Semana 1",
    description: "Compre álbum + 10 pacotinhos = ~R$ 95",
    progress: 15,
  },
  {
    step: "Semana 2-3",
    description: "Cadastre no Figurinha Fácil, comece trocas = +150 figurinhas",
    progress: 30,
  },
  {
    step: "Semana 4-6",
    description: "Trocas ativas 2x/semana + 5 pacotinhos = +350 figurinhas",
    progress: 60,
  },
  {
    step: "Semana 7-10",
    description: "Trocas focadas em faltantes = +200 figurinhas",
    progress: 85,
  },
  {
    step: "Semana 11+",
    description: "Últimas especiais em troca = completar = R$ 650 total",
    progress: 100,
  },
];

export default function ComoColecionar() {
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
              <li className="text-[var(--on-surface)] font-medium">
                Como Colecionar Figurinhas
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Completo 2026
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Colecionar Figurinhas da Copa 2026:{" "}
              <span className="text-gradient-primary">
                guia com dicas de economia
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              O álbum com <strong>980 figurinhas</strong> pode custar R$ 2.500+
              ou <strong>apenas R$ 650</strong> se você souber trocar. Neste
              guia você descobre como começar, onde comprar mais barato, e as
              estratégias de colecionadores experientes para economizar até{" "}
              <strong>70% em figurinhas repetidas</strong>.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 31/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 10 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Quick Stats */}
        <section
          aria-labelledby="stats-heading"
          className="mx-auto max-w-5xl px-4 sm:px-6 pb-8"
        >
          <h2 id="stats-heading" className="sr-only">
            Estatísticas de economia
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickStats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={stat.label}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader className="pb-2">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-2">
                      <Icon
                        className="h-5 w-5 text-[var(--primary)]"
                        aria-hidden="true"
                      />
                    </div>
                    <CardDescription className="text-[10px] uppercase tracking-widest text-[var(--outline)]">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-2xl font-[var(--font-headline)]">
                      {stat.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {stat.detail}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Colecionar figurinhas é um hobby acessível e divertido
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O álbum da Copa 2026 é a chance perfeita para começar. Ao
              contrário do mito de que completar custa fortuna, a realidade é
              que <strong>colecionadores estratégicos gastam 70% menos</strong>{" "}
              que quem só compra pacotinhos no piloto automático.
            </p>
            <p>
              Neste guia você aprende: como começar do zero, onde comprar mais
              barato, qual é o custo real, como trocar inteligentemente, e as
              tácticas que colecionadores experientes usam para não estourar o
              orçamento.
            </p>
          </div>
        </section>

        {/* Como Começar */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por onde começar: o investimento inicial
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Não precisa de muito para começar. Com <strong>R$ 100</strong> você
              tem tudo:
            </p>
            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--primary)] font-bold min-w-fit">
                    R$ 24,90
                  </span>
                  <span>
                    <strong>Álbum brochura:</strong> a versão básica que você
                    vai preencher. Recomendamos começar por aqui, sem capa dura.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--primary)] font-bold min-w-fit">
                    R$ 70
                  </span>
                  <span>
                    <strong>10 pacotinhos:</strong> R$ 7 cada. Isso lhe dá ~70
                    figurinhas para começar a trocar.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="font-mono text-[var(--primary)] font-bold min-w-fit">
                    R$ 5
                  </span>
                  <span>
                    <strong>Cadastro:</strong> Grátis no Figurinha Fácil. Você
                    encontra trocadores da sua cidade.
                  </span>
                </li>
              </ul>
              <div className="mt-6 p-4 rounded-lg bg-[var(--primary)]/5 border border-[var(--primary)]/20">
                <p className="text-sm font-semibold text-[var(--on-surface)]">
                  💡 Dica: Não compre pacotes soltos. Procure boxes com 50
                  envelopes — o preço cai de R$ 7 para R$ 5,20. Economiza 25%.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Onde Comprar */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Onde comprar figurinhas: canal por canal
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {whereToBy.map((place) => (
              <Card
                key={place.place}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{place.place}</CardTitle>
                    {place.available && (
                      <span className="text-xs bg-[var(--tertiary)]/20 text-[var(--tertiary)] px-2 py-1 rounded-full font-semibold">
                        Disponível
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    {place.detail}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Quanto Custa */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Quanto custa completar o álbum? (A verdade)
          </h2>
          <div className="space-y-6 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <div>
              <h3 className="text-[var(--on-surface)] font-bold mb-2">
                Cenário 1: Só comprar pacotinhos
              </h3>
              <p>
                <strong>R$ 2.500+</strong> — Cada figurinha duplica suas chances
                de repetir. As últimas 100 figurinhas podem custar mais de R$
                1.500 sozinhas. É a pior estratégia e milhões de colecionadores
                caem nela todo ano.
              </p>
            </div>

            <div>
              <h3 className="text-[var(--on-surface)] font-bold mb-2">
                Cenário 2: Combinando compra + trocas
              </h3>
              <p>
                <strong>R$ 650-800</strong> — Você compra pacotinhos no início
                (R$ 300) e trocas focadas (R$ 150), mas deixa 70% das
                figurinhas para trocar com outros colecionadores (zero custo
                adicional). Este é o caminho inteligente.
              </p>
            </div>

            <div>
              <h3 className="text-[var(--on-surface)] font-bold mb-2">
                Cenário 3: Máxima eficiência com grupos
              </h3>
              <p>
                <strong>R$ 400-500</strong> — Você entra em um grupo de 10+
                trocadores ativos. O pool é tão grande que você encontra
                praticamente tudo o que precisa trocar. Compras mínimas.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--secondary)]/20 bg-[var(--surface-container-high)] p-6">
              <p className="text-[var(--on-surface)] font-semibold mb-3">
                ✅ Fórmula recomendada para o Cenário 2:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Semana 1-2: Investimento inicial (álbum + 10 pacotes) = R$ 95</li>
                <li>• Semana 3-8: Trocas ativas (4-8 trocas/semana) = grátis</li>
                <li>• Semana 9-14: Compra focada de especiais raras = R$ 150</li>
                <li>• Semana 15+: Últimos matches em troca = R$ 300-400</li>
                <li className="font-bold border-t border-[var(--outline-variant)] pt-2">
                  Total: R$ 650-800
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Economy Tips */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            6 Dicas Práticas para Economizar 70%
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {economyTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={tip.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <Icon
                        className="h-5 w-5 text-[var(--secondary)]"
                        aria-hidden="true"
                      />
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--on-surface-variant)] text-sm">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Timeline */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Timeline realista: sua jornada até completar em 10-15 semanas
          </h2>
          <div className="space-y-4">
            {collectorStory.map((milestone, idx) => (
              <Card
                key={milestone.step}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-lg">{milestone.step}</CardTitle>
                    <span className="text-2xl font-bold text-[var(--primary)]">
                      {milestone.progress}%
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] mb-3">
                    {milestone.description}
                  </p>
                  <div className="w-full bg-[var(--outline-variant)]/20 rounded-full h-2">
                    <div
                      className="bg-[var(--primary)] h-2 rounded-full transition-all"
                      style={{ width: `${milestone.progress}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Trading Strategies */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Estratégias de troca que funcionam
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
              <h3 className="text-[var(--on-surface)] font-bold mb-2">
                1. Troca de 1x1 (A mais comum)
              </h3>
              <p className="text-sm">
                Você oferece 1 figurinha que tem repetida e recebe 1 que falta.
                Justo e rápido.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
              <h3 className="text-[var(--on-surface)] font-bold mb-2">
                2. Troca de nX1 (Para figurinhas raras)
              </h3>
              <p className="text-sm">
                Você oferece 2-3 figurinhas comuns e recebe 1 especial/rara. Faz
                sentido porque a rara é mais valiosa.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
              <h3 className="text-[var(--on-surface)] font-bold mb-2">
                3. Troca de lote (Grupos grandes)
              </h3>
              <p className="text-sm">
                Você oferece 50 repetidas e recebe 30 que faltam. Mais eficiente
                que uma por uma.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
              <h3 className="text-[var(--on-surface)] font-bold mb-2">
                4. Troca em círculo (Grupos ativos)
              </h3>
              <p className="text-sm">
                 Grupos de 5-10 se encontram 1x por semana em ponto fixo. Cada
                um troca com todos. 100% de eficiência.
              </p>
            </div>
          </div>
        </section>

        {/* Figurinha Fácil CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Users
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Use o Figurinha Fácil para encontrar trocadores locais
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6">
              A forma mais inteligente de colecionar é trocando, e a forma mais
              inteligente de trocar é com a plataforma certa. No{" "}
              <strong>Figurinha Fácil</strong> você:
            </p>
            <ul className="space-y-2 mb-8 text-[var(--on-surface-variant)]">
              <li>✅ Cadastra figurinhas repetidas e faltantes (1 min)</li>
              <li>✅ Sistema encontra matches 100% compatíveis (automático)</li>
              <li>✅ Trocas presenciais em pontos seguros (zero custo)</li>
              <li>✅ Comunidade ativa (milhares de trocadores)</li>
              <li>✅ Rastreamento do seu progresso (% do álbum preenchido)</li>
            </ul>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Cadastrar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/como-funciona">Como funciona</Link>
              </Button>
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
            Perguntas frequentes sobre como colecionar
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
                  <p className="text-[var(--on-surface-variant)] text-sm md:text-base">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-container)]/20 border border-[var(--secondary)]/20">
              <Gift
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              <span className="text-[var(--secondary)] text-[10px] font-bold tracking-[0.2em] uppercase">
                Comece hoje
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Pronto para colecionar figurinhas da Copa 2026 com inteligência?
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Milhares de colecionadores já estão economizando até 70% trocando
              no Figurinha Fácil. Cadastre-se grátis e encontre trocadores perto
              de você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Cadastrar Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <DownloadGuideButton />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/album-copa-do-mundo-2026">Ver guia do álbum</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
