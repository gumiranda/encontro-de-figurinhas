import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  TrendingUp,
  Users,
  Zap,
  Lightbulb,
  Smartphone,
  Shield,
  Target,
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
  generateSportsEventSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/vender-figurinhas-repetidas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-09T00:00:00Z";
const MODIFIED_AT = "2026-05-09T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Vender Figurinhas Repetidas do Álbum Copa 2026: Ganhe Dinheiro - Guia Completo",
  description:
    "Descubra como vender figurinhas repetidas da Copa 2026 e ganhar dinheiro. Melhores plataformas, preços, estratégias para figurinhas raras e dicas para lucrar com o mercado de trocas.",
  keywords: [
    "vender figurinhas repetidas copa 2026",
    "como ganhar dinheiro com figurinhas copa 2026",
    "onde vender figurinhas repetidas",
    "figurinhas raras valor mercado",
    "figurinhas mais buscadas copa 2026",
    "venda de figurinhas repetidas",
    "marketplace figurinhas copa",
    "quanto vale figurinha rara copa 2026",
    "como vender figurinhas online",
    "lucrar com figurinhas copa do mundo",
    "plataforma vender figurinhas",
  ],
  openGraph: {
    title:
      "Como Vender Figurinhas Repetidas Copa 2026 e Ganhar Dinheiro - Guia Prático",
    description:
      "Aprenda a vender figurinhas repetidas da Copa 2026 em plataformas seguras e ganhe dinheiro real com seu álbum. Estratégias para figurinhas raras.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa 2026",
      "Figurinhas",
      "Venda de Figurinhas",
      "Ganhar Dinheiro",
      "Mercado de Trocas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Como Vender Figurinhas Repetidas Copa 2026 e Ganhar Dinheiro - Guia",
    description:
      "Venda figurinhas repetidas da Copa 2026 com segurança e ganhe dinheiro. Melhores plataformas e estratégias de preço.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Posso vender figurinhas repetidas da Copa 2026?",
    answer:
      "Sim, você pode vender figurinhas repetidas em diversas plataformas legítimas de troca e venda como Figurinha Fácil, Clube da Copa, Mercado Livre e OLX. Cada plataforma oferece diferentes formas de negociação: algumas focam em trocas, outras em venda direta com dinheiro.",
  },
  {
    question: "Quanto custa vender uma figurinha no Clube da Copa?",
    answer:
      "No Clube da Copa, você não paga por adicionar figurinhas à venda. A plataforma oferece um scanner de IA que identifica figurinhas repetidas automaticamente. Você pode optar por uma assinatura de R$ 7/mês ou R$ 45 vitalício para acessar recursos premium, mas as vendas básicas são gratuitas.",
  },
  {
    question: "Qual é o valor médio de uma figurinha rara do álbum 2026?",
    answer:
      "Figurinhas raras variam bastante em preço. As figurinhas Extra Stickers na versão ouro podem custar entre R$ 20 a R$ 100+ dependendo da demanda. As figurinhas Legends (ex-jogadores históricos) variam entre R$ 15 a R$ 80. As versões comuns costumam custar entre R$ 1 a R$ 5 cada.",
  },
  {
    question: "É mais lucrativo vender ou trocar figurinhas?",
    answer:
      "Depende da sua estratégia. Trocar é mais rápido e pode ser gratuito, ideal para completar o álbum rápido. Vender gera renda direta, mas requer mais tempo para encontrar comprador. O ideal é combinar: troque figurinhas comuns com colecionadores locais e venda as raras nas plataformas online para lucrar.",
  },
  {
    question: "Como sei se uma figurinha é rara e vale mais dinheiro?",
    answer:
      "Figurinhas com efeito metalizado (brilhantes), especialmente as versões Ouro e Prata da linha Extra Stickers, são as mais raras. A categoria Legends (ex-craques), mascote, troféu e bola oficial também têm alto valor. Verifique preços em plataformas como Clube da Copa e Mercado Livre para comparar.",
  },
  {
    question: "Qual é a melhor plataforma para vender figurinhas da Copa 2026?",
    answer:
      "As melhores opções são: 1) Figurinha Fácil - foco em trocas comunitárias, 2) Clube da Copa - marketplace seguro com IA, 3) Mercado Livre - maior alcance nacional, 4) OLX - venda entre indivíduos. Cada uma tem vantagens: Figurinha Fácil é melhor para trocas locais e gratuitas; Clube da Copa para segurança; Mercado Livre para maior visibilidade.",
  },
  {
    question: "Quanto posso ganhar vendendo figurinhas repetidas?",
    answer:
      "Depende do volume e raridade. Figurinhas comuns geram R$ 50-200 de lucro se vender 50-100 unidades. Figurinhas raras podem gerar R$ 500-2000+ se você tiver múltiplas cópias das versões especiais. Colecionadores sérios podem ganhar de R$ 1.000 a R$ 5.000+ vendendo repetidas ao longo de toda a Copa 2026.",
  },
];

