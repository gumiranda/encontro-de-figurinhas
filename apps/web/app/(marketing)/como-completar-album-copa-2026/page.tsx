import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  Smartphone,
  DollarSign,
  TrendingUp,
  Share2,
  CheckCircle,
  Zap,
  MapPin,
  CreditCard,
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
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/como-completar-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-06-03T00:00:00Z";
const MODIFIED_AT = "2026-06-03T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Completar Álbum da Copa 2026: Guia Completo com Estratégias e Dicas",
  description:
    "Aprenda como completar o álbum da Copa do Mundo 2026 com estratégias eficientes: grupos de troca, apps, pontos de troca oficiais e dicas para economizar. Guia definitivo para colecionadores.",
  keywords: [
    "como completar album copa 2026",
    "como completar álbum Copa",
    "guia album Copa 2026",
    "completar album figurinhas copa",
    "estratégias album copa",
    "dicas completar album",
    "trocar figurinhas online",
    "apps trocar figurinhas",
    "pontos de troca copa 2026",
    "completar álbum rapido",
    "economizar album copa",
    "figurinhas faltando album",
  ],
  openGraph: {
    title: "Como Completar Álbum da Copa 2026: Guia Completo",
    description:
      "Estratégias eficientes para completar seu álbum da Copa do Mundo 2026. Aprenda sobre grupos, apps e pontos de troca.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Álbum Copa 2026",
      "Figurinhas",
      "Trocar",
      "Guia Completo",
      "Dicas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como Completar Álbum da Copa 2026: Estratégias Práticas",
    description: "Guia completo com 5 estratégias para completar seu álbum.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const STRATEGIES = [
  {
    title: "Participar de Grupos de Troca Online",
    description:
      "Junte-se a grupos no X (Twitter), Instagram e Facebook focados em trocas de figurinhas. Em um grupo com 100 pessoas, você economiza até 90% comparado com comprar tudo sozinho.",
    icon: Users,
    savings: "Economiza até R$ 570",
    details: [
      "Reduza custos de R$ 630 para apenas R$ 60",
      "Acesso a colecionadores de todo o Brasil",
      "Trocas rápidas e frequentes",
      "Comunidade engajada e colaborativa",
    ],
  },
  {
    title: "Usar Aplicativos Especializados",
    description:
      "Aplicativos como FIFA Panini Collection e Minhas Figurinhas Copa 2026 conectam colecionadores para trocas online em tempo real.",
    icon: Smartphone,
    savings: "Grátis",
    details: [
      "FIFA Panini Collection oficial (Android/iOS)",
      "Troca com pessoas do mundo todo",
      "Rastreie suas figurinhas faltando",
      "Interface intuitiva e rápida",
    ],
  },
  {
    title: "Frequentar Pontos de Troca Presenciais",
    description:
      "Existem 113+ locais em 29 cidades brasileiras onde você pode trocar figurinhas pessoalmente com outros colecionadores.",
    icon: MapPin,
    savings: "Grátis",
    details: [
      "Trocas face-a-face em shoppings e praças",
      "Encontros regulares aos finais de semana",
      "Localizador de pontos de troca no site",
      "Comunidade local de colecionadores",
    ],
  },
  {
    title: "Comprar Figurinhas Avulsas na Panini",
    description:
      "A Panini permite comprar diretamente as figurinhas que faltam entre 15 de julho e 31 de dezembro de 2026.",
    icon: CreditCard,
    savings: "Opção rápida",
    details: [
      "Compra direta no site da Panini",
      "Figurinhas específicas que você escolhe",
      "Entrega em sua casa",
      "Ideal para as últimas figurinhas",
    ],
  },
  {
    title: "Comprar Kits com Múltiplos Envelopes",
    description:
      "Adquirir kits com vários envelopes oferece melhor custo-benefício que pacotes individuais.",
    icon: TrendingUp,
    savings: "Reduz preço unitário",
    details: [
      "Preço menor por figurinha",
      "Maior volume de tentativas",
      "Mais chances de raros",
      "Disponível em lojas físicas",
    ],
  },
  {
    title: "Organizar Grupo Local de Troca",
    description:
      "Crie seu próprio grupo com amigos, família ou vizinhos para trocas regulares e compartilhamento de custos.",
    icon: Share2,
    savings: "Máxima economia",
    details: [
      "Controle total das trocas",
      "Comunidade próxima a você",
      "Eventos presenciais organizados",
      "Economia em escala",
    ],
  },
];

