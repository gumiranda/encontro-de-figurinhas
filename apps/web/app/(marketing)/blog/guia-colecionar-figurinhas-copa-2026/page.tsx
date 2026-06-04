import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Lightbulb,
  Map,
  Sparkles,
  Target,
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
import {
  BASE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateCombinedSchema,
  generateFAQSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/blog/guia-colecionar-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-08T00:00:00Z";
const MODIFIED_AT = "2026-05-08T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais e Dicas Essenciais",
  description:
    "Aprenda como colecionar figurinhas da Copa 2026 de forma eficiente. Estratégias profissionais, dicas para evitar repetidas, métodos de troca e como completar seu álbum gastando menos.",
  keywords: [
    "como colecionar figurinhas copa 2026",
    "guia colecionar figurinhas copa",
    "estratégia figurinhas copa 2026",
    "dicas colecionar álbum copa",
    "como evitar repetidas figurinhas",
    "método organizar figurinhas",
    "colecionar figurinhas eficiência",
    "guia completo figurinhas copa 2026",
    "estratégias para colecionar figurinhas",
    "figurinhas raras copa 2026 como conseguir",
  ],
  openGraph: {
    title:
      "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais",
    description:
      "Descubra estratégias profissionais para colecionar figurinhas da Copa 2026 com eficiência. Saiba como evitar repetidas e completar seu álbum economizando.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas",
      "Colecionismo",
      "Guia Completo",
      "Dicas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais",
    description:
      "Aprenda estratégias profissionais para colecionar figurinhas da Copa 2026 com eficiência.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é a melhor estratégia para colecionar figurinhas da Copa 2026?",
    answer:
      "A melhor estratégia combina compra inteligente com trocas organizadas. Comece comprando pacotes regularmente, catalogue suas figurinhas (use o Figurinha Fácil), identifique as que faltam e as repetidas, e troque com colecionadores da sua região. Isso reduz custos em até 60%.",
  },
  {
    question: "Como evitar muitas figurinhas repetidas ao colecionar?",
    answer:
      "Use uma plataforma de rastreamento como o Figurinha Fácil para catalogar suas figurinhas. Antes de comprar novos pacotes, saiba exatamente quais já possui. Ao coletar, foque em trocas estratégicas com outros colecionadores para preencher as lacunas sem duplicar.",
  },
  {
    question: "Qual é a sequência ideal de compra de pacotes de figurinhas?",
    answer:
      "Não existe ordem específica de sequência, já que cada pacote é aleatório. O que funciona é: compre regularmente (2-3 pacotes por semana), catalogue o que ganhou, identifique gaps (lacunas), e troque para preencher. Alguns colecionadores focam em figurinhas especiais primeiro, outros nas seleções favoritas.",
  },
  {
    question:
      "Como organizar minha coleção de figurinhas da Copa 2026 de forma eficiente?",
    answer:
      "Use um caderno ou app para rastrear seu progresso. O Figurinha Fácil permite marcar figurinhas que você tem e não tem. Organize por seleção (Brasil, Argentina, etc.), depois por número. Mantenha as repetidas separadas para trocas. Faça backup digital da sua coleção.",
  },
  {
    question:
      "Quais são as figurinhas mais raras e valiosas da Copa 2026 para colecionar?",
    answer:
      "As figurinhas especiais (68 no total) são as mais raras: hologramas, foil, e edições limitadas. Também são valiosas as figurinhas de ídolos (Neymar, Mbappé, Haaland). Figurinhas de estádios e bandeiras também têm valor. Comece coletando as seleções favoritas e vá buscando as raras depois.",
  },
  {
    question: "Quanto tempo leva para colecionar todas as figurinhas da Copa 2026?",
    answer:
      "Depende da sua dedicação. Apenas comprando pacotes, leva 6-12 meses. Com trocas ativas usando o Figurinha Fácil, você pode completar em 3-5 meses. Colecionadores profissionais que negociam ativamente conseguem em 1-2 meses.",
  },
];

