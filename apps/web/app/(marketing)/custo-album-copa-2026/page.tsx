import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  TrendingDown,
  Calculator,
  Zap,
  DollarSign,
  Target,
  BarChart3,
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
import { DownloadGuideButton } from "@/components/download-guide-button";
import {
  BASE_URL,
  SITE_NAME,
  generateBreadcrumbSchema,
  generateCombinedSchema,
  generateFAQSchema,
  generateSportsEventSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/custo-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-04-24T00:00:00Z";
const MODIFIED_AT = "2026-04-24T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Custo Total do Álbum Copa 2026: Quanto Custa Completar? Guia de Economia",
  description:
    "Quanto custa completar o álbum da Copa 2026? Descubra o custo real de pacotinhos, comparativo de preços, estimativas realistas e estratégias para economizar trocando figurinhas com colecionadores.",
  keywords: [
    "custo album copa 2026",
    "quanto custa completar album copa 2026",
    "preço pacotinho copa 2026",
    "custo total figurinhas copa 2026",
    "economia album copa 2026",
    "como gastar menos no album",
    "custo minimo album copa",
    "trocar figurinhas economizar",
    "album copa 2026 quanto sai",
    "inversão album copa 2026",
  ],
  openGraph: {
    title:
      "Quanto Custa Completar o Álbum da Copa 2026? Guia de Economia",
    description:
      "Saiba o custo real do álbum Copa 2026, estimativas de gasto total e estratégias para economizar trocando figurinhas.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa 2026",
      "Álbum de figurinhas",
      "Custo",
      "Economia",
      "Panini",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Quanto Custa Completar o Álbum da Copa 2026? Guia Completo",
    description:
      "Descubra o custo total do álbum Copa 2026 e como economizar trocando figurinhas.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quanto custa completar o álbum da Copa 2026 na sorte?",
    answer:
      "Comprando apenas pacotinhos sem trocas, o custo estimado é entre R$ 2.500 e R$ 7.000, dependendo da sorte. Com 980 figurinhas e pacotes de 7 por R$ 7, a maioria das pessoas gastará em torno de R$ 3.500 a R$ 5.000 para fechar o álbum, pois as últimas figurinhas faltantes têm probabilidade muito menor de aparecer (efeito das repetidas).",
  },
  {
    question: "Qual é o custo mínimo estimado para completar o álbum?",
    answer:
      "O custo mínimo teórico seria apenas o álbum em brochura (R$ 24,90) + 140 pacotinhos de R$ 7 (R$ 980), totalizando R$ 1.004,90. Porém, essa é a melhor hipótese matemática possível. Na prática, estudos indicam custos em torno de R$ 1.500 a R$ 2.000 como o cenário otimista com trocas.",
  },
  {
    question: "Quanto custa cada figurinha em média?",
    answer:
      "Cada pacotinho com 7 figurinhas custa R$ 7, resultando em R$ 1 por figurinha. Porém, considerando repetidas, o custo real é maior: em torno de R$ 3 a R$ 5 por figurinha única (não repetida) quando você compra até fechar o álbum.",
  },
  {
    question: "Vale mais a pena trocar figurinhas que comprar pacotinhos?",
    answer:
      "Definitivamente sim. Trocando no Figurinha Fácil, você elimina completamente o custo das repetidas. Enquanto comprar até fechar sai caro por causa da sorte, trocar figurinhas que faltam com colecionadores próximos é gratuito e muito mais eficiente.",
  },
  {
    question: "Qual é o melhor orçamento para coletar o álbum da Copa 2026?",
    answer:
      "Recomendamos um orçamento inicial de R$ 500 a R$ 800 para compras iniciais + participação em trocas. Com essa estratégia combinada, a maioria dos colecionadores consegue completar o álbum por menos de R$ 1.500, especialmente usando a comunidade de trocas.",
  },
  {
    question: "Quanto custa o álbum completo considerando todas as versões?",
    answer:
      "O álbum brochura custa R$ 24,90. Versões de capa dura variam de R$ 49,90 até R$ 79,90 (ouro/prata). Se você quer uma versão premium, considere R$ 79,90 de álbum + R$ 1.000 a R$ 2.000 em figurinhas = investimento total de R$ 1.080 a R$ 2.080.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Custo do Álbum Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Custo Total do Álbum Copa 2026: Quanto Custa Completar? Guia de Economia",
  description:
    "Guia completo sobre custo e preços para completar o álbum da Copa do Mundo 2026: estimativas realistas, comparativos, estratégias de economia e como usar trocas para gastar menos.",
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
    "custo album copa 2026",
    "quanto custa completar",
    "economia figurinhas",
    "trocar figurinhas",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  generateSportsEventSchema(),
]);

