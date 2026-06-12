import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  MapPin,
  PiggyBank,
  Rocket,
  Search,
  Sticker,
  TrendingUp,
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

const ARTICLE_PATH = "/como-colecionar-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-10T00:00:00Z";
const MODIFIED_AT = "2026-06-12T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Colecionar Figurinhas da Copa do Mundo 2026: Guia Completo Passo a Passo",
  description:
    "Guia definitivo para colecionar figurinhas da Copa 2026. Aprenda as estratégias certas, onde encontrar colecionadores, como economizar e completar o álbum de forma inteligente.",
  keywords: [
    "como colecionar figurinhas copa 2026",
    "colecionar figurinhas copa do mundo",
    "dicas para colecionar álbum copa 2026",
    "estratégia colecionar figurinhas",
    "como economizar colecionar copa 2026",
    "onde encontrar figurinhas raras copa",
    "como trocar figurinhas copa 2026",
    "guia colecionar álbum panini",
    "figurinhas repetidas o que fazer",
    "coleção figurinhas copa dicas",
  ],
  openGraph: {
    title: "Como Colecionar Figurinhas da Copa 2026: Guia Passo a Passo",
    description:
      "Estratégias completas para colecionar, economizar e completar o álbum da Copa 2026 trocando com outros colecionadores.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Colecionar figurinhas",
      "Dicas e estratégias",
      "Álbum Panini",
      "Figurinhas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como Colecionar Figurinhas da Copa 2026: Guia Completo",
    description:
      "Aprenda as melhores estratégias para colecionar, economizar e completar o álbum.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é a forma mais econômica de colecionar figurinhas?",
    answer:
      "A forma mais econômica é combinar a compra de alguns pacotinhos com trocas frequentes. Ao invés de comprar até completar, você compra o suficiente para ter repetidas, depois troca essas repetidas por figurinhas que faltam com colecionadores próximos. Isso pode reduzir o custo final em até 70%.",
  },
  {
    question: "Como encontrar colecionadores para trocar figurinhas?",
    answer:
      "Use plataformas especializadas como o Figurinha Fácil, que conecta colecionadores automaticamente por localização. A plataforma mostra matches entre suas repetidas e as figurinhas que faltam para outros usuários próximos. Também existem grupos em redes sociais e pontos de troca públicos.",
  },
  {
    question: "É melhor comprar figurinhas avulsas ou pacotinhos?",
    answer:
      "Pacotinhos são mais baratos (R$ 7,00 por 7 figurinhas) mas trazem surpresas. Se você procura figurinhas específicas, avulsas são mais diretas mas custam mais caro. A melhor estratégia é: compre alguns pacotinhos para ter base de repetidas, depois troque as repetidas por específicas que faltam.",
  },
  {
    question: "Como guardar figurinhas para que não estraguem?",
    answer:
      "Guarde em local seco, longe da luz solar direta. Álbuns com capa dura protegem melhor que capas simples. Álbuns premium de capa dura são investimento se você quer guardar a coleção a longo prazo. Evite dobrar, amassar ou expor ao calor intenso.",
  },
  {
    question: "Posso voltar atrás em uma troca já realizada?",
    answer:
      "Geralmente não. Trocas são definitivas. Por isso, sempre verificar bem as figurinhas antes de confirmar: se estão íntegras, se os números batem, se não há duplicação. Confirme 100% antes de fechar a troca.",
  },
  {
    question: "Qual é o melhor período para colecionar, antes ou durante a Copa?",
    answer:
      "Antes é ideal. Você tem mais tempo para planejar, organizar e completar sem pressa. Durante a Copa, há mais procura e competição por figurinhas raras, o que pode encarecer. Comece cedo, aproveite os preços antes do torneio e termine com tranquilidade.",
  },
  {
    question: "Figurinhas especiais metalizadas aumentam muito o custo?",
    answer:
      "Sim, figurinhas especiais e metalizadas têm custo e raridade muito maior. O conselho é deixar essas para o final. Concentre-se em completar as 912 figurinhas base primeiro, depois use as repetidas acumuladas para trocar as 68 especiais com outros colecionadores.",
  },
];