const STRATEGIES = [
  {
    icon: Target,
    title: "Identifique figurinhas raras",
    description:
      "Procure pelas versões Ouro, Prata e Legends. Elas têm efeito metalizado e são produzidas em menor quantidade. Use o scanner IA do Clube da Copa para identificar automaticamente suas raridades.",
    tips: [
      "Versões Ouro são as mais raras",
      "Extra Stickers têm 4 variações cada",
      "Legends homenageiam ex-craques",
    ],
  },
  {
    icon: Banknote,
    title: "Precifique corretamente",
    description:
      "Compare preços em múltiplas plataformas antes de vender. Figurinhas comuns custam R$ 1-3; especiais R$ 5-20; raras R$ 20-100+. Ofereça preços ligeiramente abaixo da concorrência para vender mais rápido.",
    tips: [
      "Cheque preços no Mercado Livre",
      "Negocie com quem procura",
      "Ofereça desconto em lotes",
    ],
  },
  {
    icon: Smartphone,
    title: "Use múltiplas plataformas",
    description:
      "Não fique em apenas uma. Liste suas figurinhas raras simultaneamente no Clube da Copa, Mercado Livre e OLX. Isso aumenta visibilidade e chances de venda rápida.",
    tips: [
      "Clube da Copa para segurança",
      "Mercado Livre para volume",
      "OLX para negociação local",
    ],
  },
  {
    icon: Users,
    title: "Construa comunidade local",
    description:
      "Participar de grupos de trocas em escolas, parques e shoppings é gratuito e leva a vendas diretas. Você também negocia figurinhas para sua coleção pessoal enquanto oferece as repetidas.",
    tips: [
      "Marque encontros seguros",
      "Troque antes de vender",
      "Crie grupos nas redes sociais",
    ],
  },
];

const PLATFORMS = [
  {
    name: "Figurinha Fácil",
    focus: "Trocas comunitárias",
    model: "Gratuito com taxa opcional",
    description:
      "Plataforma especializada em conectar colecionadores para trocas seguras e próximas. Ganhe dinheiro com a comunidade, não vendendo direto.",
  },
  {
    name: "Clube da Copa",
    focus: "Marketplace seguro",
    model: "Assinatura R$ 7/mês ou R$ 45 vitalício",
    description:
      "Scanner IA identifica figurinhas repetidas. Venda com segurança e acesso a preços de mercado em tempo real.",
  },
  {
    name: "Mercado Livre",
    focus: "Maior alcance nacional",
    model: "Comissão por venda (7-15%)",
    description:
      "Maior visibilidade de comprador, proteção ao consumidor, mas com comissão. Ideal para figurinhas raras de alto valor.",
  },
  {
    name: "OLX",
    focus: "Negociação local",
    model: "Gratuito ou anúncio patrocinado",
    description:
      "Venda entre indivíduos localmente, sem intermediários. Encontre colecionadores dispostos a negociar face a face.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Vender Figurinhas Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Como Vender Figurinhas Repetidas do Álbum Copa 2026: Ganhe Dinheiro - Guia Completo",
  description:
    "Guia prático sobre como vender figurinhas repetidas da Copa 2026 em plataformas seguras, estratégias de preço e dicas para lucrar com figurinhas raras.",
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
    "vender figurinhas",
    "ganhar dinheiro",
    "copa 2026",
    "figurinhas raras",
    "marketplace",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
  generateSportsEventSchema(),
]);

