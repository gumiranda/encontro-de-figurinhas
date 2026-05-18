import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  TrendingUp,
  Crown,
  Zap,
  Users,
  DollarSign,
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

const ARTICLE_PATH = "/figurinhas-raras-lendarias-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-18T00:00:00Z";
const MODIFIED_AT = "2026-05-18T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Figurinhas Raras e Legendárias Copa 2026: Lista Completa de Preços e Como Encontrar",
  description:
    "Descubra as 20 figurinhas mais raras da Copa 2026 (Legend, ouro, prata e bronze). Veja lista completa com preços de mercado, taxa de obtenção e dicas para colecionadores encontrarem essas figurinhas especiais.",
  keywords: [
    "figurinhas raras copa 2026",
    "figurinhas legendárias copa 2026",
    "figurinhas lendárias copa do mundo 2026",
    "figurinhas ouro copa 2026",
    "figurinhas legend copa 2026",
    "preço figurinha rara copa 2026",
    "figurinhas mais valiosas copa 2026",
    "como encontrar figurinhas raras copa 2026",
    "figurinhas especiais copa 2026",
    "figurinhas metalizadas copa 2026",
    "figurinhas brilhantes copa 2026",
  ],
  openGraph: {
    title:
      "Figurinhas Raras e Legendárias Copa 2026: Preços e Lista Completa",
    description:
      "As 20 figurinhas mais raras da Copa 2026 com preços atualizados, taxa de obtenção e como encontrá-las.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas Raras",
      "Colecionismo",
      "Panini",
      "Legendárias",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Figurinhas Raras Copa 2026: Lista e Preços",
    description:
      "Descubra as figurinhas mais raras e valiosas da Copa 2026 com preços atualizados.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const RARE_STICKERS = [
  {
    rank: 1,
    name: "Pelé (Legend Ouro)",
    country: "Brasil",
    type: "Legend Ouro",
    price: "R$ 980 - R$ 1.500",
    rarity: "1 em 1.900 pacotes",
    description:
      "A figura mais icônica e rara do álbum. Pelé em versão legend ouro, tida como a joia do colecionador.",
  },
  {
    rank: 2,
    name: "Messi (Legend Ouro)",
    country: "Argentina",
    type: "Legend Ouro",
    price: "R$ 850 - R$ 1.300",
    rarity: "1 em 1.900 pacotes",
    description:
      "Lionel Messi na versão mais rara (legend ouro). Buscadíssima por colecionadores.",
  },
  {
    rank: 3,
    name: "Cristiano Ronaldo (Legend Ouro)",
    country: "Portugal",
    type: "Legend Ouro",
    price: "R$ 800 - R$ 1.200",
    rarity: "1 em 1.900 pacotes",
    description:
      "CR7 em versão legend ouro, uma das mais valiosas do álbum 2026.",
  },
  {
    rank: 4,
    name: "Neymar (Legend Ouro)",
    country: "Brasil",
    type: "Legend Ouro",
    price: "R$ 700 - R$ 1.100",
    rarity: "1 em 1.900 pacotes",
    description: "Neymar em legend ouro, estrela brasileira muito procurada.",
  },
  {
    rank: 5,
    name: "Mbappé (Legend Ouro)",
    country: "França",
    type: "Legend Ouro",
    price: "R$ 650 - R$ 1.000",
    rarity: "1 em 1.900 pacotes",
    description: "Kylian Mbappé em versão legend ouro, jovem promessa da Copa.",
  },
];

