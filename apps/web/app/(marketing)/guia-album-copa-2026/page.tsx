import type { Metadata } from "next";
import Link from "next/link";
import {
  BookOpen,
  DollarSign,
  Sparkles,
  Trophy,
  Users,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar,
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
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const GUIDE_PATH = "/guia-album-copa-2026";
const GUIDE_URL = `${BASE_URL}${GUIDE_PATH}`;
const PUBLISHED_AT = "2026-05-25T00:00:00Z";
const MODIFIED_AT = "2026-05-25T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Guia Completo do Álbum da Copa do Mundo 2026: Tudo Que Você Precisa Saber",
  description:
    "Tudo sobre o álbum da Copa 2026: como funciona, quantas figurinhas tem, preços, onde comprar, como completar, estratégias de troca e onde encontrar colecionadores perto de você.",
  keywords: [
    "guia album copa 2026",
    "como funciona album copa",
    "album da copa do mundo 2026",
    "informações completas copa 2026",
    "tudo sobre figurinhas copa 2026",
    "tutorial album copa 2026",
  ],
  openGraph: {
    title:
      "Guia Completo do Álbum Copa 2026: Figurinhas, Preços, Estratégias",
    description:
      "Tudo que você precisa saber para colecionar figurinhas da Copa do Mundo 2026. Informações, preços, estratégias e onde encontrar colecionadores.",
    url: GUIDE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guia Completo do Álbum Copa 2026",
    description:
      "Tudo sobre figurinhas, preços, estratégias e como completar o álbum da Copa 2026.",
  },
  alternates: {
    canonical: GUIDE_URL,
  },
};

const SECTIONS = [
  {
    id: "basico",
    title: "O Básico: O Que é o Álbum da Copa 2026?",
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    id: "especificacoes",
    title: "Especificações do Álbum",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    id: "precos",
    title: "Preços e Custos",
    icon: <DollarSign className="w-6 h-6" />,
  },
  {
    id: "estrategias",
    title: "Estratégias de Coleta",
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    id: "encontrar",
    title: "Onde Encontrar Trocadores",
    icon: <Users className="w-6 h-6" />,
  },
];

const ALBUM_SPECS = [
  {
    label: "Total de Figurinhas",
    value: "980",
    description: "Distribuídas em 112 páginas do álbum oficial",
  },
  {
    label: "Figurinhas Especiais",
    value: "68",
    description: "Hologramas, pratas, douradas e outras variações",
  },
  {
    label: "Seleções Participantes",
    value: "48",
    description: "A maior Copa da história com mais países",
  },
  {
    label: "Figurinhas por Pacote",
    value: "7",
    description: "Cada pacote custa R$ 7,00",
  },
];

const PRICING_BREAKDOWN = [
  {
    item: "Pacote de Figurinhas",
    price: "R$ 7,00",
    description: "7 figurinhas por pacote",
  },
  {
    item: "Álbum Brochura",
    price: "R$ 24,90",
    description: "Versão básica do álbum",
  },
  {
    item: "Álbum Capa Dura",
    price: "R$ 49,90",
    description: "Acabamento premium",
  },
  {
    item: "Álbum Capa Especial",
    price: "R$ 79,90",
    description: "Prateado ou Dourado",
  },
];

const GROUP_STRATEGIES = [
  {
    size: "Sozinho",
    cost: "R$ 7.000,00",
    description: "Custo total apenas comprando pacotes",
  },
  {
    size: "2 Pessoas",
    cost: "R$ 4.100/pessoa",
    description: "Economia de 41% por pessoa com trocas",
  },
  {
    size: "5 Pessoas",
    cost: "R$ 2.350/pessoa",
    description: "Economia de 66% por pessoa com trocas",
  },
  {
    size: "10 Pessoas",
    cost: "R$ 1.720/pessoa",
    description: "Economia de 75% por pessoa com trocas",
  },
  {
    size: "20 Pessoas",
    cost: "R$ 1.430/pessoa",
    description: "Economia de 80% por pessoa com trocas",
  },
];

