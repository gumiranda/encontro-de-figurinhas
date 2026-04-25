import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  TrendingUp,
  Zap,
  DollarSign,
  Users,
  PiggyBank,
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

const ARTICLE_PATH = "/blog/quanto-custa-completar-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-04-25T00:00:00Z";
const MODIFIED_AT = "2026-04-25T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Quanto Custa Completar o Álbum da Copa 2026? Guia Completo com Simulações",
  description:
    "Descubra o custo real para completar o álbum da Copa do Mundo 2026. Veja simulações de preços com e sem trocas, e as melhores estratégias para economizar ao colecionar figurinhas.",
  keywords: [
    "quanto custa completar álbum copa 2026",
    "custo album copa 2026",
    "preço album completo copa do mundo 2026",
    "quanto gasto para completar álbum 2026",
    "simular custo figurinhas copa",
    "como economizar album copa 2026",
    "custo figurinhas copa 2026",
    "valor total album copa mundo 2026",
  ],
  openGraph: {
    title:
      "Quanto Custa Completar o Álbum da Copa 2026? Simulações e Estratégias",
    description:
      "Análise completa do custo para completar o álbum da Copa 2026 com diferentes estratégias de compra e troca.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Dicas de Economia",
      "Troca de Figurinhas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Quanto Custa Completar o Álbum da Copa 2026? Guia com Simulações",
    description:
      "Descubra quanto você vai gastar para completar o álbum da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question:
      "É possível completar o álbum da Copa 2026 gastando menos de R$ 2 mil?",
    answer:
      "Sim! Se você combinar compra estratégica de pacotinhos com trocas ativas no Figurinha Fácil, é possível reduzir o custo total significativamente. Trocando figurinhas repetidas com outros colecionadores da sua cidade, você economiza entre R$ 1.500 e R$ 3.000 em relação a quem compra apenas pacotinhos.",
  },
  {
    question:
      "Por que completar o álbum apenas com pacotinhos custa mais de R$ 7 mil?",
    answer:
      "Porque 980 figurinhas com muitas repetidas no final é um problema matemático. Cada pacote tem 7 figurinhas, então para 980, você precisaria de ~140 pacotes. Mas como há repetições, você acaba gastando 3-7 vezes mais. O pacote a R$ 7,00 significa R$ 1.050 em folha, mas as repetições inflam para R$ 7.363.",
  },
  {
    question:
      "Qual é a forma mais barata de completar o álbum da Copa 2026?",
    answer:
      "A forma mais barata é usar o Figurinha Fácil: cadastre suas figurinhas repetidas e as que faltam, encontre matches automáticos com colecionadores perto de você, e troque presencialmente. Isso reduz o custo final em até 60% em relação a comprar tudo.",
  },
  {
    question: "O álbum brochura ou capa dura é mais econômico?",
    answer:
      "Para completar o álbum (as figurinhas), não faz diferença: você vai gastar o mesmo com os pacotinhos. A diferença é no custo inicial: brochura por R$ 24,90 vs capa dura por R$ 79,90. Se você quer apenas completar economicamente, escolha a brochura.",
  },
  {
    question:
      "Duas pessoas trocando juntas economizam quanto para completar o álbum?",
    answer:
      "Sim, economizam bastante! Com duas pessoas trocando figurinhas, o valor economizado chega a R$ 2.724 em relação a comprar tudo sem trocas. O custo cai de R$ 7.363 para aproximadamente R$ 4.639.",
  },
];

