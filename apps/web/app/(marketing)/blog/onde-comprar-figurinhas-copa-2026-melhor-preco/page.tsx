import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  DollarSign,
  Smartphone,
  Package,
  Tag,
  TrendingDown,
  Store,
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

const ARTICLE_PATH = "/blog/onde-comprar-figurinhas-copa-2026-melhor-preco";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-24T00:00:00Z";
const MODIFIED_AT = "2026-05-24T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Onde Comprar Figurinhas Copa 2026: Guia de Preços, Lojas Físicas e Online",
  description:
    "Encontre os melhores preços para comprar figurinhas da Copa 2026. Compare preços em bancas, supermercados, Mercado Livre, Amazon, McDonald's e lojas online. Descubra promoções exclusivas.",
  keywords: [
    "onde comprar figurinhas copa 2026",
    "preço figurinhas copa 2026",
    "comprar álbum copa 2026 online",
    "figurinhas copa 2026 melhor preço",
    "bancas com figurinhas copa",
    "supermercado figurinhas copa 2026",
    "Mercado Livre figurinhas copa",
    "Amazon figurinhas copa 2026",
    "McDonald's figurinhas copa 2026",
    "promoção figurinhas copa 2026",
  ],
  openGraph: {
    title:
      "Onde Comprar Figurinhas Copa 2026: Lojas Físicas e Online com Melhores Preços",
    description:
      "Guia completo comparando preços de figurinhas da Copa 2026 em diferentes lojas e plataformas. Encontre as melhores ofertas.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas",
      "Guia de Compras",
      "Promoções",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Onde Comprar Figurinhas Copa 2026: Melhor Preço e Ofertas Exclusivas",
    description:
      "Compare preços e encontre as melhores promoções para comprar figurinhas da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question:
      "Qual é o melhor lugar para comprar figurinhas da Copa 2026 mais barato?",
    answer:
      "A melhor relação custo-benefício é encontrada em promoções do McDonald's (R$5 o pacote) e em compras a granel no Mercado Livre. Para compra única, bancas e supermercados oferecem R$7 padrão, que é o preço oficial da Panini.",
  },
  {
    question: "Vale a pena comprar figurinhas usadas ou de terceiros?",
    answer:
      "Cuidado! Sempre compre de vendedores certificados. No Mercado Livre, procure por vendedores com boa reputação. Existem falsificações de baixa qualidade circulando. Prefira vendedores que especificam 'Panini Original'.",
  },
  {
    question: "Qual é o preço do álbum completo em diferentes versões?",
    answer:
      "Brochura: R$24,90 | Capa Dura Padrão: R$74,90 | Capa Dura Prateada: R$79,90 | Capa Dura Dourada: R$79,90. O álbum em capa dura é mais durável e procurado por colecionadores.",
  },
  {
    question: "Existe promoção de figurinhas em alguma época do ano?",
    answer:
      "Sim! Geralmente há promoções em datas comemorativas (Dia do Consumidor, Black Friday, Natal). O McDonald's frequentemente tem promoções sazonais. Acompanhe redes sociais oficiais da Panini.",
  },
  {
    question: "Posso comprar figurinhas internacionais direto da Panini?",
    answer:
      "Sim, a Panini tem e-commerce oficial em panini.com.br. Também é possível importar de sites internacionais, mas o frete é caro. Para o Brasil, é mais econômico comprar localmente.",
  },
];

const stores = [
  {
    name: "Bancas de Jornal",
    price: "R$7,00 por pacote",
    album: "R$24,90 (brochura)",
    pros: ["Encontra facilmente", "Preço oficial", "Sem frete"],
    cons: ["Estoque limitado", "Menos variedade"],
    icon: Store,
  },
  {
    name: "Supermercados",
    price: "R$7,00 por pacote",
    album: "R$24,90 (brochura)",
    pros: ["Bastante estoque", "Promoções frequentes", "Compra fácil"],
    cons: ["Nem todos têm", "Menos variedade de capas"],
    icon: Package,
  },
  {
    name: "McDonald's",
    price: "R$5,00 (McLanche Feliz)",
    album: "Não vende",
    pros: ["Menor preço", "Figurinhas exclusivas", "Promoção com combo"],
    cons: ["Limitado a 1 por compra", "Refeição obrigatória"],
    icon: Tag,
  },
  {
    name: "Mercado Livre",
    price: "R$6,50-8,00 por pacote",
    album: "R$23,00-80,00 (varia)",
    pros: ["Melhor preço em lote", "Variedade de vendedores", "Frete rápido"],
    cons: ["Risco de falsificação", "Esperar entrega"],
    icon: Smartphone,
  },
  {
    name: "Amazon",
    price: "R$7,50 por pacote",
    album: "R$24,90-79,90",
    pros: ["Entrega rápida", "Segurança de compra", "Devolução fácil"],
    cons: ["Preço mais alto", "Frete pode ser caro"],
    icon: Package,
  },
  {
    name: "Panini.com.br",
    price: "R$7,00 por pacote",
    album: "R$24,90-79,90",
    pros: ["Oficial da Panini", "Promoções exclusivas", "Maior variedade"],
    cons: ["Frete cobrado", "Entrega mais lenta"],
    icon: Store,
  },
];