const FAQS = [
  {
    question: "Qual é a melhor estratégia para completar o álbum rápido?",
    answer:
      "A combinação de grupos de troca online + aplicativos + pontos presenciais é a mais eficiente. Comece com grupos online (alcance nacional) e complemente com encontros presenciais locais para as figurinhas mais raras.",
  },
  {
    question: "Quanto custa completar o álbum da Copa 2026?",
    answer:
      "Dependendo da estratégia: comprando tudo sozinho (~R$ 980), em grupo pequeno (R$ 630), ou em grupo grande (R$ 60). A maioria gasta entre R$ 100-200 usando trocas combinadas.",
  },
  {
    question: "Posso trocar figurinhas online antes de ir a um ponto?",
    answer:
      "Sim! Use a FIFA Panini Collection ou grupos no X/Instagram para fazer trocas online. Muitas pessoas fazem trocas por correio ou encontros agendados antes de ir aos pontos presenciais.",
  },
  {
    question: "Onde encontro os 113+ pontos de troca?",
    answer:
      "Visite encontrosfigurinhasdacopa.com ou use nosso buscador de pontos para localizar o mais próximo de você. Existem locais em shoppings, praças, bibliotecas e bancas.",
  },
  {
    question: "Quantas figurinhas tem o álbum?",
    answer:
      "O álbum da Copa 2026 tem 980 figurinhas no total, sendo 68 especiais. É a maior edição da história da Panini.",
  },
  {
    question: "Qual é o preço de cada pacote?",
    answer:
      "Cada pacote custa R$ 7,00 e vem com 7 figurinhas. O álbum brochura sai por R$ 24,90, com versões especiais de capa dura entre R$ 49,90 e R$ 79,90.",
  },
  {
    question: "Como rastrear minhas figurinhas faltando?",
    answer:
      "Use planilhas Google compartilhadas, aplicativos como Minhas Figurinhas Copa 2026, ou o FIFA Panini Collection. Esses rastreiam quais figurinhas você tem e quais faltam.",
  },
  {
    question: "Posso trocar figurinhas internacionalmente?",
    answer:
      "Sim! Através da FIFA Panini Collection você pode trocar com pessoas do mundo todo. Também existem grupos internacionais no X e Discord para trocas.",
  },
];

