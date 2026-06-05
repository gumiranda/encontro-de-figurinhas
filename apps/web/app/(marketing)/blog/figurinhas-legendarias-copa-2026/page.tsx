import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Crown,
  Sparkles,
  Trophy,
  Users,
  Zap,
  Star,
  Shield,
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

const ARTICLE_PATH = "/blog/figurinhas-legendarias-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-16T10:00:00Z";
const MODIFIED_AT = "2026-05-16T10:00:00Z";

export const metadata: Metadata = {
  title:
    "Figurinhas Legendárias da Copa 2026: Guia Completo das Raras e Especiais",
  description:
    "Descubra quais são as figurinhas legendárias, raras e especiais do álbum da Copa 2026. Guia completo com lista de brilhantes, craques, mascotes e troféu da FIFA.",
  keywords: [
    "figurinhas legendarias copa 2026",
    "figurinhas especiais copa 2026",
    "figurinhas raras copa do mundo 2026",
    "figurinhas brilhantes copa 2026",
    "craques copa 2026 figurinhas",
    "figurinhas rare panini",
    "troféu fifa figurinha",
    "mascote copa 2026 figurinha",
    "figurinhas holograficas copa 2026",
    "vinicius jr figurinha copa 2026",
    "capitães seleções figurinhas",
    "figurinhas mais valiosas copa 2026",
  ],
  openGraph: {
    title: "Figurinhas Legendárias da Copa 2026: Guia das Raras e Especiais",
    description:
      "Lista completa de figurinhas especiais, brilhantes e legendárias do álbum da Copa do Mundo 2026. Descubra quais são as mais raras e valiosas.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas Legendárias",
      "Álbum de Figurinhas",
      "Panini",
      "Colecionismo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Figurinhas Legendárias da Copa 2026: Guia Completo",
    description:
      "Quais são as figurinhas especiais, raras e brilhantes do álbum da Copa 2026? Veja o guia completo.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "O que são figurinhas legendárias do álbum da Copa 2026?",
    answer:
      "Figurinhas legendárias são as mais raras e valiosas do álbum. Incluem jogadores históricos, ídolos que marcaram época, capitães das seleções, a bola oficial da FIFA, o troféu da Copa e o mascote. Elas têm efeito brilhante (holográfico) e maior raridade, o que faz delas muito procuradas por colecionadores.",
  },
  {
    question: "Quantas figurinhas especiais tem o álbum da Copa 2026?",
    answer:
      "O álbum tem 68 figurinhas especiais com efeito brilhante no total. Essas figurinhas são divididas entre: 12 capitães das seleções, 24 jogadores craques, 16 figurinhas de estádios, o mascote, a bola oficial e o troféu da FIFA. Todas elas têm maior raridade em relação às figurinhas base.",
  },
  {
    question: "Qual é a figurinha mais rara do álbum da Copa 2026?",
    answer:
      "As figurinhas mais raras variam conforme a distribuição. Geralmente, o troféu da FIFA e o mascote são os mais difíceis de encontrar. Capitães e jogadores craques como Vinicius Jr., Mbappé e Haaland também têm alta demanda entre colecionadores, o que faz com que sejam muito procurados.",
  },
  {
    question: "Como encontrar figurinhas legendárias da Copa 2026?",
    answer:
      "Figurinhas especiais aparecem aleatoriamente nos pacotinhos, geralmente com menos frequência. A melhor estratégia é: compre pacotes de forma consistente, cadastre as figurinhas que encontrar em plataformas de troca como o Figurinha Fácil, e troque com outros colecionadores que têm as que você falta.",
  },
  {
    question: "Quanto vale uma figurinha legendária da Copa 2026?",
    answer:
      "O valor depende da figurinha e da demanda. Craques como Vinicius Jr. e Mbappé podem valer 5 a 10 vezes mais que uma figurinha base. O troféu e mascote podem valer ainda mais entre colecionadores. Em trocas, o valor é negociado direto entre os colecionadores.",
  },
  {
    question: "Qual é a probabilidade de encontrar uma figurinha especial?",
    answer:
      "As figurinhas especiais aparecem em aproximadamente 1 a cada 10 pacotes, variando conforme o lote de produção (batch). Esse é um número aproximado; alguns batches têm mais especiais, outros têm menos. Por isso é importante controlar de qual batch vieram seus pacotes.",
  },
  {
    question: "Figurinhas brilhantes e especiais são a mesma coisa?",
    answer:
      "Sim, na Copa 2026 as figurinhas especiais e legendárias todas têm efeito brilhante (holográfico). O termo 'brilhante' se refere ao acabamento visual, e todas as figurinhas especiais têm esse acabamento. Elas são a mesma categoria.",
  },
  {
    question: "Como cuidar das figurinhas legendárias?",
    answer:
      "Figurinhas especiais devem ser manuseadas com cuidado: use mãos limpas e secas, armazene em sacos plásticos de proteção ou páginas de álbum de qualidade, mantenha em local seco e longe de luz solar direta. Colecionadores sérios usam sleeves de proteção e caixas ácido-free para preservar o valor.",
  },
];

