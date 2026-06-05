import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Users,
  MapPin,
  Smartphone,
  TrendingUp,
  Lightbulb,
  CheckCircle,
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

const ARTICLE_PATH = "/blog/como-completar-album-copa-2026-estrategias-trocas";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-24T00:00:00Z";
const MODIFIED_AT = "2026-05-24T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Completar Álbum Copa 2026: Estratégias de Troca, Apps e Dicas Econômicas",
  description:
    "Guia completo com 7 estratégias para completar o álbum da Copa do Mundo 2026. Aprenda a encontrar trocadores, usar apps como Cromo26, fazer trocas online e economizar ao colecionar figurinhas.",
  keywords: [
    "como completar álbum copa 2026",
    "estratégia completar figurinhas copa",
    "trocar figurinhas copa 2026",
    "onde trocar figurinhas copa mundo",
    "app trocar figurinhas copa 2026",
    "pontos de troca figurinhas copa",
    "Cromo26 app copa 2026",
    "trocas figurinhas online copa 2026",
    "dicas completar álbum rápido",
    "encontrar trocadores figurinhas",
  ],
  openGraph: {
    title:
      "Como Completar Álbum Copa 2026: Estratégias de Troca e Apps Essenciais",
    description:
      "7 estratégias práticas para completar seu álbum da Copa 2026 usando trocas inteligentes, apps especializados e encontros de colecionadores.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Estratégias de Troca",
      "Apps de Coleccionismo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Como Completar Álbum Copa 2026: 7 Estratégias Essenciais de Troca",
    description:
      "Descubra as melhores estratégias para encontrar e trocar figurinhas da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é o melhor app para trocar figurinhas da Copa 2026?",
    answer:
      "O Cromo26 é um dos apps mais populares, permitindo cadastrar suas figurinhas faltantes e repetidas, gerar QR Codes para trocas e encontrar combinações compatíveis com outros usuários. O álbum digital da FIFA Panini também permite trocas ilimitadas entre usuários. Outros apps como Encontro de Figurinhas, Trocas Figurinhas e Panini Swap também são opções viáveis.",
  },
  {
    question: "Como encontrar pontos de troca perto de mim?",
    answer:
      "Você pode encontrar pontos de troca em shoppings, praças públicas, parques, bancas de jornal, livrarias e supermercados. A melhor forma é usar o app Encontro de Figurinhas, que mapeia os pontos de troca em tempo real com raio de busca. Também vale verificar grupos no Facebook e WhatsApp com colecionadores locais.",
  },
  {
    question: "Quantas figurinhas em média consigo por troca?",
    answer:
      "Isso depende da sua estratégia. Em uma troca 1x1, você troca 1 figurinha repetida por 1 faltante. Em encontros maiores, é comum fazer trocas em lote (5x5, 10x10) o que acelera o processo. Um colecionador experiente consegue completar 50-100 figurinhas em um encontro bem organizado.",
  },
  {
    question: "Vale a pena esperar por trocas ou devo comprar pacotes?",
    answer:
      "Trocas são sempre mais econômicas que comprar pacotes. Enquanto um pacote custa R$7 com 7 figurinhas, em uma troca bem feita você consegue 7 figurinhas faltantes gastando nada. O ideal é combinar estratégias: compre alguns pacotes para ter mais repetidas e use-as em trocas.",
  },
  {
    question: "Como funcionam as trocas no álbum digital da FIFA?",
    answer:
      "No álbum digital, você cadastra suas figurinhas faltantes e repetidas. O app permite criar até 3 propostas de troca por dia e você também recebe propostas. Quando há compatibilidade (você quer o que a outra pessoa tem e vice-versa), a troca é confirmada automaticamente. É totalmente gratuito e permite trocas com pessoas do mundo todo.",
  },
  {
    question: "Qual é o tempo médio para completar o álbum com trocas?",
    answer:
      "Variável conforme dedicação. Colecionadores com estratégia ativa conseguem completar em 3-6 meses participando de 1-2 encontros por semana. Quem só faz trocas online pode levar 6-12 meses. O importante é ser consistente e estar disponível para trocas regulares.",
  },
];

