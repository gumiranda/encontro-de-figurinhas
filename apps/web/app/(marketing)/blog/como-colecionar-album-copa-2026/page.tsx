import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Users,
  MapPin,
  Clock,
  Lightbulb,
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

const ARTICLE_PATH = "/blog/como-colecionar-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-15T00:00:00Z";
const MODIFIED_AT = "2026-06-06T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Colecionar o Álbum da Copa 2026: Guia Prático Passo a Passo",
  description:
    "Guia completo sobre como colecionar e completar o álbum da Copa do Mundo 2026. Descubra estratégias, dicas de economia, onde encontrar figurinhas e como fazer trocas com segurança.",
  keywords: [
    "como colecionar album copa 2026",
    "como coleção figurinhas copa 2026",
    "guia colecionar album copa mundo 2026",
    "dicas colecionar figurinhas copa",
    "como completar album copa 2026",
    "estrategia colecionar album copa",
    "onde comprar figurinhas copa 2026",
    "como trocar figurinhas copa 2026",
    "como montar album copa 2026",
  ],
  openGraph: {
    title: "Como Colecionar o Álbum da Copa 2026: Guia Prático Passo a Passo",
    description:
      "Aprenda estratégias, dicas de economia e como fazer trocas seguras no álbum da Copa 2026.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Dicas Prácticas",
      "Guia Completo",
      "Troca de Figurinhas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como Colecionar o Álbum da Copa 2026: Guia Completo",
    description:
      "Descubra as melhores estratégias para colecionar o álbum da Copa 2026 economizando ao máximo.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Por onde começo a colecionar o álbum da Copa 2026?",
    answer:
      "Comece comprando um álbum (brochura é mais barata) e um box inicial de figurinhas. Cadastre-se no Figurinha Fácil para conectar com outros colecionadores da sua cidade. Essa combinação entre compra estratégica e trocas é a forma mais eficiente de começar.",
  },
  {
    question: "Qual é a melhor forma de organizar as figurinhas repetidas?",
    answer:
      "Crie três categorias: as que vão pro álbum, as repetidas comuns e as repetidas especiais. Guarde em sacos plásticos separados, longe de umidade e luz solar. Tire foto das repetidas e compartilhe no Figurinha Fácil para encontrar colecionadores com as figurinhas que faltam para você.",
  },
  {
    question: "É seguro fazer trocas de figurinhas com pessoas desconhecidas?",
    answer:
      "Sim, quando você usa o Figurinha Fácil. Todas as trocas acontecem em pontos públicos e seguros (praças, bancas, cafés) durante o dia. O colecionador é verificado na plataforma e você pode ver seu perfil, histórico de trocas e comentários de outros usuários antes de combinar o encontro.",
  },
  {
    question: "Quanto tempo leva para completar o álbum da Copa 2026?",
    answer:
      "Depende da sua estratégia. Quem compra apenas pacotinhos pode levar 3-6 meses. Quem troca ativamente no Figurinha Fácil consegue completar em 4-8 semanas, encontrando matches com mais frequência. A Copa inteira dura de junho a julho, então tem tempo para terminar.",
  },
  {
    question: "Como encontro figurinhas específicas que faltam para mim?",
    answer:
      "No Figurinha Fácil, você cadastra as figurinhas que faltam e o sistema busca automaticamente colecionadores na sua cidade que têm. Você pode filtrar por bairro, pedir sugestões de troca e negociar as quantidades. Também existem grupos de WhatsApp locais de colecionadores que ajudam na busca.",
  },
  {
    question: "Vale a pena comprar boxes e cases fechados?",
    answer:
      "Boxes (36 pacotes) costumam ter melhor preço unitário, cerca de R$ 6,50 por pacote vs R$ 7,00 avulso. Se você vai colecionar mesmo, vale a pena. Cases (300 pacotes) são mais para revendedores. Evite comprar de revendedores nas primeiras semanas quando os preços estão altos.",
  },
];