const legendaryCategories = [
  {
    name: "Capitães das Seleções",
    count: 12,
    description:
      "Os 12 capitães das seleções que disputam a Copa 2026. Lideranças dos times como Mbappé (França), Haaland (Noruega - qualificadas) e Vinicius Jr. (Brasil). Muito procurados por fãs dos respectivos países.",
    examples: "Vinicius Jr., Mbappé, Kane, Lewandowski, Modric",
    rarity: "Alta",
  },
  {
    name: "Craques e Ídolos",
    count: 24,
    description:
      "Os maiores jogadores do mundo em destaque especial. Incluem astros que marcaram história e os melhores em atividade. Têm efeito brilhante exclusivo e são as figurinhas mais buscadas.",
    examples: "Vinicius Jr., Mbappé, Haaland, Bellingham, Foden",
    rarity: "Muito Alta",
  },
  {
    name: "Estádios Sede",
    count: 16,
    description:
      "Os 16 estádios-sede da Copa 2026 distribuídos entre EUA, México e Canadá. Incluem templos do futebol como o Estádio Azteca, Rose Bowl e SoFi Stadium. Apreciadas por colecionadores interessados em história e geografia.",
    examples: "SoFi Stadium, Estádio Azteca, Rose Bowl, Arrowhead Stadium",
    rarity: "Média-Alta",
  },
  {
    name: "Mascote da Copa",
    count: 1,
    description:
      "A mascote oficial da FIFA World Cup 2026. Uma figurinha única e muito importante para completar a coleção. Mascotes históricos sempre foram raras e valiosas.",
    examples: "FIFA World Cup 2026 Mascot",
    rarity: "Muito Alta",
  },
  {
    name: "Bola Oficial da FIFA",
    count: 1,
    description:
      "A bola oficial que será usada nos jogos da Copa 2026. Uma figurinha singular que marca a importância do torneio. Colecionadores sérios consideram essencial para um álbum completo.",
    examples: "FIFA World Cup Official Ball 2026",
    rarity: "Muito Alta",
  },
  {
    name: "Troféu da FIFA",
    count: 1,
    description:
      "O troféu da FIFA World Cup. A figurinha mais icônica e rara do álbum, frequentemente reservada para aparecer próxima ao final dos lotes. Um símbolo máximo da competição.",
    examples: "FIFA World Cup Trophy",
    rarity: "Crítica",
  },
];

const topCrackList = [
  { name: "Vinicius Jr.", country: "Brasil", position: "Atacante" },
  { name: "Kylian Mbappé", country: "França", position: "Atacante" },
  { name: "Erling Haaland", country: "Noruega", position: "Atacante" },
  { name: "Jude Bellingham", country: "Inglaterra", position: "Meio-campo" },
  { name: "Phil Foden", country: "Inglaterra", position: "Meio-campo" },
  { name: "Pedri", country: "Espanha", position: "Meio-campo" },
  { name: "Florian Wirtz", country: "Alemanha", position: "Atacante" },
  { name: "Federico Valverde", country: "Uruguai", position: "Meio-campo" },
  { name: "Vinícius Tobias", country: "Brasil", position: "Defesa" },
  { name: "Declan Rice", country: "Inglaterra", position: "Meio-campo" },
];

