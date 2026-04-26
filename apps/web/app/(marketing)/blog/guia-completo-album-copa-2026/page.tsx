import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Users,
  MapPin,
  Sparkles,
  Trophy,
  TrendingUp,
  Shield,
  Zap,
  Heart,
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
  generateArticleSchema,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/blog/guia-completo-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-04-26T00:00:00Z";
const MODIFIED_AT = "2026-04-26T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo do Álbum da Copa do Mundo 2026: Tudo o Que Você Precisa Saber",
  description:
    "Descubra tudo sobre o álbum da Copa do Mundo 2026: quantas figurinhas tem, preço, onde comprar, como completar, figurinhas especiais e dicas para economizar. Guia definitivo para colecionadores.",
  keywords: [
    "copa do mundo 2026 álbum",
    "álbum copa 2026",
    "como completar álbum copa 2026",
    "figurinhas copa 2026",
    "figurinhas copa do mundo 2026",
    "preço álbum copa 2026",
    "onde comprar álbum copa 2026",
    "quantas figurinhas tem álbum copa 2026",
    "álbum panini 2026",
    "guia álbum copa 2026",
    "dicas colecionador copa 2026",
    "figurinhas especiais copa 2026",
    "trocar figurinhas copa 2026 online",
  ],
  openGraph: {
    title:
      "Guia Completo do Álbum da Copa do Mundo 2026: Tudo o Que Você Precisa Saber",
    description:
      "Tudo sobre o álbum da Copa 2026: quantas figurinhas, preço, onde comprar, como completar e dicas para economizar.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Coleção",
      "Panini",
      "Guia Completo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Guia Completo do Álbum da Copa do Mundo 2026: Tudo o Que Você Precisa Saber",
    description:
      "Descubra tudo sobre o álbum da Copa 2026: quantas figurinhas, preço e como completar.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa do Mundo 2026?",
    answer:
      "O álbum oficial da Panini da Copa do Mundo 2026 possui 980 figurinhas no total. Esse é o maior álbum de Copa da história, superando edições anteriores. Dessas 980 figurinhas, 68 são especiais e raras.",
  },
  {
    question: "Qual é o preço do álbum da Copa 2026?",
    answer:
      "O álbum em versão brochura custa R$ 24,90. As versões especiais com capa dura custam entre R$ 49,90 (capa padrão) e R$ 79,90 (capas prata e ouro). Os pacotinhos com 7 figurinhas cada saem por R$ 7,00.",
  },
  {
    question: "Onde comprar o álbum da Copa do Mundo 2026?",
    answer:
      "O álbum está disponível em principais livrarias, bancas de jornal, lojas de departamento e plataformas de e-commerce como Amazon, Mercado Livre e site da Panini. Também é possível encontrar em lojas de brinquedos e presentes.",
  },
  {
    question: "Como completar o álbum da Copa 2026 economizando?",
    answer:
      "A forma mais econômica é combinando compra de pacotinhos com trocas com outros colecionadores. Usando plataformas como Figurinha Fácil, você encontra pessoas perto de você para trocar figurinhas repetidas, economizando até 60% no custo total.",
  },
  {
    question: "Quanto custa completar o álbum da Copa 2026?",
    answer:
      "Comprando apenas pacotinhos, o custo fica em torno de R$ 7.000. Porém, usando trocas com outros colecionadores, você consegue reduzir esse valor para R$ 2.000-3.500, dependendo da estratégia e número de parceiros de troca.",
  },
  {
    question: "Existem figurinhas especiais ou ouro na Copa 2026?",
    answer:
      "Sim! Entre as 980 figurinhas, 68 são especiais. Existem figurinhas holográficas, douradas, prateadas e numeradas. Essas figurinhas raras têm maior valor e são buscadas por colecionadores, fazendo parte de edições limitadas e premium.",
  },
  {
    question: "Como funciona a troca de figurinhas do álbum da Copa 2026?",
    answer:
      "Você pode trocar presencialmente com amigos e colecionadores ou usar aplicativos e plataformas especializadas. No Figurinha Fácil, por exemplo, você registra quais figurinhas tem repetidas e quais faltam, o sistema encontra matches automáticos com colecionadores próximos, facilitando as trocas.",
  },
  {
    question: "Qual é a melhor estratégia para colecionar o álbum da Copa 2026?",
    answer:
      "A melhor estratégia é combinar: 1) Compre pacotinhos regularmente para ter variedade, 2) Organize suas figurinhas repetidas, 3) Use plataformas de troca para conectar com outros colecionadores, 4) Participe de grupos em redes sociais, 5) Troque presencialmente sempre que possível para economizar frete.",
  },
];

