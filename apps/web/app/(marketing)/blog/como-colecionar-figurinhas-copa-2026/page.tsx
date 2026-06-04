import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Trophy,
  Users,
  TrendingUp,
  Shield,
  Zap,
  Heart,
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
const PUBLISHED_AT = "2026-05-11T00:00:00Z";
const MODIFIED_AT = "2026-05-11T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Colecionar Figurinhas da Copa 2026: Guia Completo do Colecionador",
  description:
    "Aprenda a colecionar figurinhas da Copa do Mundo 2026 como um profissional. Dicas de estratégia, figurinhas raras, preservação e como ganhar trocando com outros colecionadores.",
  keywords: [
    "como colecionar figurinhas copa 2026",
    "guia colecionador copa 2026",
    "figurinhas raras copa mundo 2026",
    "estratégia colecionar figurinhas",
    "coleção completa álbum copa 2026",
    "dicas colecionar figurinhas",
    "figurinhas mais valiosas copa 2026",
    "preservação figurinhas coleção",
    "colecionador profissional copa 2026",
    "como ganhar com figurinhas copa",
  ],
  openGraph: {
    title:
      "Como Colecionar Figurinhas da Copa 2026: Guia Completo do Colecionador",
    description:
      "Estratégias, dicas de preservação e como completar sua coleção trocando com outros fãs de Copa do Mundo.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Coleção de Figurinhas",
      "Guia de Colecionador",
      "Figurinhas Raras",
      "Panini",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Como Colecionar Figurinhas da Copa 2026: Guia do Colecionador",
    description:
      "Aprenda estratégias profissionais para colecionar e completar o álbum da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é a diferença entre colecionador casual e profissional?",
    answer:
      "O colecionador casual compra pacotes ocasionalmente e aprecia figurinhas bonitas. Já o profissional usa estratégia: estuda raridades, preserva bem, acompanha tendências de mercado e foca em aumentar o valor da coleção. Com planejamento, você pode passar de casual para profissional rapidamente.",
  },
  {
    question:
      "Qual é a melhor estratégia para colecionar figurinhas da Copa 2026?",
    answer:
      "A estratégia de 3 fases funciona bem: (1) Compre 20-30 pacotes para ter base; (2) Troque intensamente com outros colecionadores para preencher as comuns; (3) Foque em raras usando o Figurinha Fácil para encontrar matches específicos. Isso economiza dinheiro e acelera a coleta.",
  },
  {
    question: "Como saber quais figurinhas vão ser as mais raras?",
    answer:
      "As raras na Copa 2026 são: (1) Figurinhas de jogadores lendários (Mbappé, Haaland no seu pico); (2) Treinadores icônicos; (3) Hologramas e especiais; (4) Mascotes e símbolos da Copa. Pesquise em comunidades de colecionadores e acompanhe fóruns especializados para antecipar tendências.",
  },
  {
    question:
      "Vale a pena colecionar figurinhas como investimento financeiro?",
    answer:
      "Sim, mas com critério. Figurinhas raras podem triplicar de valor em 2-3 anos. A chave é: comprar figurinhas com potencial real de valorização (raras, especiais, hologramas), manter em condição excelente e vender no momento certo. Evite colecionar tudo - seja seletivo.",
  },
  {
    question:
      "Como preservar figurinhas para mantê-las em condição de coleção?",
    answer:
      "Use: (1) Mangas (sleeves) de qualidade Premium; (2) Caixa de armazenamento com silica gel para umidade; (3) Evite luz solar direta; (4) Não dobre ou amasse; (5) Use luvas de algodão ao manusear raras. Figurinhas em mint condition valem 5-10x mais que danificadas.",
  },
  {
    question: "Onde encontrar colecionadores perto de mim para trocar?",
    answer:
      "Use o Figurinha Fácil! A plataforma encontra automaticamente colecionadores próximos com figurinhas que você precisa. Você cadastra o que tem e o que falta, o sistema faz os matches, e vocês trocam presencialmente. É muito mais eficiente que procurar manualmente.",
  },
];

const collectorTypes = [
  {
    icon: Heart,
    title: "Colecionador Casual",
    description:
      "Compra ocasionalmente, coleciona por diversão. Sem meta específica. Perfeito para iniciantes.",
    traits: [
      "Compra 1-5 pacotes por mês",
      "Coleciona suas seleções favoritas",
      "Não se preocupa com danos menores",
      "Troca informalmente com amigos",
    ],
  },
  {
    icon: Trophy,
    title: "Colecionador Competitivo",
    description:
      "Quer completar o álbum rapidamente. Estratégia de compra e troca calculada. Foco em meta.",
    traits: [
      "Objetivo claro: completar 100%",
      "Estratégia de troca ativa",
      "Pesquisa preços e mercado",
      "Participa de comunidades online",
    ],
  },
  {
    icon: Sparkles,
    title: "Colecionador Premium",
    description:
      "Coleciona apenas raras e especiais. Alto investimento. Foco em qualidade e exclusividade.",
    traits: [
      "Investe apenas em hologramas",
      "Preservação com cuidados extremos",
      "Acompanha tendências de mercado",
      "Busca figurinhas com potencial de valorização",
    ],
  },
  {
    icon: TrendingUp,
    title: "Colecionador Investidor",
    description:
      "Vê figurinhas como ativo financeiro. Compra estratégia. Vende no timing certo. ROI é prioridade.",
    traits: [
      "Análise de valor e raridade",
      "Armazenamento profissional",
      "Venda planejada para lucro",
      "Diversificação de raridades",
    ],
  },
];

