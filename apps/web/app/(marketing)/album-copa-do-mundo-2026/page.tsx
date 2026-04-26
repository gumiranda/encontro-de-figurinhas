import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleDollarSign,
  Globe,
  Sparkles,
  Sticker,
  Trophy,
  Users,
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
  generateCombinedSchema,
  generateFAQSchema,
  generateCollectionPageSchema,
  generateSportsEventSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/album-copa-do-mundo-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-04-17T00:00:00Z";
const MODIFIED_AT = "2026-04-17T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Álbum da Copa do Mundo 2026: Guia Completo de Figurinhas, Preços e Como Completar",
  description:
    "Tudo sobre o álbum da Copa do Mundo 2026 da Panini: quantas figurinhas tem, quanto custa o pacotinho, quando foi lançado, figurinhas legendárias e como completar o álbum trocando com colecionadores perto de você.",
  keywords: [
    "álbum da copa 2026",
    "álbum copa do mundo 2026",
    "figurinhas copa 2026",
    "figurinhas copa do mundo 2026",
    "quantas figurinhas tem o álbum da copa 2026",
    "quanto custa o álbum da copa 2026",
    "pacote de figurinhas copa 2026",
    "álbum panini copa 2026",
    "figurinhas legendárias copa 2026",
    "álbum fifa world cup 2026",
    "completar álbum copa 2026",
    "trocar figurinhas copa 2026",
  ],
  openGraph: {
    title:
      "Álbum da Copa do Mundo 2026: Guia Completo de Figurinhas e Preços",
    description:
      "Quantas figurinhas tem, quanto custa o pacotinho, figurinhas legendárias e como completar o álbum da Copa 2026 trocando com colecionadores.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de figurinhas",
      "Panini",
      "Figurinhas",
      "FIFA World Cup 2026",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Álbum da Copa do Mundo 2026: Guia Completo de Figurinhas e Preços",
    description:
      "Quantas figurinhas tem, preço do pacotinho e como completar o álbum da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa do Mundo 2026?",
    answer:
      "O álbum oficial da Panini da Copa do Mundo 2026 tem 980 figurinhas no total, sendo 68 especiais. É a maior edição da história da coleção, superando o recorde do álbum da Copa de 2018, que tinha 681 figurinhas.",
  },
  {
    question: "Quanto custa o pacotinho de figurinhas da Copa 2026?",
    answer:
      "Cada pacote de figurinhas da Copa do Mundo 2026 custa R$ 7,00 e vem com 7 figurinhas. O álbum em versão brochura custa cerca de R$ 24,90, e as versões especiais de capa dura vão de R$ 49,90 até R$ 79,90 (capa prata e capa ouro).",
  },
  {
    question: "Quando foi lançado o álbum da Copa do Mundo 2026?",
    answer:
      "O álbum oficial da FIFA World Cup 2026 começou a ser distribuído no Brasil em maio de 2026, algumas semanas antes do início do torneio, que acontece entre junho e julho nos Estados Unidos, México e Canadá.",
  },
  {
    question: "Quantas seleções aparecem no álbum da Copa 2026?",
    answer:
      "O álbum contempla as 48 seleções classificadas para o Mundial de 2026, a primeira Copa do Mundo com formato expandido. Cada seleção tem páginas dedicadas com jogadores, escudo, uniforme e figurinhas do elenco.",
  },
  {
    question: "Quanto custa para completar o álbum da Copa do Mundo 2026?",
    answer:
      "Comprando apenas pacotinhos na loteria, o custo médio para completar o álbum passa dos R$ 2.500, já que figurinhas repetidas são comuns. Usando plataformas de troca como o Figurinha Fácil, dá para reduzir drasticamente esse valor, trocando repetidas por figurinhas que faltam com colecionadores da sua cidade.",
  },
  {
    question: "O que são figurinhas legendárias do álbum da Copa 2026?",
    answer:
      "As figurinhas legendárias e especiais são as mais raras e brilhantes do álbum. Elas incluem jogadores icônicos, capitães das seleções, mascotes da Copa, bola oficial e troféu da FIFA. Essas figurinhas costumam ter maior valor de troca entre colecionadores.",
  },
  {
    question: "Como completar o álbum da Copa 2026 mais rápido?",
    answer:
      "A forma mais econômica é combinar compra de pacotinhos com trocas. No Figurinha Fácil você cadastra suas figurinhas repetidas e as que faltam, e a plataforma encontra automaticamente colecionadores perto de você com figurinhas compatíveis para a troca.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Álbum da Copa do Mundo 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Álbum da Copa do Mundo 2026: Guia Completo de Figurinhas, Preços e Como Completar",
  description:
    "Guia completo sobre o álbum da Copa do Mundo 2026 da Panini: quantidade de figurinhas, preços, data de lançamento, figurinhas legendárias e dicas para completar o álbum trocando com colecionadores.",
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
    "álbum da copa 2026",
    "figurinhas copa do mundo 2026",
    "panini",
    "fifa world cup 2026",
    "figurinhas legendárias",
  ],
  inLanguage: "pt-BR",
};