const strategies = [
  {
    title: "Participar de Encontros Presenciais",
    description:
      "Procure por pontos de troca em seu bairro ou cidade. Shopping centers, parques e praças costumam ter encontros semanais de colecionadores. Leve seus duplicados organizados e prepare uma lista de figurinhas faltantes.",
    icon: MapPin,
  },
  {
    title: "Usar Apps Especializados",
    description:
      "Baixe o Cromo26 ou o app do Encontro de Figurinhas para conectar-se com outros colecionadores. Cadastre seu inventário e receba sugestões automáticas de trocas compatíveis.",
    icon: Smartphone,
  },
  {
    title: "Álbum Digital da FIFA",
    description:
      "Acesse gratuitamente o álbum digital no app FIFA Panini Collection. Faça trocas online ilimitadas com pessoas do mundo todo. Perfeito para completar figurinhas raras.",
    icon: TrendingUp,
  },
  {
    title: "Grupos Online (Facebook e WhatsApp)",
    description:
      "Participe de comunidades de colecionadores na sua cidade. Grupos como 'Trocas Copa 2026 [Sua Cidade]' facilitam encontros e negociações diretas entre membros.",
    icon: Users,
  },
  {
    title: "Negociar em Mercado Livre",
    description:
      "Venda suas figurinhas repetidas em lote no Mercado Livre para arrecadar fundos. Use o dinheiro para comprar figurinhas específicas de vendedores ou colecionadores.",
    icon: TrendingUp,
  },
  {
    title: "Combinar Compras com Trocas",
    description:
      "Não dependa apenas de trocas. Compre 2-3 pacotes por semana e use as figurinhas repetidas como moeda de troca, acelerando o processo.",
    icon: CheckCircle,
  },
];

