import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Lightbulb,
  Trophy,
  Users,
  Zap,
  Star,
  Target,
  TrendingUp,
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

const ARTICLE_PATH = "/como-colecionar-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-04-30T00:00:00Z";
const MODIFIED_AT = "2026-04-30T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Colecionar o Álbum da Copa 2026: Guia Completo para Colecionadores",
  description:
    "Guia completo sobre como colecionar o álbum da Copa do Mundo 2026. Aprenda dicas de colecionadores experientes, identifique figurinhas raras, estratégias para economizar com trocas e como completar seu álbum da Panini.",
  keywords: [
    "como colecionar album copa 2026",
    "dicas colecionadores copa 2026",
    "figurinhas raras copa 2026",
    "estratégia completar album",
    "trocar figurinhas copa",
    "coleção copa mundo 2026",
    "álbum panini 2026",
    "figurinhas especiais copa",
    "como organizar figurinhas",
    "dicas de colecionar",
  ],
  openGraph: {
    title:
      "Como Colecionar o Álbum da Copa 2026: Guia Completo para Colecionadores",
    description:
      "Descubra como colecionar o álbum Copa 2026 com dicas de especialistas, estratégias de troca e informações sobre figurinhas raras e especiais.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa 2026",
      "Álbum de figurinhas",
      "Colecionadores",
      "Guia",
      "Panini",
      "Dicas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como Colecionar o Álbum da Copa 2026: Guia Completo",
    description:
      "Aprenda com especialistas como colecionar e completar o álbum Copa 2026 da Panini.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question:
      "Qual é a melhor estratégia para colecionar o álbum da Copa 2026?",
    answer:
      "A estratégia mais eficaz combina planejamento e trocas. Comece comprando envelopes regularmente, organize suas figurinhas por seleção e mova, crie uma lista de faltantes e se conecte com outros colecionadores. Estudos mostram que colecionadores que usam o app Figurinha Fácil para encontrar parceiros de troca economizam até 60% comparado a comprar apenas envelopes.",
  },
  {
    question: "Quantas figurinhas tem o álbum da Copa 2026?",
    answer:
      "O álbum oficial da Copa do Mundo 2026 da Panini possui 980 figurinhas no total, distribuídas entre as 48 seleções participantes. Dessas, 68 são figurinhas especiais em papel metalizado com diferentes níveis de raridade (base, bronze, prata, ouro).",
  },
  {
    question: "Como identificar figurinhas raras da Copa 2026?",
    answer:
      "As figurinhas raras da Copa 2026 são os 68 cromos especiais em papel metalizado com acabamento brilhante. Elas vêm distribuídas em diferentes camadas de raridade: Base (comum), Bronze (acobreada), Prata (prateada), Ouro (dourada) e variações secretas. Você pode identificá-las pelo brilho metalizado característico e pelo número no verso com a denominação da raridade.",
  },
  {
    question:
      "Qual é o melhor lugar para trocar figurinhas da Copa 2026?",
    answer:
      "Aplicativos e plataformas especializadas como Figurinha Fácil permitem você conectar com colecionadores próximos para trocas presenciais seguras. Alternativas incluem grupos de coleciona dores em sua cidade, eventos de colecionismo, lojas de figurinhas e comunidades online. Trocas presenciais são preferíveis pois permitem verificar a qualidade das figurinhas antes.",
  },
  {
    question: "Como proteger minhas figurinhas do álbum Copa 2026?",
    answer:
      "Use mangas protetoras (sleeves) específicas para figurinhas, armazene em caixa de acrílico ou protetor de álbum adequado, mantenha longe de umidade, luz solar direta e temperaturas extremas. Para figurinhas raras e especiais, considere usar top loaders individuais. Limpe as mãos antes de manusear figurinhas premium e evite dobrar ou amassar.",
  },
  {
    question:
      "Quanto custa completar o álbum da Copa 2026 com trocas?",
    answer:
      "Com uma estratégia eficaz de trocas, o custo estimado para completar o álbum é entre R$ 1.500 a R$ 2.500, dependendo da sua sorte e da disposição de outros colecionadores em trocar. Sem trocas, o custo sobe para R$ 4.000 a R$ 7.000. A chave é começar cedo e estabelecer redes de troca fortes.",
  },
];

const RARE_CATEGORIES = [
  {
    name: "Base",
    description: "Figurinhas especiais base, metalizada mas sem cores extras",
    raridade: "Comum",
    icon: "📄",
  },
  {
    name: "Bronze",
    description: "Primeiro nível de raridade com acabamento acobreado",
    raridade: "Rara",
    icon: "🥉",
  },
  {
    name: "Prata",
    description: "Segundo nível de raridade com brilho prateado",
    raridade: "Muito Rara",
    icon: "🥈",
  },
  {
    name: "Ouro",
    description: "Terceiro nível de raridade com acabamento dourado",
    raridade: "Rarissíma",
    icon: "🥇",
  },
];

