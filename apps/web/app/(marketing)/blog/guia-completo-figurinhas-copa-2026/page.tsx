import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  MapPin,
  Users,
  TrendingUp,
  Zap,
  Trophy,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
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

const ARTICLE_PATH = "/blog/guia-completo-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-14T10:00:00Z";
const MODIFIED_AT = "2026-05-14T10:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo de Figurinhas da Copa do Mundo 2026: Colecionar, Trocar e Completar o Álbum",
  description:
    "Descubra o guia completo para coletar figurinhas da Copa 2026. Aprenda dicas de compra, onde encontrar figurinhas, como fazer trocas com colecionadores e completar seu álbum Panini de forma inteligente.",
  keywords: [
    "guia figurinhas copa 2026",
    "como coletar figurinhas copa",
    "dicas trocas figurinhas copa",
    "onde comprar figurinhas copa 2026",
    "figurinhas copa mundo 2026",
    "como completar álbum copa",
    "pontos troca figurinhas",
    "figurinhas raras copa 2026",
    "colecionar figurinhas dicas",
    "álbum panini 2026 completo",
  ],
  openGraph: {
    title:
      "Guia Completo: Como Coletar, Trocar e Completar Figurinhas da Copa 2026",
    description:
      "Tudo que você precisa saber para coletar figurinhas da Copa do Mundo 2026. Estratégias de compra, onde trocar e dicas de colecionadores experientes.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Guia Completo",
      "Colecionar",
      "Dicas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Completo: Figurinhas Copa 2026 - Colecionar, Trocar e Completar",
    description:
      "Aprenda tudo sobre colecionar figurinhas da Copa 2026. Dicas de compra, onde trocar e estratégias para completar seu álbum.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum da Copa do Mundo 2026 tem 980 figurinhas no total, sendo 68 delas especiais em papel metalizado. Este é o maior álbum de Copa da história da Panini, reflexo da expansão do torneio para 48 seleções.",
  },
  {
    question: "Quanto custa para completar o álbum da Copa 2026?",
    answer:
      "O custo depende de quantas figurinhas você consegue trocar. Se comprar todos os envelopes necessários sem trocar, a matemática é simples: com 7 figurinhas por envelope a R$ 7,00 cada, você gastaria aproximadamente R$ 980 para completar tudo sem duplicatas. Na prática, usando trocas inteligentes, é possível completar por R$ 300-500.",
  },
  {
    question: "Onde posso trocar figurinhas da Copa 2026?",
    answer:
      "Existem pontos de troca oficiais em bancas, lojas especializadas e grupos de coleccionadores em cidades do Brasil. Plataformas digitais como o Encontro de Figurinhas também conectam colecionadores próximos para facilitar trocas. Procure usar essas redes para encontrar as figurinhas que faltam com custo zero.",
  },
  {
    question: "Qual é a melhor estratégia para não gastar muito?",
    answer:
      "A melhor estratégia é: 1) Compre alguns envelopes iniciais, 2) Registre todas as figurinhas que tem e que faltam em uma plataforma, 3) Troque com colecionadores antes de comprar mais. Quanto mais você troca, menos precisa investir. Use também aplicativos que rastreiam lotes (batches) para evitar repetir a mesma seleção.",
  },
  {
    question: "Como funcionam os pontos de troca de figurinhas?",
    answer:
      "Os pontos de troca são locais (geralmente em bancas ou lojas) onde colecionadores se encontram para trocar figurinhas duplicadas. Você leva suas repetidas e procura as que faltam. Muitos pontos funcionam em horários específicos. Procure descobrir qual fica mais perto de sua casa ou trabalho.",
  },
  {
    question: "Vale a pena comprar o álbum na versão digital?",
    answer:
      "A versão digital Panini 2026 (via Coca-Cola) é ótima para acompanhar o progresso sem gastar tanto. Você registra as figurinhas digitalmente e pode usar para negociar trocas com outras pessoas. Para quem quer apenas colecionar sem gastar, a digital é uma ótima opção.",
  },
  {
    question: "Como identificar figurinhas raras?",
    answer:
      "As figurinhas mais raras geralmente são as especiais (68 metalizado), jogadores de seleções menos conhecidas e alguns craques em ângulos especiais. Use o aplicativo oficial para ver quais figurinhas aparecem com menos frequência. Colecionadores experientes costumam trocar essas por múltiplas figurinhas comuns.",
  },
];

