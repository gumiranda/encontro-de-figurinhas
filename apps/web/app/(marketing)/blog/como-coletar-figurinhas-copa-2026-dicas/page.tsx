import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Target,
  Users,
  Lightbulb,
  CheckCircle,
  AlertCircle,
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

const ARTICLE_PATH = "/blog/como-coletar-figurinhas-copa-2026-dicas";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-01T00:00:00Z";
const MODIFIED_AT = "2026-05-01T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Coletar Figurinhas da Copa 2026: Guia Completo com Dicas Práticas",
  description:
    "Guia definitivo para colecionar figurinhas da Copa do Mundo 2026. Descubra as melhores estratégias, dicas de troca, onde comprar e como completar o álbum da forma mais econômica.",
  keywords: [
    "como coletar figurinhas copa 2026",
    "dicas colecionar figurinhas copa",
    "estratégia album copa 2026",
    "como completar album copa mais rápido",
    "guia colecionar figurinhas",
    "dicas troca figurinhas copa",
    "como economizar figurinhas",
    "colecionar figurinhas dicas práticas",
  ],
  openGraph: {
    title:
      "Como Coletar Figurinhas da Copa 2026: Guia Completo com Dicas Práticas",
    description:
      "Estratégias comprovadas, dicas de troca e orientações para completar o álbum da Copa 2026 de forma econômica e rápida.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas",
      "Dicas de Coleta",
      "Troca",
      "Estratégia",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Como Coletar Figurinhas da Copa 2026: Guia Completo com Dicas Práticas",
    description:
      "Descubra as melhores estratégias e dicas para colecionar figurinhas da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Por onde começo a coletar figurinhas da Copa 2026?",
    answer:
      "Comece comprando o álbum (brochura é mais econômico) e uma quantidade moderada de pacotinhos iniciais (20-30). Depois cadastre-se no Figurinha Fácil e organize suas figurinhas por seleção. Isso prepara você para trocas eficientes.",
  },
  {
    question: "É melhor coletar sozinho ou em grupo?",
    answer:
      "Em grupo é muito melhor! Coletar com amigos aumenta as chances de trocas compatíveis e reduz custos dramaticamente. Plataformas como Figurinha Fácil conectam você com colecionadores da sua cidade automaticamente.",
  },
  {
    question: "Como identificar figurinhas raras da Copa 2026?",
    answer:
      "As 68 figurinhas especiais são as raras — têm efeito brilhante/metalizado. Além delas, homenagens a lendas da Copa e figurinhas de capitães de seleções também são procuradas. Conheça o catálogo completo no site da Panini.",
  },
  {
    question: "Devo comprar caixas ou pegar poucos pacotinhos por vez?",
    answer:
      "Poucos pacotinhos por vez é melhor. Ao invés de gastar R$ 500 em uma caixa (70 pacotes) e gerar muitas repetidas, compre 10-20 pacotinhos, troque as repetidas, e recompre. Você economiza muito mais assim.",
  },
  {
    question: "Como fazer boas trocas sem ser enganado?",
    answer:
      "Use plataformas verificadas como Figurinha Fácil que garantem compatibilidade de trocas. Sempre troque com colecionadores que têm histórico de trocas positivas. Em encontros presenciais, examine bem a condição das figurinhas antes de confirmar.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Como Coletar Figurinhas da Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: "Como Coletar Figurinhas da Copa 2026: Guia Completo com Dicas Práticas",
  description:
    "Estratégias comprovadas para colecionar figurinhas da Copa do Mundo 2026 de forma eficiente e econômica.",
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
    "como coletar figurinhas",
    "dicas figurinhas copa",
    "estratégia album",
    "troca figurinhas",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

const strategies = [
  {
    icon: Target,
    title: "Estratégia do Iniciante",
    description:
      "Compre o álbum + 20 pacotinhos iniciais. Organize por seleção. Cadastre no Figurinha Fácil e comece a trocar sem pressa.",
    budget: "R$ 200-250",
    duration: "3-4 meses",
  },
  {
    icon: Lightbulb,
    title: "Estratégia Equilibrada",
    description:
      "Combine compra inteligente (10-15 pacotinhos por semana) com trocas ativas. Priorize seleções que ainda faltam muitas figurinhas.",
    budget: "R$ 600-800",
    duration: "2-3 meses",
  },
  {
    icon: Users,
    title: "Estratégia de Grupo",
    description:
      "Se coleta com amigos, organizem um fundo comum. Comprem juntos e distribuem as figurinhas por seleção. Multiplicam as trocas possíveis.",
    budget: "R$ 300-400 (por pessoa)",
    duration: "1-2 meses",
  },
];

const mistakes = [
  {
    mistake: "Comprar muitos pacotinhos de uma vez",
    consequence: "Gera excesso de repetidas e desperdício de dinheiro",
    solution: "Compre poucos por vez e troque regularmente",
  },
  {
    mistake: "Guardar figurinhas normais esperando ficar raro",
    consequence: "Figurinhas normais nunca ficam raras (especiais sim)",
    solution: "Use figurinhas normais repetidas para trocar por especiais",
  },
  {
    mistake: "Não fazer trocas online ou em grupo",
    consequence: "Custo final explode (R$ 3.000+)",
    solution: "Use Figurinha Fácil, grupos do Facebook ou WhatsApp",
  },
  {
    mistake: "Focar em completar antes de juntar repetidas",
    consequence: "Difícil negociar nos últimos cromos",
    solution: "Construa estoque antes de buscar as especiais",
  },
];

const tips = [
  {
    number: 1,
    title: "Organize suas figurinhas desde o início",
    content:
      "Separe por seleção em envelopes. Saiba exatamente quantas você tem de cada país. Isso acelera encontrar compatibilidades para troca.",
  },
  {
    number: 2,
    title: "Cadastre-se no Figurinha Fácil imediatamente",
    content:
      "Adicione suas figurinhas repetidas e as que faltam. A plataforma encontra matches automáticos com colecionadores perto de você.",
  },
  {
    number: 3,
    title: "Priorize trocas sobre compras",
    content:
      "Cada real gasto em pacotinhos é uma oportunidade perdida de economizar. Trocas presenciais são grátis e muito mais rápidas.",
  },
  {
    number: 4,
    title: "Conheça o valor relativo das figurinhas",
    content:
      "Especiais valem muito mais que normais. Capitães e craques valem mais que reservas. Use isso ao negociar trocas.",
  },
  {
    number: 5,
    title: "Participe de comunidades ativas",
    content:
      "Grupos no Facebook, WhatsApp e aplicativos de troca têm centenas de colecionadores. Quanto mais ativo você for, mais trocas vai conseguir.",
  },
  {
    number: 6,
    title: "Mantenha um notebook de trocas",
    content:
      "Anote quem você já trocou, quais figurinhas faltam em cada colega. Isso ajuda a planejar futuras trocas e evita repetições.",
  },
];

export default function ComoColetarFigurinhasPage() {
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
                Como Coletar Figurinhas da Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Prático
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Coletar Figurinhas da Copa 2026:{" "}
              <span className="text-gradient-primary">
                guia completo com dicas e estratégias
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Quer colecionar <strong>figurinhas da Copa 2026</strong> de forma
              inteligente e econômica? Este guia prático mostra{" "}
              <strong>estratégias comprovadas</strong>,{" "}
              <strong>dicas de troca</strong> e os{" "}
              <strong>erros mais comuns</strong> que colecionadores iniciantes
              cometem — e como evitá-los.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 01/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 10 min</span>
              <span aria-hidden="true">•</span>
              <span>Guia prático</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por que coletar figurinhas da Copa é diferente em 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O <strong>álbum da Copa 2026 tem 980 figurinhas</strong> — o maior
              da história. Com 48 seleções (em vez de 32), isso traz novas
              oportunidades e desafios para quem quer completar a coleção.
            </p>
            <p>
              A boa notícia? <strong>Existem estratégias comprovadas</strong> para
              colecionar de forma inteligente, gastando até 80% menos do que quem
              compra apenas pacotinhos. Este guia te mostra exatamente como fazer
              isso.
            </p>
          </div>
        </section>

        {/* Estratégias */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Escolha sua estratégia de coleta
          </h2>
          <div className="grid gap-4 md:grid-cols-3">
            {strategies.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <Card
                  key={strategy.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="h-5 w-5 text-[var(--primary)]" />
                      <CardTitle className="text-lg">
                        {strategy.title}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-[var(--on-surface-variant)] text-sm">
                      {strategy.description}
                    </p>
                    <div className="space-y-2 border-t border-[var(--outline-variant)]/20 pt-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--outline)]">
                          Investimento
                        </span>
                        <span className="font-mono font-bold text-[var(--primary)]">
                          {strategy.budget}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-[var(--outline)]">Tempo</span>
                        <span className="font-mono font-bold text-[var(--secondary)]">
                          {strategy.duration}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Dicas */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            6 Dicas Práticas para Colecionar de Forma Inteligente
          </h2>
          <div className="space-y-6">
            {tips.map((tip) => (
              <div
                key={tip.number}
                className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6"
              >
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-lg">
                    {tip.number}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--on-surface)] mb-2 text-lg">
                      {tip.title}
                    </h3>
                    <p className="text-[var(--on-surface-variant)] text-base">
                      {tip.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Erros comuns */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Erros Comuns que Aumentam o Custo
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {mistakes.map((item) => (
              <Card
                key={item.mistake}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start gap-3 mb-2">
                    <AlertCircle className="h-5 w-5 text-[var(--secondary)] flex-shrink-0 mt-1" />
                    <CardTitle className="text-base">{item.mistake}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="rounded bg-[var(--error)]/10 p-3 border-l-2 border-[var(--error)]">
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      <strong>Consequência:</strong> {item.consequence}
                    </p>
                  </div>
                  <div className="rounded bg-[var(--primary)]/10 p-3 border-l-2 border-[var(--primary)]">
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      <strong>Solução:</strong> {item.solution}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Processo passo a passo */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Seu Primeiro Mês Coletando: Dia a Dia
          </h2>
          <div className="space-y-4">
            {[
              {
                week: "Semana 1",
                tasks: [
                  "Compre o álbum (brochura R$ 24,90)",
                  "Compre 20 pacotinhos iniciais (R$ 140)",
                  "Organize as figurinhas por seleção",
                  "Cadastre-se no Figurinha Fácil",
                ],
              },
              {
                week: "Semana 2",
                tasks: [
                  "Adicione suas figurinhas no app",
                  "Procure primeiros matches de troca",
                  "Efetue 2-3 trocas presenciais",
                  "Compre mais 10 pacotinhos",
                ],
              },
              {
                week: "Semana 3",
                tasks: [
                  "Aumente trocas (5-7 por semana)",
                  "Organize seu estoque de repetidas",
                  "Compre mais 10 pacotinhos",
                  "Aprenda valor relativo das figuras",
                ],
              },
              {
                week: "Semana 4",
                tasks: [
                  "Consolide padrões de troca",
                  "Foque em seleções com menos figurinhas",
                  "Comece a buscar especiais",
                  "Planeje próximo mês",
                ],
              },
            ].map((phase) => (
              <div
                key={phase.week}
                className="rounded-xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4"
              >
                <h3 className="font-semibold text-[var(--on-surface)] mb-3">
                  {phase.week}
                </h3>
                <ul className="space-y-2">
                  {phase.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-4 w-4 text-[var(--primary)] flex-shrink-0 mt-0.5" />
                      <span className="text-[var(--on-surface-variant)] text-sm">
                        {task}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Plataformas de troca */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Onde Fazer Trocas
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              <strong>Figurinha Fácil</strong> — A maior plataforma de troca do
              Brasil. Cadastra figurinhas repetidas e faltantes, encontra matches
              automáticos com colecionadores da sua cidade. Trocas presenciais e
              gratuitas.
            </p>
            <p>
              <strong>Grupos Facebook</strong> — Existem centenas de grupos de
              trocadores por cidade. Busque por "figurinhas copa 2026 + sua
              cidade". Comunidade ativa e trocas diárias.
            </p>
            <p>
              <strong>WhatsApp e Telegram</strong> — Cria-se um grupo com
              colecionadores próximos. Combina trocas e encontros. Muito comum
              entre iniciantes.
            </p>
            <p>
              <strong>Mercado Livre</strong> — Para figuras muito raras e
              especiais. Não é a forma mais econômica, mas funciona para completar
              último cromo.
            </p>
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
            Dúvidas Frequentes
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

        {/* CTA final */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Comece sua coleção inteligentemente
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Milhares de colecionadores estão usando essas estratégias para
              completar o álbum da Copa 2026 gastando muito menos. Cadastre-se
              grátis e encontre seu primeira oportunidade de troca.
            </p>
            <Button
              asChild
              size="lg"
              className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
            >
              <Link href="/sign-up">
                Começar Minha Coleta
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