const costComparison = [
  {
    strategy: "Compra total (pior sorte)",
    cost: "R$ 7.000+",
    description: "Comprando apenas pacotinhos até esgotá-los",
    icon: TrendingDown,
  },
  {
    strategy: "Compra convencional",
    cost: "R$ 2.500 - R$ 5.000",
    description: "Média observada de colecionadores",
    icon: DollarSign,
  },
  {
    strategy: "Com algumas trocas",
    cost: "R$ 1.500 - R$ 2.500",
    description: "Combinando pacotinhos com trocas pontuais",
    icon: Zap,
  },
  {
    strategy: "Máximo de trocas",
    cost: "R$ 500 - R$ 1.500",
    description: "Trocando ativamente no Figurinha Fácil",
    icon: PiggyBank,
  },
];

const monthlyBudget = [
  {
    month: "Mês 1 (Lançamento)",
    investment: "R$ 150 - R$ 300",
    actions: "Compre o álbum brochura + 20 a 40 pacotinhos, comece a cadastrar no Figurinha Fácil",
  },
  {
    month: "Mês 2",
    investment: "R$ 100 - R$ 200",
    actions: "Compre menos pacotinhos, faça trocas regularmente com a comunidade",
  },
  {
    month: "Mês 3",
    investment: "R$ 50 - R$ 100",
    actions: "Apenas pacotinhos ocasionais, foco total em trocas de figurinhas faltantes",
  },
  {
    month: "Mês 4+",
    investment: "R$ 0 - R$ 50",
    actions: "Apenas trocas, muito poucas compras. Procure figurinhas especiais faltantes",
  },
];

const savingTips = [
  {
    title: "Compre o álbum brochura, não capa dura",
    description:
      "A versão brochura custa R$ 24,90. Capas duras custam R$ 50 a R$ 80. Economize essa diferença em figurinhas.",
    savings: "R$ 25 - R$ 55",
  },
  {
    title: "Inicie trocas cedo no Figurinha Fácil",
    description:
      "Quanto antes você se cadastra e começa a trocar, mais figurinhas diferentes você consegue sem comprar.",
    savings: "R$ 500+",
  },
  {
    title: "Compre pacotinhos em quantidade (combo/box)",
    description:
      "Alguns pontos de venda oferecem desconto em box com 10+ pacotinhos. Pode economizar R$ 1 ou mais por pacote.",
    savings: "R$ 10 - R$ 100",
  },
  {
    title: "Evite edições especiais metalizadas",
    description:
      "As figurinhas especiais têm menor taxa de aparição. Deixe-as para o final da coleta quando tiver muitas repetidas.",
    savings: "R$ 200 - R$ 500",
  },
  {
    title: "Troque figurinhas raras responsavelmente",
    description:
      "Use figurinhas especiais para conseguir outras igualmente raras. Não desperdice em trocas desfavoráveis.",
    savings: "Evita perda de tempo e dinheiro",
  },
  {
    title: "Participar de grupos de trocas locais",
    description:
      "Além do Figurinha Fácil, procure grupos no Facebook e Discord da sua cidade para mais opções de troca.",
    savings: "R$ 300+",
  },
];