export default function GuiaAlbumCopa2026Page() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Guia Álbum Copa 2026", url: GUIDE_URL },
  ]);

  const articleSchema = generateCombinedSchema({
    type: "Guide",
    headline:
      "Guia Completo do Álbum da Copa do Mundo 2026: Tudo Que Você Precisa Saber",
    description:
      "Tudo sobre o álbum da Copa 2026: como funciona, quantas figurinhas tem, preços, onde comprar, como completar, estratégias de troca.",
    image: `${BASE_URL}/og-image.jpg`,
    datePublished: PUBLISHED_AT,
    dateModified: MODIFIED_AT,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  });

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <LandingHeader />

      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <Badge className="mb-4" variant="default">
            <BookOpen className="w-3 h-3 mr-2" />
            Guia Informativo Completo
          </Badge>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Guia Completo do
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-400 to-purple-500 block">
              Álbum da Copa 2026
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed max-w-3xl">
            Um guia informativo completo com tudo que você precisa saber para
            colecionar figurinhas da Copa do Mundo 2026: especificações,
            preços, estratégias inteligentes e como conectar com colecionadores
            perto de você.
          </p>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="text-3xl font-bold text-green-400 mb-1">980</div>
              <div className="text-sm text-slate-400">Figurinhas Totais</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="text-3xl font-bold text-blue-400 mb-1">68</div>
              <div className="text-sm text-slate-400">Especiais</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="text-3xl font-bold text-purple-400 mb-1">48</div>
              <div className="text-sm text-slate-400">Seleções</div>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-4 border border-slate-600">
              <div className="text-3xl font-bold text-amber-400 mb-1">R$ 7</div>
              <div className="text-sm text-slate-400">Por Pacote</div>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Button size="lg" asChild>
              <Link href="/">Encontrar Trocadores</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">Ler Blog</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation Sections */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-800/30">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
            {SECTIONS.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                className="group p-4 rounded-lg bg-slate-700/50 border border-slate-600 hover:border-blue-500 hover:bg-slate-700 transition-all"
              >
                <div className="text-blue-400 mb-2 group-hover:text-blue-300 transition-colors">
                  {section.icon}
                </div>
                <p className="text-sm font-medium text-white group-hover:text-blue-100 transition-colors">
                  {section.title}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Section 1: O Básico */}
      <section id="basico" className="py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-6">
            O Que é o Álbum da Copa 2026?
          </h2>

          <div className="space-y-6 mb-8">
            <p className="text-lg text-slate-300 leading-relaxed">
              O álbum da Copa do Mundo 2026 é uma coleção oficial de figurinhas
              produzida pela Panini que celebra o maior evento de futebol do
              mundo. É uma continuação de uma tradição de décadas que faz parte
              da cultura de fãs de futebol em todo o mundo.
            </p>

            <p className="text-lg text-slate-300 leading-relaxed">
              Este é um projeto comunitário onde colecionadores trabalham
              juntos, trocando figurinhas duplicadas para completar seus álbuns.
              A experiência não é apenas colecionar, mas também conectar-se com
              outras pessoas que compartilham a mesma paixão.
            </p>

            <p className="text-lg text-slate-300 leading-relaxed">
              A Copa 2026 será a primeira com 48 seleções participando, tornando
              este o álbum mais ambicioso de todos os tempos. Isso significa
              mais figurinhas, mais variedade e uma experiência ainda mais
              interessante para colecionadores.
            </p>
          </div>

          <Card className="bg-blue-600/20 border-blue-500/50">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" />
                Fatos Importantes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-slate-200">
              <p>✓ Produtor oficial: Panini</p>
              <p>✓ Lançamento: 2026 (próximo à Copa)</p>
              <p>✓ Maior álbum da história da Panini</p>
              <p>
                ✓ Primeira Copa com 48 seleções em vez de 32
              </p>
              <p>✓ Inclui 68 figurinhas especiais e raras</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Section 2: Especificações */}
      <section id="especificacoes" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-10">
            Especificações Técnicas do Álbum
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {ALBUM_SPECS.map((spec, idx) => (
              <Card key={idx} className="bg-slate-700/50 border-slate-600">
                <CardHeader>
                  <CardTitle className="text-white text-2xl">
                    {spec.value}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {spec.label}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{spec.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gradient-to-r from-slate-700/50 to-slate-600/50 rounded-lg border border-slate-600">
            <h3 className="text-xl font-bold text-white mb-4">
              Por Que Este É o Maior Álbum?
            </h3>
            <p className="text-slate-300 leading-relaxed">
              A Copa do Mundo 2026 marca um divisor de águas: pela primeira vez
              na história moderna, a Copa do Mundo terá 48 seleções
              participantes, em vez das tradicionais 32. Isso resulta em mais
              páginas, mais figurinhas por país e uma coleção sem precedentes.
              Estima-se que 11 milhões de figurinhas são produzidas
              diariamente na fábrica da Panini em São Paulo.
            </p>
          </div>
        </div>
      </section>

      {/* Section 3: Preços */}
      <section id="precos" className="py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-10">
            Preços e Custos Totais
          </h2>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              Tabela de Preços Unitários
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {PRICING_BREAKDOWN.map((item, idx) => (
                <Card
                  key={idx}
                  className="bg-slate-700/50 border-slate-600 hover:border-amber-500 transition-colors"
                >
                  <CardHeader>
                    <CardTitle className="text-white">{item.item}</CardTitle>
                    <CardDescription className="text-amber-400 text-lg">
                      {item.price}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-300">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6">
              Custo Total: Sozinho vs. Em Grupo
            </h3>
            <p className="text-slate-300 mb-6 leading-relaxed">
              O fator mais importante para economizar é o tamanho do seu grupo
              de troca. Quanto mais pessoas trocando, menor o custo por pessoa.
            </p>

            <div className="space-y-4">
              {GROUP_STRATEGIES.map((strategy, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-slate-700/50 border border-slate-600 rounded-lg hover:border-green-500 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-white">
                      {strategy.size}
                    </h4>
                    <span className="text-2xl font-bold text-green-400">
                      {strategy.cost}
                    </span>
                  </div>
                  <p className="text-slate-400">{strategy.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-r from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/50">
              <p className="text-slate-200">
                <span className="font-bold text-purple-300">💡 Dica:</span> Você
                pode economizar até <span className="font-bold">80%</span> ao
                participar de um grupo bem organizado de trocas. Isso significa
                pagar apenas ~R$ 1.430 em vez de R$ 7.000 para completar o
                álbum.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 4: Estratégias */}
      <section id="estrategias" className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-10">
            Estratégias Inteligentes de Coleta
          </h2>

          <div className="space-y-8">
            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-400" />
                  Estratégia 1: Forme Grupos de Trocas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  A estratégia mais eficiente é formar ou participar de grupos
                  de troca. Quanto maior o grupo, maior a variedade de
                  figurinhas disponíveis.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Reúna amigos e familiares interessados</li>
                  <li>
                    Estabeleça regras claras para trocas (ex: 1 comum por 1
                    comum)
                  </li>
                  <li>Use planilhas para rastrear quem tem o quê</li>
                  <li>Organize encontros regulares para trocas</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Estratégia 2: Organize Seus Registros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  Manter um registro detalhado do que você tem facilita
                  negociações e evita erros.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Crie uma planilha com todas as figurinhas do álbum</li>
                  <li>Marque as figurinhas que você já tem</li>
                  <li>Identifique duplicadas para trocar</li>
                  <li>Atualize regularmente</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Estratégia 3: Priorize Figurinhas Especiais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-slate-300">
                <p>
                  As 68 figurinhas especiais são as mais procuradas e valiosas.
                </p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Identifique quais especiais você mais procura</li>
                  <li>Não troque especiais por comuns</li>
                  <li>Negotiate equivalências (especial por especial)</li>
                  <li>
                    Reserve recursos para buscar as mais raras no final
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Section 5: Encontrar Trocadores */}
      <section id="encontrar" className="py-16 px-4 sm:px-6 lg:px-8 scroll-mt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-white mb-10">
            Onde Encontrar Outros Colecionadores
          </h2>

          <div className="space-y-6 mb-12">
            <Card className="bg-slate-700/50 border-slate-600 hover:border-blue-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-400" />
                  Encontro de Figurinhas
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Plataforma Online
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  A plataforma Encontro de Figurinhas conecta colecionadores em
                  sua região para facilitar trocas organizadas.
                </p>
                <Button asChild size="sm">
                  <Link href="/">Ver Colecionadores Próximos</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600 hover:border-green-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-green-400" />
                  Comunidades Online
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Redes Sociais e Grupos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Procure grupos no Facebook, WhatsApp, Reddit e Discord
                  dedicados a colecionar figurinhas da Copa 2026. Esses grupos
                  são excelentes para encontrar pessoas interessadas em trocas
                  na sua região.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-500 transition-colors">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-purple-400" />
                  Pontos de Troca
                </CardTitle>
                <CardDescription className="text-slate-400">
                  Locais Físicos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-300">
                  Procure por eventos de troca de figurinhas em sua cidade.
                  Muitas cidades organizam encontros periódicos de
                  colecionadores em parques, shoppings ou centros comunitários.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Comece Sua Jornada de Colecionador
          </h2>
          <p className="text-xl text-slate-100 mb-8 max-w-2xl mx-auto leading-relaxed">
            Conecte-se com outros colecionadores em sua região e comece a trocar
            figurinhas da Copa 2026. Com uma estratégia inteligente e bom grupo
            de trocas, você pode economizar até 80% do custo total.
          </p>
          <div className="flex gap-4 flex-wrap justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100">
              <Link href="/" className="flex items-center gap-2">
                Encontrar Colecionadores Perto de Mim
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/blog">Ler Mais Artigos</Link>
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
