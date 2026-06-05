import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Star,
  Trophy,
  Sparkles,
  MapPin,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import {
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateFAQSchema,
  generateCombinedSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs } from "@/components/breadcrumbs";

export const metadata: Metadata = {
  title: "Álbum Copa do Mundo 2026 - Guia Completo | Figurinha Fácil",
  description:
    "Tudo sobre o álbum Panini Copa 2026: 980 figurinhas, preço, onde comprar, figurinhas raras e douradas. Guia completo para colecionadores.",
  keywords:
    "álbum copa 2026, figurinhas copa 2026, panini 2026, álbum copa do mundo 2026, figurinhas douradas, figurinhas raras copa 2026",
  openGraph: {
    title: "Álbum Copa do Mundo 2026 - Guia Completo | Figurinha Fácil",
    description:
      "Tudo sobre o álbum Panini Copa 2026: 980 figurinhas, preço, onde comprar e figurinhas raras.",
    type: "website",
    url: `${BASE_URL}/album-copa-2026`,
  },
};

export default function AlbumCopa2026Page() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Álbum Copa 2026" },
  ]);

  const webPageSchema = generateWebPageSchema({
    url: `${BASE_URL}/album-copa-2026`,
    name: "Álbum Copa do Mundo 2026 - Guia Completo",
    description:
      "Guia completo sobre o álbum Panini Copa 2026: características, preço, onde comprar, figurinhas douradas e raras.",
  });

  const faqSchema = generateFAQSchema([
    {
      question: "Quantas figurinhas tem o álbum Copa 2026?",
      answer: "O álbum Copa 2026 tem 980 figurinhas, sendo 68 especiais.",
    },
    {
      question: "Qual é o preço do álbum Copa 2026?",
      answer:
        "O álbum custa entre R$ 24,90 (brochura) e R$ 79,90 (edição especial). Cada envelope com 7 figurinhas custa R$ 7,00.",
    },
    {
      question: "Quando foi lançado o álbum Copa 2026?",
      answer: "O álbum Copa 2026 da Panini foi lançado no dia 30 de abril de 2026.",
    },
    {
      question: "Onde comprar álbum Copa 2026?",
      answer:
        "Você pode comprar em lotéricas da Caixa, bancas de jornal, lojas de revistas, Mercado Livre, Shopee e outras plataformas de e-commerce.",
    },
    {
      question: "Quanto custa cada figurinha?",
      answer:
        "Cada envelope com 7 figurinhas custa R$ 7,00, resultando em aproximadamente R$ 1,00 por figurinha.",
    },
  ]);

  const combinedSchema = generateCombinedSchema([
    webPageSchema,
    breadcrumbSchema,
    faqSchema,
  ]);

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/10 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <Breadcrumbs
              items={[{ label: "Álbum Copa do Mundo 2026" }]}
              className="mb-8"
            />

            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Álbum Copa do Mundo{" "}
                <span className="text-primary">2026: Guia Completo</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Descubra tudo sobre o maior álbum de figurinhas da história da
                Copa do Mundo, com 980 figurinhas, 68 especiais e figurinhas
                douradas exclusivas. Saiba onde comprar, preços e como coletar
                todas as figurinhas.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Sparkles className="h-4 w-4 mr-2" />
                  980 figurinhas
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-2 px-4 text-yellow-600 border-yellow-600"
                >
                  <Star className="h-4 w-4 mr-2 fill-yellow-600" />
                  68 especiais
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-2 px-4 text-blue-600 border-blue-600"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Lançamento: 30/04/2026
                </Badge>
              </div>

              <Button size="lg" asChild>
                <Link href="/figurinhas">
                  Ver todas as 980 figurinhas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-primary mb-2">980</div>
                <p className="text-muted-foreground">Figurinhas totais</p>
              </div>
              <div className="bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-yellow-600 mb-2">68</div>
                <p className="text-muted-foreground">Figurinhas especiais</p>
              </div>
              <div className="bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-blue-600 mb-2">48</div>
                <p className="text-muted-foreground">Países participantes</p>
              </div>
              <div className="bg-background rounded-lg p-6 border">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  11M
                </div>
                <p className="text-muted-foreground">
                  Figurinhas/dia produzidas
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* História e Context */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                História e Recordes do Álbum Copa 2026
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                O álbum da Copa do Mundo 2026 da Panini é historicamente o maior
                já produzido, com 980 figurinhas no total. Este é um aumento
                significativo em relação às edições anteriores, refletindo a
                expansão da Copa para 48 seleções (ao invés das tradicionais 32).
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                Lançado no dia <strong>30 de abril de 2026</strong>, o álbum foi
                distribuído em bancas de jornal, lotéricas da Caixa, e
                plataformas de e-commerce em todo o Brasil. A produção é
                impressionante: <strong>11 milhões de figurinhas são produzidas
                diariamente</strong>, destacando a demanda colossal por este
                álbum.
              </p>
            </div>

            {/* Características Principais */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Características Principais
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Total de Figurinhas</h3>
                  <p className="text-muted-foreground">
                    980 figurinhas divididas entre as 48 seleções que participam
                    da Copa 2026, incluindo figurinhas especiais de destaque.
                  </p>
                </div>
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Figurinhas Douradas</h3>
                  <p className="text-muted-foreground">
                    O álbum conta com figurinhas douradas exclusivas e raras,
                    destacando os melhores jogadores da competição. Estas são
                    as figurinhas mais procuradas pelos colecionadores.
                  </p>
                </div>
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Figurinhas Especiais</h3>
                  <p className="text-muted-foreground">
                    68 figurinhas especiais com designs únicos, incluindo
                    figurinhas de lendas do futebol e ícones históricos.
                  </p>
                </div>
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Edições Disponíveis</h3>
                  <p className="text-muted-foreground">
                    Edição brochura (R$ 24,90) com capa simples e edição especial
                    hardcover (R$ 79,90) com capa dura luxuosa.
                  </p>
                </div>
              </div>
            </div>

            {/* Preços */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Preços e Quanto Custa Completar
              </h2>
              <div className="overflow-x-auto mb-6">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="py-3 px-4 font-bold">Produto</th>
                      <th className="py-3 px-4 font-bold">Preço</th>
                      <th className="py-3 px-4 font-bold">Descrição</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">Álbum Brochura</td>
                      <td className="py-3 px-4 font-bold">R$ 24,90</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Capa simples, ideal para uso diário
                      </td>
                    </tr>
                    <tr className="border-b hover:bg-muted/50">
                      <td className="py-3 px-4">Álbum Hardcover</td>
                      <td className="py-3 px-4 font-bold">R$ 79,90</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Edição especial com capa dura
                      </td>
                    </tr>
                    <tr className="hover:bg-muted/50">
                      <td className="py-3 px-4">Envelope (7 figurinhas)</td>
                      <td className="py-3 px-4 font-bold">R$ 7,00</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        Aproximadamente R$ 1,00 por figurinha
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="bg-[#f0ebe0]/70 p-6 rounded-lg">
                <h3 className="font-bold mb-3 text-lg">Custo total estimado</h3>
                <p className="text-muted-foreground mb-2">
                  Para completar as 980 figurinhas, considerando-se repetições
                  inevitáveis e figurinhas raras:
                </p>
                <p className="text-2xl font-bold text-primary">
                  Entre R$ 700 e R$ 1.500
                </p>
                <p className="text-sm text-muted-foreground mt-3">
                  O custo varia dependendo de sua sorte ao abrir envelopes e da
                  disposição para trocar figurinhas repetidas com outros
                  colecionadores.
                </p>
              </div>
            </div>

            {/* Onde Comprar */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Onde Comprar Álbum e Figurinhas Copa 2026
              </h2>
              <div className="space-y-4">
                <div className="flex gap-4 p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <MapPin className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Lotéricas Caixa</h3>
                    <p className="text-muted-foreground">
                      Distribuição oficial da Caixa Econômica Federal desde 30
                      de abril de 2026.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <ShoppingCart className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Bancas de Jornal</h3>
                    <p className="text-muted-foreground">
                      As tradicionais bancas de jornal distribuem álbuns e
                      envelopes. Procure a mais próxima de sua casa.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <TrendingUp className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Mercado Livre</h3>
                    <p className="text-muted-foreground">
                      Vendedores particulares e lojas oficiais vendem álbuns,
                      envelopes e figurinhas individuais com frete rápido.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <Users className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold mb-1">Shopee e Outras Plataformas</h3>
                    <p className="text-muted-foreground">
                      Shopee, Amazon e outras plataformas de e-commerce também
                      disponibilizam produtos do álbum Copa 2026.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dicas para Colecionadores */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Dicas para Colecionadores
              </h2>
              <div className="space-y-4">
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="font-bold mb-2">Economize com Trocas</h3>
                  <p className="text-muted-foreground">
                    A estratégia mais inteligente é trocar figurinhas repetidas
                    com outros colecionadores. Isto pode reduzir o custo total
                    em até 40-50%.
                  </p>
                </div>
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="font-bold mb-2">Procure por Figurinhas Raras</h3>
                  <p className="text-muted-foreground">
                    As figurinhas douradas e especiais são as mais difíceis de
                    encontrar. Participar de comunidades de trocas ajuda a
                    localizar colecionadores que têm o que você precisa.
                  </p>
                </div>
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="font-bold mb-2">Use Aplicativos de Troca</h3>
                  <p className="text-muted-foreground">
                    Plataformas como Figurinha Fácil conectam colecionadores e
                    facilitam as trocas, economizando tempo e dinheiro.
                  </p>
                </div>
                <div className="p-4 bg-[#f0ebe0]/70 rounded-lg">
                  <h3 className="font-bold mb-2">Organize sua Coleção</h3>
                  <p className="text-muted-foreground">
                    Mantenha um registro de quais figurinhas você tem e quais
                    faltam. Isso facilita identificar o que procurar na próxima
                    compra.
                  </p>
                </div>
              </div>
            </div>

            {/* FAQ */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Quantas figurinhas tem o álbum Copa 2026?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    O álbum Copa 2026 tem 980 figurinhas, sendo 68 delas
                    especiais. Isto representa um aumento significativo em
                    relação às edições anteriores.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Qual é o preço do álbum?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    O álbum custa R$ 24,90 (brochura) ou R$ 79,90 (hardcover
                    especial). Cada envelope com 7 figurinhas custa R$ 7,00.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Quando foi lançado?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    O álbum Copa 2026 foi lançado no dia 30 de abril de 2026
                    pela Panini, em distribuição oficial pela Caixa Econômica
                    Federal.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Quanto custa completar o álbum?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    O custo estimado é entre R$ 700 e R$ 1.500, dependendo de
                    sua sorte, repetições e disposição para trocar figurinhas
                    com outros colecionadores.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Existem figurinhas raras ou especiais?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    Sim! O álbum tem 68 figurinhas especiais e figurinhas
                    douradas exclusivas. Estas são as mais procuradas pelos
                    colecionadores e mais difíceis de encontrar.
                  </p>
                </details>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold mb-6">
              Comece a Coletar Hoje Mesmo
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Explore todas as 980 figurinhas do álbum Copa 2026, encontre as
              figurinhas que faltam e conecte-se com outros colecionadores para
              trocar.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/figurinhas">
                  Ver Todas as Figurinhas
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/sign-up">Criar Conta Grátis</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
