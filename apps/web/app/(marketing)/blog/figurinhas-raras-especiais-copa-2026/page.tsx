import type { Metadata } from "next";
import Link from "next/link";
import {
  Trophy,
  Sparkles,
  Zap,
  Heart,
  TrendingUp,
  Users,
  AlertCircle,
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
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const ARTICLE_PATH = "/blog/figurinhas-raras-especiais-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-25T00:00:00Z";
const MODIFIED_AT = "2026-05-25T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Figurinhas Raras e Especiais da Copa do Mundo 2026: Guia Completo e Lista de Todas as 68",
  description:
    "Descubra as 68 figurinhas especiais, raras e lendárias do álbum da Copa 2026. Saiba quais são as mais procuradas, como identificar hologramas, pratas e douradas, e as melhores estratégias para colecionar e trocar.",
  keywords: [
    "figurinhas raras copa 2026",
    "figurinhas especiais copa 2026",
    "figurinhas lendárias copa do mundo 2026",
    "hologramas copa 2026",
    "figurinha prata copa 2026",
    "figurinha dourada copa 2026",
    "68 figurinhas especiais copa 2026",
    "figurinhas mais procuradas copa 2026",
    "como encontrar figurinhas raras",
    "lista completa figurinhas especiais",
  ],
  openGraph: {
    title:
      "Figurinhas Raras da Copa 2026: Guia das 68 Figurinhas Especiais e Mais Procuradas",
    description:
      "Conheça todas as figurinhas raras, especiais e lendárias do álbum da Copa 2026. Hologramas, pratas, douradas e as mais valiosas para colecionar.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Figurinhas Raras",
      "Figurinhas Especiais",
      "Panini",
      "Colecionar",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Figurinhas Raras da Copa 2026: 68 Figurinhas Especiais para Colecionar",
    description:
      "Saiba quais são as figurinhas raras, hologramas e douradas do álbum da Copa 2026.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const RARE_FIGURINE_CATEGORIES = [
  {
    name: "Figurinhas com Holograma",
    description:
      "As figurinhas com holograma são as mais buscadas do álbum. Apresentam um efeito visual especial que as diferencia das figurinhas comuns.",
    icon: "✨",
    count: "Aproximadamente 68",
  },
  {
    name: "Figurinhas Pratas",
    description:
      "Versões especiais com acabamento prateado. Normalmente representam destaques de cada seleção ou partidas importantes.",
    icon: "🥈",
    count: "Variável por série",
  },
  {
    name: "Figurinhas Douradas",
    description:
      "A versão mais rara e valiosa. Figurinhas com acabamento dourado que são extremamente procuradas por colecionadores.",
    icon: "🥇",
    count: "Série limitada",
  },
  {
    name: "Figurinhas Fotográficas",
    description:
      "Figurinhas com fotos reais dos jogadores e momentos marcantes da Copa. Incluem capitães, talentos emergentes e craques mundiais.",
    icon: "📸",
    count: "Destaques principais",
  },
];

const FAQS = [
  {
    question: "O álbum da Copa 2026 tem quantas figurinhas especiais?",
    answer:
      "O álbum oficial da Panini da Copa do Mundo 2026 possui exatamente 68 figurinhas especiais distribuídas entre as 980 figurinhas totais. Essas figurinhas especiais incluem hologramas, pratas, douradas e outras variações exclusivas.",
  },
  {
    question: "Qual é a diferença entre figurinha rara e especial?",
    answer:
      "Uma figurinha especial é aquela que faz parte da coleção oficial com acabamentos diferentes, como holograma, prata ou ouro. Figurinha rara é aquela que é difícil de encontrar em pacotes, podendo ser uma figurinha especial ou comum, mas com baixa frequência de produção.",
  },
  {
    question: "Como identificar se uma figurinha é de holograma?",
    answer:
      "Figurinhas com holograma apresentam um efeito visual brilhante e mutável quando inclinadas à luz. O padrão holográfico muda de cor e intensidade dependendo do ângulo de visualização. Compare com figurinhas comuns para notar claramente a diferença.",
  },
  {
    question: "As figurinhas douradas da Copa 2026 existem em quantidade limitada?",
    answer:
      "Sim, as figurinhas douradas são produzidas em quantidade muito menor comparado às comuns. Representam menos de 1% da produção total, tornando-as as mais procuradas e valiosas para colecionadores.",
  },
  {
    question: "Qual é o melhor jeito de conseguir figurinhas raras?",
    answer:
      "A melhor estratégia é combinar compra de pacotes com trocas com outros colecionadores. Plataformas online de encontro de colecionadores facilitam a identificação de pessoas próximas para trocar. Quanto mais pessoas no seu grupo de troca, maiores as chances de conseguir figurinhas raras.",
  },
  {
    question: "As figurinhas especiais têm valor diferente na venda?",
    answer:
      "Sim, figurinhas raras e especiais têm valor muito superior ao das figurinhas comuns. Uma figurinha dourada pode custar dezenas de reais, enquanto hologramas e pratas variam de 2 a 15 reais, dependendo da demanda.",
  },
];

const TIPS_FOR_COLLECTING = [
  {
    title: "Comece com Grupos de Troca",
    description:
      "Participar de comunidades e grupos de troca aumenta significativamente as chances de conseguir figurinhas especiais. Quanto maior o grupo, mais variedade de figurinhas disponíveis.",
    icon: <Users className="w-6 h-6" />,
  },
  {
    title: "Organize Seu Inventário",
    description:
      "Mantenha um registro detalhado de quais figurinhas especiais você já tem. Use planilhas ou aplicativos para rastrear duplicadas e facilitar negociações.",
    icon: <TrendingUp className="w-6 h-6" />,
  },
  {
    title: "Negocie Estrategicamente",
    description:
      "Não troque figurinhas especiais por comuns. Procure fazer trocas equivalentes em valor. Uma figurinha dourada vale muito mais que várias comuns.",
    icon: <Zap className="w-6 h-6" />,
  },
  {
    title: "Verifique Autenticidade",
    description:
      "Ao receber figurinhas raras, verifique a qualidade da impressão, o brilho do holograma e compare com exemplares conhecidos. Falsificações existem no mercado.",
    icon: <AlertCircle className="w-6 h-6" />,
  },
  {
    title: "Paciência é Fundamental",
    description:
      "Colecionar figurinhas raras leva tempo. Não é possível completar a coleção especial rapidamente. Desfrutar do processo é tão importante quanto o resultado final.",
    icon: <Heart className="w-6 h-6" />,
  },
  {
    title: "Conecte-se com Outros Colecionadores",
    description:
      "Quanto mais pessoas você conhece que coleciona, maiores as possibilidades de trocas benéficas. Redes online facilitam encontrar colecionadores na sua região.",
    icon: <Trophy className="w-6 h-6" />,
  },
];

export default function RarFigurinhasPage() {
  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Home", url: BASE_URL },
    { name: "Blog", url: `${BASE_URL}/blog` },
    {
      name: "Figurinhas Raras Copa 2026",
      url: ARTICLE_URL,
    },
  ]);

  const articleSchema = generateCombinedSchema({
    type: "BlogPosting",
    headline:
      "Figurinhas Raras e Especiais da Copa do Mundo 2026: Guia Completo e Lista de Todas as 68",
    description:
      "Descubra as 68 figurinhas especiais, raras e lendárias do álbum da Copa 2026. Saiba quais são as mais procuradas, como identificar hologramas, pratas e douradas.",
    image: `${BASE_URL}/og-image.jpg`,
    datePublished: PUBLISHED_AT,
    dateModified: MODIFIED_AT,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  });

  const faqSchema = generateFAQSchema(FAQS);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800">
      <LandingHeader />

      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={articleSchema} />
      <JsonLd data={faqSchema} />

      {/* Hero Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Badge className="mb-4" variant="outline">
            <Sparkles className="w-3 h-3 mr-2" />
            Guia Completo de Figurinhas Raras
          </Badge>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
            Figurinhas Raras e Especiais da Copa 2026
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500 block">
              Guia das 68 Figurinhas Mais Procuradas
            </span>
          </h1>

          <p className="text-xl text-slate-300 mb-8 leading-relaxed">
            Descubra tudo sobre as figurinhas especiais, raras e lendárias do
            álbum da Copa do Mundo 2026. Saiba como identificar hologramas,
            pratas e douradas, e as melhores estratégias para coletar e trocar
            com outros colecionadores.
          </p>

          <div className="flex gap-4 mb-12">
            <Button size="lg" asChild>
              <Link href="/">Encontrar Colecionadores</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/blog">Voltar ao Blog</Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-4 text-sm text-slate-300 mb-8">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">68</span>
              <span>Figurinhas Especiais</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">980</span>
              <span>Total do Álbum</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-bold">7%</span>
              <span>Da Coleção</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-8">
            O Que São Figurinhas Raras e Especiais?
          </h2>

          <p className="text-slate-300 mb-6 leading-relaxed text-lg">
            No álbum oficial da Copa do Mundo 2026 da Panini, 68 figurinhas são
            classificadas como "especiais" e diferem das comuns por apresentarem
            acabamentos únicos e exclusivos. Essas figurinhas são as mais
            procuradas pelos colecionadores e geralmente têm valor de troca ou
            venda muito superior.
          </p>

          <p className="text-slate-300 mb-6 leading-relaxed text-lg">
            A raridade dessas figurinhas vem de dois fatores: sua produção é
            menor comparada às comuns (proporcionalmente), e a demanda é muito
            alta. Isso cria um cenário onde conseguir uma figurinha especial
            requer estratégia e paciência.
          </p>

          {/* Rare Types */}
          <div className="grid md:grid-cols-2 gap-6 my-12">
            {RARE_FIGURINE_CATEGORIES.map((category) => (
              <Card
                key={category.name}
                className="bg-slate-700/50 border-slate-600 hover:border-amber-500 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-white text-lg">
                      {category.name}
                    </CardTitle>
                    <span className="text-3xl">{category.icon}</span>
                  </div>
                  <CardDescription className="text-slate-400">
                    {category.count}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Collecting Tips */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-4">
            6 Dicas para Colecionar Figurinhas Raras
          </h2>
          <p className="text-slate-400 mb-12">
            Estratégias comprovadas para aumentar suas chances de conseguir as
            figurinhas mais procuradas
          </p>

          <div className="grid md:grid-cols-2 gap-6">
            {TIPS_FOR_COLLECTING.map((tip, idx) => (
              <Card
                key={idx}
                className="bg-slate-700/30 border-slate-600 hover:border-blue-500 transition-colors"
              >
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-blue-400 flex-shrink-0">
                      {tip.icon}
                    </div>
                    <CardTitle className="text-white">{tip.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300">{tip.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-slate-800/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white mb-12">
            Perguntas Frequentes sobre Figurinhas Raras
          </h2>

          <div className="space-y-6">
            {FAQS.map((faq, idx) => (
              <Card
                key={idx}
                className="bg-slate-700/50 border-slate-600 hover:border-purple-500 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-white text-lg">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-300 leading-relaxed">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Comece a Coletar Figurinhas Raras Agora
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Conecte-se com outros colecionadores na sua região e troque
            figurinhas de forma inteligente. Quanto mais pessoas no seu grupo,
            mais raridades você conseguirá.
          </p>
          <Button size="lg" variant="secondary" asChild className="mr-4">
            <Link href="/">Encontrar Colecionadores</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/blog">Ler Outros Artigos</Link>
          </Button>
        </div>
      </section>

      <LandingFooter />
    </main>
  );
}