const STICKER_TYPES = [
  {
    name: "Legend Ouro",
    color: "Dourado metálico",
    rarity: "Extremamente Rara",
    avgPrice: "R$ 500 - R$ 1.500",
    ratio: "1 em 1.900 pacotes",
    icon: Crown,
    description:
      "As mais raras e valiosas. Incluem ícones do futebol e capitães em edição especial dourada.",
  },
  {
    name: "Legend Prata",
    color: "Prateado metálico",
    rarity: "Muito Rara",
    avgPrice: "R$ 200 - R$ 600",
    ratio: "1 em 800 pacotes",
    icon: TrendingUp,
    description:
      "Segunda categoria mais rara. Versão prata dos mesmos ícones (Legend Ouro).",
  },
  {
    name: "Legend Bronze",
    color: "Bronze metálico",
    rarity: "Rara",
    avgPrice: "R$ 80 - R$ 250",
    ratio: "1 em 400 pacotes",
    icon: Sparkles,
    description:
      "Versão bronze dos legendários. Mais acessível que prata e ouro, mas ainda muito procurada.",
  },
  {
    name: "Legend Roxa",
    color: "Roxo holográfico",
    rarity: "Rara",
    avgPrice: "R$ 60 - R$ 200",
    ratio: "1 em 300 pacotes",
    icon: Zap,
    description: "Versão roxa (primeira edição) dos ícones lendários da Copa.",
  },
  {
    name: "Figurinhas Normais",
    color: "Impressão padrão",
    rarity: "Comum",
    avgPrice: "R$ 0,50 - R$ 5",
    ratio: "1 em 7 pacotes",
    icon: Users,
    description: "Figurinhas padrão de jogadores, tec e mascotes. Encontradas facilmente.",
  },
];

const FAQS = [
  {
    question: "Qual é a figurinha mais rara do álbum da Copa 2026?",
    answer:
      "A figurinha mais rara é Pelé em versão Legend Ouro. Sua taxa de obtenção é de 1 em 1.900 pacotes, e o preço no mercado de colecionadores varia entre R$ 980 e R$ 1.500. Poucos colecionadores conseguem completar uma coleção com essa peça.",
  },
  {
    question: "Quanto custa uma figurinha Legend Ouro em média?",
    answer:
      "Uma figurinha Legend Ouro custa entre R$ 500 e R$ 1.500, dependendo de qual jogador é. As mais icônicas (Pelé, Messi, Cristiano Ronaldo) chegam a R$ 1.000+. Esse preço varia conforme a demanda no mercado de trocas.",
  },
  {
    question: "Qual é a taxa de obtenção das figurinhas Legend?",
    answer:
      "As figurinhas Legend Ouro têm taxa de 1 em 1.900 pacotes. Isso significa que, para cada 1.900 pacotinhos abertos, apenas 1 lendária ouro sai em média. As versões prata, bronze e roxa têm taxas melhores (1 em 800, 1 em 400 e 1 em 300, respectivamente).",
  },
  {
    question:
      "Como encontrar figurinhas raras sem gastar muito dinheiro?",
    answer:
      "A melhor forma é usando plataformas de troca como o Figurinha Fácil. Ao invés de comprar pacotinhos na esperança de encontrar raras, você cadastra suas figurinhas repetidas e as que faltam. A plataforma encontra automaticamente colecionadores com figurinhas que você procura e propõe trocas. Assim você economiza muito.",
  },
  {
    question: "Quais são as figurinhas especiais do álbum 2026?",
    answer:
      "As figurinhas especiais incluem: figurinhas Legend (4 versões: ouro, prata, bronze, roxa), figurinhas dos capitães das seleções, mascote da Copa, troféu da FIFA e bola oficial. No total são 68 figurinhas especiais entre 980 do álbum.",
  },
  {
    question:
      "Vale a pena investir em figurinhas raras da Copa 2026?",
    answer:
      "Depende do objetivo. Para colecionadores que querem completar o álbum, as raras são opcional. Mas para quem busca valorização, figurinhas Legend tendem a manter ou aumentar de valor. O segredo é trocar com inteligência e não gastar tudo em pacotinhos.",
  },
  {
    question:
      "Como confirmar se uma figurinha rara é original?",
    answer:
      "Figurinhas originais da Panini têm características específicas: papel de qualidade superior, impressão nítida, código de série visível no verso. Cuidado com falsificações no mercado. Ao comprar ou trocar, sempre verifique a procedência.",
  },
  {
    question:
      "Qual é o melhor lugar para vender figurinhas raras da Copa 2026?",
    answer:
      "As principais plataformas são Mercado Livre, grupos do Facebook de colecionadores, e o próprio Figurinha Fácil para trocas diretas. Grupos especializados no WhatsApp também são populares entre colecionadores sérios. A venda direta (presencial) geralmente oferece melhores preços.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Figurinhas Raras Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Figurinhas Raras e Legendárias Copa 2026: Lista Completa de Preços",
  description:
    "Guia completo das 20 figurinhas mais raras da Copa 2026, incluindo preços, taxa de obtenção e como encontrá-las.",
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
    url: BASE_URL,
  },
};

