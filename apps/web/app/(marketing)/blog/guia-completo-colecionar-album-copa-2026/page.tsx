import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  DollarSign,
  Users,
  PiggyBank,
  MapPin,
  Star,
  AlertCircle,
  CheckCircle2,
  Trophy,
  BookOpen,
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

const ARTICLE_PATH = "/blog/guia-completo-colecionar-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-15T00:00:00Z";
const MODIFIED_AT = "2026-05-15T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo: Como Colecionar o Álbum da Copa 2026 Economizando até 70%",
  description:
    "Estratégias práticas para colecionar o álbum da Copa do Mundo 2026 sem gastar demais. Descubra onde comprar figurinhas, como trocar com sucesso e as melhores dicas de colecionadores experientes.",
  keywords: [
    "guia completo album copa 2026",
    "como colecionar album copa 2026",
    "estratégia colecionar figurinhas copa 2026",
    "onde comprar figurinhas copa 2026",
    "melhores dicas album copa 2026",
    "colecionar figurinhas economia",
    "album copa 2026 dicas",
    "como economizar colecionar album",
    "figurinhas copa guia completo",
    "album copa 2026 estratégia",
  ],
  openGraph: {
    title:
      "Guia Completo: Como Colecionar o Álbum da Copa 2026 Economizando",
    description:
      "Estratégias práticas para colecionar o álbum da Copa 2026 com dicas de colecionadores experientes.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Guia Prático",
      "Economia",
      "Colecionar",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Guia Completo: Como Colecionar o Álbum da Copa 2026 Economizando até 70%",
    description:
      "Estratégias práticas e dicas de colecionadores para não gastar demais com o álbum da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question:
      "Por quanto tempo devo colecionar pacotinhos antes de começar a trocar?",
    answer:
      "Recomendamos comprar entre 15 e 25 pacotinhos (R$ 105 a R$ 175) para ter uma base sólida de figurinhas antes de começar a buscar trocas. Isso te dá ~100-175 figurinhas diferentes para oferecer em troca e aumenta suas chances de encontrar matches rápidos com outros colecionadores.",
  },
  {
    question: "Qual é a melhor época para começar a colecionar?",
    answer:
      "Junho e julho de 2026 (durante a Copa) são os piores meses, pois tem mais colecionadores disputando figurinhas. O ideal é começar agora (maio/junho) ou aguardar agosto, quando parte da demanda diminui e preços caem. Você encontra figurinhas mais raras com preços melhores.",
  },
  {
    question:
      "Vale a pena comprar álbum capa dura ou brochura para economizar?",
    answer:
      "Para economia pura, brochura (R$ 24,90) é a melhor opção. Mas se planeja colecionar por muitos anos, capa dura (R$ 49-79,90) protege melhor as figurinhas. O que importa mesmo é a estratégia de troca: um álbum brochura + trocas ativas custa bem menos que capa dura + apenas compras.",
  },
  {
    question:
      "Como sei se estou pagando preço justo pelas figurinhas no Figurinha Fácil?",
    answer:
      "Figurinhas comuns têm valor similar para todos; o importante é o match (você oferece o que o outro quer e vice-versa). Para especiais, pesquise quanto cobram em marketplaces. No Figurinha Fácil, trocas são gratuitas — você economiza em ambos os sentidos.",
  },
  {
    question: "É seguro trocar figurinhas com desconhecidos?",
    answer:
      "Sim, quando você usa pontos de encontro públicos como plazas, shoppings e eventos. O Figurinha Fácil recomenda encontros durante o dia em locais movimentados. Sempre troque durante o horário comercial e em ambientes com fluxo de pessoas.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Guia Completo: Como Colecionar o Álbum da Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Guia Completo: Como Colecionar o Álbum da Copa 2026 Economizando até 70%",
  description:
    "Estratégias práticas para colecionar o álbum da Copa do Mundo 2026 sem gastar demais. Dicas de colecionadores experientes.",
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
    "guia album copa 2026",
    "colecionar figurinhas",
    "economia",
    "estratégia",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

const collectingStages = [
  {
    stage: "Fase 1: Começar",
    duration: "1-2 semanas",
    actions: [
      "Comprar o álbum (brochura ou capa dura)",
      "Adquirir 15-25 pacotinhos iniciais",
      "Organizar figurinhas em ordem numérica",
      "Cadastrar-se no Figurinha Fácil",
    ],
    budget: "R$ 130 - R$ 200",
  },
  {
    stage: "Fase 2: Crescimento",
    duration: "3-6 semanas",
    actions: [
      "Iniciar trocas no Figurinha Fácil",
      "Comprar 5-10 pacotinhos adicionais",
      "Buscar figurinhas específicas que faltam",
      "Participar de encontros de troca",
    ],
    budget: "R$ 200 - R$ 400",
  },
  {
    stage: "Fase 3: Reto final",
    duration: "4-8 semanas",
    actions: [
      "Focar nas últimas 200-300 figurinhas",
      "Priorizar trocas sobre compras",
      "Negociar especiais com colecionadores",
      "Buscar figurinhas raras em grupos comunitários",
    ],
    budget: "R$ 300 - R$ 800",
  },
];

const buyingPlaces = [
  {
    place: "Bancas de jornal",
    pros: ["Conveniência local", "Entrega rápida", "Sem taxa de frete"],
    cons: ["Preço integral", "Estoque limitado às vezes"],
    priceRange: "R$ 7,00 por pacote",
  },
  {
    place: "Supermercados (Carrefour, Pão de Açúcar, Asda)",
    pros: ["Preços competitivos", "Oferta de pacotes", "Promoções ocasionais"],
    cons: ["Variam por localidade", "Concorrência alta"],
    priceRange: "R$ 6,50 - R$ 7,50 por pacote",
  },
  {
    place: "Amazon e Mercado Livre",
    pros: ["Comparação de preços fácil", "Promoções frequentes", "Frete rápido"],
    cons: ["Frete adicional (até R$ 30)", "Demora de 3-7 dias"],
    priceRange: "R$ 85 - R$ 110 por box (50 pacotes)",
  },
  {
    place: "Panini Official (panini.com.br)",
    pros: ["Fonte oficial", "Lançamentos primeiro", "Serviço de complementação"],
    cons: ["Preço integral", "Frete cobrado"],
    priceRange: "R$ 7,00 por pacote + frete",
  },
];

const tradingTips = [
  {
    icon: MapPin,
    title: "Escolha locais públicos e seguros",
    description:
      "Sempre encontre em plazas, shoppings ou eventos comunitários durante horário comercial. Evite encontros isolados.",
  },
  {
    icon: Users,
    title: "Comunique-se antes de encontrar",
    description:
      "Confirme os números exatos que vão ser trocados. Use fotos para verificar a condição das figurinhas.",
  },
  {
    icon: Star,
    title: "Priorizev figurinhas comuns primeiro",
    description:
      "Não segure especiais esperando um trade perfeito. Troque comuns agressivamente para fechar o álbum.",
  },
  {
    icon: CheckCircle2,
    title: "Organize suas figurinhas",
    description:
      "Use planilhas ou o Figurinha Fácil para saber exatamente o que você tem e o que falta. Isso acelera negociações.",
  },
];

export default function GuiaCompletoColecionar() {
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
                Guia Completo: Como Colecionar o Álbum da Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Prático 2026
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Guia Completo:{" "}
              <span className="text-gradient-primary">
                como colecionar o álbum da Copa 2026 economizando até 70%
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Descubra as estratégias práticas de colecionadores experientes para
              completar o álbum da Copa 2026 sem gastar uma fortuna. Aprenda onde
              comprar, como trocar e as dicas de ouro para economizar.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 15/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 12 min</span>
              <span aria-hidden="true">•</span>
              <span>Artigo completo</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O <strong>álbum da Copa 2026</strong> é a maior coleção da história
              com <strong>980 figurinhas</strong>, e a maioria dos colecionadores
              quer saber: <em>quanto vai custar para completar?</em> A resposta é:
              depende muito da sua estratégia.
            </p>
            <p>
              Quem compra apenas pacotinhos gasta acima de <strong>R$ 2.500</strong>
              . Quem combina compras inteligentes com trocas ativas pode completar
              o álbum por <strong>R$ 800-1.200</strong>. Essa diferença de até
              70% é o que separa colecionadores desorganizados de quem planeja bem.
            </p>
            <p>
              Neste guia, você vai descobrir exatamente como fazer isso. Vamos
              abordar onde comprar, quando comprar, como trocar eficientemente e
              as dicas de ouro dos melhores colecionadores do Brasil.
            </p>
          </div>
        </section>

        {/* Plano em 3 fases */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Seu plano em 3 fases: do zero ao álbum completo
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {collectingStages.map((stage, idx) => (
              <Card
                key={stage.stage}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-[var(--primary)]/20 text-[var(--primary)]">
                      Fase {idx + 1}
                    </Badge>
                    <span className="text-xs text-[var(--outline)]">
                      {stage.duration}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{stage.stage}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm text-[var(--on-surface)] mb-2">
                      O que fazer:
                    </h4>
                    <ul className="space-y-1">
                      {stage.actions.map((action) => (
                        <li
                          key={action}
                          className="text-sm text-[var(--on-surface-variant)] flex gap-2"
                        >
                          <CheckCircle2 className="w-4 h-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                          {action}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-2 border-t border-[var(--outline-variant)]/20">
                    <p className="text-sm text-[var(--on-surface)]">
                      <span className="font-semibold">Orçamento:</span>{" "}
                      <span className="text-[var(--primary)] font-mono">
                        {stage.budget}
                      </span>
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Onde Comprar */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Onde comprar figurinhas da Copa 2026: guia de preços
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            O preço não é tudo, mas a logística de compra afeta seu orçamento. Aqui
            está o que realmente importa em cada lugar:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {buyingPlaces.map((place) => (
              <Card
                key={place.place}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{place.place}</CardTitle>
                  <CardDescription className="font-mono font-bold text-[var(--primary)]">
                    {place.priceRange}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[var(--primary)] mb-2">
                      ✓ Vantagens
                    </h4>
                    <ul className="space-y-1">
                      {place.pros.map((pro) => (
                        <li
                          key={pro}
                          className="text-sm text-[var(--on-surface-variant)]"
                        >
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase text-[var(--secondary)] mb-2">
                      ✗ Desvantagens
                    </h4>
                    <ul className="space-y-1">
                      {place.cons.map((con) => (
                        <li
                          key={con}
                          className="text-sm text-[var(--on-surface-variant)]"
                        >
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-8 p-6 rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)]">
            <div className="flex gap-3">
              <Zap className="w-5 h-5 text-[var(--secondary)] flex-shrink-0" />
              <div>
                <h4 className="font-semibold text-[var(--on-surface)] mb-1">
                  Dica de ouro: acompanhe promoções
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Supermercados fazem promoções em fins de semana ("leve 2, pague
                  1,50"). Siga o Mercado Livre e Amazon para alertas de Black
                  Friday na Copa 2026. Um box desconto pode economizar R$ 50-100.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Estratégia de Troca */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Estratégia de troca: como trocar sem gastar
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Trocas são o coração da economia para colecionadores. Aqui estão os
            princípios que funcionam:
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {tradingTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={tip.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-[var(--primary)] flex-shrink-0 mt-0.5" />
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

          <div className="mt-8 space-y-4 max-w-3xl">
            <h3 className="font-[var(--font-headline)] text-xl font-bold">
              O ciclo perfeito de troca
            </h3>
            <div className="space-y-3">
              {[
                {
                  num: "1",
                  title: "Cadastre suas figurinhas",
                  desc: "Abra o Figurinha Fácil e adicione os números que você tem repetidos e os que faltam.",
                },
                {
                  num: "2",
                  title: "O sistema encontra matches",
                  desc: "A plataforma busca colecionadores da sua cidade com figurinhas que você precisa.",
                },
                {
                  num: "3",
                  title: "Combine o encontro",
                  desc: "Mensagem direta, confirma local (shopping, plaza) e horário (almoço ou tardinha).",
                },
                {
                  num: "4",
                  title: "Troque presencialmente",
                  desc: "Verifique as figurinhas, troquem e pronto. Grátis, seguro e rápido.",
                },
              ].map((step) => (
                <div
                  key={step.num}
                  className="flex gap-4 p-4 rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container)]"
                >
                  <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <p className="font-semibold text-[var(--on-surface)] text-sm">
                      {step.title}
                    </p>
                    <p className="text-[var(--on-surface-variant)] text-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Erros comuns */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Erros comuns que custam caro
          </h2>
          <div className="space-y-4">
            {[
              {
                title: "Comprar demais no começo",
                desc: "Muitos colecionadores compram 50 pacotinhos no primeiro mês e recebem muitas repetidas. Melhor começar devagar e trocar.",
              },
              {
                title: "Ignorar trocas e apenas comprar",
                desc: "Isso multiplica o custo final em 3-5x. Trocas são a chave. Mesmo que demore mais, economiza muito.",
              },
              {
                title: "Esperar figurinhas especiais aparecerem naturalmente",
                desc: "Raridade = 1 em 500 pacotinhos. Para especiais, foque em trocar. Elas saem muito mais fácil assim.",
              },
              {
                title: "Não organizar suas figurinhas",
                desc: "Se não sabe o que você tem, não consegue oferecer em trocas de forma eficiente. Planilha é essencial.",
              },
              {
                title: "Desistir perto do fim",
                desc: "As últimas 50-100 figurinhas são difíceis. Mas justamente aqui que trocas salvam. Não compre tudo.",
              },
            ].map((error, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border-l-4 border-[var(--secondary)] bg-[var(--surface-container-high)]"
              >
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-[var(--secondary)] flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-[var(--on-surface)]">
                      {error.title}
                    </h4>
                    <p className="text-sm text-[var(--on-surface-variant)] mt-1">
                      {error.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Timeline 2026 */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Calendário 2026: melhor época para colecionar
          </h2>
          <div className="space-y-3">
            {[
              {
                period: "Maio 2026",
                status: "🎯 Ideal",
                note: "Lançamento oficial. Procure começar aqui.",
              },
              {
                period: "Junho-Julho 2026",
                status: "⚠️ Pior",
                note: "Copa acontecendo. Máxima concorrência e preços altos.",
              },
              {
                period: "Agosto-Setembro 2026",
                status: "✅ Bom",
                note: "Hype diminui, figurinhas raras aparecem mais, preços caem.",
              },
              {
                period: "Outubro+ 2026",
                status: "💰 Barato",
                note: "Prédio fechar. Colecionadores vendem estoque a preço de banana.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-[var(--on-surface)]">
                      {item.period}
                    </p>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {item.note}
                    </p>
                  </div>
                  <span className="text-xl">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Trophy
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Pronto para economizar até 70%?
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6 max-w-3xl">
              O Figurinha Fácil é a ferramenta que você precisa para colocar esse
              guia em prática. Cadastre suas figurinhas, encontre matches
              automáticos com colecionadores da sua cidade e comece a trocar hoje
              mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
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
                <Link href="/">Voltar ao início</Link>
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
            Perguntas frequentes
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

        {/* Final Summary */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h3 className="font-[var(--font-headline)] text-xl font-bold">
                Resumo: seu plano em 3 passos
              </h3>
            </div>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="font-bold text-[var(--primary)]">1.</span>
                <span className="text-[var(--on-surface-variant)]">
                  Comece com um álbum brochura + 20 pacotinhos. Cadastre-se no
                  Figurinha Fácil.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-[var(--primary)]">2.</span>
                <span className="text-[var(--on-surface-variant)]">
                  Faça trocas agressivas pelas figurinhas comuns. Priorize volume
                  sobre perfeição.
                </span>
              </li>
              <li className="flex gap-4">
                <span className="font-bold text-[var(--primary)]">3.</span>
                <span className="text-[var(--on-surface-variant)]">
                  Deixe especiais para o fim. Negocie com colecionadores
                  experientes em grupos comunitários.
                </span>
              </li>
            </ol>
            <p className="text-sm text-[var(--on-surface-variant)] mt-6 pt-6 border-t border-[var(--outline-variant)]/20">
              Seguindo esse plano, você completa o álbum entre R$ 800 e R$ 1.200.
              Sem puxar corda. 🎯
            </p>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
