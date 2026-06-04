import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
  Users,
  Zap,
  Lightbulb,
  Award,
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
  generateCombinedSchema,
  generateFAQSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/blog/como-colecionar-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-04-20T00:00:00Z";
const MODIFIED_AT = "2026-04-20T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Colecionar Figurinhas da Copa 2026: Guia Completo para Iniciantes e Veteranos",
  description:
    "Aprenda tudo sobre colecionar figurinhas da Copa do Mundo 2026. Dicas estratégicas, dinheiro inteligente, como trocar, figurinhas raras e dicas para completar seu álbum Panini de forma eficiente.",
  keywords: [
    "colecionar figurinhas Copa 2026",
    "como colecionar figurinhas",
    "colecionador figurinhas Copa",
    "estratégia colecionar album Copa",
    "dicas figurinhas Copa 2026",
    "colecionar Panini Copa",
    "hobby colecionar figurinhas",
    "colecionar figurinhas barato",
    "figurinhas Copa como começar",
  ],
  openGraph: {
    title:
      "Como Colecionar Figurinhas da Copa 2026: Guia Completo para Iniciantes",
    description:
      "Aprenda estratégias comprovadas para colecionar figurinhas da Copa 2026. Dicas de economia, trocas inteligentes e como completar seu álbum.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Hobby",
      "Coleção",
      "Panini",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Como Colecionar Figurinhas da Copa 2026: Guia Completo para Iniciantes",
    description:
      "Aprenda estratégias para colecionar figurinhas da Copa 2026 de forma eficiente e inteligente.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é a melhor idade para começar a colecionar figurinhas?",
    answer:
      "Não há idade limite! Crianças (a partir de 6 anos) e adultos coleciona figurinhas. A Copa 2026 tem alto apelo em todas as faixas etárias. Pais costumam colecionar junto com filhos como atividade em família.",
  },
  {
    question: "Preciso comprar muitos pacotinhos para começar?",
    answer:
      "Não! Comece com o álbum brochura (R$ 24,90) e um box inicial de 3-5 pacotes (R$ 21-35). Isso é suficiente para entender o hobby. O restante vem de trocas inteligentes com outros colecionadores.",
  },
  {
    question: "Como sei se uma figurinha é rara ou especial?",
    answer:
      "Figurinhas especiais têm brilho (efeito holográfico). O álbum Panini tem 912 figurinhas comuns e 68 especiais/brilhantes. As especiais são mais raras em pacotinhos (média 1 por 15-20 pacotes) e têm maior valor de troca.",
  },
  {
    question:
      "Posso colecionar figurinhas digitais em vez de físicas?",
    answer:
      "Sim! A Panini lançou versão digital da Copa 2026 com app próprio e integração com Coca-Cola. Custa menos e não exige armazenamento físico. Mas muitos colecionadores preferem o álbum físico por nostalgia e valor de coleta.",
  },
  {
    question:
      "Vale a pena investir em figurinhas raras? Elas aumentam de valor?",
    answer:
      "Depende. Algumas figurinhas raras de Copas antigas (Pelé, Maradona) aumentam muito de valor. Mas a maioria das figurinhas 2026 tem valor estável. Colecione mais por hobby que por investimento. Raras de Copa 1970 e 1986 podem valer 50-500x o preço original.",
  },
  {
    question: "Qual é o melhor lugar para guardar meu álbum?",
    answer:
      "Coloque em local seco e fresco, longe da luz direta do sol (que desbota figurinhas). Álbuns em capa dura oferecem mais proteção. Evite umidade extrema. Se pretende coleção valiosa, use capas protetoras individuais.",
  },
  {
    question: "Como encontro outros colecionadores para trocar?",
    answer:
      "Use plataformas como Figurinha Fácil, grupos Facebook, Reddit, Discord de colecionadores, ou apps de encontro de trocas. No Figurinha Fácil a plataforma conecta você automaticamente com colecionadores próximos.",
  },
];

const collectionTips = [
  {
    icon: Zap,
    title: "Comece pequeno, cresça devagar",
    description:
      "Não compre 30 pacotes de uma vez. Compre 5-10 por semana. Isso permite ajustar estratégia e não acumular repetidas desnecessárias.",
  },
  {
    icon: Users,
    title: "Comunidade é sua melhor ferramenta",
    description:
      "Colecionadores ajudam colecionadores. Grupos de WhatsApp, Discord e Facebook são onde deals reais acontecem. Compartilhe repetidas, encontre matches.",
  },
  {
    icon: Target,
    title: "Defina seu objetivo final",
    description:
      "Quer completar os 980? Apenas as especiais? Coletar de um país? Definir objetivo guia sua estratégia de gastos.",
  },
  {
    icon: TrendingUp,
    title: "Monitore o mercado de valores",
    description:
      "Algumas figurinhas especiais sobem de preço ao longo da Copa. Jogadores que brilham nos jogos ficam mais caros. Aprenda a ler essas tendências.",
  },
  {
    icon: BookOpen,
    title: "Mantenha registro das suas figurinhas",
    description:
      "Use planilhas, apps de coleção ou o próprio Figurinha Fácil. Saber exatamente o que tem facilita trocas 10x.",
  },
  {
    icon: Lightbulb,
    title: "Figurinhas especiais: estratégia de timing",
    description:
      "As 68 especiais soltam vagarosamente. Não desperdice repetidas comuns tentando pegar especiais caro. Deixe para o final quando tiver muito para oferecer.",
  },
];