const keyFeatures = [
  {
    icon: Trophy,
    title: "980 Figurinhas Históricas",
    description:
      "O maior álbum de Copa da história com figurinhas de 48 seleções diferentes. Colete todas e faça parte da história do futebol.",
  },
  {
    icon: Sparkles,
    title: "68 Figurinhas Especiais",
    description:
      "Figurinhas holográficas, douradas, prateadas e numeradas. As raras que todo colecionador deseja ter na coleção.",
  },
  {
    icon: TrendingUp,
    title: "Edições Limitadas",
    description:
      "Capas especiais (prata, ouro) e versões colecionador. Cada edição tem seu diferencial e valor no mercado de colecionadores.",
  },
  {
    icon: MapPin,
    title: "Seleções Internacionais",
    description:
      "Figurinhas de todas as 48 seleções que participam da Copa 2026. Conheca jogadores e técnicos de diferentes países.",
  },
];

const collectionSteps = [
  {
    step: 1,
    title: "Comece com o Álbum Base",
    description:
      "Adquira um álbum da Panini (brochura ou capa dura). O álbum serve como guia visual e local para colar suas figurinhas.",
  },
  {
    step: 2,
    title: "Compre seus Primeiros Pacotinhos",
    description:
      "Inicie com alguns pacotes de figurinhas (R$ 7,00 cada) para começar a montar sua coleção. Não se preocupe com duplicatas nessa fase.",
  },
  {
    step: 3,
    title: "Registre suas Figurinhas",
    description:
      "Use aplicativos como Figurinha Fácil para registrar quais figurinhas você tem e quais faltam. Isso facilita as trocas.",
  },
  {
    step: 4,
    title: "Comece a Trocar",
    description:
      "Conecte-se com outros colecionadores perto de você. Troque figurinhas repetidas por aquelas que faltam.",
  },
  {
    step: 5,
    title: "Continue Estrategicamente",
    description:
      "Compre novos pacotes focando nas figurinhas que faltam. Combine compras com trocas para otimizar gastos.",
  },
  {
    step: 6,
    title: "Complete e Celebre",
    description:
      "Quando tiver todas as 980 figurinhas, você terá completado um dos maiores desafios do colecionador de figurinhas.",
  },
];

const savingTips = [
  {
    icon: Users,
    title: "Troque com Múltiplos Colecionadores",
    description:
      "Quanto mais pessoas você trocar, mais chances tem de encontrar figurinhas que faltam sem gastar dinheiro extra.",
  },
  {
    icon: Zap,
    title: "Organize suas Trocas",
    description:
      "Mantenha um registro das figurinhas repetidas. Isso economiza tempo e evita compras desnecessárias.",
  },
  {
    icon: Shield,
    title: "Use Plataformas de Troca",
    description:
      "Aplicativos especializados conectam colecionadores próximos, tornando as trocas mais fáceis e seguras.",
  },
  {
    icon: Heart,
    title: "Participe de Comunidades",
    description:
      "Grupos em redes sociais e forums de colecionadores oferecem dicas, trocas e suporte durante a jornada.",
  },
];

const pricingTiers = [
  {
    name: "Álbum Brochura",
    price: "R$ 24,90",
    description: "Versão básica do álbum para colar figurinhas",
    features: ["980 posições", "Capa flexível", "Melhor preço"],
  },
  {
    name: "Álbum Capa Dura",
    price: "R$ 49,90",
    description: "Versão com capa resistente",
    features: ["980 posições", "Capa dura", "Mais durável"],
  },
  {
    name: "Álbum Edição Especial",
    price: "R$ 79,90",
    description: "Edições limitadas em prata ou ouro",
    features: [
      "980 posições",
      "Capa especial (prata/ouro)",
      "Colecionável",
      "Numerado",
    ],
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Blog", url: `${BASE_URL}/blog` },
  {
    name: "Guia Completo do Álbum da Copa 2026",
    url: ARTICLE_URL,
  },
]);