const COLLECTION_TIPS = [
  {
    icon: Target,
    title: "Comece Com Um Plano",
    description:
      "Defina seus objetivos: completar o álbum inteiro, colecionar apenas figurinhas especiais, ou focar em seleções específicas. Um plano claro ajuda a manter o foco.",
  },
  {
    icon: Users,
    title: "Organize Seus Contatos",
    description:
      "Crie uma rede de colecionadores confiáveis. Quanto mais parceiros de troca você tiver, maior será sua chance de completar o álbum rapidamente.",
  },
  {
    icon: Lightbulb,
    title: "Acompanhe Seu Progresso",
    description:
      "Mantenha uma lista atualizada de figurinhas faltantes. Organize por seleção para facilitar as trocas e visualizar seu progresso.",
  },
  {
    icon: TrendingUp,
    title: "Invista Em Épocas Certas",
    description:
      "Nos primeiros meses após o lançamento, os envelopes têm distribuição mais equilibrada. Evite comprar muito perto do final quando todos têm os mesmos comuns.",
  },
  {
    icon: Zap,
    title: "Diversifique Suas Compras",
    description:
      "Compre em diferentes lojas e momentos do dia. Cada lote de produção pode ter distribuições ligeiramente diferentes.",
  },
  {
    icon: Star,
    title: "Priorize Figurinhas Especiais",
    description:
      "As 68 figurinhas especiais metalizada são o diferencial. Negocie com mais intensidade por elas, pois agregam muito valor à coleção.",
  },
];

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline: metadata.title as string,
  description: metadata.description as string,
  url: ARTICLE_URL,
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

export default function ComoColetarCopa2026Page() {
  return (
    <>
      <JsonLd
        data={generateCombinedSchema([
          articleSchema,
          generateBreadcrumbSchema([
            { name: "Início", url: BASE_URL },
            {
              name: "Como Colecionar Álbum Copa 2026",
              url: ARTICLE_URL,
            },
          ]),
          generateFAQSchema(FAQS),
        ])}
      />

      <LandingHeader />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 via-background to-background py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <Badge className="mb-4" variant="secondary">
                Guia Completo de Coleciona dores
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Como Colecionar o Álbum da Copa do Mundo 2026
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-6">
                Aprenda as melhores estratégias, identifique figurinhas raras e
                economize até 60% completando seu álbum Panini da Copa 2026 com
                dicas de colecionadores experientes.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/album-copa-do-mundo-2026">
                  <Button size="lg">
                    Ver Todas as Figurinhas
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/custo-album-copa-2026">
                  <Button size="lg" variant="outline">
                    Calcular Custo Total
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      980
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Figurinhas totais no álbum
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      68
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Figurinhas especiais metalizada
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      48
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Seleções participantes
                    </p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">
                      60%
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Economia com trocas
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Collection Tips */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              6 Dicas Essenciais para Colecionar
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Estratégias práticas de colecionadores experientes que completaram
              álbuns anteriores com sucesso
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {COLLECTION_TIPS.map((tip, idx) => {
                const Icon = tip.icon;
                return (
                  <Card key={idx} className="hover:border-primary/50 transition">
                    <CardHeader>
                      <Icon className="w-8 h-8 text-primary mb-2" />
                      <CardTitle className="text-lg">{tip.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground text-sm">
                        {tip.description}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Figurinhas Especiais */}
        <section className="py-12 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Entenda as Figurinhas Especiais Raras
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              As 68 figurinhas metalizada da Copa 2026 vêm em diferentes níveis
              de raridade. Saiba como identificá-las e procurá-las
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {RARE_CATEGORIES.map((category, idx) => (
                <Card
                  key={idx}
                  className="overflow-hidden hover:border-primary/50 transition"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-3xl mb-2">{category.icon}</div>
                        <CardTitle>{category.name}</CardTitle>
                        <CardDescription>{category.description}</CardDescription>
                      </div>
                      <Badge>{category.raridade}</Badge>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>

            <Card className="mt-8 bg-primary/5 border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Dica Especial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  As figurinhas Ouro (dourada) são as mais raras e valiosas do
                  álbum. Se conseguir encontrá-las, guarde bem protegidas! Elas
                  agregam significativamente o valor da sua coleção.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
              Perguntas Frequentes
            </h2>
            <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
              Respostas para as dúvidas mais comuns de colecionadores
            </p>

            <div className="max-w-3xl mx-auto space-y-4">
              {FAQS.map((faq, idx) => (
                <Card key={idx}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm">
                      {faq.answer}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-12 md:py-20 bg-primary/5 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Encontre Parceiros de Troca Perto de Você
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Conecte-se com outros colecionadores na sua região e comece a
                trocar figurinhas para completar seu álbum Copa 2026 com menos
                gastos.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/album-copa-do-mundo-2026">
                    Explorar Figurinhas
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link href="/pontos">Encontrar Comunidade</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-12 md:py-16 border-t">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold mb-8">Artigos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="hover:border-primary/50 transition">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Álbum da Copa 2026
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Veja todas as 980 figurinhas do álbum oficial Panini da
                    Copa do Mundo 2026.
                  </p>
                  <Link href="/album-copa-do-mundo-2026">
                    <Button variant="link" className="p-0">
                      Ver Álbum <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition">
                <CardHeader>
                  <CardTitle className="text-lg">Custo Total</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Quanto custa completar o álbum? Veja estimativas de gastos
                    reais.
                  </p>
                  <Link href="/custo-album-copa-2026">
                    <Button variant="link" className="p-0">
                      Calcular Custo <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card className="hover:border-primary/50 transition">
                <CardHeader>
                  <CardTitle className="text-lg">
                    Encontre Figurinhas Raras
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Descubra quais são as figurinhas mais procuradas e raras da
                    Copa 2026.
                  </p>
                  <Link href="/raras">
                    <Button variant="link" className="p-0">
                      Ver Raras <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </>
  );
}