const strategies = [
  {
    number: 1,
    title: "Compre em pequenas quantidades e rastreie os batches",
    description:
      "Não compre 100 pacotes de uma vez. Compre 10-20 pacotes, anote de qual série/batch vieram, cadastre tudo em uma plataforma, e depois compre mais. Assim você identifica batches com mais especiais.",
  },
  {
    number: 2,
    title: "Troque primeiro, compre depois",
    description:
      "Cada figurinha que você consegue em troca é uma que você não precisa comprar. No Figurinha Fácil, você conecta com colecionadores locais e troca suas duplicadas pelas que faltam.",
  },
  {
    number: 3,
    title: "Procure por colecionadores especializados",
    description:
      "Alguns colecionadores focam em encontrar especiais. Eles abrem muitos pacotes e têm muitas duplicadas raras. Oferecendo boas trocas, você consegue figurinhas legendárias sem gastar tanto.",
  },
  {
    number: 4,
    title: "Foque nas legendárias por último",
    description:
      "Complete as figurinhas base primeiro. Deixe as raras para o final, quando você tiver um grande estoque de repetidas para oferecer em troca.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Figurinhas Legendárias Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Figurinhas Legendárias da Copa 2026: Guia Completo das Raras e Especiais",
  description:
    "Guia completo sobre figurinhas legendárias, especiais e raras do álbum da Copa do Mundo 2026 da Panini.",
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
    "figurinhas legendárias",
    "figurinhas especiais",
    "figurinhas raras",
    "copa 2026",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function FigurinhasLegendariasCopaPage() {
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
                Figurinhas Legendárias Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Completo
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Figurinhas Legendárias da Copa 2026:{" "}
              <span className="text-gradient-primary">
                Guia completo das raras e especiais
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Descubra quais são as <strong>figurinhas especiais e legendárias</strong> do álbum
              da Copa do Mundo 2026, como encontrá-las, qual é a probabilidade
              de aparecerem nos pacotinhos, e as estratégias mais eficazes para
              completar sua coleção gastando menos.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 16/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Quick Highlights */}
        <section
          aria-labelledby="highlights-heading"
          className="mx-auto max-w-5xl px-4 sm:px-6 pb-8"
        >
          <h2 id="highlights-heading" className="sr-only">
            Destaques das figurinhas legendárias
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-2">
                  <Sparkles
                    className="h-5 w-5 text-[var(--primary)]"
                    aria-hidden="true"
                  />
                </div>
                <CardDescription className="text-[10px] uppercase tracking-widest">
                  Figurinhas especiais
                </CardDescription>
                <CardTitle className="text-2xl font-[var(--font-headline)]">
                  68
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Todas com efeito brilhante
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-[var(--secondary)]/10 flex items-center justify-center mb-2">
                  <Crown
                    className="h-5 w-5 text-[var(--secondary)]"
                    aria-hidden="true"
                  />
                </div>
                <CardDescription className="text-[10px] uppercase tracking-widest">
                  Capitães
                </CardDescription>
                <CardTitle className="text-2xl font-[var(--font-headline)]">
                  12
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Lideranças das seleções
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader className="pb-2">
                <div className="w-10 h-10 rounded-lg bg-[var(--tertiary)]/10 flex items-center justify-center mb-2">
                  <Zap
                    className="h-5 w-5 text-[var(--tertiary)]"
                    aria-hidden="true"
                  />
                </div>
                <CardDescription className="text-[10px] uppercase tracking-widest">
                  Probabilidade
                </CardDescription>
                <CardTitle className="text-2xl font-[var(--font-headline)]">
                  1 em 10
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Aproximadamente por pacote
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O que são figurinhas legendárias e especiais?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              No álbum da <strong>Copa 2026</strong>, as <strong>figurinhas legendárias</strong> são as{" "}
              <strong>figurinhas especiais com efeito brilhante</strong> (holográfico).
              Elas representam os destaques do torneio: craques, capitães, estádios
              históricos, mascote, bola e troféu da FIFA.
            </p>
            <p>
              Com <strong>apenas 68 especiais</strong> em um total de 980 figurinhas, essas
              figurinhas têm <strong>raridade muito maior</strong> que as figurinhas base.
              A probabilidade de encontrá-las é de aproximadamente <strong>1 a cada 10
              pacotes</strong>, e algumas (como troféu e mascote) são ainda mais raras.
            </p>
            <p>
              Para colecionadores sérios, as <strong>figurinhas legendárias são o desafio
              final</strong>. Completar o álbum com todas as especiais é a marca de um
              verdadeiro apaixonado por figurinhas.
            </p>
          </div>
        </section>

        {/* Categorias */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Tipos de figurinhas legendárias
          </h2>
          <div className="space-y-4">
            {legendaryCategories.map((category) => (
              <Card
                key={category.name}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Star
                          className="h-5 w-5 text-[var(--secondary)]"
                          aria-hidden="true"
                        />
                        {category.name}
                      </CardTitle>
                      <CardDescription className="mt-2">
                        {category.count === 1 ? "1 figurinha" : `${category.count} figurinhas`}
                      </CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-bold uppercase tracking-widest ${
                        category.rarity === "Crítica"
                          ? "bg-red-500/10 text-red-700 border-red-500/30"
                          : category.rarity === "Muito Alta"
                            ? "bg-orange-500/10 text-orange-700 border-orange-500/30"
                            : category.rarity === "Alta"
                              ? "bg-yellow-500/10 text-yellow-700 border-yellow-500/30"
                              : "bg-blue-500/10 text-blue-700 border-blue-500/30"
                      }`}
                    >
                      {category.rarity}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[var(--on-surface-variant)]">
                    {category.description}
                  </p>
                  <div>
                    <p className="text-sm font-semibold text-[var(--on-surface)] mb-1">
                      Exemplos:
                    </p>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {category.examples}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Top Craques */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Craques mais procurados: figurinhas com maior valor de troca
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Estes são os 10 jogadores cujas figurinhas especiais têm maior demanda
            entre colecionadores. Aparecem com efeito brilhante especial e são as
            mais difíceis de encontrar:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {topCrackList.map((player, idx) => (
              <Card
                key={player.name}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
                        <span className="font-bold text-[var(--primary)]">
                          {idx + 1}
                        </span>
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {player.name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {player.country} • {player.position}
                        </CardDescription>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </section>

        {/* Estratégias */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            4 estratégias para coletar todas as figurinhas legendárias
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Completar a coleção de especiais demanda paciência e estratégia.
            Siga estes passos para maximizar suas chances e reduzir custos:
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            {strategies.map((strategy) => (
              <Card
                key={strategy.number}
                className="relative bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardHeader>
                  <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                    {strategy.number}
                  </div>
                  <CardTitle className="text-lg mt-2">
                    {strategy.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {strategy.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Cuidados */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como preservar suas figurinhas legendárias
          </h2>
          <div className="space-y-4">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield
                    className="h-5 w-5 text-[var(--secondary)]"
                    aria-hidden="true"
                  />
                  Proteção Física
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--on-surface-variant)] space-y-2">
                <p>
                  Use <strong>sleeves de proteção</strong> de qualidade (com acesso ácido
                  zero). Armazene em caixas ácido-free. Evite manusear muito; use mãos
                  limpas e secas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Sparkles
                    className="h-5 w-5 text-[var(--secondary)]"
                    aria-hidden="true"
                  />
                  Condições Ambientais
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--on-surface-variant)] space-y-2">
                <p>
                  Armazene em local <strong>seco, fresco e longe de luz solar</strong>.
                  Umidade faz as figurinhas enrugar. Luz direta desbota o brilho especial
                  que as torna valiosas.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield
                    className="h-5 w-5 text-[var(--secondary)]"
                    aria-hidden="true"
                  />
                  Manuseio
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--on-surface-variant)] space-y-2">
                <p>
                  Evite <strong>dobras, amassados e rasgos</strong>. Não escreva ou
                  marque as figurinhas. O estado de conservação é crucial para o valor
                  de revenda ou troca.
                </p>
              </CardContent>
            </Card>
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
            Perguntas frequentes sobre figurinhas legendárias
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

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Trophy
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Conecte-se com outros colecionadores para trocar legendárias
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6">
              A forma mais econômica para completar todas as figurinhas especiais
              é <strong>trocando com outros colecionadores</strong>. No{" "}
              <strong>Figurinha Fácil</strong>, você encontra quem tem as raras que
              faltam e oferece as suas duplicadas em troca. Gratuito, presencial e
              seguro.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar a trocar
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
                  Voltar ao guia do álbum
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