const collectionStages = [
  {
    stage: "Iniciante (0-100 figurinhas)",
    time: "Semana 1-2",
    strategy:
      "Compre pacotinhos aleatoriamente. O objetivo aqui é aprender o hobby e ver qual é o apelo. Não se preocupe em repetir.",
    spending: "R$ 50-100",
  },
  {
    stage: "Coletor Ativo (100-500 figurinhas)",
    time: "Semana 3-6",
    strategy:
      "Comece a usar plataforma de trocas. Cada vez que compra um pacote, procura matches na plataforma. Trocas dobram velocidade de coleta.",
    spending: "R$ 150-300/semana",
  },
  {
    stage: "Especialista (500-850 figurinhas)",
    time: "Semana 7-12",
    strategy:
      "Agora trocas são 80% da estratégia. Compre apenas para figurinhas que não consegue trocar. Foco em manter diversidade para múltiplos matches.",
    spending: "R$ 50-100/semana",
  },
  {
    stage: "Ultra-Coletor (850-980 figurinhas)",
    time: "Semana 13+",
    strategy:
      "Foco total em raras. Junte múltiplas repetidas para oferecer valor alto. Use comunidade premium de colecionadores. Final da Copa acelera trades.",
    spending: "R$ 200-500 (em pacotes/trocas premium)",
  },
];