const collectionPageSchema = generateCollectionPageSchema();

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  collectionPageSchema,
  generateSportsEventSchema(),
]);

const quickFacts = [
  {
    icon: Sticker,
    label: "Total de figurinhas",
    value: "980",
    detail: "68 especiais",
  },
  {
    icon: CircleDollarSign,
    label: "Preço do pacotinho",
    value: "R$ 7,00",
    detail: "7 figurinhas",
  },
  {
    icon: CalendarDays,
    label: "Lançamento",
    value: "Maio/2026",
    detail: "antes da Copa",
  },
  {
    icon: Globe,
    label: "Seleções",
    value: "48",
    detail: "formato expandido",
  },
];

const albumVersions = [
  {
    name: "Brochura",
    price: "R$ 24,90",
    description:
      "Versão tradicional, ideal para quem está começando a coleção e quer economizar.",
  },
  {
    name: "Capa Dura Clássica",
    price: "R$ 49,90",
    description:
      "Capa reforçada que protege as figurinhas e valoriza o álbum como peça de coleção.",
  },
  {
    name: "Capa Dura Prata",
    price: "R$ 69,90",
    description:
      "Edição especial com detalhes prateados, muito procurada por colecionadores.",
  },
  {
    name: "Capa Dura Ouro",
    price: "R$ 79,90",
    description:
      "Versão mais luxuosa da Panini para a Copa 2026, com acabamento dourado premium.",
  },
];

const stickerTypes = [
  {
    title: "Figurinhas base",
    description:
      "Jogadores das 48 seleções, escudos e uniformes. São a maior parte do álbum e as mais fáceis de encontrar em pacotinhos.",
  },
  {
    title: "Figurinhas especiais",
    description:
      "68 figurinhas brilhantes com capitães, craques, bola oficial, troféu e mascote da FIFA World Cup 2026. Maior raridade e valor de troca.",
  },
  {
    title: "Figurinhas legendárias",
    description:
      "Homenagem a nomes históricos que marcaram a Copa do Mundo. Muito disputadas entre colecionadores por seu apelo emocional.",
  },
  {
    title: "Figurinhas dos estádios",
    description:
      "Arenas do México, Estados Unidos e Canadá que vão receber os 104 jogos do primeiro Mundial com 48 seleções.",
  },
];

const completeSteps = [
  {
    number: 1,
    title: "Compre o álbum e os primeiros pacotinhos",
    description:
      "Comece com o álbum e um box inicial de figurinhas para ter base para trocar. Evite comprar muitos pacotinhos de uma vez: foque em qualidade e trocas.",
  },
  {
    number: 2,
    title: "Cadastre suas figurinhas no Figurinha Fácil",
    description:
      "Adicione os números das figurinhas que você tem repetidas e das que ainda faltam. O sistema encontra automaticamente matches com colecionadores da sua cidade.",
  },
  {
    number: 3,
    title: "Troque com colecionadores próximos",
    description:
      "Combine o encontro em um ponto de troca público e seguro. Trocas presenciais são mais rápidas, gratuitas e ajudam a construir comunidade.",
  },
  {
    number: 4,
    title: "Foque nas especiais por último",
    description:
      "As figurinhas especiais e legendárias são as mais raras. Deixe para completar essas no fim, quando já tiver um bom estoque de repetidas para oferecer em troca.",
  },
];