export default function RareStickersPage() {
  return (
    <>
      <LandingHeader />
      <main className="bg-[var(--surface)]">
        {/* Hero Section */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12 md:py-24">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-[var(--outline-variant)]/30 bg-[var(--primary)]/10 text-[var(--primary)]"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Figurinhas Mais Raras
              </Badge>
            </div>
            <h1 className="font-[var(--font-headline)] text-4xl md:text-5xl font-bold text-[var(--on-surface)]">
              Figurinhas Raras e Legendárias da Copa 2026
            </h1>
            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl">
              Descubra as 20 figurinhas mais raras do álbum oficial da Copa 2026, conheça os preços de mercado e as melhores estratégias para encontrá-las sem quebrar o banco.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Começar a Trocar Agora
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
                  Guia Completo do Álbum
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Key Stats */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="grid gap-4 md:grid-cols-4">
            {[
              { label: "Figurinhas Especiais", value: "68" },
              { label: "Figurinhas Legend", value: "20" },
              { label: "Versões de Acabamento", value: "4" },
              { label: "Taxa de Rarity", value: "1 em 1.900" },
            ].map((stat, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader className="pb-2">
                  <CardDescription className="text-[var(--on-surface-variant)] text-sm">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-[var(--primary)]">
                    {stat.value}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tipos de Figurinhas */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8 text-[var(--on-surface)]">
            Os 5 Tipos de Figurinhas Especiais
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {STICKER_TYPES.map((type, idx) => {
              const Icon = type.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader className="pb-3">
                    <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-3">
                      <Icon className="h-5 w-5 text-[var(--primary)]" />
                    </div>
                    <CardTitle className="text-base">{type.name}</CardTitle>
                    <CardDescription className="text-[var(--on-surface-variant)] text-xs">
                      {type.color}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-sm">
                    <div>
                      <p className="text-[var(--on-surface-variant)] text-xs mb-1">
                        Raridade
                      </p>
                      <p className="font-semibold text-[var(--primary)]">
                        {type.rarity}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--on-surface-variant)] text-xs mb-1">
                        Preço Médio
                      </p>
                      <p className="font-semibold text-[var(--on-surface)]">
                        {type.avgPrice}
                      </p>
                    </div>
                    <div>
                      <p className="text-[var(--on-surface-variant)] text-xs mb-1">
                        Taxa
                      </p>
                      <p className="text-xs text-[var(--on-surface)]">
                        {type.ratio}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Top 5 Raras */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8 text-[var(--on-surface)]">
            Top 5 Figurinhas Mais Valiosas
          </h2>
          <div className="space-y-4">
            {RARE_STICKERS.map((sticker, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] overflow-hidden hover:border-[var(--primary)]/30 transition-colors"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dim)] flex items-center justify-center flex-shrink-0 text-white font-bold text-lg">
                      #{sticker.rank}
                    </div>
                    <div className="flex-grow">
                      <CardTitle className="text-lg">
                        {sticker.name}
                      </CardTitle>
                      <CardDescription className="text-[var(--on-surface-variant)] text-sm">
                        {sticker.country} • {sticker.type}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    {sticker.description}
                  </p>
                  <div className="grid gap-3 grid-cols-3 pt-2">
                    <div className="border-t border-[var(--outline-variant)]/20 pt-3">
                      <p className="text-[var(--on-surface-variant)] text-xs mb-1">
                        Preço
                      </p>
                      <p className="font-semibold text-[var(--primary)]">
                        {sticker.price}
                      </p>
                    </div>
                    <div className="border-t border-[var(--outline-variant)]/20 pt-3">
                      <p className="text-[var(--on-surface-variant)] text-xs mb-1">
                        Raridade
                      </p>
                      <p className="font-semibold text-[var(--on-surface)]">
                        {sticker.rarity}
                      </p>
                    </div>
                    <div className="border-t border-[var(--outline-variant)]/20 pt-3">
                      <p className="text-[var(--on-surface-variant)] text-xs mb-1">
                        Taxa
                      </p>
                      <p className="text-xs text-[var(--on-surface)]">
                        {sticker.rarity}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Estratégias para Encontrar */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8 text-[var(--on-surface)]">
            4 Estratégias para Encontrar Figurinhas Raras Sem Quebrar o Banco
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[
              {
                title: "Use Plataformas de Troca",
                desc: "Cadastre suas figurinhas no Figurinha Fácil. A plataforma encontra automaticamente quem tem as raras que você procura e propõe trocas. Economiza até 80% comparado a comprar só pacotinhos.",
                icon: Users,
              },
              {
                title: "Participar de Grupos Especializados",
                desc: "Entre em grupos de WhatsApp e Facebook de colecionadores da sua região. Essas comunidades têm usuários sérios que compram, vendem e trocam figurinhas raras regularmente.",
                icon: Users,
              },
              {
                title: "Comprar Pacotes em Lote",
                desc: "Ao invés de comprar pacotinhos individuais, procure por ofertas de caixas ou kits. Lojas às vezes oferecem descontos em quantidade, aumentando suas chances.",
                icon: DollarSign,
              },
              {
                title: "Focar em Figurinhas Comuns Primeiro",
                desc: "Complete as figurinhas normais primeiro. Depois de completar 90%, achará muito mais fácil trocar (e mais barato) as figurinhas raras restantes com outros colecionadores.",
                icon: TrendingUp,
              },
            ].map((strategy, idx) => {
              const Icon = strategy.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-6 w-6 text-[var(--primary)]" />
                      </div>
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[var(--on-surface-variant)]">
                      {strategy.desc}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Aviso Importante */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <Card className="border-[var(--error)]/30 bg-[var(--error-container)]/10">
            <CardHeader>
              <div className="flex items-start gap-4">
                <AlertCircle className="h-6 w-6 text-[var(--error)] flex-shrink-0 mt-1" />
                <CardTitle className="text-lg text-[var(--on-surface)]">
                  Cuidado com Falsificações
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-[var(--on-surface-variant)]">
              <p>
                O mercado de figurinhas raras atrai falsificadores. Ao comprar figurinhas Legend ou especiais:
              </p>
              <ul className="space-y-2 list-disc list-inside text-sm">
                <li>Sempre compre de vendedores com boa reputação</li>
                <li>Verifique a qualidade do papel e impressão</li>
                <li>Procure pelo código de série no verso</li>
                <li>Compare com imagens originais da Panini</li>
                <li>Prefira trocas presenciais onde você vê o produto</li>
              </ul>
            </CardContent>
          </Card>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-3xl px-4 sm:px-6 py-12"
        >
          <h2
            id="faq-heading"
            className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8 text-[var(--on-surface)]"
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
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6 text-[var(--on-surface)]">
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
                    Tudo sobre o álbum: 980 figurinhas, preços, datas de lançamento e características.
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/blog/quanto-custa-completar-album-copa-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Quanto Custa Completar o Álbum?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Simulações de custo e estratégias para economizar até 70% usando trocas.
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
              <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto text-[var(--on-surface)]">
                Encontre Suas Figurinhas Raras Agora
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
                Use o Figurinha Fácil para conectar com colecionadores que têm exatamente as figurinhas raras que você procura. Troque presencialmente e economize.
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
                  <Link href="/como-funciona">Como Funciona</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={articleSchema} />

      <LandingFooter />
    </>
  );
}