const collectingSteps = [
  {
    number: 1,
    icon: Rocket,
    title: "Comece com um objetivo claro",
    description:
      "Decida se quer completar 100% ou apenas colecionar seu time. Isso muda a estratégia de compras e trocas. Coletar apenas Brasil custa muito menos que coletar as 48 seleções.",
  },
  {
    number: 2,
    icon: PiggyBank,
    title: "Defina um orçamento mensal",
    description:
      "Não compre tudo de uma vez. Distribua compras em pequenas quantidades todo mês. Isso economiza espaço, reduz stress das repetidas e deixa mais tempo para trocas.",
  },
  {
    number: 3,
    icon: Search,
    title: "Pesquise os melhores pontos de compra",
    description:
      "Bancas, supermercados, Amazon, Mercado Livre e Panini oficial têm preços diferentes. Pesquise antes, compare, procure promoções. Alguns lugares têm descontos em compra de múltiplos pacotes.",
  },
  {
    number: 4,
    icon: MapPin,
    title: "Encontre sua comunidade de troca",
    description:
      "Entre em grupos nas redes sociais, use plataformas como Figurinha Fácil ou procure pontos de troca na sua cidade. Colecionadores locais são seus melhores aliados.",
  },
];

const betterStrategies = [
  {
    title: "A estratégia do 30-70",
    description:
      "Compre 30% do álbum em pacotinhos (gasta uns R$ 700-800) e complete os 70% restantes por trocas. Suas repetidas dos pacotinhos valem bastante na comunidade.",
    icon: TrendingUp,
  },
  {
    title: "Foco no seu time primeiro",
    description:
      "Colecione 100% do Brasil, depois escolha 2-3 seleções favoritas para completar. Isso deixa a coleção bem focada e economiza muito dinheiro nos primeiros meses.",
    icon: Lightbulb,
  },
  {
    title: "Deixe as especiais para o final",
    description:
      "As 68 figurinhas metalizadas são raras e caras. Concentre-se nas 912 base primeiro. Ao final, você terá muitas repetidas da base para oferecer em troca.",
    icon: Sticker,
  },
  {
    title: "Grupos de troca ajudam",
    description:
      "Colecionadores que trocam juntos criam sinergia. Um tem a figurinha X que o outro precisa, vice-versa. Comunidades são o segredo para economizar.",
    icon: Users,
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Como Colecionar Figurinhas Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Como Colecionar Figurinhas da Copa do Mundo 2026: Guia Completo Passo a Passo",
  description:
    "Guia definitivo com estratégias completas, dicas de economia, onde encontrar colecionadores e como completar o álbum de forma inteligente.",
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
    "colecionar figurinhas copa do mundo",
    "dicas colecionar álbum",
    "estratégia figurinhas",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  generateCollectionPageSchema(),
  generateSportsEventSchema(),
]);

