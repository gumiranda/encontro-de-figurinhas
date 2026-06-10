import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Trophy,
  Globe,
  Zap,
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

const ARTICLE_PATH = "/blog/guia-completo-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-01T00:00:00Z";
const MODIFIED_AT = "2026-06-10T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo do Álbum da Copa do Mundo 2026 - Tudo Sobre Figurinhas",
  description:
    "Descubra tudo sobre o álbum oficial da Copa 2026: 980 figurinhas, 68 especiais, onde comprar, figurinhas raras, preços e estratégias para completar. Guia 100% atualizado.",
  keywords: [
    "album copa mundo 2026",
    "figurinhas copa 2026",
    "como completar album copa 2026",
    "figurinhas raras copa 2026",
    "onde comprar figurinhas copa 2026",
    "guia album copa 2026",
    "panini fifa world cup 2026",
    "quantas figurinhas tem album copa 2026",
    "figurinhas especiais copa 2026",
    "preco album copa 2026",
    "trocar figurinhas copa 2026",
  ],
  openGraph: {
    title:
      "Guia Completo do Álbum da Copa do Mundo 2026 - 980 Figurinhas Explicadas",
    description:
      "Tudo sobre o álbum da Copa 2026: quantidade, preços, figurinhas raras e como completar. Estratégias e dicas para colecionadores.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Panini",
      "Guia Completo",
      "Colecionismo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Completo do Álbum da Copa 2026 - Figurinhas",
    description:
      "Descubra tudo sobre o álbum da Copa 2026: 980 figurinhas, figurinhas raras e onde comprar.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum da Copa do Mundo 2026 tem um total de 980 figurinhas. Este é o maior álbum da história das Copas do Mundo, devido ao aumento de 48 seleções participantes (comparado aos 32 tradicionais). Destas, 68 são figurinhas especiais em acabamento metalizado.",
  },
  {
    question: "Qual é o preço do álbum e dos pacotinhos de figurinhas?",
    answer:
      "O álbum brochura custa R$ 24,90 e a versão capa dura sai por R$ 49,90 a R$ 79,90. Os pacotinhos com 7 figurinhas custam R$ 7,00 cada. O preço pode variar dependendo da loja e região.",
  },
  {
    question: "Qual é a diferença entre as figurinhas especiais e normais?",
    answer:
      "As 68 figurinhas especiais têm acabamento metalizado (roxo, bronze, prata ou dourado) e são muito mais raras que as comuns. A probabilidade de conseguir uma figurinha especial é de 1 a cada 1.900 pacotes. Elas são mais valiosas para trocas e costumam ser as últimas a completar o álbum.",
  },
  {
    question: "Qual é a figurinha mais rara do álbum da Copa 2026?",
    answer:
      "As figurinhas Legend douradas são as mais raras e caras, custando entre R$ 300 e R$ 5.000 cada. As bronze custam cerca de R$ 200, as prata de R$ 180 a R$ 400, e as roxas saem por aproximadamente R$ 150.",
  },
  {
    question: "Onde posso comprar o álbum e figurinhas da Copa 2026?",
    answer:
      "Você pode comprar em lojas físicas de brinquedos, supermercados, livrarias e lojas online como Amazon, Shopee, Mercado Livre e na loja oficial da Panini. Muitas bancas de jornal também vendem pacotinhos de figurinhas.",
  },
  {
    question: "Como posso trocar figurinhas repetidas da Copa 2026?",
    answer:
      "Use o Figurinha Fácil! A plataforma conecta colecionadores automaticamente, encontrando matches perfeitos com pessoas perto de você. Você cadastra as figurinhas que tem (repetidas) e as que precisa, e o sistema avisa quando há um colecionador com o que você quer.",
  },
];

const albumStats = [
  {
    icon: Trophy,
    label: "Total de Figurinhas",
    value: "980",
  },
  {
    icon: Sparkles,
    label: "Figurinhas Especiais",
    value: "68",
  },
  {
    icon: Globe,
    label: "Seleções Participantes",
    value: "48",
  },
  {
    icon: Zap,
    label: "Figurinhas por Pacote",
    value: "7",
  },
];