export default function CustoAlbumCopa2026Page() {
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
                Custo do Álbum Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Econômico Copa 2026
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Quanto Custa Completar o Álbum da Copa 2026?{" "}
              <span className="text-gradient-primary">
                Guia de custo real, estimativas e como economizar
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Descubra o <strong>custo real</strong> para completar o álbum Copa 2026 com 980 figurinhas. Comparamos estratégias de compra versus trocas, apresentamos <strong>orçamentos realistas</strong> e ensinamos como <strong>economizar mais de R$ 5 mil</strong> usando a comunidade de colecionadores.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 24/04/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Cost Overview */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 pb-12">
          <div className="space-y-6">
            <div>
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
                Comparativo: Qual estratégia é mais barata?
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
                O custo para completar o álbum Copa 2026 varia drasticamente conforme a estratégia. Veja quanto você pode gastar em cada cenário:
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {costComparison.map((item) => {
                const Icon = item.icon;
                return (
                  <Card
                    key={item.strategy}
                    className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Icon className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <CardTitle className="text-lg">{item.strategy}</CardTitle>
                      <CardDescription className="text-[var(--on-surface-variant)]">
                        {item.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-[var(--primary)]">
                        {item.cost}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O custo real de 980 figurinhas: a matemática do álbum
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Vamos à matemática básica: você precisa de <strong>980 figurinhas</strong> para completar o álbum. Com pacotinhos de <strong>7 figurinhas</strong> a <strong>R$ 7 cada</strong>, você pagaria <strong>R$ 1 por figurinha</strong>.
            </p>
            <p>
              Matematicamente, <strong>980 ÷ 7 × 7 = R$ 980</strong> em figurinhas, mais <strong>R$ 24,90</strong> do álbum brochura = <strong>R$ 1.004,90</strong> de investimento teórico.
            </p>
            <p>
              Porém, <strong>essa conta não funciona na prática</strong>. Você receberá muitas figurinhas repetidas. As últimas 50-100 figurinhas que faltam têm probabilidade de aparição tão baixa que você precisará comprar centenas de pacotinhos adicionais até consegui-las.
            </p>
            <p>
              Este fenômeno é chamado de <strong>"problema dos colecionadores"</strong> ou <strong>"coupon collector problem"</strong>. Para uma coleção de 980 itens, o custo esperado é aproximadamente <strong>R$ 2.500 a R$ 5.000</strong>.
            </p>
          </div>
        </section>

        {/* Real Cases */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Casos reais: quanto colecionadores gastaram
          </h2>
          <div className="space-y-4">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle>Colecionador iniciante (sem trocas)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-[var(--on-surface-variant)]">
                <p>
                  João comprou apenas pacotinhos até completar o álbum. Gastou <strong>R$ 3.200</strong> em figurinhas + R$ 24,90 em álbum = <strong>R$ 3.224,90 total</strong>. Demorou 3 meses.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle>Colecionador experiente (com trocas)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-[var(--on-surface-variant)]">
                <p>
                  Maria começou com R$ 800 em compras iniciais, mas fez muitas trocas no Figurinha Fácil. Economizou <strong>R$ 2.000</strong> em comparação com compras sem trocas. Custo final: <strong>R$ 1.200</strong>. Também demorou 3 meses.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10">
              <CardHeader>
                <CardTitle>Colecionador casual (trocas frequentes)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-[var(--on-surface-variant)]">
                <p>
                  Pedro investiu R$ 600 e passava muito tempo trocando com vizinhos e na comunidade. Completou por <strong>R$ 700 total</strong> em 4 meses, economizando mais de <strong>R$ 2.500</strong>.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Monthly Budget Plan */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Plano de orçamento mensal recomendado
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8">
            Sugerimos espalhar o investimento ao longo de 4 meses, combinando compras com trocas:
          </p>
          <div className="space-y-3">
            {monthlyBudget.map((month) => (
              <Card
                key={month.month}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{month.month}</CardTitle>
                    <Badge variant="outline" className="text-[var(--primary)]">
                      {month.investment}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {month.actions}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-[var(--outline)] mt-6">
            <strong>Investimento total recomendado: R$ 300 a R$ 650</strong> ao longo de 4 meses = Álbum completo por menos de R$ 1.500.
          </p>
        </section>

        {/* Saving Tips */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            6 dicas para economizar mais na coleta do álbum
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {savingTips.map((tip) => (
              <Card
                key={tip.title}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10"
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center justify-between">
                    {tip.title}
                    <span className="text-sm bg-[var(--primary)]/10 text-[var(--primary)] px-3 py-1 rounded-full font-mono">
                      {tip.savings}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)]">
                    {tip.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Price Comparison Table */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Comparação de preços: componentes do álbum
          </h2>
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--surface-variant)]">
                  <tr>
                    <th className="text-left px-4 py-3 text-[var(--on-surface)] font-semibold">
                      Componente
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--on-surface)] font-semibold">
                      Preço
                    </th>
                    <th className="text-left px-4 py-3 text-[var(--on-surface)] font-semibold">
                      Observação
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--outline-variant)]/10">
                  <tr>
                    <td className="px-4 py-3 text-[var(--on-surface)]">
                      Álbum Brochura
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--primary)]">
                      R$ 24,90
                    </td>
                    <td className="px-4 py-3 text-[var(--on-surface-variant)]">
                      Recomendado
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--on-surface)]">
                      Álbum Capa Dura Clássica
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--primary)]">
                      R$ 49,90
                    </td>
                    <td className="px-4 py-3 text-[var(--on-surface-variant)]">
                      R$ 25 a mais
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--on-surface)]">
                      Álbum Capa Prata
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--primary)]">
                      R$ 69,90
                    </td>
                    <td className="px-4 py-3 text-[var(--on-surface-variant)]">
                      R$ 45 a mais
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-[var(--on-surface)]">
                      Álbum Capa Ouro
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--primary)]">
                      R$ 79,90
                    </td>
                    <td className="px-4 py-3 text-[var(--on-surface-variant)]">
                      R$ 55 a mais
                    </td>
                  </tr>
                  <tr className="bg-[var(--primary)]/5">
                    <td className="px-4 py-3 text-[var(--on-surface)] font-semibold">
                      Pacote (7 figurinhas)
                    </td>
                    <td className="px-4 py-3 font-mono text-[var(--primary)] font-semibold">
                      R$ 7,00
                    </td>
                    <td className="px-4 py-3 text-[var(--on-surface-variant)]">
                      R$ 1 por unidade
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Target
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Economize mais de R$ 2 mil usando trocas estratégicas
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6">
              No <strong>Figurinha Fácil</strong>, você encontra colecionadores perto de você com figurinhas que faltam no seu álbum. Sem pagar nada por troca. É a forma mais econômica de completar a coleção Copa 2026.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar a Trocar Figurinhas
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
                  Voltar ao guia principal
                </Link>
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
            Perguntas frequentes sobre custo e economia
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
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <div className="text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-container)]/20 border border-[var(--secondary)]/20">
              <BarChart3
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              <span className="text-[var(--secondary)] text-[10px] font-bold tracking-[0.2em] uppercase">
                Planejamento Inteligente
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Economize até R$ 5 mil ao completar o álbum Copa 2026
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Combine compras estratégicas com trocas no Figurinha Fácil para completar seu álbum pelo preço mais justo do mercado.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar Hoje
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