const collectingStrategies = [
  {
    phase: "Fase 1: Construção da Base",
    duration: "Semanas 1-4",
    steps: [
      "Compre 20-30 pacotes para montar base",
      "Organize por seleção no álbum",
      "Identifique quais figurinhas faltam",
      "Cadastre tudo no Figurinha Fácil",
    ],
    tip: "Não compre muito no início. Base significa ~30-40% do álbum preenchido.",
  },
  {
    phase: "Fase 2: Trocas Intensivas",
    duration: "Semanas 5-12",
    steps: [
      "Encontre matches com Figurinha Fácil",
      "Troque com 3-5 colecionadores diferentes",
      "Priorize figurinhas comuns primeiro",
      "Atualize seu perfil semanalmente",
    ],
    tip: "Aqui é onde você economiza dinheiro. Cada troca evita 5-10 compras.",
  },
  {
    phase: "Fase 3: Caça às Raras",
    duration: "Semanas 13+",
    steps: [
      "Identifique as 50-100 figurinhas raras faltantes",
      "Procure matches específicos com raridades",
      "Negocie trocas vantajosas com colecionadores premium",
      "Compre apenas o essencial que não achar",
    ],
    tip: "Raras são 5-10% do álbum mas levam 30-40% do tempo. Seja paciente.",
  },
];

const rareCardsInfo = [
  {
    category: "Hologramas",
    rarity: "Muito Rara",
    value: "R$ 50-300",
    examples:
      "Hologramas especiais de jogadores estrela. Aparecem 1 por caixa (~36 pacotes).",
  },
  {
    category: "Jogadores Lendários",
    rarity: "Rara",
    value: "R$ 30-150",
    examples:
      "Figurinhas de ídolos históricos do futebol. Panini limita quantidade.",
  },
  {
    category: "Mascotes e Símbolos",
    rarity: "Rara",
    value: "R$ 20-80",
    examples:
      "Mascotes da Copa, símbolos, eventos especiais. Colecionadas por tema.",
  },
  {
    category: "Treinadores Icônicos",
    rarity: "Rara",
    value: "R$ 15-60",
    examples:
      "Técnicos famosos. Versões limitadas ganham valor com o tempo.",
  },
  {
    category: "Figurinhas Convencionais",
    rarity: "Comum",
    value: "R$ 0,50-2",
    examples:
      "Jogadores regulares. Abundantes. Ótimas para trocar por outras.",
  },
];