const specialStickers = [
  {
    name: "Legend Roxo",
    rarity: "Comum das especiais",
    price: "~R$ 150",
    probability: "1 a cada 1.900 pacotes",
  },
  {
    name: "Legend Bronze",
    rarity: "Raro",
    price: "~R$ 200",
    probability: "1 a cada 3.800 pacotes",
  },
  {
    name: "Legend Prata",
    rarity: "Muito Raro",
    price: "R$ 180 a R$ 400",
    probability: "1 a cada 5.700 pacotes",
  },
  {
    name: "Legend Dourado",
    rarity: "Lendário",
    price: "R$ 300 a R$ 5.000",
    probability: "1 a cada 7.600 pacotes",
  },
];

const collectingTips = [
  {
    icon: BookOpen,
    title: "Organize seu Álbum",
    description:
      "Mantenha o álbum e as figurinhas em bom estado. Use plástico protetor e guarde em local seco. Figurinhas bem preservadas valem mais.",
  },
  {
    icon: Zap,
    title: "Troque Rapidamente",
    description:
      "Não acumule repetidas. Quanto mais rápido trocar, mais oportunidades aparecem. Use o Figurinha Fácil para encontrar matches automáticos.",
  },
  {
    icon: Globe,
    title: "Conecte com Outros Colecionadores",
    description:
      "Participe de comunidades online e presenciais. Quanto mais pessoas você conhecer, mais opções de troca terá.",
  },
  {
    icon: Trophy,
    title: "Estratégia com Especiais",
    description:
      "As figurinhas especiais são caras. Deixe para completar no final, quando tiver muitas repetidas para oferecer em troca.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  { name: "Guia Completo Álbum Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Guia Completo do Álbum da Copa do Mundo 2026 - Tudo Sobre Figurinhas",
  description:
    "Guia detalhado sobre o álbum da Copa 2026: 980 figurinhas, 68 especiais, onde comprar, figurinhas raras e estratégias para completar.",
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
    "album copa 2026",
    "figurinhas copa 2026",
    "guia album copa 2026",
    "figurinhas raras copa 2026",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

export default function GuiaCompletoArticlePage() {
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
                Guia Completo Álbum Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia Completo
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Guia Completo do Álbum da Copa 2026{" "}
              <span className="text-gradient-primary">
                980 figurinhas explicadas
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Tudo que você precisa saber sobre o maior álbum de figurinhas da
              história da Copa do Mundo. Descubra quantas figurinhas tem,
              figurinhas raras, preços, onde comprar e as melhores estratégias
              para completar seu álbum.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 01/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 12 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado em 10/06/2026</span>
            </div>
          </div>
        </section>

        {/* Album Stats */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {albumStats.map((stat, idx) => {
              const Icon = stat.icon;
              return (
                <Card
                  key={idx}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader className="pb-3">
                    <Icon className="h-6 w-6 text-[var(--primary)] mb-2" />
                    <CardDescription className="text-[var(--on-surface-variant)] text-xs">
                      {stat.label}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-[var(--primary)]">
                      {stat.value}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* O que é o Álbum */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            O que é o Álbum da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              O álbum da Copa do Mundo 2026 é a coleção oficial de figurinhas
              produzida pela <strong>Panini FIFA World Cup 2026</strong>. Diferente
              de edições anteriores, este é o <strong>maior álbum da história</strong>,
              com 980 figurinhas no total para completar.
            </p>

            <p>
              A razão do aumento é simples: a Copa 2026 será a primeira com{" "}
              <strong>48 seleções participantes</strong> (em vez das tradicionais 32),
              resultando em mais jogadores, técnicos, e figurinhas especiais para
              colecionadores.
            </p>

            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 mt-6">
              <h3 className="font-semibold text-[var(--on-surface)] mb-4">
                📊 Comparação com Copas Anteriores
              </h3>
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between">
                  <span>Copa 2014 Brasil</span>
                  <span className="font-mono">643 figurinhas</span>
                </li>
                <li className="flex justify-between">
                  <span>Copa 2018 Rússia</span>
                  <span className="font-mono">682 figurinhas</span>
                </li>
                <li className="flex justify-between">
                  <span>Copa 2022 Qatar</span>
                  <span className="font-mono">670 figurinhas</span>
                </li>
                <li className="flex justify-between border-t border-[var(--outline-variant)]/20 pt-2 font-bold">
                  <span>Copa 2026 (Esta!)</span>
                  <span className="font-mono text-[var(--primary)]">980 figurinhas</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Figurinhas Especiais */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            As 68 Figurinhas Especiais: Raras e Valiosas
          </h2>

          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Dentro dos 980 figurinhas, há 68 figurinhas especiais com acabamento
            metalizado em quatro tipos: <strong>roxo, bronze, prata e dourado</strong>.
            Essas são as mais raras e procuradas pelos colecionadores.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            {specialStickers.map((sticker, idx) => (
              <Card
                key={idx}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-lg">{sticker.name}</CardTitle>
                  <Badge variant="outline" className="w-fit">
                    {sticker.rarity}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-[var(--outline)]">
                      Valor Aproximado
                    </p>
                    <p className="text-2xl font-bold text-[var(--primary)]">
                      {sticker.price}
                    </p>
                  </div>
                  <div className="rounded-lg bg-[var(--surface-container)]/50 p-3">
                    <p className="text-xs text-[var(--on-surface-variant)]">
                      {sticker.probability}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Preços e Onde Comprar */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Preços e Onde Comprar Figurinhas da Copa 2026
          </h2>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 md:p-8">
              <h3 className="font-semibold text-[var(--on-surface)] mb-4">
                💰 Tabela de Preços Oficial
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-3 border-b border-[var(--outline-variant)]/10">
                  <span>Pacotinho (7 figurinhas)</span>
                  <span className="font-bold">R$ 7,00</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--outline-variant)]/10">
                  <span>Álbum Brochura</span>
                  <span className="font-bold">R$ 24,90</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-[var(--outline-variant)]/10">
                  <span>Álbum Capa Dura (Prata)</span>
                  <span className="font-bold">R$ 49,90</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Álbum Premium (Ouro)</span>
                  <span className="font-bold">R$ 79,90</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6 md:p-8">
              <h3 className="font-semibold text-[var(--on-surface)] mb-4">
                🛒 Onde Comprar
              </h3>
              <ul className="space-y-2 text-[var(--on-surface-variant)]">
                <li>✓ <strong>Lojas físicas:</strong> Supermercados, livrarias, bancas de jornal</li>
                <li>✓ <strong>Online:</strong> Panini.com.br, Amazon, Shopee, Mercado Livre</li>
                <li>✓ <strong>Redes de Brinquedos:</strong> Imaginarium, Ri Happy, Brinquedos Educativos</li>
                <li>✓ <strong>Varejo:</strong> Extra, Carrefour, Walmart</li>
                <li>✓ <strong>Colecionadores:</strong> Figurinha Fácil (trocas e compras com outros collectors)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Dicas para Colecionadores */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Dicas de Ouro para Colecionadores da Copa 2026
          </h2>

          <div className="grid gap-4 md:grid-cols-2">
            {collectingTips.map((tip, idx) => {
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

        {/* Estratégia para Completar */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Estratégia Passo a Passo para Completar o Álbum
          </h2>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Escolha seu Álbum",
                desc: "Decida entre brochura (R$ 24,90) ou capa dura (R$ 49-79). A brochura é mais econômica.",
              },
              {
                step: 2,
                title: "Comece a Coletar",
                desc: "Compre pacotinhos regularmente e preencha seu álbum. Guarde as repetidas em um local seguro.",
              },
              {
                step: 3,
                title: "Conecte com Outros Colecionadores",
                desc: "Use o Figurinha Fácil para encontrar automaticamente quem tem as figurinhas que faltam.",
              },
              {
                step: 4,
                title: "Realize Trocas Estratégicas",
                desc: "Troque figurinhas repetidas presencialmente. Isso economiza até R$ 4 mil no final.",
              },
              {
                step: 5,
                title: "Complete as Raras",
                desc: "Deixe as figurinhas especiais para o final, quando terá mais figurinhas para oferecer em troca.",
              },
              {
                step: 6,
                title: "Finalize e Preserve",
                desc: "Mantenha o álbum em bom estado. Proteja com plástico e guarde em local seco.",
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
            <Link href="/blog/quanto-custa-completar-album-copa-2026">
              <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--primary)]/30 transition-colors cursor-pointer">
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    Quanto Custa Completar o Álbum?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)] text-sm">
                    Análise detalhada de custos com simulações reais e estratégias
                    para economizar até 70%.
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
                    Aprenda a usar o Figurinha Fácil para encontrar matches
                    automáticos e trocar com colecionadores.
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
                Comece a Completar seu Álbum Agora
              </h2>
              <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
                Use o Figurinha Fácil para encontrar automaticamente colecionadores
                com as figurinhas que você precisa. Troque presencialmente e
                complete seu álbum economizando até R$ 4 mil.
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
                  <Link href="/blog">Ler Mais Artigos</Link>
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