export default function ComoCompletarAlbumPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="flex flex-col space-y-6">
                <Badge className="w-fit" variant="secondary">
                  ✨ Guia Completo 2026
                </Badge>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                  Como Completar o Álbum da Copa 2026
                </h1>
                <p className="text-lg text-muted-foreground">
                  Descubra as 6 estratégias mais eficientes para completar seu álbum de figurinhas da Copa do Mundo 2026. Economize até R$ 570 usando trocas inteligentes.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/pontos-de-troca-figurinhas-copa-2026">
                    <Button size="lg" className="w-full sm:w-auto">
                      Encontrar Pontos de Troca
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/calculadora-figurinhas">
                    <Button variant="outline" size="lg" className="w-full sm:w-auto">
                      Calcular Custo
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full bg-primary" />
                    <div className="w-8 h-8 rounded-full bg-secondary" />
                    <div className="w-8 h-8 rounded-full bg-accent" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Milhares de colecionadores já economizaram com nossas dicas
                  </p>
                </div>
              </div>

              <div className="relative h-96 sm:h-96 lg:h-full flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 rounded-2xl" />
                <div className="relative text-center space-y-4">
                  <div className="text-6xl font-bold text-primary">980</div>
                  <p className="text-xl text-muted-foreground">
                    Figurinhas para coletar
                  </p>
                  <Badge variant="outline">Maior edição da história</Badge>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6 Strategies Section */}
        <section className="py-12 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4 mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold">
                6 Estratégias Comprovadas para Completar o Álbum
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                De grupos de troca a aplicativos especializados, descubra qual estratégia funciona melhor para você
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {STRATEGIES.map((strategy, idx) => {
                const Icon = strategy.icon;
                return (
                  <Card
                    key={idx}
                    className="hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between mb-4">
                        <Icon className="h-8 w-8 text-primary" />
                        <Badge variant="secondary" className="text-xs">
                          {strategy.savings}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{strategy.title}</CardTitle>
                      <CardDescription>{strategy.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <ul className="space-y-3">
                        {strategy.details.map((detail, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
              Comparativo de Custos e Tempo
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">Estratégia</th>
                    <th className="text-left py-4 px-4 font-semibold">Custo Estimado</th>
                    <th className="text-left py-4 px-4 font-semibold">Tempo</th>
                    <th className="text-left py-4 px-4 font-semibold">Dificuldade</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">Comprando tudo sozinho</td>
                    <td className="py-4 px-4">~R$ 980</td>
                    <td className="py-4 px-4">1-2 meses</td>
                    <td className="py-4 px-4">⭐</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">Grupos pequenos (10 pessoas)</td>
                    <td className="py-4 px-4">~R$ 630</td>
                    <td className="py-4 px-4">2-3 meses</td>
                    <td className="py-4 px-4">⭐⭐</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">Grupos grandes (100 pessoas)</td>
                    <td className="py-4 px-4">~R$ 60</td>
                    <td className="py-4 px-4">3-4 meses</td>
                    <td className="py-4 px-4">⭐⭐⭐</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">Aplicativos de troca</td>
                    <td className="py-4 px-4">R$ 100-200</td>
                    <td className="py-4 px-4">2-3 meses</td>
                    <td className="py-4 px-4">⭐⭐</td>
                  </tr>
                  <tr className="border-b hover:bg-muted/50">
                    <td className="py-4 px-4">Pontos presenciais</td>
                    <td className="py-4 px-4">R$ 150-300</td>
                    <td className="py-4 px-4">2-3 meses</td>
                    <td className="py-4 px-4">⭐⭐</td>
                  </tr>
                  <tr className="hover:bg-muted/50">
                    <td className="py-4 px-4 font-semibold">Estratégia Combinada</td>
                    <td className="py-4 px-4 font-semibold">R$ 50-150</td>
                    <td className="py-4 px-4 font-semibold">2-3 meses</td>
                    <td className="py-4 px-4 font-semibold">⭐⭐⭐⭐</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-8 p-6 bg-primary/10 rounded-lg border border-primary/20">
              <h3 className="font-semibold text-lg mb-2">💡 Estratégia Recomendada</h3>
              <p className="text-sm text-foreground/80">
                Combine grupos de troca online (alcance nacional) + aplicativo FIFA Panini Collection (grátis) + encontros presenciais nos pontos oficiais. Essa abordagem oferece o melhor custo-benefício: economiza até 90% mantendo velocidade de conclusão.
              </p>
            </div>
          </div>
        </section>

        {/* Apps & Tools Section */}
        <section className="py-12 sm:py-20 bg-muted/50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              Aplicativos e Ferramentas Recomendadas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    FIFA Panini Collection
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Aplicativo oficial da FIFA em parceria com a Panini para coleção digital.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Disponível Android e iOS
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Troca com qualquer pessoa do mundo
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Totalmente grátis
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Smartphone className="h-5 w-5 text-primary" />
                    Minhas Figurinhas Copa 2026
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    App comunitário para gerenciar e trocar figurinhas do álbum.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Rastreamento completo
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Interface intuitiva
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Conecta com comunidade
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Encontro de Figurinhas da Copa
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Plataforma para encontrar 113+ pontos de troca no Brasil.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      113+ locais em 29 cidades
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Encontros agendados
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Trocas presenciais
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Grupos no X (Twitter)
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Comunidades ativas focadas em trocas online.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Alcance nacional
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Trocas rápidas
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
                      Comunidade engajada
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              Perguntas Frequentes
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {FAQS.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 sm:py-20 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold">
                Comece a Completar Seu Álbum Agora
              </h2>
              <p className="text-lg text-muted-foreground">
                Escolha sua estratégia e comece a economizar. Milhares de colecionadores já estão economizando até R$ 570.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/pontos-de-troca-figurinhas-copa-2026">
                  <Button size="lg">
                    Ver Pontos de Troca
                    <MapPin className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/album-copa-do-mundo-2026">
                  <Button variant="outline" size="lg">
                    Saiba Mais sobre o Álbum
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />

      {/* JSON-LD Schemas */}
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Article",
              headline:
                "Como Completar Álbum da Copa 2026: Guia Completo com Estratégias e Dicas",
              description:
                "Aprenda como completar o álbum da Copa do Mundo 2026 com estratégias eficientes: grupos de troca, apps, pontos de troca oficiais e dicas para economizar.",
              url: ARTICLE_URL,
              image: `${BASE_URL}/og-image.jpg`,
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
            },
            generateBreadcrumbSchema([
              { name: "Início", url: BASE_URL },
              {
                name: "Como Completar Álbum Copa 2026",
                url: ARTICLE_URL,
              },
            ]),
            {
              "@type": "FAQPage",
              mainEntity: FAQS.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ],
        }}
      />
    </div>
  );
}
