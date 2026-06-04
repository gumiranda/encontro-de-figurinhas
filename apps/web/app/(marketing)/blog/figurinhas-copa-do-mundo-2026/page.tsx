import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  DollarSign,
  Users,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Sticker,
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
import { Alert, AlertDescription } from "@workspace/ui/components/alert";
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

const ARTICLE_PATH = "/blog/figurinhas-copa-do-mundo-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-30T00:00:00Z";
const MODIFIED_AT = "2026-05-30T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Figurinhas Copa do Mundo 2026: Guia Completo, Raridades e Estratégias de Coleta",
  description:
    "Tudo sobre figurinhas da Copa 2026: quais são as mais raras, como encontrá-las, valores de mercado, figurinhas legendárias ouro e roxo. Estratégias práticas para completar sua coleção.",
  keywords: [
    "figurinhas copa do mundo 2026",
    "figurinhas copa 2026",
    "figurinhas raras copa 2026",
    "figurinhas especiais copa 2026",
    "figurinhas legendárias copa",
    "figurinhas ouro copa 2026",
    "figurinhas roxo copa",
    "como conseguir figurinhas raras copa",
    "valor figurinhas rare copa 2026",
    "onde comprar figurinhas copa 2026",
  ],
  openGraph: {
    title:
      "Figurinhas Copa do Mundo 2026: Raridades, Preços e Guia Completo",
    description:
      "Descubra as figurinhas mais raras da Copa 2026, valores de mercado, figurinhas legendárias e estratégias para colecionar.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Figurinhas",
      "Copa do Mundo 2026",
      "Colecionismo",
      "Panini",
      "Rarezas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Figurinhas Copa do Mundo 2026: Raridades e Estratégias de Coleta",
    description:
      "Guia completo sobre figurinhas da Copa 2026: raridades, preços e como colecionar.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quais são as figurinhas mais raras da Copa 2026?",
    answer:
      "As figurinhas mais raras são as Legendárias (roxo) e Ouro. As legendárias têm probabilidade de 1 em 190 envelopes, enquanto as de ouro têm 1 em 1.900 envelopes. Entre as mais procuradas estão Vini Jr., Mbappé, Haaland e Messi — que custam entre R$ 600 a R$ 5.000 dependendo da condição.",
  },
  {
    question: "Quanto custa uma figurinha rara da Copa 2026?",
    answer:
      "Figurinhas Ouro e Legendárias custam de R$ 100 a R$ 5.000+ no mercado secundário. Legendárias de craques como Vini Jr. (BRA-10) podem alcançar R$ 3.000. Figurinhas base normais custam de R$ 0,50 a R$ 5,00.",
  },
  {
    question:
      "Qual é a diferença entre figurinhas Ouro, Roxo e Especiais da Copa 2026?",
    answer:
      "Especiais (68 no total) são figurinhas brilhantes com captains, craques e ícones. Roxo (Legendárias) têm efeito roxo e maior raridade. Ouro têm acabamento dourado e são as mais raras de todas. Cada categoria tem frequência de drop diferente.",
  },
  {
    question: "Como saber se uma figurinha é rara de verdade?",
    answer:
      "Figurinhas especiais têm efeito brilhante visível. Legendárias roxas têm código BRA-L1, BRA-L2, etc. Figurinhas Ouro têm acabamento dourado e listras holográficas. A Panini publica a lista oficial de todas as especiais no manual do álbum.",
  },
  {
    question:
      "Onde posso vender ou trocar figurinhas raras da Copa 2026?",
    answer:
      "Você pode trocar no Figurinha Fácil com colecionadores locais de graça. Para vender, Mercado Livre, OLX e grupos do Facebook são populares. Casas de selos e colecionáveis também compram. Sempre valide o preço verificando vendas recentes.",
  },
  {
    question: "Como aumentar a chance de encontrar figurinhas raras?",
    answer:
      "Comprando diretamente em lotes ou boxes da Panini (maior concentração de especiais). Trocando com muitos colecionadores aumenta a chance de conseguir as raras que faltam. Grupos de colecionadores compartilham informações sobre as drop rates reais.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Figurinhas Copa do Mundo 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Figurinhas Copa do Mundo 2026: Guia Completo, Raridades e Estratégias de Coleta",
  description:
    "Guia completo sobre figurinhas da Copa 2026: quais são as mais raras, valores de mercado, figurinhas legendárias e estratégias para completar sua coleção.",
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
    "figurinhas copa 2026",
    "figurinhas raras",
    "figurinhas especiais",
    "legendárias copa",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

const raretyTiers = [
  {
    name: "Base",
    probability: "~1 em 7",
    avgPrice: "R$ 0,50 - R$ 2,00",
    color: "bg-blue-50",
    icon: Sticker,
    description:
      "Jogadores das seleções, escudos e uniformes. Encontradas na maioria dos pacotes.",
  },
  {
    name: "Especiais (Brilhantes)",
    probability: "1 em ~20",
    avgPrice: "R$ 5,00 - R$ 50,00",
    color: "bg-purple-50",
    icon: Sparkles,
    description:
      "68 figurinhas com efeito brilhante: capitães, craques, troféu e mascote.",
  },
  {
    name: "Legendárias (Roxo)",
    probability: "1 em 190",
    avgPrice: "R$ 100,00 - R$ 1.000,00",
    color: "bg-pink-50",
    icon: Sparkles,
    description:
      "Homenagens a lendas do futebol com acabamento roxo premium. Muito procuradas.",
  },
  {
    name: "Ouro Premium",
    probability: "1 em 1.900",
    avgPrice: "R$ 500,00 - R$ 5.000,00+",
    color: "bg-yellow-50",
    icon: TrendingUp,
    description:
      "As mais raras: acabamento ouro holográfico. Colecionadores disputam ferozmente.",
  },
];

const collectingStrategies = [
  {
    title: "Estratégia 1: Colecionador Casual",
    description:
      "Compre pacotes regularmente, troque o que sobra, não foque em raras.",
    budget: "R$ 100-500",
    timeframe: "5-6 meses",
    difficulty: "Fácil",
    pros: [
      "Diversão garantida",
      "Sem pressão por raras",
      "Comunidade acessível",
    ],
    cons: ["Álbum incompleto", "Muitas repetidas", "Custo disperso"],
  },
  {
    title: "Estratégia 2: Completador Inteligente",
    description:
      "Mix de compras + trocas agressivas com foco em base e especiais.",
    budget: "R$ 300-800",
    timeframe: "3-4 meses",
    difficulty: "Médio",
    pros: [
      "Álbum bem completo",
      "Economia significativa",
      "Comunidade forte",
    ],
    cons: ["Requer dedicação", "Negociações frequentes", "Últimas figurinhas difíceis"],
  },
  {
    title: "Estratégia 3: Colecionador Premium",
    description: "Foco em conseguir todas as raras: roxo, ouro e legendárias.",
    budget: "R$ 3.000+",
    timeframe: "6-12 meses",
    difficulty: "Difícil",
    pros: [
      "Coleção completa e rara",
      "Potencial de revenda",
      "Prestígio na comunidade",
    ],
    cons: ["Investimento alto", "Requer muita pesquisa", "Risco de falsificações"],
  },
];

export default function FigurinhasCopaDoMundo2026Page() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main
        id="main-content"
        className="pt-24 min-h-screen text-[var(--on-surface)]"
      >
        {/* Breadcrumb */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-6">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-[var(--outline)]"
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
                Figurinhas Copa do Mundo 2026
              </li>
            </ol>
          </nav>
        </section>

        {/* Hero */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-8">
          <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold mb-4">
            Guia de Coleta
          </Badge>

          <h1 className="font-[var(--font-headline)] text-3xl sm:text-4xl md:text-5xl font-black leading-tight mb-6">
            Figurinhas Copa do Mundo 2026:{" "}
            <span className="text-gradient-primary">
              Raridades, Preços e Estratégias de Coleta Completa
            </span>
          </h1>

          <p className="text-lg md:text-xl text-[var(--on-surface-variant)] leading-relaxed mb-8 max-w-3xl">
            A Copa 2026 tem <strong>980 figurinhas</strong> divididas em 4 níveis
            de raridade: base, especiais, legendárias roxo e ouro. Este guia
            prático explica quais são as mais valiosas, como encontrá-las, os
            preços reais do mercado e as melhores estratégias para colecionar
            todas elas.
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-[var(--outline)]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Publicado em 30/05/2026
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Atualizado regularmente
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Leitura: 8 min
            </span>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div className="space-y-6 text-[var(--on-surface-variant)] leading-relaxed">
            <p className="text-base md:text-lg">
              As <strong>figurinhas da Copa do Mundo 2026</strong> são mais que
              apenas cartas para colar: para colecionadores, representam
              desafios de raridade, valor de mercado e prestígio dentro da
              comunidade. Com um álbum 44% maior que o da Copa 2022, as
              figurinhas se tornaram ainda mais procuradas e caras.
            </p>

            <p className="text-base md:text-lg">
              Este artigo é um guia prático para entender os diferentes tipos de
              figurinhas, seus valores reais no mercado, quais são as mais raras
              e disputadas, e as melhores estratégias para conseguir cada uma
              delas — seja através de troca, compra ou investimento.
            </p>
          </div>
        </section>

        {/* Raridade Tiers */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-3xl font-bold mb-8">
            Os 4 Níveis de Raridade das Figurinhas Copa 2026
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {raretyTiers.map((tier) => {
              const Icon = tier.icon;
              return (
                <Card
                  key={tier.name}
                  className={`${tier.color} border-[var(--outline-variant)]/20`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="w-6 h-6 text-[var(--primary)]" />
                      <CardTitle className="text-lg">{tier.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm text-[var(--outline)]">Raridade</p>
                      <p className="font-mono font-bold text-[var(--primary)]">
                        {tier.probability}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-[var(--outline)]">
                        Preço médio
                      </p>
                      <p className="font-mono font-bold text-[var(--secondary)]">
                        {tier.avgPrice}
                      </p>
                    </div>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {tier.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Figurinhas Mais Valiosas */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-3xl font-bold mb-6">
            Top 10: Figurinhas Mais Valiosas da Copa 2026
          </h2>

          <div className="space-y-3">
            {[
              {
                pos: 1,
                name: "Vini Jr. (BRA-10) - Ouro",
                price: "R$ 4.500",
              },
              {
                pos: 2,
                name: "Mbappé (FRA-7) - Ouro",
                price: "R$ 4.000",
              },
              {
                pos: 3,
                name: "Haaland (NOR-9) - Ouro",
                price: "R$ 3.800",
              },
              {
                pos: 4,
                name: "Messi (ARG-10) - Ouro",
                price: "R$ 3.600",
              },
              {
                pos: 5,
                name: "Rodrygo (BRA-20) - Roxo",
                price: "R$ 1.200",
              },
              {
                pos: 6,
                name: "Neymar (BRA-10) - Roxo",
                price: "R$ 1.100",
              },
              {
                pos: 7,
                name: "Kane (ENG-9) - Roxo",
                price: "R$ 950",
              },
              {
                pos: 8,
                name: "Ronaldo (POR-7) - Roxo",
                price: "R$ 900",
              },
              {
                pos: 9,
                name: "Mascote Copa 2026",
                price: "R$ 650",
              },
              {
                pos: 10,
                name: "Bola Oficial FIFA",
                price: "R$ 550",
              },
            ].map((item) => (
              <Card
                key={item.pos}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardContent className="py-4 px-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-[var(--primary)] w-8 text-center">
                      {item.pos}
                    </span>
                    <span className="text-[var(--on-surface)] font-medium">
                      {item.name}
                    </span>
                  </div>
                  <span className="font-mono font-bold text-[var(--secondary)]">
                    {item.price}
                  </span>
                </CardContent>
              </Card>
            ))}
          </div>

          <Alert className="mt-6 bg-[var(--secondary-container)]/20 border-[var(--secondary)]/20">
            <AlertCircle className="h-4 w-4 text-[var(--secondary)]" />
            <AlertDescription className="text-[var(--on-surface-variant)]">
              <strong>Nota importante:</strong> Preços variam conforme condição da
              figurinha (menta, leve amassado, danificada), demanda sazonal e
              plataforma de venda. Estes valores são referência de maio 2026.
            </AlertDescription>
          </Alert>
        </section>

        {/* Como as figurinhas são distribuídas */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-3xl font-bold mb-6">
            Como a Panini Distribui as Figurinhas nos Pacotes
          </h2>

          <div className="space-y-6 text-[var(--on-surface-variant)] leading-relaxed">
            <p className="text-base md:text-lg">
              Cada pacote da Copa 2026 vem com <strong>7 figurinhas aleatórias</strong>.
              A distribuição segue um padrão de raridade, mas <strong>a
              aleatoriedade garante surpresa</strong> — pode sair uma figurinha
              ouro raramente, ou várias repetidas de uma seleção.
            </p>

            <div className="rounded-xl bg-[var(--surface-container-high)] border border-[var(--outline-variant)]/20 p-6">
              <h3 className="font-bold mb-4 text-[var(--on-surface)]">
                Probabilidade Real (baseada em aberturas de colecionadores):
              </h3>
              <ul className="space-y-2 text-sm font-mono">
                <li className="flex justify-between">
                  <span>5-6 figurinhas base por pacote</span>
                  <span className="text-[var(--primary)] font-bold">~85%</span>
                </li>
                <li className="flex justify-between">
                  <span>1 figurinha especial (brilhante)</span>
                  <span className="text-[var(--secondary)] font-bold">~13%</span>
                </li>
                <li className="flex justify-between">
                  <span>1 figurinha rara (roxo/ouro)</span>
                  <span className="text-yellow-600 font-bold">~2%</span>
                </li>
              </ul>
            </div>

            <p className="text-base md:text-lg">
              <strong>Importante:</strong> A Panini não divulga as odds oficiais,
              então esses percentuais vêm de análises da comunidade. Colecionadores
              experientes acompanham os{" "}
              <strong>"weight checks" (pesagem de envelopes)</strong> para tentar
              identificar pacotes com maior probabilidade de raras antes de abrir.
            </p>
          </div>
        </section>

        {/* Estratégias de Coleta */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-3xl font-bold mb-8">
            3 Estratégias de Coleta: Qual é a Sua?
          </h2>

          <div className="grid gap-6">
            {collectingStrategies.map((strategy, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardHeader>
                  <CardTitle className="text-xl">{strategy.title}</CardTitle>
                  <CardDescription className="text-base mt-2">
                    {strategy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-[var(--outline)] text-xs uppercase font-bold mb-1">
                        Orçamento
                      </p>
                      <p className="font-mono font-bold text-[var(--primary)]">
                        {strategy.budget}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--outline)] text-xs uppercase font-bold mb-1">
                        Tempo estimado
                      </p>
                      <p className="font-mono font-bold text-[var(--secondary)]">
                        {strategy.timeframe}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--outline)] text-xs uppercase font-bold mb-1">
                        Dificuldade
                      </p>
                      <p className="font-mono font-bold text-orange-600">
                        {strategy.difficulty}
                      </p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-bold text-[var(--primary)] mb-2 flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4" /> Vantagens
                      </p>
                      <ul className="space-y-1 text-[var(--on-surface-variant)]">
                        {strategy.pros.map((pro, i) => (
                          <li key={i}>• {pro}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="font-bold text-orange-600 mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Desafios
                      </p>
                      <ul className="space-y-1 text-[var(--on-surface-variant)]">
                        {strategy.cons.map((con, i) => (
                          <li key={i}>• {con}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Dicas Práticas */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-3xl font-bold mb-6">
            7 Dicas Práticas para Colecionar Figurinhas Raras
          </h2>

          <div className="space-y-4">
            {[
              {
                title: "Use o weight check para identificar pacotes raros",
                desc: "Comunidades de colecionadores documentam o peso de pacotes com figurinhas raras. Pacotes mais pesados tendem a vir com especiais. Visite bancas que deixam examinar.",
              },
              {
                title: "Compre boxes em vez de pacotinhos aleatórios",
                desc: "Um box com 50 pacotinhos garante distribuição mais homogênea de raras. Sai mais caro por unidade, mas aumenta as chances de especiais.",
              },
              {
                title: "Troque agressivamente — é grátis",
                desc: "No Figurinha Fácil você encontra colecionadores com duplicatas que você quer. Trocar é 100% gratuito e mais rápido que abrir pacotes.",
              },
              {
                title: "Faça follow em colecionadores de YouTube",
                desc: "Canais especializados abrem caixas em tempo real e mostram odds reais. Muitos adquirem pacotes em lotes diretos da Panini.",
              },
              {
                title: "Negocie em grupos do Facebook especializados",
                desc: "Grupos fechados têm preços melhores que Mercado Livre. Membros têm reputação e histórico de transações verificáveis.",
              },
              {
                title: "Invista em proteção premium desde o início",
                desc: "Pastas com plástico transparente duplo e protetor de álbum caro evitam amassados. Uma figurinha rara danificada perde 30-50% do valor.",
              },
              {
                title: "Documente suas figurinhas com foto",
                desc: "Tire fotos em boa iluminação de todas as raras que conseguir. Facilita negociações futuras e comprovação de propriedade.",
              },
            ].map((tip, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-7 h-7 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                      {idx + 1}
                    </span>
                    <CardTitle className="text-lg">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)]">{tip.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-3xl font-bold mb-8">
            Perguntas Frequentes sobre Figurinhas Copa 2026
          </h2>

          <div className="space-y-4">
            {FAQS.map((item) => (
              <Card
                key={item.question}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
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

        {/* Final CTA */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 py-16">
          <div className="rounded-2xl bg-gradient-to-r from-[var(--primary)]/10 to-[var(--secondary)]/10 border border-[var(--outline-variant)]/20 p-8 md:p-12 text-center space-y-6">
            <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
              Pronto para completar sua coleção?
            </h2>

            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Milhares de colecionadores estão usando o <strong>Figurinha Fácil</strong>{" "}
              para trocar figurinhas da Copa 2026 com pessoas perto de casa. Cadastre-se
              e encontre as figurinhas que faltam sem pagar mais caro.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Criar conta grátis
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
                  Ver guia do álbum
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