const collectingStrategies = [
  {
    icon: Target,
    title: "Estratégia Focada",
    description:
      "Defina quais figurinhas são prioridade (time favorito, ídolos, raras) e colecione-as primeiro. Isso acelera a satisfação e economiza recursos.",
  },
  {
    icon: Users,
    title: "Rede de Trocas",
    description:
      "Monte uma rede de colecionadores (amigos, família, comunidade). Use o Figurinha Fácil para conectar com pessoas perto de você e fazer trocas presenciais.",
  },
  {
    icon: BookOpen,
    title: "Catalogação Sistemática",
    description:
      "Mantenha registro detalhado de tudo que você tem. Saiba exatamente quais são as 50 figurinhas que faltam. Isso guia suas compras futuras.",
  },
  {
    icon: Lightbulb,
    title: "Compra Estratégica",
    description:
      "Não compre pacotes ao acaso. Compre regularmente (mesma quantidade por semana) para distribuir probabilidades. Evite picos de compra que geram muitas repetidas.",
  },
  {
    icon: Map,
    title: "Localização Geográfica",
    description:
      "Use plataformas que mostram colecionadores perto de você. Trocas locais eliminam frete e conectam você com a comunidade de colecionadores.",
  },
  {
    icon: Sparkles,
    title: "Foco em Raras",
    description:
      "Deixe as figurinhas especiais para o final. Concentre-se em completar as 912 figurinhas comuns antes de buscar as 68 especiais.",
  },
];

const tipsForNewCollectors = [
  "Comece criando uma conta no Figurinha Fácil para rastrear sua coleção",
  "Compre pacotes em locais confiáveis (farmácias, supermercados, lojas autorizadas)",
  "Não guarde todas as repetidas - comece a trocar assim que tiver duplas",
  "Organize por seleção/país para facilitar buscas de faltantes",
  "Participe de grupos de colecionadores em redes sociais da sua região",
  "Guarde as figurinhas raras em local seguro (capa protetora, álbum de qualidade)",
  "Faça backup digital de sua coleção (foto ou app)",
  "Negocie trocas respeitosamente - figurinhas têm valores diferentes",
  "Não compre figurinhas avulsas a preço inflado - use trocas",
  "Acompanhe o calendário de lançamento de pacotes especiais",
];