const costScenarios = [
  {
    scenario: "Só Compra (Sem Trocas)",
    cost: "R$ 7.363",
    pacotes: "~1.050 pacotes",
    description:
      "Comprando apenas pacotinhos até completar. As repetidas fazem o preço explodir nas últimas figurinhas.",
    badge: "❌ Mais caro",
  },
  {
    scenario: "Compra + Troca com 1 Colega",
    cost: "R$ 4.639",
    pacotes: "~662 pacotes",
    description:
      "Quando você e um colega trocam figurinhas repetidas. Economiza R$ 2.724.",
    badge: "✅ Recomendado",
  },
  {
    scenario: "Estratégia Otimizada (Plataforma)",
    cost: "R$ 2.000 - R$ 3.500",
    pacotes: "~286-500 pacotes",
    description:
      "Usando o Figurinha Fácil para encontrar matches automáticos com múltiplos colecionadores. A forma mais econômica.",
    badge: "🚀 Melhor opção",
  },
  {
    scenario: "Compra Mínima + Máx Trocas",
    cost: "R$ 1.005",
    pacotes: "~143 pacotes",
    description:
      "Comprando o mínimo necessário de pacotes e trocando o máximo possível. Apenas teoricamente possível.",
    badge: "🎯 Ideal",
  },
];

const savingTips = [
  {
    icon: Zap,
    title: "Foco em Trocas Rápidas",
    description:
      "Não acumule figurinhas repetidas esperando por trocas perfeitas. Quanto mais rápido você trocar, mais oportunidades aparecem.",
  },
  {
    icon: Users,
    title: "Use Plataformas de Rede",
    description:
      "No Figurinha Fácil, a plataforma encontra matches automáticos com colecionadores pertos de você. Isso é muito mais eficiente que trocar manualmente.",
  },
  {
    icon: PiggyBank,
    title: "Estratégia Escalonada",
    description:
      "Compre poucos pacotes por semana e concentre-se em trocas. Dessa forma você diversifica o risco e aproveitando melhor cada R$ gasto.",
  },
  {
    icon: TrendingUp,
    title: "Figurinhas Especiais por Último",
    description:
      "As 68 figurinhas especiais são raras e caras. Deixe para completar essas no final, quando terá muitas repetidas para oferecer.",
  },
];