export default function ComoCompletarAlbumCopa2026Page() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <main className="relative">
        <JsonLd
          data={generateCombinedSchema(
            "article",
            {
              headline:
                "Como Completar Álbum Copa 2026: Estratégias de Troca, Apps e Dicas Econômicas",
              description:
                "Guia completo com estratégias para completar o álbum da Copa do Mundo 2026 usando trocas inteligentes, apps e encontros de colecionadores.",
              url: ARTICLE_URL,
              datePublished: PUBLISHED_AT,
              dateModified: MODIFIED_AT,
              author: SITE_NAME,
              image: `${BASE_URL}/opengraph-image.png`,
            },
            [
              generateBreadcrumbSchema([
                { name: "Início", url: BASE_URL },
                { name: "Blog", url: `${BASE_URL}/blog` },
                {
                  name: "Como Completar Álbum Copa 2026",
                  url: ARTICLE_URL,
                },
              ]),
              generateFAQSchema(FAQS),
            ]
          )}
        />

        {/* Hero Section */}
        <section className="relative px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="mb-8 flex items-center gap-2">
              <Badge variant="secondary">Guia Completo</Badge>
              <Badge variant="outline">7 Estratégias Eficientes</Badge>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Como Completar o Álbum da Copa 2026: Estratégias de Troca e Apps
              Essenciais
            </h1>

            <p className="mb-8 text-xl text-gray-600">
              Descobrir como completar o álbum da Copa do Mundo 2026 sem
              quebrar o banco é a missão de todo colecionador. Com 980
              figurinhas para colecionar, as trocas inteligentes são a chave.
              Este guia apresenta 7 estratégias práticas, apps especializados e
              dicas de economia para você completar seu álbum de forma
              estratégica e divertida.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="#estrategias">
                <Button size="lg">
                  Ver Estratégias <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#faqs">
                <Button variant="outline" size="lg">
                  Ver Perguntas Frequentes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Introduction Section */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              O Desafio de 980 Figurinhas
            </h2>

            <p className="mb-4 text-gray-700">
              O álbum da Copa do Mundo 2026 é a maior edição da história da
              Panini com{" "}
              <strong>980 figurinhas, sendo 68 especiais</strong>. Completar
              apenas com compras de pacotes seria extremamente caro (mais de
              R$7 mil), o que torna as trocas não apenas uma opção, mas a
              estratégia mais inteligente.
            </p>

            <p className="mb-4 text-gray-700">
              A boa notícia? Existem várias formas de trocar figurinhas em 2026:
              encontros presenciais, apps especializados, álbum digital online e
              comunidades ativas em redes sociais. Cada estratégia tem suas
              vantagens, e a maioria dos colecionadores bem-sucedidos combina
              várias delas.
            </p>

            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-blue-600" />
                  Dica do Especialista
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-700">
                <p>
                  A melhor estratégia é combinar compras inteligentes com trocas
                  regulares. Compre um pacote por semana e use as repetidas em
                  trocas. Isso reduz custos mantendo o álbum em progresso
                  constante.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Estratégias Section */}
        <section id="estrategias" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-3xl font-bold text-gray-900">
              7 Estratégias para Completar o Álbum da Copa 2026
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {strategies.map((strategy, idx) => {
                const Icon = strategy.icon;
                return (
                  <Card key={idx} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                        <CardTitle className="text-lg">
                          {strategy.title}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="text-gray-600">
                      {strategy.description}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Apps Section */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-3xl font-bold text-gray-900">
              Apps Essenciais para Trocar Figurinhas
            </h2>

            <div className="grid gap-6 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cromo26</CardTitle>
                  <CardDescription>Trocas Inteligentes</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <p>✓ Cadastro automático de figurinhas</p>
                  <p>✓ Gerador de QR Codes para trocas</p>
                  <p>✓ Radar de colecionadores próximos</p>
                  <p>✓ Sugestões automáticas de combos</p>
                  <p className="pt-2 font-medium text-blue-600">Recomendado</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">FIFA Panini Digital</CardTitle>
                  <CardDescription>Album Online Oficial</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <p>✓ Oficial da Panini</p>
                  <p>✓ Trocas ilimitadas grátis</p>
                  <p>✓ Trocar com pessoas do mundo todo</p>
                  <p>✓ Suporte oficial 24/7</p>
                  <p className="pt-2 font-medium text-blue-600">Essencial</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Encontro de Figurinhas
                  </CardTitle>
                  <CardDescription>Mapa de Pontos</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-gray-600">
                  <p>✓ Localização de pontos de troca</p>
                  <p>✓ Filtra por tipo e horário</p>
                  <p>✓ Avaliações de trocadores</p>
                  <p>✓ Chat com colecionadores</p>
                  <p className="pt-2 font-medium text-blue-600">Útil</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Dicas de Economia */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Dicas de Economia para Colecionadores Inteligentes
            </h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    1. Organize suas trocas em lotes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    Em vez de fazer trocas 1x1, organize lotes (5x5, 10x10).
                    Isso economiza tempo e torna o processo mais eficiente,
                    especialmente em encontros presenciais.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    2. Participe de grupos locais
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    Grupos no Facebook como "Trocas Copa 2026 [Sua Cidade]"
                    facilitam encontros com colecionadores próximos. Trocas
                    presenciais são mais vantajosas que online.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    3. Compre com amigos
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    Comprando com amigos, vocês conseguem mais diversidade de
                    figurinhas. Ao dividir os pacotes, ambos ganham repetidas
                    diferentes para trocar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    4. Guarde os pacotes chapa
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    Algumas figurinhas parecem vir em "chapas" (lotes de
                    produção). Ao notar padrões, concentre trocas com essas
                    figurinhas repetidas.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    5. Use o McDonald's a seu favor
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    A promoção do McLanche Feliz com figurinhas de Copa oferece
                    exclusivos brilhantes por R$5. Vale a pena se você gosta de
                    comer lá mesmo.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    6. Negocie figurinhas raras
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    Figurinhas especiais (68 no total) são mais procuradas.
                    Ao conseguir uma rara duplicada, guarde para negociar por 2
                    ou mais figurinhas comuns faltantes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    7. Combine álbum digital com físico
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p>
                    Use o álbum digital para completar online e mantê-lo como
                    backup. O álbum físico é mais caro, então as trocas online
                    ajudam sem gastar.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Análise de Custo */}
        <section className="bg-blue-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Análise: Custo para Completar com Trocas vs Apenas Compras
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-red-200 bg-red-50">
                <CardHeader>
                  <CardTitle className="text-lg">Apenas Comprando</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>980 figurinhas ÷ 7 por pacote = 140 pacotes</strong>
                  </p>
                  <p>140 pacotes × R$7,00 = <strong>R$980,00</strong></p>
                  <p className="pt-4 text-red-700 font-semibold">
                    ❌ Alto investimento, sem garantia de completar
                  </p>
                </CardContent>
              </Card>

              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="text-lg">Com Trocas Estratégicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p>
                    <strong>Compra + Trocas eficientes</strong>
                  </p>
                  <p>~30 pacotes comprados = R$210</p>
                  <p>Restante conseguido em trocas</p>
                  <p className="pt-4 text-green-700 font-semibold">
                    ✓ Investimento baixo + comunidade engajada
                  </p>
                </CardContent>
              </Card>
            </div>

            <p className="mt-8 text-gray-700">
              <strong>Conclusão:</strong> Com trocas estratégicas, você consegue
              completar o álbum investindo apenas 20-30% do custo total. O resto
              vem de negociações inteligentes com a comunidade de colecionadores.
            </p>
          </div>
        </section>

        {/* FAQs */}
        <section id="faqs" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-3xl font-bold text-gray-900">
              Perguntas Frequentes
            </h2>

            <div className="space-y-6">
              {FAQS.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-gray-900">
                      {faq.question}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600">{faq.answer}</CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-16 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Pronto para Completar seu Álbum?
            </h2>
            <p className="mb-8 text-lg text-blue-100">
              Comece hoje mesmo a usar as estratégias de troca e encontre outros
              colecionadores na sua região.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/album-copa-do-mundo-2026">
                <Button size="lg" variant="secondary">
                  Ver Guia Completo do Álbum
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                  Ler Mais Artigos
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