const tips = [
  {
    title: "Compre em Lote",
    description:
      "Ao comprar 10+ pacotes de uma vez no Mercado Livre, vendedores oferecem descontos (até 15%). Ótimo para completar estoque de repetidas.",
  },
  {
    title: "Acompanhe Promoções",
    description:
      "Supermercados como Carrefour e Pão de Açúcar frequentemente oferecem 'Leve 3 Pague 2' ou descontos em dias específicos.",
  },
  {
    title: "Compre com Amigos",
    description:
      "Dividindo a compra, você consegue se beneficiar de descontos por quantidade e o frete fica mais vantajoso.",
  },
  {
    title: "Use Cupons de Desconto",
    description:
      "Mercado Livre e Amazon frequentemente oferecem cupons de 5-10% para primeira compra ou clientes recorrentes.",
  },
  {
    title: "Compare Frete",
    description:
      "No Mercado Livre, compare o frete entre vendedores. Às vezes frete grátis vale mais que 1-2 reais de desconto.",
  },
  {
    title: "Aproveite Datas Sazonais",
    description:
      "Black Friday, Dia do Consumidor e promoções sazonais oferecem 10-20% de desconto. Planeje suas compras para essas datas.",
  },
];

export default function OndeComprarFigurinhasCopa2026Page() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />

      <main className="relative">
        <JsonLd
          schema={generateCombinedSchema(
            "article",
            {
              headline:
                "Onde Comprar Figurinhas Copa 2026: Guia de Preços, Lojas Físicas e Online",
              description:
                "Guia completo comparando preços de figurinhas da Copa 2026 em diferentes lojas e plataformas.",
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
                  name: "Onde Comprar Figurinhas Copa 2026",
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
              <Badge variant="secondary">Guia de Compras</Badge>
              <Badge variant="outline">Comparação de Preços</Badge>
            </div>

            <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Onde Comprar Figurinhas da Copa 2026: Melhor Preço e Ofertas
            </h1>

            <p className="mb-8 text-xl text-gray-600">
              Descobrir onde comprar figurinhas da Copa do Mundo 2026 com melhor
              preço é essencial para economizar. Comparamos bancas, supermercados,
              Mercado Livre, Amazon, McDonald's e a loja oficial da Panini para
              ajudar você a encontrar a melhor oferta.
            </p>

            <div className="flex flex-wrap gap-3">
              <Link href="#comparacao">
                <Button size="lg">
                  Ver Comparação <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="#dicas">
                <Button variant="outline" size="lg">
                  Dicas de Economia
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Preço Oficial Section */}
        <section className="bg-gray-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-gray-900">
              Preços Oficiais da Panini - Copa 2026
            </h2>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Pacote de Figurinhas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold text-blue-600">R$7,00</p>
                  <p className="text-gray-600">7 figurinhas por pacote</p>
                  <p className="text-sm text-gray-500">= R$1,00 por figurinha</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Álbum Brochura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold text-blue-600">R$24,90</p>
                  <p className="text-gray-600">Versão básica</p>
                  <p className="text-sm text-gray-500">Mais econômico</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Álbum Capa Dura</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold text-blue-600">R$74,90</p>
                  <p className="text-gray-600">Versão padrão</p>
                  <p className="text-sm text-gray-500">Mais durável</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Álbum Capa Especial</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-3xl font-bold text-blue-600">R$79,90</p>
                  <p className="text-gray-600">Prateada ou Dourada</p>
                  <p className="text-sm text-gray-500">Colecionador</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Comparação de Lojas */}
        <section id="comparacao" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-12 text-3xl font-bold text-gray-900">
              Comparação: Onde Comprar Figurinhas Copa 2026
            </h2>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {stores.map((store, idx) => {
                const Icon = store.icon;
                return (
                  <Card key={idx} className="flex flex-col">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            <Icon className="h-5 w-5 text-blue-600" />
                            {store.name}
                          </CardTitle>
                        </div>
                      </div>
                      <CardDescription>
                        <div className="mt-2">
                          <p className="font-semibold text-gray-900">
                            {store.price}
                          </p>
                          <p className="text-xs text-gray-500">Pacote</p>
                        </div>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1 space-y-4">
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2">
                          ÁLBUM: {store.album}
                        </p>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-green-700 mb-2">
                          ✓ Vantagens
                        </h4>
                        <ul className="space-y-1">
                          {store.pros.map((pro, i) => (
                            <li key={i} className="text-xs text-gray-600">
                              • {pro}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-semibold text-red-700 mb-2">
                          ✗ Desvantagens
                        </h4>
                        <ul className="space-y-1">
                          {store.cons.map((con, i) => (
                            <li key={i} className="text-xs text-gray-600">
                              • {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Melhor Preço por Quantidade */}
        <section className="bg-blue-50 px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-8 text-3xl font-bold text-gray-900">
              Qual é o Melhor Preço por Quantidade?
            </h2>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    1-2 Pacotes (Compra Casual)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="font-semibold text-blue-600 mb-2">
                    🏆 MELHOR: Bancas ou Supermercados (R$7,00)
                  </p>
                  <p>
                    Nenhum frete adicional e acesso imediato. Preço oficial
                    Panini.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    3-5 Pacotes (Compra Pequena)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="font-semibold text-blue-600 mb-2">
                    🏆 MELHOR: Supermercado com Promoção (2x1 ou 3x2)
                  </p>
                  <p>
                    Procure por promoções em Carrefour, Pão de Açúcar ou
                    similar.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    10+ Pacotes (Compra em Lote)
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="font-semibold text-blue-600 mb-2">
                    🏆 MELHOR: Mercado Livre com Desconto (R$6,00-6,50)
                  </p>
                  <p>
                    Vendedores oferecem 10-15% de desconto em compras acima de
                    10 pacotes.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Quer Economia Máxima?
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-gray-600">
                  <p className="font-semibold text-blue-600 mb-2">
                    🏆 MELHOR: McDonald's (R$5,00 por pacote)
                  </p>
                  <p>
                    McLanche Feliz com figurinha exclusiva. Mas é limitado a 1
                    pacote por compra e você compra a refeição também.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Dicas de Economia */}
        <section id="dicas" className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-12 text-3xl font-bold text-gray-900">
              6 Dicas para Economizar ao Comprar Figurinhas
            </h2>

            <div className="space-y-4">
              {tips.map((tip, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-green-600" />
                      {tip.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="text-gray-600">
                    {tip.description}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Aviso Importante */}
        <section className="bg-yellow-50 border-l-4 border-yellow-400 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h3 className="text-lg font-bold text-yellow-900 mb-3">
              ⚠️ Cuidado com Falsificações
            </h3>
            <p className="text-yellow-700 mb-4">
              Existem falsificações de baixa qualidade circulando, especialmente
              no Mercado Livre. Sempre compre de vendedores com boa avaliação e
              que confirmem ser "Panini Original 100%".
            </p>
            <ul className="list-disc list-inside space-y-2 text-yellow-700">
              <li>Procure por certificação de originalidade</li>
              <li>Verifique fotos do produto com detalhes claros</li>
              <li>Leia avaliações de outros compradores</li>
              <li>Desconfie de preços muito abaixo do normal</li>
            </ul>
          </div>
        </section>

        {/* FAQs */}
        <section className="px-4 py-16 sm:px-6 lg:px-8">
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
        <section className="bg-gradient-to-r from-green-600 to-green-700 px-4 py-16 sm:px-6 lg:px-8 text-white">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold">
              Comece a Colecionar Agora!
            </h2>
            <p className="mb-8 text-lg text-green-100">
              Com as dicas de compra e economia, você conseguirá completar seu
              álbum da Copa 2026 de forma inteligente e econômica.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/como-completar-album-copa-2026-estrategias-trocas">
                <Button size="lg" variant="secondary">
                  Ver Estratégias de Troca
                </Button>
              </Link>
              <Link href="/blog">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-green-600">
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