const budgetScenarios = [
  {
    scenario: "Casual",
    monthly: "R$ 100-200",
    pace: "2-3 pacotes/semana",
    goal: "500 figurinhas + as favoritas",
    timeframe: "4-5 meses",
  },
  {
    scenario: "Dedicado",
    monthly: "R$ 300-600",
    pace: "6-12 pacotes/semana",
    goal: "Completar 900+",
    timeframe: "3 meses com trocas",
  },
  {
    scenario: "Hardcore",
    monthly: "R$ 1.000+",
    pace: "20+ pacotes/semana + compra de raras",
    goal: "980/980 (100% completo)",
    timeframe: "6-8 semanas",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Como Colecionar Figurinhas Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Como Colecionar Figurinhas da Copa 2026: Guia Completo para Iniciantes e Veteranos",
  description:
    "Guia completo sobre como colecionar figurinhas da Copa do Mundo 2026 de forma estratégica e eficiente.",
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
    "colecionar figurinhas Copa 2026",
    "como colecionar",
    "estratégia colecão",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function ComoColetarFigurinhasCopa2026Page() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main
        id="main-content"
        className="pt-24 min-h-screen text-[var(--on-surface)]"
      >
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
                  href="/blog"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Blog
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--on-surface)] font-medium">
                Como Colecionar Figurinhas Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia de Coleção
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Colecionar Figurinhas da Copa 2026:{" "}
              <span className="text-gradient-primary">
                Guia completo para iniciantes e veteranos
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Seja você iniciante ou colecionador experiente, este guia revela as{" "}
              <strong>estratégias comprovadas</strong> para colecionar figurinhas
              da Copa 2026 de forma inteligente: como começar, orçamento,
              figurinhas raras e como triplicar sua coleção usando trocas.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 20/04/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 10 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por que colecionar figurinhas da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Colecionar figurinhas da Copa é mais que um hobby: é uma{" "}
              <strong>tradição brasileira</strong> que conecta gerações. A Copa
              2026 é especial porque será a <strong>primeira com 48 seleções</strong>
              , significando mais figurinhas (980 no total), mais oportunidades de
              coleta e uma experiência inédita.
            </p>
            <p>
              Diferente de décadas passadas, hoje você não está sozinho na sua
              coleta. Comunidades online, plataformas de troca e outros
              colecionadores estão em volta, tornando o hobby mais social,
              colaborativo e — mais importante — muito mais barato.
            </p>
          </div>
        </section>

        {/* Como começar */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como Começar a Colecionar: Passo a Passo
          </h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Escolha seu tipo de álbum",
                desc: "Brochura (R$ 24,90) é ideal para começar. Versões capa dura (R$ 49,90-79,90) são para quem quer coleção premium.",
              },
              {
                step: 2,
                title: "Compre um box inicial",
                desc: "Comece com 3-5 pacotinhos (R$ 21-35). Isso já dá base para entender o hobby e começar a trocar.",
              },
              {
                step: 3,
                title: "Abra os pacotes e organize",
                desc: "Cole no álbum e separe as figurinhas repetidas. Use planilha ou app para rastrear o que tem.",
              },
              {
                step: 4,
                title: "Encontre comunidade de trocadores",
                desc: "Junte-se a grupos de Facebook, Discord, Telegram ou use Figurinha Fácil. Comece a procurar por matches.",
              },
              {
                step: 5,
                title: "Inicie trocas locais",
                desc: "Encontre colecionadores perto de você em pontos públicos seguros. Trocas são onde o hobby fica divertido.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-[var(--primary)] text-[var(--on-primary)] font-bold text-sm">
                    {item.step}
                  </div>
                </div>
                <div className="flex-grow pt-1">
                  <h3 className="font-semibold text-[var(--on-surface)] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-[var(--on-surface-variant)] text-sm md:text-base">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Orçamento */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Quanto Gastar? Cenários de Orçamento
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            A quantidade que você gasta depende do seu objetivo e como você
            estrutura a coleta. Aqui estão 3 cenários reais:
          </p>

          <div className="grid gap-4 md:grid-cols-3">
            {budgetScenarios.map((scenario, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{scenario.scenario}</CardTitle>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    Colecionar sem stress
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--outline)] mb-1">
                      Mensal
                    </p>
                    <p className="text-2xl font-bold text-[var(--primary)]">
                      {scenario.monthly}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--outline)] mb-1">
                      Ritmo
                    </p>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {scenario.pace}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--outline)] mb-1">
                      Meta
                    </p>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {scenario.goal}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-container)] px-3 py-2">
                    <p className="text-xs text-[var(--outline)]">Tempo estimado</p>
                    <p className="text-sm font-semibold text-[var(--on-surface)]">
                      {scenario.timeframe}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Estágios de coleta */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Os 4 Estágios de um Colecionador
          </h2>

          <div className="space-y-4">
            {collectionStages.map((stage, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{stage.stage}</CardTitle>
                      <CardDescription className="text-[var(--on-surface-variant)]">
                        {stage.time}
                      </CardDescription>
                    </div>
                    <Badge className="whitespace-nowrap">
                      {stage.spending}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)]">
                    {stage.strategy}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Dicas */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            6 Dicas Estratégicas para Colecionar Melhor
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {collectionTips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon
                          className="h-6 w-6 text-[var(--primary)]"
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

        {/* Figurinhas raras */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Sobre Figurinhas Especiais e Raras
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O álbum da Copa 2026 tem <strong>68 figurinhas especiais</strong>{" "}
              (com brilho/holográfico). Essas são <strong>5-10x mais raras</strong>{" "}
              que figurinhas comuns em pacotes aleatoriamente.
            </p>
            <p>
              As mais buscadas incluem: <strong>Capitães das seleções</strong>,{" "}
              <strong>craques (Mbappé, Vinicius Jr.)</strong>,{" "}
              <strong>troféu da FIFA</strong> e <strong>mascote oficial</strong>.
              Essas são muito mais valiosas em trocas no meio/fim da Copa.
            </p>
            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
                ⭐ Estratégia Inteligente para Raras:
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  • <strong>Não compre raras diretamente</strong> — muito caro
                  em sites de venda
                </li>
                <li>
                  • <strong>Junte repetidas comuns</strong> para oferecer valor
                  alto em trocas
                </li>
                <li>
                  • <strong>Deixe raras para o final</strong> — quando tiver
                  estoque de repetidas
                </li>
                <li>
                  • <strong>Acompanhe a Copa</strong> — jogadores que brilham
                  ficam mais caros
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Award
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Pronto para começar sua coleção?
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6">
              A melhor parte de colecionar é trocar com outros colecionadores.{" "}
              <strong>Figurinha Fácil</strong> conecta você automaticamente com
              colecionadores perto de você que têm figurinhas que você precisa.
              Comece a trocar em minutos, de forma gratuita e segura.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Criar Conta Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/como-funciona">Ver como funciona</Link>
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
            Perguntas Frequentes sobre Colecionar Figurinhas
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

        {/* Related Content */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Conteúdo Relacionado
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/album-copa-do-mundo-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Guia Completo do Álbum Copa 2026
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Saiba quantas figurinhas tem, preços, figurinhas legendárias
                    e como completar o álbum.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/quanto-custa-completar-album-copa-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Quanto Custa Completar o Álbum?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Análise detalhada de custos com simulações reais para
                    completar 980 figurinhas.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Junte-se a Milhares de Colecionadores
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              A Copa 2026 é a oportunidade perfeita para começar seu hobby.
              Cadastre-se agora e encontre automaticamente outros colecionadores
              perto de você para trocar figurinhas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar Agora Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/blog">Ler Outros Artigos</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