const steps = [
  {
    number: 1,
    title: "Adquira o álbum e comece pequeno",
    description:
      "Compre um álbum (brochura é mais econômico: R$ 24,90) e um box inicial com 36 pacotes. Isso dá uma base de 252 figurinhas para começar a estratégia de troca.",
    icon: CheckCircle2,
  },
  {
    number: 2,
    title: "Organize e categorize suas figurinhas",
    description:
      "Separe as figurinhas em três grupos: as que vão pro álbum, repetidas comuns e repetidas especiais. Anote os números em uma planilha ou tire fotos. Isso facilita encontrar matches de troca.",
    icon: CheckCircle2,
  },
  {
    number: 3,
    title: "Cadastre-se no Figurinha Fácil",
    description:
      "Crie sua conta grátis, adicione suas figurinhas repetidas e as que faltam. O sistema busca automaticamente colecionadores perto de você com figurinhas compatíveis para trocar.",
    icon: CheckCircle2,
  },
  {
    number: 4,
    title: "Combine trocas e encontre em local seguro",
    description:
      "Quando encontrar um match, negocue a quantidade de figurinhas na troca. Marchem em um ponto público (praça, banca, café) durante o dia para fazer a troca de forma segura.",
    icon: CheckCircle2,
  },
  {
    number: 5,
    title: "Atualize seu perfil e continue trocando",
    description:
      "Depois de cada troca, atualize seu perfil no Figurinha Fácil. Continue procurando matches. Quanto mais troca, mais rápido completa o álbum.",
    icon: CheckCircle2,
  },
  {
    number: 6,
    title: "Foque nas especiais ao final",
    description:
      "As figurinhas especiais e legendárias são raras. Concentre nelas nos últimos estágios, quando você tiver um bom estoque de repetidas para oferecer em troca.",
    icon: CheckCircle2,
  },
];

const strategies = [
  {
    title: "Estratégia Equilibrada (Recomendada)",
    description: "Compre 1-2 boxes + troque ativamente",
    pros: [
      "Custo total: R$ 500-1.000",
      "Tempo: 4-8 semanas",
      "Melhor custo-benefício",
      "Comunidade e diversão",
    ],
    cons: ["Requer organização", "Depende de encontros presenciais"],
    budget: "Low",
  },
  {
    title: "Estratégia Econômica",
    description: "Foco 100% em trocas com mínima compra",
    pros: [
      "Custo total: R$ 250-500",
      "Máxima economia",
      "Sem desperdício",
    ],
    cons: [
      "Mais demorado (8-12 semanas)",
      "Exige paciência",
      "Muitos encontros",
    ],
    budget: "VeryLow",
  },
  {
    title: "Estratégia Premium",
    description: "Compre conforme necessário, sem obsessão por trocas",
    pros: ["Menos trabalho", "Mais rápido (2-3 semanas)"],
    cons: [
      "Custo alto: R$ 2.500-5.000",
      "Muitas repetidas",
      "Menos diversão com comunidade",
    ],
    budget: "High",
  },
];

const tips = [
  {
    icon: Lightbulb,
    title: "Dica 1: Aproveite promoções de supermercado",
    description:
      "Supermercados como Carrefour e Walmart costumam ter promoções 2x1 ou desconto progressivo em figurinhas. Compre quando há promoção, não na primeira semana.",
  },
  {
    icon: Lightbulb,
    title: "Dica 2: Negocie com grupos de WhatsApp locais",
    description:
      "Existem grupos de colecionadores em praticamente toda cidade. Procure por 'Figurinhas Copa 2026 [sua cidade]' no WhatsApp. Muitas trocas acontecem antes de aparecer no Figurinha Fácil.",
  },
  {
    icon: Lightbulb,
    title: "Dica 3: Guarde as especiais para o final",
    description:
      "Não tente completar as figurinhas especiais (legendárias, capitães, bola) logo de início. Você precisa de muitas repetidas para oferecer em troca. Deixe para o final.",
  },
  {
    icon: Lightbulb,
    title: "Dica 4: Tire foto das suas figurinhas",
    description:
      "Tirar foto de todas as suas repetidas em grupo facilita enviar para colecionadores e encontrar matches mais rápido. Qualidade da foto ajuda na confiança.",
  },
  {
    icon: Lightbulb,
    title: "Dica 5: Participe de 'mutirões' de compra",
    description:
      "Alguns colecionadores combinam comprar cases (300 pacotes) direto com distribuidoras para pegar desconto. Participar de mutirões reduz o preço unitário.",
  },
  {
    icon: Lightbulb,
    title: "Dica 6: Organize eventos de troca comunitários",
    description:
      "Reúna colecionadores da sua região em um ponto público (parque, lanchonete) e faça um 'festival de trocas'. Aumenta o volume e a diversão.",
  },
];