const preservationTips = [
  {
    icon: Shield,
    title: "Mangas e Proteção",
    description:
      "Use sleeves de polyester ou polymesh (não PVC). Mantenha figurinhas raras em top-loader.",
  },
  {
    icon: Zap,
    title: "Armazenamento Seco",
    description:
      "Use dessecante (silica gel) em caixas fechadas. Umidade estraga figurinhas e causa manchas.",
  },
  {
    icon: Sparkles,
    title: "Evite Luz Solar",
    description:
      "Cores desbotam com luz UV. Guarde em local fresco, escuro e sem umidade.",
  },
  {
    icon: Heart,
    title: "Manuseio Cuidadoso",
    description:
      "Use luvas de algodão para raras. Evite marcas de suor e pegadas. Nunca dobre.",
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
    "Como Colecionar Figurinhas da Copa 2026: Guia Completo do Colecionador",
  description:
    "Guia detalhado com estratégias, dicas de preservação e como identificar figurinhas raras na Copa do Mundo 2026.",
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
    "guia colecionador",
    "figurinhas raras",
    "estratégia coleta",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function ComoColeccionarPage() {
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
              Guia do Colecionador
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Colecionar Figurinhas da Copa 2026{" "}
              <span className="text-gradient-primary">
                Estratégias comprovadas para completar sua coleção
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              De colecionador casual a profissional. Aprenda estratégias reais,
              como identificar <strong>figurinhas raras e valiosas</strong>,
              preservar sua coleção, e completar o álbum economizando milhares
              de reais. Um guia prático baseado em experiência de colecionadores
              profissionais.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 11/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 12 min</span>
              <span aria-hidden="true">•</span>
              <span>Baseado em comunidade de colecionadores</span>
            </div>
          </div>
        </section>

        {/* Collector Types */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Qual é o seu tipo de colecionador?
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {collectorTypes.map((type, idx) => {
              const Icon = type.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4 mb-3">
                      <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon
                          className="h-6 w-6 text-[var(--primary)]"
                          aria-hidden="true"
                        />
                      </div>
                      <div className="flex-grow">
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                        <CardDescription className="text-[var(--on-surface-variant)] text-sm">
                          {type.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {type.traits.map((trait, i) => (
                        <li
                          key={i}
                          className="text-sm text-[var(--on-surface-variant)] flex items-start gap-2"
                        >
                          <span className="text-[var(--primary)] font-bold mt-1">
                            ✓
                          </span>
                          {trait}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Strategic Approach */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Estratégia de Coleta em 3 Fases
          </h2>

          <div className="space-y-6">
            {collectingStrategies.map((strategy, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-lg text-[var(--on-surface)]">
                      {strategy.phase}
                    </h3>
                    <p className="text-xs text-[var(--outline)] uppercase tracking-widest mt-1">
                      {strategy.duration}
                    </p>
                  </div>
                  <Badge className="whitespace-nowrap text-xs">
                    Fase {idx + 1}
                  </Badge>
                </div>

                <ul className="space-y-2 mb-4">
                  {strategy.steps.map((step, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-[var(--on-surface-variant)]"
                    >
                      <span className="font-bold text-[var(--primary)] flex-shrink-0">
                        {i + 1}.
                      </span>
                      {step}
                    </li>
                  ))}
                </ul>

                <div className="rounded-lg bg-[var(--surface-container)]/50 p-3">
                  <p className="text-xs text-[var(--outline)] uppercase tracking-widest mb-1">
                    💡 Dica
                  </p>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {strategy.tip}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rare Cards Guide */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Guia de Figurinhas Raras: Identifique e Coleciom
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {rareCardsInfo.map((card, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base md:text-lg">
                      {card.category}
                    </CardTitle>
                    <Badge className="whitespace-nowrap text-xs">
                      {card.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs text-[var(--outline)] uppercase tracking-widest mb-1">
                      Valor Típico
                    </p>
                    <p className="text-lg font-bold text-[var(--primary)]">
                      {card.value}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {card.examples}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 md:p-8">
            <h3 className="font-semibold text-lg text-[var(--on-surface)] mb-4">
              Dica Pro: Identificar Figurinhas com Potencial de Valorização
            </h3>
            <ul className="space-y-3 text-sm text-[var(--on-surface-variant)]">
              <li className="flex gap-3">
                <span className="text-[var(--primary)] font-bold flex-shrink-0">
                  1.
                </span>
                <span>
                  <strong>Risco/Raridade:</strong> Figurinhas que aparecem em
                  menos de 1% dos pacotes tendem a valorizar
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--primary)] font-bold flex-shrink-0">
                  2.
                </span>
                <span>
                  <strong>Demanda futura:</strong> Jogadores jovens com futuro
                  brilhante ganham valor
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--primary)] font-bold flex-shrink-0">
                  3.
                </span>
                <span>
                  <strong>Edições limitadas:</strong> Versões especiais (gold,
                  hologramas) remetem valor
                </span>
              </li>
              <li className="flex gap-3">
                <span className="text-[var(--primary)] font-bold flex-shrink-0">
                  4.
                </span>
                <span>
                  <strong>Condição:</strong> Figurinhas em mint condition valem
                  5-10x mais
                </span>
              </li>
            </ul>
          </div>
        </section>

        {/* Preservation */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como Preservar sua Coleção para Aumentar Valor
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {preservationTips.map((tip, idx) => {
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
                    <p className="text-[var(--on-surface-variant)] text-sm">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 md:p-8">
            <h3 className="font-semibold text-lg text-[var(--on-surface)] mb-4">
              Investimento em Proteção vs Valorização
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-[var(--outline)] uppercase tracking-widest mb-2">
                  Proteção Básica
                </p>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Sleeves comuns + Caixa → R$ 50 / Coleção
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--outline)] uppercase tracking-widest mb-2">
                  Proteção Premium
                </p>
                <p className="text-xs text-[var(--on-surface-variant)]">
                  Sleeves premium + Top-loader + Dessecante → R$ 200-300
                </p>
              </div>
              <div>
                <p className="text-sm text-[var(--outline)] uppercase tracking-widest mb-2">
                  ROI Potencial
                </p>
                <p className="text-xs text-[var(--on-surface-variant)] font-bold">
                  +R$ 2-5 mil em coleção de raras bem preservadas
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
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {FAQS.map((item, idx) => (
              <Card
                key={idx}
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
                    Álbum da Copa 2026: Guia Completo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Tudo sobre o álbum: quantas figurinhas, preços, edições
                    especiais e como começar sua coleção.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/quanto-custa-completar-album-copa-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Quanto Custa Completar o Álbum
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Análise detalhada de custos e simulações para diferentes
                    estratégias de coleta.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="text-center space-y-6">
              <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
                Encontre Colecionadores com as Figurinhas que Faltam
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
                Use o Figurinha Fácil para encontrar automaticamente matches com
                outros colecionadores próximos de você. Troque presencialmente
                e complete sua coleção em tempo recorde.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Button
                  asChild
                  size="lg"
                  className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
                >
                  <Link href="/sign-up">
                    Começar a Colecionar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
                >
                  <Link href="/como-funciona">Saiba Como Funciona</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