export default function ColecionarFigurinhasGuide() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    {
      name: "Guia de Colecionismo",
      url: ARTICLE_PATH,
    },
  ];

  return (
    <>
      <JsonLd
        schema={generateCombinedSchema({
          breadcrumbs,
          article: {
            headline:
              "Guia Completo para Colecionar Figurinhas da Copa 2026: Estratégias Profissionais e Dicas Essenciais",
            description:
              "Um guia completo sobre como colecionar figurinhas da Copa 2026 com estratégias profissionais, dicas para evitar repetidas, e métodos para completar seu álbum.",
            url: ARTICLE_URL,
            image: `${BASE_URL}/og-image.png`,
            author: SITE_NAME,
            publishedTime: PUBLISHED_AT,
            modifiedTime: MODIFIED_AT,
          },
          faqs: FAQS,
        })}
      />

      <LandingHeader />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-sm text-slate-600">
            {breadcrumbs.map((crumb, idx) => (
              <div key={idx} className="flex items-center gap-2">
                {idx > 0 && <span>/</span>}
                <Link
                  href={crumb.url}
                  className="hover:text-slate-900 transition-colors"
                >
                  {crumb.name}
                </Link>
              </div>
            ))}
          </nav>

          {/* Header */}
          <div className="mb-8 space-y-4">
            <Badge className="w-fit">Guia Completo • 2026</Badge>
            <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl">
              Guia Completo para Colecionar Figurinhas da Copa 2026
            </h1>
            <p className="text-xl text-slate-600">
              Estratégias profissionais, dicas essenciais e métodos comprovados
              para completar seu álbum de forma eficiente e econômica.
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span>📅 {new Date(PUBLISHED_AT).toLocaleDateString("pt-BR")}</span>
              <span>⏱️ Leitura: 8 min</span>
              <span>📊 980 figurinhas para colecionar</span>
            </div>
          </div>

          {/* CTA Card */}
          <Card className="mb-12 border-2 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-blue-600" />
                Comece Sua Coleção Agora
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-slate-700">
                Use o Figurinha Fácil para rastrear suas figurinhas, encontrar
                colecionadores perto de você e fazer trocas inteligentes.
              </p>
              <Button asChild className="w-full sm:w-auto">
                <Link href="/dashboard">
                  Ir para Figurinha Fácil <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Índice */}
          <div className="mb-12 rounded-lg bg-slate-100 p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">
              Índice do Artigo
            </h2>
            <ul className="space-y-2 text-slate-700">
              <li>✓ O que é colecionar figurinhas profissionalmente</li>
              <li>✓ 6 estratégias comprovadas de colecionismo</li>
              <li>✓ Como organizar sua coleção</li>
              <li>✓ Dicas para evitar repetidas</li>
              <li>✓ Método de trocas inteligentes</li>
              <li>✓ 10 dicas para novos colecionadores</li>
              <li>✓ Perguntas frequentes respondidas</li>
            </ul>
          </div>

          {/* Conteúdo Principal */}
          <div className="prose prose-slate max-w-none space-y-12">
            {/* Seção 1 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                O Que é Colecionar Figurinhas Profissionalmente?
              </h2>
              <p className="text-lg text-slate-700">
                Colecionar figurinhas da Copa 2026 não é apenas comprar pacotes
                ao acaso. É um processo estratégico que envolve:
              </p>
              <ul className="space-y-2 list-disc list-inside text-slate-700">
                <li>
                  <strong>Planejamento:</strong> Saber exatamente quais
                  figurinhas você precisa
                </li>
                <li>
                  <strong>Rastreamento:</strong> Usar ferramentas para catalogar
                  sua coleção
                </li>
                <li>
                  <strong>Networking:</strong> Conectar com outros
                  colecionadores para trocas
                </li>
                <li>
                  <strong>Otimização:</strong> Minimizar gastos e repetidas
                  desnecessárias
                </li>
              </ul>
              <p className="text-slate-700">
                O álbum da Copa 2026 tem 980 figurinhas totais: 912 figurinhas
                comuns (18 de cada seleção) + 68 figurinhas especiais. Coletar
                tudo sem estratégia pode custar até R$ 7.363. Com as estratégias
                certas, você gasta entre R$ 2.000 e R$ 3.500.
              </p>
            </section>

            {/* Seção 2 */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">
                6 Estratégias Comprovadas para Colecionar Figurinhas
              </h2>
              <div className="grid gap-6 md:grid-cols-2">
                {collectingStrategies.map((strategy, idx) => {
                  const IconComponent = strategy.icon;
                  return (
                    <Card key={idx}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                          {strategy.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-slate-600">
                          {strategy.description}
                        </p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </section>

            {/* Seção 3 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Como Organizar Sua Coleção Eficientemente
              </h2>
              <p className="text-slate-700">
                A organização é fundamental para coletar de forma eficiente.
                Aqui está o método passo a passo:
              </p>

              <div className="space-y-4">
                {[
                  {
                    step: 1,
                    title: "Criar Inventário Digital",
                    description:
                      "Use o Figurinha Fácil para marcar cada figurinha que você tem. Comece digitalizando as figurinhas que já possui.",
                  },
                  {
                    step: 2,
                    title: "Identificar Faltantes",
                    description:
                      "O app mostrará automaticamente quais figurinhas faltam. Priorize por seleção (concentre em times que gosta primeiro).",
                  },
                  {
                    step: 3,
                    title: "Separar Repetidas",
                    description:
                      "Guarde as figurinhas repetidas em um local específico. Organize por seleção para facilitar buscas de trocas.",
                  },
                  {
                    step: 4,
                    title: "Conectar com Colecionadores",
                    description:
                      "Use a plataforma para encontrar colecionadores perto de você com figurinhas que faltam.",
                  },
                  {
                    step: 5,
                    title: "Fazer Trocas Estratégicas",
                    description:
                      "Troque suas repetidas pelas figurinhas que faltam. Cada troca reduz seu custo total em até 40%.",
                  },
                  {
                    step: 6,
                    title: "Atualizar Regularmente",
                    description:
                      "Toda semana, após novos pacotes, atualize seu inventário e busque novas trocas.",
                  },
                ].map((item) => (
                  <Card key={item.step}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                          {item.step}
                        </div>
                        {item.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{item.description}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Seção 4 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Como Evitar Muitas Figurinhas Repetidas
              </h2>
              <p className="text-slate-700">
                As repetidas são o maior problema dos colecionadores. Aqui está
                como minimizá-las:
              </p>

              <div className="space-y-3">
                {[
                  {
                    title: "Rastreie Antes de Comprar",
                    desc: "Saiba exatamente quais figurinhas você tem antes de comprar novos pacotes.",
                  },
                  {
                    title: "Distribua Compras",
                    desc: "Não compre 10 pacotes de uma vez. Compre 2-3 por semana para distribuir probabilidades.",
                  },
                  {
                    title: "Comece a Trocar Cedo",
                    desc: "Assim que tiver 2-3 repetidas de uma figurinha, procure alguém para trocar.",
                  },
                  {
                    title: "Use Grupos de Trocas",
                    desc: "Grupos no WhatsApp, Facebook ou Figurinha Fácil conectam você com outros colecionadores.",
                  },
                  {
                    title: "Negocie Inteligentemente",
                    desc: "Algumas figurinhas (raras, ídolos) valem mais. Saiba disso ao negociar.",
                  },
                ].map((tip, idx) => (
                  <div key={idx} className="flex gap-3 rounded-lg bg-slate-100 p-4">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">
                        {tip.title}
                      </p>
                      <p className="text-sm text-slate-600">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 5 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                10 Dicas Essenciais para Novos Colecionadores
              </h2>
              <div className="grid gap-3">
                {tipsForNewCollectors.map((tip, idx) => (
                  <div key={idx} className="flex gap-3 rounded-lg bg-amber-50 p-4">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-600 text-sm font-bold text-white flex-shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-slate-700">{tip}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Seção 6 */}
            <section className="space-y-4">
              <h2 className="text-3xl font-bold text-slate-900">
                Quanto Tempo Leva para Completar o Álbum?
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-slate-700">
                  <thead>
                    <tr className="bg-blue-50">
                      <th className="border border-slate-300 p-3 text-left font-semibold">
                        Método
                      </th>
                      <th className="border border-slate-300 p-3 text-left font-semibold">
                        Tempo
                      </th>
                      <th className="border border-slate-300 p-3 text-left font-semibold">
                        Custo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        method: "Apenas Comprando Pacotes",
                        time: "6-12 meses",
                        cost: "R$ 7.363",
                      },
                      {
                        method: "Comprando + Trocas Ocasionais",
                        time: "4-6 meses",
                        cost: "R$ 4.639",
                      },
                      {
                        method:
                          "Trocas Ativas (Figurinha Fácil)",
                        time: "3-5 meses",
                        cost: "R$ 2.000 - R$ 3.500",
                      },
                      {
                        method:
                          "Colecionador Profissional/Comunidade",
                        time: "1-2 meses",
                        cost: "R$ 1.500 - R$ 2.500",
                      },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="border border-slate-300 p-3">
                          {row.method}
                        </td>
                        <td className="border border-slate-300 p-3">
                          {row.time}
                        </td>
                        <td className="border border-slate-300 p-3 font-semibold text-blue-600">
                          {row.cost}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-slate-600 italic">
                Os tempos variam bastante dependendo de sua dedicação, frequência
                de compra e atividade em trocas.
              </p>
            </section>

            {/* FAQs */}
            <section className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, idx) => (
                  <Card key={idx}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-600">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* CTA Final */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle>Pronto para Começar?</CardTitle>
                <CardDescription>
                  Comece sua jornada de colecionismo agora mesmo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-700">
                  O Figurinha Fácil é a ferramenta definitiva para colecionadores
                  da Copa 2026. Rastreie suas figurinhas, encontre trocas perto de
                  você e complete seu álbum de forma eficiente.
                </p>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button asChild>
                    <Link href="/dashboard">
                      Ir para Figurinha Fácil
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/blog">Ver Mais Artigos</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Related Articles */}
          <div className="mt-16 pt-8 border-t border-slate-200">
            <h2 className="mb-6 text-2xl font-bold text-slate-900">
              Artigos Relacionados
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {[
                {
                  title:
                    "Quanto Custa Completar o Álbum da Copa 2026? Guia Completo com Simulações",
                  href: "/blog/quanto-custa-completar-album-copa-2026",
                  excerpt:
                    "Análise detalhada dos custos para completar o álbum com diferentes estratégias.",
                },
                {
                  title:
                    "Álbum da Copa do Mundo 2026: Guia Completo de Figurinhas, Preços e Como Completar",
                  href: "/album-copa-do-mundo-2026",
                  excerpt:
                    "Tudo que você precisa saber sobre o álbum oficial da Copa 2026.",
                },
              ].map((article, idx) => (
                <Card key={idx} className="flex flex-col">
                  <CardHeader>
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <p className="text-sm text-slate-600">{article.excerpt}</p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button variant="ghost" asChild className="w-full">
                      <Link href={article.href}>
                        Ler Artigo <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <LandingFooter />
    </>
  );
}