export default function AlbumCopaDoMundo2026Page() {
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
              <li className="text-[var(--on-surface)] font-medium">
                Álbum da Copa do Mundo 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Copa 2026
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Álbum da Copa do Mundo 2026:{" "}
              <span className="text-gradient-primary">
                guia completo de figurinhas, preços e como completar
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Com <strong>980 figurinhas</strong>, o álbum oficial da Panini para a
              FIFA World Cup 2026 é o maior da história. Neste guia você descobre{" "}
              <strong>quantas figurinhas tem</strong>, <strong>quanto custa o
              pacotinho</strong>, quais são as figurinhas legendárias e como
              completar o álbum gastando menos trocando com outros colecionadores.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 17/04/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 6 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Quick facts */}
        <section
          aria-labelledby="quick-facts-heading"
          className="mx-auto max-w-5xl px-4 sm:px-6 pb-8"
        >
          <h2 id="quick-facts-heading" className="sr-only">
            Resumo rápido do álbum
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {quickFacts.map((fact) => {
              const Icon = fact.icon;
              return (
                <Card
                  key={fact.label}
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
                      {fact.label}
                    </CardDescription>
                    <CardTitle className="text-2xl font-[var(--font-headline)]">
                      {fact.value}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {fact.detail}
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
            O que é o álbum da Copa do Mundo 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O <strong>álbum da Copa do Mundo 2026</strong> é a coleção oficial
              da Panini para a <strong>FIFA World Cup 2026</strong>, o primeiro
              Mundial da história disputado por <strong>48 seleções</strong>, com
              sede compartilhada entre <strong>Estados Unidos, México e
              Canadá</strong>. Como em todas as edições desde 1970, colecionar o
              álbum faz parte da tradição de cada Copa no Brasil — e em 2026 ele
              vem ainda maior.
            </p>
            <p>
              São <strong>112 páginas</strong> que cobrem o troféu da FIFA, os 16
              estádios-sede, as 48 seleções classificadas, craques, mascote e
              figurinhas especiais brilhantes. A Panini lançou o álbum em{" "}
              <strong>maio de 2026</strong>, poucas semanas antes da bola rolar,
              dando tempo para colecionadores começarem a troca antes do início
              dos jogos em junho.
            </p>
          </div>
        </section>

        {/* Quantas figurinhas */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Quantas figurinhas tem o álbum da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O álbum tem <strong>980 figurinhas no total</strong>, sendo{" "}
              <strong>68 figurinhas especiais</strong> com efeito brilhante. É a
              maior coleção da história dos álbuns de Copa, superando o recorde
              anterior de 681 figurinhas da Copa de 2018 na Rússia.
            </p>
            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
                Evolução dos álbuns de Copa (Panini)
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Copa 2014 (Brasil)</span>
                  <span className="font-mono text-[var(--primary)]">
                    640 figurinhas
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Copa 2018 (Rússia)</span>
                  <span className="font-mono text-[var(--primary)]">
                    681 figurinhas
                  </span>
                </li>
                <li className="flex justify-between">
                  <span>Copa 2022 (Catar)</span>
                  <span className="font-mono text-[var(--primary)]">
                    670 figurinhas
                  </span>
                </li>
                <li className="flex justify-between font-bold">
                  <span>Copa 2026 (EUA/MEX/CAN)</span>
                  <span className="font-mono text-[var(--secondary)]">
                    980 figurinhas
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Preço */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Quanto custa o álbum e o pacotinho da Copa 2026?
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            O <strong>pacotinho da Copa 2026 custa R$ 7,00</strong> e vem com 7
            figurinhas — um reajuste em relação ao pacote de R$ 5,00 do último
            Mundial. O álbum aparece em quatro versões, e o preço muda conforme o
            acabamento:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {albumVersions.map((version) => (
              <Card
                key={version.name}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{version.name}</CardTitle>
                    <span className="font-mono text-[var(--primary)] font-bold">
                      {version.price}
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {version.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-[var(--outline)] mt-6 max-w-3xl">
            Valores de referência para o mercado brasileiro. Preços podem variar
            entre bancas, supermercados, Panini, Amazon, Magazine Luiza e Mercado
            Livre.
          </p>
        </section>

        {/* Tipos de figurinhas */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Tipos de figurinhas: especiais, legendárias e estádios
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {stickerTypes.map((type) => (
              <Card
                key={type.title}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Sparkles
                      className="h-5 w-5 text-[var(--secondary)]"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-lg">{type.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {type.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Como completar */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como completar o álbum da Copa do Mundo 2026 gastando menos
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Comprando apenas pacotinhos até fechar o álbum, o gasto médio passa
            dos <strong>R$ 2.500</strong> — a lei das repetidas faz o custo
            explodir nas últimas figurinhas. Quem troca, gasta menos. Siga estes
            4 passos para acelerar a coleção:
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {completeSteps.map((step) => (
              <Card
                key={step.number}
                className="relative bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                    {step.number}
                  </div>
                  <CardTitle className="text-lg mt-2">{step.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {step.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Seleções participantes */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Seleções no álbum: a primeira Copa com 48 times
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Pela primeira vez, a Copa do Mundo reúne <strong>48 seleções</strong>{" "}
              — um salto em relação aos 32 times das edições anteriores. No álbum,
              isso significa mais páginas, mais jogadores e uma oportunidade
              histórica para colecionadores. As seleções estão organizadas em 12
              grupos de 4, e cada uma tem sua página dedicada com escudo, uniforme
              e plantel.
            </p>
            <p>
              Entre os destaques, a <strong>Seleção Brasileira</strong> aparece
              com figurinhas do craque Vinicius Jr., do capitão e dos demais
              convocados para o Mundial. Países estreantes no Mundial também
              ganham espaço, o que aumenta o apelo do álbum para colecionadores
              que acompanham futebol internacional.
            </p>
          </div>
        </section>

        {/* Onde trocar */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Users
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Trocar é o caminho mais barato para completar o álbum
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6">
              O <strong>Figurinha Fácil</strong> é a maior rede de troca de
              figurinhas do Brasil. Você cadastra as figurinhas que tem repetidas
              e as que faltam, e a plataforma conecta você automaticamente com
              colecionadores da sua cidade com <strong>matches compatíveis</strong>
              . A troca é gratuita, presencial e acontece em pontos de encontro
              seguros.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
            Perguntas frequentes sobre o álbum da Copa 2026
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

        {/* Final CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-container)]/20 border border-[var(--secondary)]/20">
              <Trophy
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              <span className="text-[var(--secondary)] text-[10px] font-bold tracking-[0.2em] uppercase">
                Rumo ao álbum completo
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Comece a trocar figurinhas da Copa 2026 ainda hoje
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Milhares de colecionadores já estão usando o Figurinha Fácil para
              completar o álbum gastando muito menos. Cadastre-se grátis e encontre
              colecionadores perto de você.
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
              <DownloadGuideButton />
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/">Voltar à página inicial</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