const breakdownContent = [
  {
    title: "Pacote de Figurinhas",
    price: "R$ 7,00",
    details: "7 figurinhas | R$ 1,00 por cromo",
  },
  {
    title: "Álbum Brochura",
    price: "R$ 24,90",
    details: "Versão econômica | Proteção básica",
  },
  {
    title: "Álbum Capa Dura",
    price: "R$ 49,90 - R$ 79,90",
    details: "Capa prata ou ouro | Premium",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Quanto Custa Completar Álbum Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Quanto Custa Completar o Álbum da Copa 2026? Guia Completo com Simulações",
  description:
    "Análise detalhada do custo para completar o álbum da Copa do Mundo 2026, comparando diferentes estratégias de compra e troca de figurinhas.",
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
    "quanto custa album copa 2026",
    "custo album figurnhas 2026",
    "simulacao preco copa do mundo",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function QuantoCustaArticlePage() {
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
                Quanto Custa Completar o Álbum
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia de Economia
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Quanto Custa Completar o Álbum da Copa 2026?{" "}
              <span className="text-gradient-primary">
                Simulações reais e estratégias para economizar
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              O custo varia de <strong>R$ 1.005 a R$ 7.363</strong> dependendo da
              sua estratégia. Neste guia mostramos exatamente quanto você vai
              gastar em cada cenário e as melhores formas de <strong>economizar
              até 70%</strong> usando trocas inteligentes.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 25/04/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Cost Scenarios */}
        <section
          aria-labelledby="scenarios-heading"
          className="mx-auto max-w-5xl px-4 sm:px-6 py-12"
        >
          <h2
            id="scenarios-heading"
            className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6"
          >
            4 Cenários de Custo para Completar o Álbum
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {costScenarios.map((item, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <CardTitle className="text-lg">{item.scenario}</CardTitle>
                      <CardDescription className="text-[var(--on-surface-variant)]">
                        {item.description}
                      </CardDescription>
                    </div>
                    <Badge className="whitespace-nowrap text-xs">
                      {item.badge}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="rounded-lg bg-[var(--surface-container)]/50 p-3">
                    <p className="text-xs text-[var(--outline)]">
                      Investimento Total
                    </p>
                    <p className="text-2xl font-bold text-[var(--primary)]">
                      {item.cost}
                    </p>
                  </div>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {item.pacotes}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 md:p-8">
            <div className="grid md:grid-cols-3 gap-6">
              {breakdownContent.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <p className="text-xs uppercase tracking-widest text-[var(--outline)]">
                    {item.title}
                  </p>
                  <p className="text-2xl font-bold text-[var(--primary)]">
                    {item.price}
                  </p>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {item.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Understanding the Problem */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por que completar o álbum é tão caro?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Parece simples na teoria: 980 figurinhas ÷ 7 por pacote = 140
              pacotes x R$ 7 = R$ 980. Mas a realidade é bem diferente.
            </p>

            <p>
              O problema é o <strong>efeito das repetidas</strong>. Quando você
              compra pacotinhos aleatoriamente, as primeiras 100-200 figurinhas
              aparecem rápido. Mas conforme avança, encontrar aquela figurinha
              que falta fica cada vez mais raro. No final, você compra 10 pacotes
              só para encontrar 1 figurinha que faltava.
            </p>

            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
                Matemática das Repetidas
              </h3>
              <ul className="space-y-3 text-sm">
                <li className="flex justify-between">
                  <span>Primeiras 100 figurinhas</span>
                  <span className="font-mono">~30 pacotes (R$ 210)</span>
                </li>
                <li className="flex justify-between">
                  <span>De 100 a 500 figurinhas</span>
                  <span className="font-mono">~200 pacotes (R$ 1.400)</span>
                </li>
                <li className="flex justify-between">
                  <span>De 500 a 900 figurinhas</span>
                  <span className="font-mono">~600 pacotes (R$ 4.200)</span>
                </li>
                <li className="flex justify-between font-bold">
                  <span>Últimas 80 figurinhas</span>
                  <span className="font-mono">~220 pacotes (R$ 1.540)</span>
                </li>
              </ul>
            </div>

            <p>
              É por isso que <strong>trocas são tão importantes</strong>. Quando
              você troca, você passa a repetida para alguém que precisa dela.
              Ambos avançam, economizando dinheiro.
            </p>
          </div>
        </section>

        {/* Saving Tips */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            4 Estratégias Comprovadas para Economizar até 70%
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {savingTips.map((tip, idx) => {
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

        {/* Step by Step */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Passo a Passo: Minimizar Custo com Trocas Inteligentes
          </h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Compre o álbum e um box inicial",
                desc: "Gaste entre R$ 50-100 em álbum + primeiros pacotes. Isso serve de base.",
              },
              {
                step: 2,
                title: "Cadastre tudo no Figurinha Fácil",
                desc: "Adicione cada figurinha que tem (repetidas) e as que faltam no sistema.",
              },
              {
                step: 3,
                title: "Encontre matches e troque presencialmente",
                desc: "A plataforma avisa quando há colecionadores perto de você com matches.",
              },
              {
                step: 4,
                title: "Compre poucos pacotes por semana (máx 5-10)",
                desc: "Só compre quando precisar. Não acumule repetidas esperando por trocas.",
              },
              {
                step: 5,
                title: "Figurinhas especiais por último",
                desc: "As raras custam caro. Deixe para o final quando tiver muito para oferecer.",
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

        {/* Related Links */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Conteúdo Relacionado
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Link href="/album-copa-do-mundo-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Guia Completo do Álbum da Copa 2026
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Tudo sobre o álbum: quantas figurinhas, preços, figurinhas
                    legendárias e como completar.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/como-funciona">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Como Trocar Figurinhas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Aprenda como usar o Figurinha Fácil para encontrar matches e
                    trocar com colecionadores perto de você.
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
                Comece a Economizar Agora
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
                Use o Figurinha Fácil para encontrar automaticamente colecionadores
                com figurinhas que você precisa e economize até R$ 4 mil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
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
                  <Link href="/blog">Ler Outros Artigos</Link>
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