export default function VenderFigurinhasPage() {
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
                Vender Figurinhas Copa 2026
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Ganhe Dinheiro
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Como Vender Figurinhas Repetidas do Álbum Copa 2026:{" "}
              <span className="text-gradient-primary">
                ganhe dinheiro com segurança
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Tem <strong>figurinhas repetidas</strong> do álbum da Copa 2026?
              Descubra as <strong>melhores plataformas para vender</strong>,
              quanto <strong>figurinhas raras valem</strong>, e estratégias para{" "}
              <strong>lucrar com segurança</strong> no mercado de trocas mais
              aquecido do Brasil.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 09/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
              <span aria-hidden="true">•</span>
              <span>Atualizado regularmente</span>
            </div>
          </div>
        </section>

        {/* Key insight */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 pb-8">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-gradient-to-r from-[var(--primary)]/5 to-[var(--secondary)]/5 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <TrendingUp className="h-6 w-6 text-[var(--primary)] flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-[var(--on-surface)] mb-2">
                  O mercado de figurinhas repetidas é gigante
                </h3>
                <p className="text-[var(--on-surface-variant)]">
                  Com 11 milhões de figurinhas produzidas por dia e 980 números
                  diferentes, milhões de colecionadores procuram suas figurinhas
                  faltantes. Quem tem repetidas está sentado em uma mina de ouro.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por que vender figurinhas repetidas?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Quando você compra pacotinhos de figurinhas da Copa 2026, a
              probabilidade de receber <strong>muitos números repetidos</strong>{" "}
              é altíssima — especialmente nas últimas figurinhas. Em vez de
              deixar essas repetidas paradas na gaveta, você pode{" "}
              <strong>vender ou trocar com outros colecionadores</strong> e ganhar
              dinheiro de verdade.
            </p>
            <p>
              O mercado é impulsionado por colecionadores dispostos a{" "}
              <strong>pagar valores altos por figurinhas raras</strong> que faltam
              em seu álbum. As versões especiais (Ouro, Prata, Legends) podem
              render de <strong>R$ 20 a R$ 100+ cada uma</strong>.
            </p>
          </div>
        </section>

        {/* Quanto vale */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Quanto vale uma figurinha rara da Copa 2026?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Os preços variam drasticamente baseado em <strong>raridade</strong>,
              <strong>demanda</strong> e <strong>condição</strong>. Aqui estão as
              faixas de preço reais praticadas no mercado:
            </p>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-2">
                  Figurinhas Comuns
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Jogadores base e escudos: <span className="font-mono text-[var(--primary)]">R$ 1-3</span>
                </p>
              </div>
              <div className="rounded-xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-2">
                  Figurinhas Especiais
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Brilhantes (qualquer versão): <span className="font-mono text-[var(--primary)]">R$ 5-20</span>
                </p>
              </div>
              <div className="rounded-xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-2">
                  Figurinhas Raras (Prata)
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Extra Stickers Prata: <span className="font-mono text-[var(--secondary)]">R$ 20-50</span>
                </p>
              </div>
              <div className="rounded-xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-2">
                  Figurinhas Ultra Raras (Ouro)
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Extra Stickers Ouro: <span className="font-mono text-[var(--secondary)] font-bold">R$ 50-150+</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Platforms */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Melhores plataformas para vender figurinhas
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Cada plataforma tem uma especialidade. Escolha a que melhor se
            encaixa na sua estratégia de venda:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {PLATFORMS.map((platform) => (
              <Card
                key={platform.name}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <CardDescription className="text-xs uppercase tracking-widest mt-1">
                        {platform.focus}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="mt-4 rounded-lg bg-[var(--primary)]/10 px-3 py-2">
                    <p className="text-sm font-semibold text-[var(--primary)]">
                      {platform.model}
                    </p>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    {platform.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Strategies */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Estratégias para maximizar seus ganhos
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {STRATEGIES.map((strategy) => {
              const Icon = strategy.icon;
              return (
                <Card
                  key={strategy.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="h-5 w-5 text-[var(--primary)]" />
                      </div>
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-[var(--on-surface-variant)]">
                      {strategy.description}
                    </p>
                    <ul className="space-y-2">
                      {strategy.tips.map((tip) => (
                        <li
                          key={tip}
                          className="text-xs text-[var(--on-surface-variant)] flex items-center gap-2"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)]" />
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Step by step */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Passo a passo para vender suas figurinhas
          </h2>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <div className="w-0.5 h-12 bg-[var(--outline-variant)]/20 mt-2" />
              </div>
              <div className="pb-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-1">
                  Organize suas figurinhas
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Separe as figurinhas repetidas das que você quer guardar. Use
                  um álbum ou lista para saber exatamente o que você tem.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div className="w-0.5 h-12 bg-[var(--outline-variant)]/20 mt-2" />
              </div>
              <div className="pb-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-1">
                  Identifique figurinhas raras
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Procure pelos efeitos metalizado (brilhantes). Versões Ouro
                  valem mais do que versões comuns. Use apps que identificam
                  automaticamente.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <div className="w-0.5 h-12 bg-[var(--outline-variant)]/20 mt-2" />
              </div>
              <div className="pb-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-1">
                  Compare preços
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Pesquise em Mercado Livre, Clube da Copa e OLX. Figurinhas
                  iguais podem ter preços diferentes em cada lugar.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                  4
                </div>
                <div className="w-0.5 h-12 bg-[var(--outline-variant)]/20 mt-2" />
              </div>
              <div className="pb-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-1">
                  Liste em múltiplas plataformas
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Não coloque ovos em uma cesta só. Liste as raras no Clube da
                  Copa, Mercado Livre e OLX simultaneamente para visibilidade.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-[var(--primary)] text-[var(--on-primary)] flex items-center justify-center font-bold text-sm">
                  5
                </div>
              </div>
              <div className="pb-4">
                <h4 className="font-semibold text-[var(--on-surface)] mb-1">
                  Foque em trocas locais para o volume
                </h4>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Use Figurinha Fácil para trocar figurinhas comuns localmente
                  (grátis). Reserve as raras para vender com margem nas
                  plataformas.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Dicas extras */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Dicas extras para ganhar mais
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-[var(--secondary)]" />
                  <CardTitle className="text-base">Acompanhe demanda</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Conforme a Copa avança, figurinhas de seleções em destaque
                  aumentam em valor. Jogadores que marcam mais gols ganham
                  demanda. Venda estrategicamente durante os jogos.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-[var(--secondary)]" />
                  <CardTitle className="text-base">Ofereça desconto em lotes</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Venda 5+ figurinhas por R$ 15 em vez de R$ 5 cada. Compradores
                  adoram economia em volume. Você vende mais rápido e com margem.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-[var(--secondary)]" />
                  <CardTitle className="text-base">Priorize segurança</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Use plataformas com proteção ao comprador. Evite Cash ou PIX
                  antes de enviar. Plataformas como Mercado Livre já protegem
                  você.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-[var(--secondary)]" />
                  <CardTitle className="text-base">Construa reputação</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-[var(--on-surface-variant)]">
                  Avaliações positivas aumentam suas chances de venda. Responda
                  rápido, envie bem embalado e garanta qualidade. Clientes
                  voltam.
                </p>
              </CardContent>
            </Card>
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
            Perguntas frequentes sobre venda de figurinhas
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
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--secondary-container)]/20 border border-[var(--secondary)]/20">
              <Banknote
                className="w-4 h-4 text-[var(--secondary)]"
                aria-hidden="true"
              />
              <span className="text-[var(--secondary)] text-[10px] font-bold tracking-[0.2em] uppercase">
                Comece a ganhar
              </span>
            </div>
            <h2 className="font-[var(--font-headline)] text-2xl md:text-4xl font-bold max-w-2xl mx-auto">
              Transforme suas figurinhas repetidas em dinheiro
            </h2>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg max-w-2xl mx-auto">
              Você já tem figurinhas repetidas na gaveta. Comece a vender hoje
              no Figurinha Fácil e ganhe dinheiro enquanto completa seu álbum
              trocando com colecionadores da sua região.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Cadastrar e começar a vender
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
                  Ver guia do álbum
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