export default function ComoColecionar2026Page() {
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
                Como Colecionar Figurinhas Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Estratégico Copa 2026
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Colecionar Figurinhas da Copa do Mundo 2026:{" "}
              <span className="text-gradient-primary">
                guia completo passo a passo
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Descubra as estratégias que <strong>economizam até 70%</strong> no custo
              do álbum. Aprenda como encontrar colecionadores, fazer trocas inteligentes
              e completar sua coleção da Copa 2026 de forma eficiente, divertida e barata.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 10/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado em 12/06/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
            </div>
          </div>
        </section>

        {/* Intro Section */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por que colecionar figurinhas é tão viciante?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Colecionar figurinhas da Copa é uma tradição que marca gerações no
              Brasil. Além de ser uma forma divertida de acompanhar o torneio,
              resgata memórias e une colecionadores em torno de um objetivo comum:
              completar o álbum.
            </p>
            <p>
              Mas tem um detalhe importante: <strong>completar um álbum de 980
              figurinhas comprando apenas pacotinhos custa mais de R$ 2.500</strong>
              . Isso porque a probabilidade de repetir figurinhas aumenta
              exponencialmente conforme você se aproxima do final.
            </p>
            <p>
              A boa notícia? <strong>Trocar é a solução</strong>. E este guia te
              mostra exatamente como fazer isso de forma estratégica para
              economizar 70% do custo.
            </p>
          </div>
        </section>

        {/* 4 Steps */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Os 4 primeiros passos para começar
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {collectingSteps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.number}
                  className="relative bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="absolute -top-4 left-4 w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                      {step.number}
                    </div>
                    <Icon
                      className="h-6 w-6 text-[var(--secondary)] mb-2"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-lg mt-2">
                      {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[var(--on-surface-variant)]">
                      {step.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Estratégias */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            4 estratégias que funcionam para economizar
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {betterStrategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <Card
                  key={strategy.title}
                  className="bg-gradient-to-br from-[var(--surface-container-high)] to-[var(--surface-container)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon
                        className="h-5 w-5 text-[var(--secondary)]"
                        aria-hidden="true"
                      />
                      <CardTitle className="text-lg">
                        {strategy.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--on-surface-variant)]">
                      {strategy.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Ciclo de vida */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O ciclo de vida da coleta: fases até completar
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--primary)] text-sm uppercase mb-2">
                Fase 1: Entusiasmo inicial (semanas 1-3)
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Você compra o álbum e alguns pacotinhos. Cada envelope aberto traz
                surpresa. Letras em branco no álbum enchem rápido. Essa é a fase mais
                feliz — aproveite.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--secondary)] text-sm uppercase mb-2">
                Fase 2: Repetidas aparecem (semanas 4-8)
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Você nota que está recebendo muitas repetidas. É aqui que a maioria
                das pessoas desiste, achando "impossível completar". Não é verdade!
                Aqui é hora de procurar sua comunidade de troca.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--secondary)] text-sm uppercase mb-2">
                Fase 3: Trocas aceleração (semanas 8-16)
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Você encontrou colecionadores, começou trocas frequentes. Seu álbum
                preenche muito mais rápido porque está trocando "repetidas por faltantes"
                ao invés de comprar no acaso.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--secondary)] text-sm uppercase mb-2">
                Fase 4: Reta final (semanas 16+)
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Faltam as 68 figurinhas especiais metalizadas. Aqui a dinâmica muda
                — você precisa encontrar colecionadores que também têm especiais
                repetidas. Paciência e bons contatos fazem diferença.
              </p>
            </div>
          </div>
        </section>

        {/* Onde encontrar */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Onde encontrar figurinhas e colecionadores
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                Bancas e pontos de venda
              </h3>
              <p>
                Bancas de jornal, supermercados, lojas de brinquedos, Panini oficial
                (panini.com.br). Preços variam — compare antes de comprar.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                E-commerce
              </h3>
              <p>
                Amazon, Mercado Livre, Magazine Luiza. Costumam ter descontos em
                promoções. Cuidado com frete — às vezes sai mais caro que na loja física.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                Redes sociais
              </h3>
              <p>
                Grupos no Facebook, comunidades no Instagram e TikTok. Procure por
                "figurinhas copa 2026 [sua cidade]". Muitas trocas acontecem ali.
              </p>
            </div>

            <div className="rounded-lg border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                Plataformas especializadas
              </h3>
              <p>
                Figurinha Fácil conecta colecionadores por localização automaticamente.
                Você vê matches entre suas repetidas e as faltantes de outros usuarios
                próximos. Prático, seguro e feito para trocar.
              </p>
            </div>
          </div>
        </section>

        {/* CTA section com chamada */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-gradient-to-r from-[var(--secondary-container)]/20 to-[var(--primary-container)]/20 p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Users
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                A comunidade de troca mais segura e eficiente do Brasil
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
              No <strong>Figurinha Fácil</strong>, você encontra colecionadores perto
              de você em segundos. Cadastra suas repetidas, busca faltantes, e a
              plataforma faz o match automático. Seguro, prático e 100% gratuito.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar a trocar agora
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

        {/* Erros comuns */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Erros que colecionadores iniciantes comentem (e como evitar)
          </h2>
          <div className="space-y-4">
            <div className="rounded-lg border-l-4 border-[var(--secondary)] bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                ❌ Erro 1: Comprar demais de uma vez
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Você gasta R$ 2000 logo no início comprando caixa inteira. Resultado:
                muita repetida, pouco espaço, poucos lugares para trocar. <strong>Melhor:</strong>
                compre gradualmente, 1-2 pacotinhos por semana.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-[var(--secondary)] bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                ❌ Erro 2: Pagar preço cheio sempre
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Comprar sempre na banca ao lado de casa. <strong>Melhor:</strong> pesquise
                preços em Amazon, Mercado Livre e promoções em supermercados. Diferença
                pode ser de 20-30%.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-[var(--secondary)] bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                ❌ Erro 3: Desistir na Fase 2
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Quando as repetidas aparecem (semanas 4-8), muitos desistem achando
                que é impossível. <strong>Melhor:</strong> essa é hora de COMEÇAR as
                trocas, não desistir. Trocas resolvem o problema.
              </p>
            </div>

            <div className="rounded-lg border-l-4 border-[var(--secondary)] bg-[var(--surface-container-high)] p-6">
              <h3 className="font-bold text-[var(--on-surface)] mb-2">
                ❌ Erro 4: Ignorar as comunidades locais
              </h3>
              <p className="text-[var(--on-surface-variant)]">
                Tentar colecionar sozinho. <strong>Melhor:</strong> entre em grupos,
                na plataformas, procure pontos de troca. A comunidade é seu superpower.
              </p>
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
            <Badge className="inline-block bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Comece sua jornada
            </Badge>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Agora você sabe como colecionar inteligentemente
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Tens as estratégias, os passos e as comunidades. Agora é hora de começar.
              Cadastre-se no Figurinha <span className="text-[#87d400]">Fácil</span> e
              comece a trocar figurinhas da Copa 2026 com colecionadores perto de você.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar gratuitamente
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
