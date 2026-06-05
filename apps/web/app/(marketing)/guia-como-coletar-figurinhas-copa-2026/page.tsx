import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Users,
  TrendingUp,
  Zap,
  Target,
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
  title:
    "Guia Completo: Como Coletar Figurinhas da Copa 2026 | Estratégias e Dicas",
  description:
    "Descubra as melhores estratégias para coletar figurinhas da Copa 2026 da Panini. Dicas para encontrar raras, economizar dinheiro e completar o álbum com sucesso.",
  keywords:
    "como coletar figurinhas Copa 2026, estratégia figurinhas, figurinhas raras Copa, completar álbum Copa 2026, dicas coleta figurinhas",
  openGraph: {
    title:
      "Guia Completo: Como Coletar Figurinhas da Copa 2026 | Estratégias e Dicas",
    description:
      "Descubra as melhores estratégias para coletar figurinhas da Copa 2026 com economia e eficiência.",
    type: "website",
    url: `${BASE_URL}/guia-como-coletar-figurinhas-copa-2026`,
  },
};

export default function GuiaColetarFigurinhasPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Guia de Coleta" },
  ]);

  const webPageSchema = generateWebPageSchema({
    url: `${BASE_URL}/guia-como-coletar-figurinhas-copa-2026`,
    name: "Guia Completo: Como Coletar Figurinhas da Copa 2026",
    description:
      "Estratégias, dicas e técnicas para coletar figurinhas da Copa 2026 com eficiência e economia.",
  });

  const faqSchema = generateFAQSchema([
    {
      question: "Qual é a melhor estratégia para coletar figurinhas rapidamente?",
      answer:
        "A melhor estratégia é combinar a compra de envelopes com trocas organizadas. Participar de comunidades de colecionadores permite trocar figurinhas repetidas e acelerar a coleta sem gastar muito.",
    },
    {
      question: "Como encontrar figurinhas raras da Copa 2026?",
      answer:
        "Figurinhas raras, como as lendas e figurinhas douradas, aparecem em proporções muito menores. Use plataformas de troca especializadas, comunidades online, ou negocie com outros colecionadores que têm o que você precisa.",
    },
    {
      question: "Quanto tempo leva para completar o álbum?",
      answer:
        "Depende de quanto você investe e de sua estratégia. Com compras regulares e trocas ativas, a maioria dos colecionadores completa o álbum em 4-6 meses durante a Copa.",
    },
    {
      question:
        "Qual é o melhor lugar para comprar figurinhas da Copa 2026 online?",
      answer:
        "Mercado Livre, Shopee, Amazon e o site oficial da Panini oferecem boas opções com frete. Você também pode comprar em lotéricas, bancas de jornal e lojas de conveniência.",
    },
    {
      question:
        "Como economizar dinheiro ao colecionar figurinhas da Copa 2026?",
      answer:
        "As principais estratégias são: fazer trocas com outros colecionadores, comprar envelopes em promoção, juntar-se a grupos de coleta e negociar para conseguir figurinhas repetidas por um preço menor.",
    },
    {
      question: "Existem figurinhas holográficas ou especiais na Copa 2026?",
      answer:
        "Sim! O álbum inclui 68 figurinhas especiais, figurinhas douradas (Legends) com até 4 níveis de raridade (bronze, prata, ouro e diamante), além de versões holográficas com diferentes cores de borda.",
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
              items={[{ label: "Guia de Coleta de Figurinhas Copa 2026" }]}
              className="mb-8"
            />

            <div className="max-w-4xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Como Coletar Figurinhas da Copa{" "}
                <span className="text-primary">2026: Guia Estratégico</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Descubra as melhores estratégias, técnicas de coleta e dicas de
                economia para completar o álbum Panini Copa 2026 com sucesso.
                Aprenda como encontrar figurinhas raras, fazer trocas
                inteligentes e maximizar seu investimento em figurinhas.
              </p>

              <div className="flex flex-wrap gap-4 mb-8">
                <Badge variant="secondary" className="text-sm py-2 px-4">
                  <Target className="h-4 w-4 mr-2" />
                  Estratégia completa
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-2 px-4 text-green-600 border-green-600"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Economize até 50%
                </Badge>
                <Badge
                  variant="outline"
                  className="text-sm py-2 px-4 text-blue-600 border-blue-600"
                >
                  <Zap className="h-4 w-4 mr-2" />
                  Dicas práticas
                </Badge>
              </div>

              <Button size="lg" asChild>
                <Link href="/figurinhas">
                  Começar a Coleta Agora
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 max-w-4xl">
            {/* Introdução */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Entenda o Desafio da Coleta
              </h2>
              <p className="text-lg text-muted-foreground mb-4">
                Com 980 figurinhas distribuídas em 48 seleções, o álbum da Copa
                2026 é o maior já produzido pela Panini. Para completá-lo, você
                enfrentará o desafio das repetições inevitáveis — quanto mais
                próximo estiver de completar, mais difícil será encontrar as
                figurinhas que faltam.
              </p>
              <p className="text-lg text-muted-foreground mb-4">
                A probabilidade matemática sugere que você precisará comprar
                mais de 1.000 envelopes para garantir todas as figurinhas,
                custando mais de <strong>R$ 7.000</strong> se comprar
                individualmente. Mas com estratégia inteligente, é possível
                reduzir esse custo em até 50%.
              </p>
            </div>

            {/* 5 Pilares */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                5 Pilares da Coleta Inteligente
              </h2>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex gap-4 items-start">
                    <Lightbulb className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        1. Planejamento Financeiro
                      </h3>
                      <p className="text-muted-foreground">
                        Estabeleça um orçamento mensal e cumpra-o. Em vez de
                        gastar tudo de uma vez, distribua suas compras ao longo
                        de 4-6 meses. Isso reduz custos e aumenta as chances de
                        encontrar repetidas para trocar.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex gap-4 items-start">
                    <Users className="h-6 w-4 text-green-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        2. Comunidade de Trocas
                      </h3>
                      <p className="text-muted-foreground">
                        Junte-se a grupos de colecionadores online ou locais.
                        Trocar figurinhas repetidas é a forma mais econômica de
                        completar o álbum. Cada troca bem feita economiza R$ 7
                        em uma compra de envelope.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex gap-4 items-start">
                    <Target className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        3. Foco em Figurinhas Raras
                      </h3>
                      <p className="text-muted-foreground">
                        Não gaste dinheiro tentando coletar figurinhas comuns.
                        Foque nas raras: lendas, douradas e especiais. As comuns
                        virão naturalmente com as compras de envelope.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                  <div className="flex gap-4 items-start">
                    <TrendingUp className="h-6 w-6 text-orange-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        4. Aproveite Promoções
                      </h3>
                      <p className="text-muted-foreground">
                        Fique atento a descontos em plataformas de e-commerce,
                        promoções em supermercados (Caixa, Carrefour) e cupons
                        promocionais. Economize R$ 1-2 por envelope.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-red-50 to-red-100 dark:from-red-950 dark:to-red-900 p-6 rounded-lg border border-red-200 dark:border-red-800">
                  <div className="flex gap-4 items-start">
                    <Zap className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        5. Ferramentas de Rastreamento
                      </h3>
                      <p className="text-muted-foreground">
                        Use aplicativos como Figurinha Fácil, planilhas ou
                        anotações para rastrear quais figurinhas você tem,
                        quais faltam e quais estão à venda. Isso evita compras
                        desnecessárias.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Estratégias Detalhadas */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Estratégias Comprovadas para Economizar
              </h2>

              <div className="space-y-6">
                <div className="p-6 bg-muted/50 rounded-lg border-l-4 border-primary">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Estratégia 1: Compra em Grupo
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Negocie com amigos, família ou colecionadores para compras
                    em lote. Muitas lojas oferecem descontos a partir de 10
                    envelopes comprados. Uma redução de 10% significa
                    economizar R$ 70 em 100 envelopes.
                  </p>
                  <div className="bg-background p-3 rounded text-sm text-muted-foreground">
                    <strong>Economia estimada:</strong> R$ 100-200 no álbum
                    completo
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border-l-4 border-green-600">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Estratégia 2: Trocas Estratégicas
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Estabeleça uma proporção de trocas: 5 figurinhas repetidas
                    por 1 que você precisa. Isso é mais justo que trocar 1x1 e
                    acelera sua coleta. Use plataformas como Figurinha Fácil
                    para encontrar parceiros de troca.
                  </p>
                  <div className="bg-background p-3 rounded text-sm text-muted-foreground">
                    <strong>Economia estimada:</strong> R$ 2.500-3.500 (50% de
                    redução)
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border-l-4 border-blue-600">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Estratégia 3: Focar nas Comuns Primeiro
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Nos primeiros meses, compre envelopes normalmente. As
                    figurinhas comuns (não-raras) completarão naturalmente. Só
                    depois, foque em raras através de trocas ou compra direta.
                  </p>
                  <div className="bg-background p-3 rounded text-sm text-muted-foreground">
                    <strong>Dica:</strong> 80% do álbum é preenchido com 20% do
                    investimento total
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border-l-4 border-yellow-600">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Estratégia 4: Compre Figurinhas Individuais Apenas no Final
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Evite comprar figurinhas individuais caro (às vezes custam
                    R$ 15-50 cada). Foque em trocas. Compre figurinhas avulsas
                    apenas nas últimas 10-20 figurinhas que faltam.
                  </p>
                  <div className="bg-background p-3 rounded text-sm text-muted-foreground">
                    <strong>Economia estimada:</strong> R$ 500-1.000 evitando
                    compras avulsas desnecessárias
                  </div>
                </div>

                <div className="p-6 bg-muted/50 rounded-lg border-l-4 border-red-600">
                  <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    Estratégia 5: Acompanhe Promoções Sazonais
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Supermercados costumam fazer promoções em datas festivas
                    (fim de semana, feriados prolongados). Acompanhe redes como
                    Carrefour, Walmart e Mercado Livre que frequentemente
                    oferecem descontos.
                  </p>
                  <div className="bg-background p-3 rounded text-sm text-muted-foreground">
                    <strong>Economia estimada:</strong> R$ 200-400 ao longo de
                    6 meses
                  </div>
                </div>
              </div>
            </div>

            {/* Tipos de Figurinhas */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Entenda os Diferentes Tipos de Figurinhas
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h3 className="font-bold mb-2">
                    🎯 Figurinhas Comuns (Base)
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Representam aproximadamente 80% do álbum. Aparecem em quase
                    todo envelope comprado. Não são raras e completam
                    naturalmente com compras regulares. Não gaste dinheiro
                    focando especificamente nelas.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-bold mb-2">
                    ⭐ Figurinhas Especiais (68 totais)
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Designs únicos com efeitos especiais. Aparecem com maior
                    frequência que as lendas, mas menos que as comuns. Excelente
                    alvo para trocas nos estágios intermediários da coleta.
                  </p>
                </div>

                <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h3 className="font-bold mb-2">
                    👑 Figurinhas Lendas (Legends)
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Ícones históricos do futebol com 4 níveis de raridade:
                    Bronze, Prata, Ouro e Diamante. As versões Ouro aparecem
                    em ~1 a cada 500 envelopes. Diamante em ~1 a cada 1.900
                    envelopes. Passe para trocas agressivas para conseguir estas.
                  </p>
                </div>

                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h3 className="font-bold mb-2">
                    💛 Figurinhas Douradas (Rare)
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Versões com borda colorida das figurinhas comuns. Existem
                    cores de borda (branco, laranja, azul, vermelho, roxo, verde,
                    preto). A raridade aumenta conforme a cor. Negocie pelo
                    menos as raras (roxo, verde, preto) com outros colecionadores.
                  </p>
                </div>
              </div>
            </div>

            {/* Calendário de Coleta */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Calendário de Coleta: Cronograma de 6 Meses
              </h2>

              <div className="space-y-4">
                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary w-16">
                    Mês 1
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Fase de Lançamento</h3>
                    <p className="text-muted-foreground text-sm">
                      Comece com compras regulares. Seu objetivo: completar 40%
                      do álbum. Invista R$ 150-200 em envelopes e comece a
                      conectar com outros colecionadores.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary w-16">
                    Mês 2-3
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Fase de Aceleração</h3>
                    <p className="text-muted-foreground text-sm">
                      Aumente trocas com outros colecionadores. Objetivo:
                      atingir 70% do álbum. Reduza gastos, foque em trocas e
                      promoções. Mantenha R$ 100-150/mês.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary w-16">
                    Mês 4-5
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Fase de Recta Final</h3>
                    <p className="text-muted-foreground text-sm">
                      85-90% do álbum está completo. Foque apenas nas figurinhas
                      faltantes através de trocas agressivas. Reduza compras de
                      envelope. Negocie figurinhas raras. Gaste apenas R$ 50-100.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary w-16">
                    Mês 6
                  </div>
                  <div>
                    <h3 className="font-bold mb-1">Fase de Conclusão</h3>
                    <p className="text-muted-foreground text-sm">
                      Últimas 10-20 figurinhas. Compre individuais apenas para
                      as que não conseguir trocar. Objetivo: terminar antes do
                      final da Copa. Gasto final: R$ 100-200.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <h3 className="font-bold mb-2">Investimento Total Estimado</h3>
                <p className="text-muted-foreground mb-3">
                  Com este plano, seu investimento total seria:
                </p>
                <div className="flex justify-between items-center p-3 bg-background rounded">
                  <span className="font-bold">Sem trocas (modo hardcore):</span>
                  <span className="text-lg font-bold">R$ 7.000+</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded mt-2">
                  <span className="font-bold">Com trocas eficientes:</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ 3.500-4.500
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-background rounded mt-2">
                  <span className="font-bold">Com trocas + promoções:</span>
                  <span className="text-lg font-bold text-green-600">
                    R$ 2.500-3.500
                  </span>
                </div>
              </div>
            </div>

            {/* Plataformas Recomendadas */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                Plataformas Recomendadas para Trocas e Compras
              </h2>

              <div className="space-y-4">
                <div className="p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-bold mb-2 text-lg">
                    📱 Figurinha Fácil (App)
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Plataforma especializada em trocas de figurinhas. Conecta
                    colecionadores locais e permite negociar figurinhas
                    específicas. Ideal para economizar com trocas.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Melhor para trocas
                  </Badge>
                </div>

                <div className="p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-bold mb-2 text-lg">
                    🛒 Mercado Livre
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Maior marketplace do Brasil. Oferece envelopes, álbuns
                    completos e figurinhas avulsas. Compare preços entre
                    vendedores e aproveite cupons promocionais frequentes.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Melhor para variedade de preços
                  </Badge>
                </div>

                <div className="p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-bold mb-2 text-lg">
                    🏪 Carrefour e Mercado Pão de Açúcar
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Supermercados frequentemente oferecem descontos e promoções
                    em envelopes. Acompanhe seus folhetos para encontrar as
                    melhores ofertas em épocas festivas.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Melhor para promoções
                  </Badge>
                </div>

                <div className="p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-bold mb-2 text-lg">
                    🎁 Coca-Cola (Promoção Oficial)
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    Coca-Cola é parceira oficial. Compre garrafas em promoção e
                    ganhe códigos para coletar figurinhas digitais ou descontos
                    em envelopes físicos.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Melhor para promoções
                  </Badge>
                </div>

                <div className="p-6 bg-background border rounded-lg hover:shadow-md transition-shadow">
                  <h3 className="font-bold mb-2 text-lg">
                    💻 Site Oficial Panini
                  </h3>
                  <p className="text-muted-foreground mb-3">
                    A Panini vende diretamente com preços tabelados. Acesse
                    panini.com.br para comprar álbuns e envelopes com segurança
                    garantida.
                  </p>
                  <Badge variant="outline" className="text-xs">
                    Melhor para segurança
                  </Badge>
                </div>
              </div>
            </div>

            {/* Erros Comuns */}
            <div className="mb-12">
              <h2 className="text-3xl md:text-4xl font-headline font-bold mb-6">
                7 Erros Comuns que Colecionadores Cometem
              </h2>

              <div className="space-y-4">
                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">
                      ❌ Erro 1: Comprar Tudo de Uma Vez
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Não invista todo seu dinheiro no início. Espalhe ao longo
                      de 6 meses para melhor aproveitamento e oportunidades de
                      trocas.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">
                      ❌ Erro 2: Ignorar Plataformas de Troca
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Plataformas como Figurinha Fácil podem reduzir seu custo
                      em até 50%. Não desperdice oportunidades de trocar
                      figurinhas repetidas.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">
                      ❌ Erro 3: Perder Tempo Com Figurinhas Raras Cedo
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      As 20% raras tomarão 80% do seu tempo e dinheiro. Foque
                      nelas apenas no final da coleta, quando 90% estiver
                      completo.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">
                      ❌ Erro 4: Comprar Figurinhas Individuais Caro
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Figurinhas avulsas custam R$ 15-50. Use trocas. Compre
                      avulsas apenas para as 5-10 últimas figurinhas que não
                      conseguir trocar.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">
                      ❌ Erro 5: Não Rastrear Suas Figurinhas
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Use um app ou planilha para rastrear o que tem e o que
                      falta. Evita compras de figurinhas que já possui e acelera
                      trocas.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">
                      ❌ Erro 6: Não Aproveitar Promoções
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Supermercados e e-commerce frequentemente oferecem
                      descontos. Economizar R$ 1-2 por envelope significa R$
                      100-300 em economia total.
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800 flex gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-bold mb-1">
                      ❌ Erro 7: Coletar Sozinho(a)
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      Comunidades ajudam. Junte-se a grupos de amigos,
                      colecionadores locais ou online. Isso torna a coleta mais
                      divertida e econômica.
                    </p>
                  </div>
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
                    Qual é a melhor estratégia para coletar figurinhas
                    rapidamente?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    A combinação de compras regulares + trocas estratégicas.
                    Compre envelopes mensalmente e troque figurinhas repetidas
                    com outros colecionadores. Isso acelera a coleta e reduz
                    custos significativamente.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Como encontrar figurinhas raras da Copa 2026?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    Figurinhas raras aparecem em proporções menores. Melhores
                    estratégias: (1) Participar ativamente em comunidades de
                    trocas, (2) Usar plataformas especializadas como Figurinha
                    Fácil, (3) Negociar com colecionadores que têm o que você
                    precisa, (4) Comprar em lotes específicos de marcadores
                    conhecidos.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Quanto tempo leva para completar o álbum?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    Depende do investimento financeiro e dedicação às trocas.
                    Com compras regulares (R$ 150-200/mês) + trocas ativas, a
                    maioria dos colecionadores completa o álbum em 4-6 meses
                    durante a Copa. Sem trocas, pode levar muito mais tempo ou
                    ficar impossível.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Como economizar dinheiro ao colecionar?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    Principais formas de economizar: (1) Fazer trocas
                    estratégicas (economiza ~50%), (2) Comprar envelopes em
                    promoção e em grupo, (3) Focar nas figurinhas comuns
                    primeiro, (4) Usar apps de troca para conectar-se com
                    colecionadores, (5) Acompanhar promoções de supermercados e
                    e-commerce, (6) Comprar figurinhas avulsas apenas no final.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Qual é o melhor lugar para comprar figurinhas da Copa 2026
                    online?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    Para envelopes: Mercado Livre (maior variedade), Shopee,
                    Amazon. Para trocas: Figurinha Fácil (especializada). Para
                    promoções: Acompanhe supermercados (Carrefour, Walmart) e
                    cupons Coca-Cola. Para segurança: Site oficial da Panini.
                  </p>
                </details>

                <details className="group p-4 bg-muted/50 rounded-lg border cursor-pointer hover:bg-muted/70 transition-colors">
                  <summary className="font-bold flex justify-between items-center">
                    Existem figurinhas holográficas ou especiais?
                    <span className="group-open:rotate-180 transition-transform">
                      ▼
                    </span>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    Sim! O álbum inclui: (1) 68 figurinhas especiais com designs
                    únicos, (2) Figurinhas Legends (ícones históricos) com até 4
                    níveis de raridade, (3) Versões douradas/holográficas com
                    bordas coloridas (branco, laranja, azul, vermelho, roxo,
                    verde, preto), onde preto é a mais rara.
                  </p>
                </details>
              </div>
            </div>

            {/* Resumo */}
            <div className="p-8 bg-gradient-to-r from-primary/10 to-primary/5 rounded-lg border">
              <h2 className="text-2xl font-bold mb-4">Resumo: Seu Plano de Ação</h2>
              <ol className="space-y-3 text-muted-foreground">
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">1.</span>
                  <span>
                    <strong>Defina um orçamento:</strong> R$ 500-750 para 6
                    meses (mais barato que qualquer outra estratégia)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">2.</span>
                  <span>
                    <strong>Comece a comprar:</strong> Adquira 30-50 envelopes
                    no primeiro mês
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">3.</span>
                  <span>
                    <strong>Conecte-se:</strong> Junte-se a comunidades de
                    trocas (Figurinha Fácil, grupos locais)
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">4.</span>
                  <span>
                    <strong>Troque ativamente:</strong> Negocie figurinhas
                    repetidas com outros colecionadores
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">5.</span>
                  <span>
                    <strong>Rastreie:</strong> Use um app ou planilha para
                    acompanhar progresso
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">6.</span>
                  <span>
                    <strong>Aproveite promoções:</strong> Fique atento a
                    descontos em supermercados e e-commerce
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="font-bold text-primary flex-shrink-0">7.</span>
                  <span>
                    <strong>Finalize:</strong> Compre as últimas 5-10
                    figurinhas avulsas necessárias
                  </span>
                </li>
              </ol>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-gradient-to-r from-primary/10 to-primary/5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-headline font-bold mb-6">
              Comece Sua Coleta Inteligente Agora
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Use o Figurinha Fácil para conectar com outros colecionadores,
              rastrear suas figurinhas e fazer trocas estratégicas. Economize
              até 50% completando o álbum da Copa 2026.
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