const warningTips = [
  {
    title: "Não colecione com medo",
    description:
      "Se você vai colecionar, comece logo em maio/2026. Quanto mais perto do fim da Copa, mais difícil fica encontrar figurinhas e menos gente está trocando.",
  },
  {
    title: "Não compre tudo de uma vez",
    description:
      "Evite comprar muitos pacotes logo no lançamento. Os preços costumam cair após as primeiras 2-3 semanas. Espere um pouco.",
  },
  {
    title: "Não ignore as especiais no início",
    description:
      "Embora recomende focar nelas ao final, avalie se saiu uma especial que você gosta. Às vezes vale a pena tentar pegar mais cedo.",
  },
  {
    title: "Não faça troca sem conferir",
    description:
      "Sempre conferir figurinha por figurinha durante a troca. Marque com o outro colecionador de forma clara: '3 figurinhas suas por 2 minhas'.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Como Colecionar o Álbum da Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Como Colecionar o Álbum da Copa 2026: Guia Prático Passo a Passo",
  description:
    "Guia completo com estratégias, dicas práticas e passo a passo para colecionar e completar o álbum da Copa 2026 com segurança e economia.",
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
    "como colecionar album copa 2026",
    "guia colecionar figurinhas",
    "dicas colecionar copa",
    "estrategia album copa",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function ComoColeccionarAlbumCopa2026Page() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main
        id="main-content"
        className="pt-24 min-h-screen text-[var(--on-surface)]"
      >
        {/* Hero */}
        <section className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 md:py-24">
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
                Como Colecionar o Álbum da Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--primary-container)]/20 text-[var(--primary)] border border-[var(--primary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Completo
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Colecionar o Álbum da Copa 2026:{" "}
              <span className="text-gradient-primary">
                guia prático passo a passo
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Aprenda as melhores estratégias para colecionar o álbum da Copa 2026
              de forma segura, organizada e <strong>gastando menos</strong>.
              Descubra onde comprar, como fazer trocas, encontrar colecionadores e
              completar o álbum em poucas semanas.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 15/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado em 06/06/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 10 min</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por que colecionar o álbum da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Colecionar o álbum da Copa do Mundo é mais do que preencher 980 espaços em branco. É uma tradição, um hobby que reúne famílias e amigos, e uma forma de participar da emoção de um dos maiores eventos esportivos do mundo. Em 2026, com <strong>48 seleções</strong> pela primeira vez e um álbum gigante, colecionar é ainda mais especial.
            </p>
            <p>
              Mas é também uma oportunidade de aprender sobre <strong>organização, negociação e comunidade</strong>. Este guia te mostra como colecionar de forma inteligente, sem gastar uma fortuna.
            </p>
          </div>
        </section>

        {/* Passo a passo */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Passo a Passo: Como Começar a Colecionar
          </h2>
          <div className="space-y-4">
            {steps.map((step) => {
              const Icon = step.icon;
              return (
                <Card
                  key={step.number}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] overflow-hidden"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-[var(--primary)]/10">
                          <Icon className="h-6 w-6 text-[var(--primary)]" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">
                          Passo {step.number}: {step.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-[var(--on-surface-variant)] leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Estratégias */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Três Estratégias de Coleta: Qual é a Sua?
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            {strategies.map((strategy, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] flex flex-col"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{strategy.title}</CardTitle>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    {strategy.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 space-y-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-[var(--primary)]">
                      ✓ Vantagens
                    </h4>
                    <ul className="text-sm space-y-1 text-[var(--on-surface-variant)]">
                      {strategy.pros.map((pro, i) => (
                        <li key={i}>• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-[var(--secondary)]">
                      ✗ Desvantagens
                    </h4>
                    <ul className="text-sm space-y-1 text-[var(--on-surface-variant)]">
                      {strategy.cons.map((con, i) => (
                        <li key={i}>• {con}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Onde comprar */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Onde Comprar Figurinhas da Copa 2026
          </h2>
          <div className="space-y-4">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="text-lg">Banca de Jornal</CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--on-surface-variant)]">
                O lugar clássico. Tem figurinhas soltas, pacotinhos e álbuns. Preço padrão R$ 7,00.
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="text-lg">Supermercados</CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--on-surface-variant)]">
                Carrefour, Walmart, Extra. Frequentemente têm promoções. Ideal para aproveitar 2x1 e descontos progressivos.
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="text-lg">E-commerce</CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--on-surface-variant)]">
                Amazon, Mercado Livre, Shopee. Bom para boxes e álbuns especiais. Cuidado com revendedores com preço inflado nas primeiras semanas.
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="text-lg">Direto da Panini</CardTitle>
              </CardHeader>
              <CardContent className="text-[var(--on-surface-variant)]">
                Panini.com.br tem o preço oficial. Ideal se você quer garantir autenticidade e suporte.
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Como fazer trocas seguras */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Como Fazer Trocas Seguras e Eficientes
          </h2>
          <div className="space-y-6 text-[var(--on-surface-variant)]">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-[var(--primary)]" />
                  Escolha Locais Públicos e Seguros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Sempre faça trocas em locais públicos durante o dia: parques,
                  praças, bancas, cafés, lanchonetes. Evite encontros em
                  casas ou lugares isolados. Se usar o Figurinha Fácil, o sistema
                  já recomenda pontos de troca públicos da sua região.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[var(--primary)]" />
                  Verifique o Perfil do Colecionador
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  No Figurinha Fácil, veja o histórico de trocas, comentários
                  e avaliações do colecionador. Se tiver poucos comentários
                  positivos, considere pedir mais informações antes de aceitar a troca.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-[var(--primary)]" />
                  Confira as Figurinhas Durante a Troca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Nunca confie de primeira. Confira figurinha por figurinha.
                  Deixe claro: "3 figurinhas suas por 2 minhas". Anote os
                  números em um papel ou tirem foto juntos para evitar confusão depois.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[var(--primary)]" />
                  Atualize Seu Perfil Após a Troca
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">
                  Depois de cada troca, atualize sua lista de figurinhas no
                  Figurinha Fácil. Deixe comentário positivo ou neutro sobre
                  o outro colecionador. Isso ajuda a construir confiança na comunidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Dicas práticas */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            6 Dicas Práticas Para Coletar Mais Rápido
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-lg">
                      <Icon className="h-5 w-5 text-[var(--primary)]" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {tip.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Alertas */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            ⚠️ Alertas e Cuidados
          </h2>
          <div className="space-y-4">
            {warningTips.map((tip, idx) => (
              <Card
                key={idx}
                className="bg-[var(--secondary-container)]/20 border border-[var(--secondary)]/30"
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg text-[var(--secondary)]">
                    <AlertCircle className="h-5 w-5" />
                    {tip.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
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
            Perguntas Frequentes
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
                  <p className="text-[var(--on-surface-variant)] text-sm md:text-base">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6 rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold">
              Pronto para começar a colecionar?
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Cadastre-se no <strong>Figurinha Fácil</strong> hoje e comece a encontrar
              colecionadores perto de você. Gratuito, seguro e rápido.
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
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/album-copa-do-mundo-2026">Ver Guia Completo do Álbum</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