const BREADCRUMBS = [
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Guia Completo de Figurinhas Copa 2026", url: ARTICLE_URL },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Guia Completo de Figurinhas da Copa do Mundo 2026: Colecionar, Trocar e Completar o Álbum",
  description:
    "Descubra o guia completo para coletar figurinhas da Copa 2026. Aprenda dicas de compra, onde encontrar figurinhas e como fazer trocas.",
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
    "guia figurinhas copa 2026",
    "como coletar figurinhas",
    "dicas trocas figurinhas",
  ],
  inLanguage: "pt-BR",
};

const breadcrumbSchema = generateBreadcrumbSchema(BREADCRUMBS);
const faqSchema = generateFAQSchema(FAQS);
const structuredData = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function GuidePage() {

  return (
    <>
      <JsonLd data={structuredData} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <LandingHeader />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        {/* Hero Section */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <Badge className="mb-4" variant="outline">
              <Trophy className="mr-2 h-4 w-4" />
              Guia Completo 2026
            </Badge>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Guia Completo de Figurinhas da Copa do Mundo 2026
            </h1>

            <p className="mb-8 text-xl text-slate-700">
              Tudo que você precisa saber para colecionar, trocar e completar
              seu álbum Panini de forma inteligente. Dicas de colecionadores
              experientes para economizar e encontrar as figurinhas mais raras.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/">
                  Encontrar Pontos de Troca
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg">
                Ir para FAQ
              </Button>
            </div>
          </div>
        </section>

        {/* Content Sections */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-16">
            {/* Section 1: O Álbum 2026 */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                O Álbum da Copa 2026: Números e Fatos
              </h2>
              <p className="mb-4 text-lg text-slate-700">
                O álbum da Copa do Mundo 2026 é um recorde. Pela primeira vez,
                o torneio expande para 48 seleções (em vez de 32), e isso
                reflete diretamente no número de figurinhas.
              </p>

              <div className="rounded-lg border bg-white p-6 mb-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Números do Álbum 2026</h3>
                <div className="space-y-3">
                  {[
                    { label: "Total de figurinhas", value: "980" },
                    { label: "Figurinhas especiais metalizado", value: "68" },
                    { label: "Figurinhas por envelope", value: "7" },
                    { label: "Preço do envelope", value: "R$ 7,00" },
                    { label: "Preço do álbum vazio", value: "A partir de R$ 24,90" },
                    { label: "Seleções participantes", value: "48" },
                  ].map((row) => (
                    <div key={row.label} className="flex justify-between items-center border-b border-slate-100 pb-3 last:border-0 last:pb-0">
                      <span className="font-medium text-slate-700">{row.label}</span>
                      <span className="font-semibold tabular-nums text-slate-900">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-slate-700">
                O álbum está disponível em diferentes versões: capa mole (padrão),
                capa dura, e edições especiais metalizado. Escolha a que mais
                combina com seu estilo de colecionar.
              </p>
            </div>

            {/* Section 2: Onde Comprar */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                Onde Comprar Figurinhas da Copa 2026
              </h2>
              <p className="mb-6 text-lg text-slate-700">
                Existem várias opções para adquirir figurinhas, e cada uma tem
                suas vantagens. Escolha de acordo com suas preferências e
                orçamento.
              </p>

              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { icon: MapPin, title: "Bancas e Lojas Físicas", desc: "Compre envelopes individuais ou kits em bancas de jornal, lojas de conveniência e livrarias. Vantagem: você vê o que está comprando na hora." },
                  { icon: Zap, title: "Lojas Online", desc: "Amazon, Mercado Livre e sites especializados vendem kits e álbuns. Procure por ofertas e pacotes lacrados para garantir autenticidade." },
                  { icon: Users, title: "Pontos de Troca", desc: "Use a rede de pontos de troca para pegar figurinhas sem gastar dinheiro. Leve suas duplicatas e negocie as que faltam." },
                  { icon: TrendingUp, title: "Apps e Plataformas", desc: "Plataformas digitais conectam colecionadores para trocas inteligentes. Registre suas figurinhas e negocie de forma eficiente." },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.title} className="rounded-lg border bg-white p-5">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="flex items-center justify-center h-9 w-9 rounded-lg bg-blue-50 text-blue-600">
                          <Icon className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-slate-900">{item.title}</h3>
                      </div>
                      <p className="text-sm text-slate-700 ml-12">{item.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Section 3: Estratégia de Trocas */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                Estratégia de Trocas: Como Não Gastar Muito
              </h2>
              <p className="mb-6 text-lg text-slate-700">
                A melhor forma de completar um álbum é trocar figurinhas
                duplicadas. Com a estratégia certa, você reduz custos em até
                70%.
              </p>

              <div className="space-y-3">
                {[
                  { title: "1. Registre Tudo que Você Tem", desc: "Use um aplicativo ou plataforma para registrar todas as figurinhas que você já tem, inclusive as duplicadas. Assim você sabe exatamente o que falta." },
                  { title: "2. Troque Antes de Comprar Mais", desc: "Sempre que possível, troque suas duplicatas pelas figurinhas que faltam. Isso economiza muito dinheiro a longo prazo." },
                  { title: "3. Encontre Seus Pontos de Troca Locais", desc: "Identifique onde ficam os pontos de troca mais perto de você. Visite regularmente para encontrar colecionadores com figurinhas diferentes." },
                  { title: "4. Negocie com Inteligência", desc: "Figurinhas raras valem mais. Se você tem raras duplicadas, use-as para negociar múltiplas figurinhas comuns que faltam." },
                  { title: "5. Compre em Grupos", desc: "Grupos de colecionadores online conseguem melhores preços. Compartilhe custos de kits lacrados e divida entre membros." },
                ].map((item, i) => (
                  <div key={i} className={`flex gap-4 p-4 rounded-lg ${i % 2 === 0 ? "bg-slate-50" : "bg-white border"}`}>
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white text-sm font-semibold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 text-sm">{item.title}</h3>
                      <p className="text-slate-700 text-sm mt-1">{item.desc}</p>
                    </div>
                  </div>
                ))}
            </div>
            </div>

            {/* Section 4: Figurinhas Raras */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                Identificando Figurinhas Raras da Copa 2026
              </h2>
              <p className="mb-6 text-lg text-slate-700">
                Nem todas as figurinhas são iguais. Algumas aparecem com bem
                menos frequência e são mais valiosas para trocas.
              </p>

              <div className="space-y-4">
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
                  <h3 className="mb-2 font-semibold text-amber-900">
                    As Figurinhas Mais Raras
                  </h3>
                  <ul className="space-y-2 text-sm text-amber-800">
                    <li>
                      ✦ <strong>Figurinhas metalizado:</strong> As 68 especiais
                      em papel metalizado são muito mais raras
                    </li>
                    <li>
                      ✦ <strong>Jogadores de seleções menores:</strong> Países
                      que participam pela primeira vez têm figurinhas mais
                      procuradas
                    </li>
                    <li>
                      ✦ <strong>Craques em ângulos especiais:</strong> Versões
                      alternativas de Messi, Ronaldo, Neymar, etc.
                    </li>
                    <li>
                      ✦ <strong>Hologramas e especiais promocionais:</strong>
                      Distribuídas em quantidades limitadas
                    </li>
                  </ul>
                </div>

                <p className="text-slate-700">
                  Use o aplicativo Panini oficial para ver estatísticas de
                  quantos colecionadores têm cada figurinha. As que aparecem
                  menos frequentemente são as raras.
                </p>
              </div>
            </div>

            {/* Section 5: Dicas Finais */}
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                Dicas Finais para Completar Seu Álbum
              </h2>
              <p className="mb-6 text-lg text-slate-700">
                Aqui estão os conselhos que colecionadores experientes
                compartilham:
              </p>

              <div className="space-y-4">
                <div className="flex gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <Lightbulb className="h-6 w-6 flex-shrink-0 text-blue-600" />
                  <div>
                    <p className="font-semibold text-blue-900">
                      Comece cedo, mas sem pressa
                    </p>
                    <p className="mt-1 text-sm text-blue-800">
                      O álbum saiu há pouco. Você tem tempo. Comece agora, mas
                      não apresse comprando muitos envelopes logo de início.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-green-200 bg-green-50 p-4">
                  <Lightbulb className="h-6 w-6 flex-shrink-0 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">
                      Organize suas trocas
                    </p>
                    <p className="mt-1 text-sm text-green-800">
                      Use planilhas ou apps para rastrear o que você tem, o que
                      falta e o que alguém quer trocar com você.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <Lightbulb className="h-6 w-6 flex-shrink-0 text-purple-600" />
                  <div>
                    <p className="font-semibold text-purple-900">
                      Conecte-se com outros colecionadores
                    </p>
                    <p className="mt-1 text-sm text-purple-800">
                      Quanto mais pessoas você conhecer para trocar, mais
                      figurinhas diferentes você terá acesso. Use apps e redes
                      sociais.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-orange-200 bg-orange-50 p-4">
                  <Lightbulb className="h-6 w-6 flex-shrink-0 text-orange-600" />
                  <div>
                    <p className="font-semibold text-orange-900">
                      Guarde suas figurinhas em bom estado
                    </p>
                    <p className="mt-1 text-sm text-orange-800">
                      Use álbum de qualidade, proteja de umidade e dobramentos.
                      Figurinhas em bom estado valem mais em trocas.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-lg border border-red-200 bg-red-50 p-4">
                  <Lightbulb className="h-6 w-6 flex-shrink-0 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">
                      Evite FOMO (medo de ficar fora)
                    </p>
                    <p className="mt-1 text-sm text-red-800">
                      Não compre desesperadamente achando que vai faltar álbum.
                      Panini produz 11 milhões de figurinhas por dia. Haverá
                      sempre o que comprar.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Section */}
            <div className="rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
              <h2 className="mb-2 text-2xl font-bold">
                Comece Agora a Colecionar
              </h2>
              <p className="mb-6">
                Use nossos pontos de troca para encontrar colecionadores perto
                de você e economizar na hora de completar seu álbum.
              </p>
              <Button asChild variant="secondary" size="lg">
                <Link href="/">
                  Encontrar Pontos de Troca
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* FAQ Section */}
            <div>
              <h2 className="mb-8 text-3xl font-bold text-slate-900">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Related Links */}
            <div>
              <h2 className="mb-6 text-2xl font-bold text-slate-900">
                Artigos Relacionados
              </h2>
              <div className="grid gap-4 md:grid-cols-2">
                <Link
                  href="/album-copa-do-mundo-2026"
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-blue-600">
                      Álbum da Copa do Mundo 2026
                    </h3>
                    <p className="text-sm text-slate-700">
                      Tudo sobre preços, quantidade de figurinhas e novidades
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-600" />
                </Link>

                <Link
                  href="/blog/quanto-custa-completar-album-copa-2026"
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-blue-600">
                      Quanto Custa Completar o Álbum?
                    </h3>
                    <p className="text-sm text-slate-700">
                      Cálculo realista com e sem trocas
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-600" />
                </Link>

                <Link
                  href="/blog/abrir-pacotinhos-peso-batch-analise"
                  className="group flex items-center gap-4 rounded-lg border border-slate-200 p-4 hover:border-blue-400 hover:bg-blue-50"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold group-hover:text-blue-600">
                      Análise de Peso e Batch
                    </h3>
                    <p className="text-sm text-slate-700">
                      Técnicas para identificar pacotes com figurinhas raras
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 flex-shrink-0 text-slate-400 group-hover:text-blue-600" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