const faqSchema = generateFAQSchema(FAQS.map((faq) => ({ ...faq })));

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Guia Completo do Álbum da Copa do Mundo 2026: Tudo o Que Você Precisa Saber",
  description:
    "Descubra tudo sobre o álbum da Copa do Mundo 2026: quantas figurinhas tem, preço, onde comprar, como completar, figurinhas especiais e dicas para economizar.",
  image: `${BASE_URL}/opengraph-image.png`,
  datePublished: PUBLISHED_AT,
  dateModified: MODIFIED_AT,
  author: {
    "@type": "Organization",
    name: SITE_NAME,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
  },
};

export default function GuidePage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={articleSchema} />

      <LandingHeader />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-green-50 via-yellow-50 to-white py-12 md:py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <Badge className="mb-4 w-fit bg-green-100 text-green-800">
              Guia Completo 2026
            </Badge>
            <h1 className="mb-6 text-4xl font-bold md:text-5xl">
              Guia Completo do Álbum da Copa do Mundo 2026
            </h1>
            <p className="mb-8 text-lg text-gray-600">
              Tudo o que você precisa saber para colecionar, completar e dominar
              o maior álbum de figurinhas da história da Copa do Mundo. Descubra
              quantas figurinhas tem, quanto custa, onde comprar e como economizar
              na sua jornada de colecionador.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-green-600 hover:bg-green-700">
                <Link href="/album-copa-do-mundo-2026">
                  Começar a Colecionar <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <DownloadGuideButton variant="outline" size="lg" />
            </div>
          </div>
        </section>

        {/* Key Facts Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Fatos Principais do Álbum 2026
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {keyFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <Card key={feature.title}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 rounded-lg bg-green-100 p-2">
                          <Icon className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <CardTitle>{feature.title}</CardTitle>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{feature.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="bg-gray-50 py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Opções de Álbum e Preços
            </h2>
            <p className="mb-12 text-center text-gray-600">
              Escolha a versão que melhor se adequa ao seu estilo de colecionador
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {pricingTiers.map((tier) => (
                <Card
                  key={tier.name}
                  className={tier.name === "Álbum Capa Dura" ? "border-green-200 md:scale-105" : ""}
                >
                  <CardHeader>
                    <CardTitle>{tier.name}</CardTitle>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-6">
                      <span className="text-3xl font-bold">{tier.price}</span>
                    </div>
                    <ul className="space-y-3">
                      {tier.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="mt-6 w-full bg-green-600 hover:bg-green-700">
                      Comprar Agora
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Collection Steps */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Como Completar o Álbum em 6 Passos
            </h2>
            <div className="space-y-6">
              {collectionSteps.map((step) => (
                <div key={step.step} className="flex gap-6">
                  <div className="flex-shrink-0">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-600 text-white font-bold">
                      {step.step}
                    </div>
                  </div>
                  <div className="flex-1 pt-1">
                    <h3 className="mb-2 text-lg font-bold">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Saving Tips */}
        <section className="bg-gradient-to-b from-blue-50 to-white py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Dicas para Economizar até 60%
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {savingTips.map((tip) => {
                const Icon = tip.icon;
                return (
                  <Card key={tip.title}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="mt-1 rounded-lg bg-blue-100 p-2">
                          <Icon className="h-6 w-6 text-blue-600" />
                        </div>
                        <CardTitle className="text-lg">{tip.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600">{tip.description}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-4 text-center text-3xl font-bold">
              Perguntas Frequentes
            </h2>
            <p className="mb-12 text-center text-gray-600">
              Respostas para as dúvidas mais comuns sobre o álbum da Copa 2026
            </p>
            <div className="space-y-6">
              {FAQS.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 py-12 md:py-16 text-white">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Comece sua Jornada de Colecionador Hoje
            </h2>
            <p className="mb-8 text-lg text-green-50">
              Junte-se a milhares de colecionadores conectando-se e trocando
              figurinhas da Copa 2026. Economize, colete e divirta-se!
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-green-600 hover:bg-gray-100"
            >
              <Link href="/album-copa-do-mundo-2026">
                Explorar Plataforma <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
