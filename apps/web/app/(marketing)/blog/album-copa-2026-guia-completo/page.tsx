import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Sparkles,
  Trophy,
  Users,
  Zap,
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

const ARTICLE_PATH = "/blog/album-copa-2026-guia-completo";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-22T00:00:00Z";
const MODIFIED_AT = "2026-05-22T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Álbum Copa do Mundo 2026: Guia Completo - Figurinhas, Histórico e Curiosidades",
  description:
    "Tudo que você precisa saber sobre o álbum da Copa do Mundo 2026: quantas figurinhas tem, histórico da coleção, figurinhas especiais, edições raras e como colecionar. Guia completo do maior álbum de figurinhas da história.",
  keywords: [
    "álbum copa do mundo 2026",
    "álbum copa 2026",
    "figurinhas copa do mundo 2026",
    "figurinhas copa 2026",
    "quantas figurinhas tem álbum copa 2026",
    "álbum panini 2026",
    "história álbum copa",
    "edição especial copa 2026",
    "figurinhas raras copa 2026",
    "coleção figurinhas copa",
  ],
  openGraph: {
    title:
      "Álbum Copa do Mundo 2026: Guia Completo com Histórico e Curiosidades",
    description:
      "Descubra tudo sobre o álbum da Copa 2026: tamanho recorde, figurinhas especiais, histórico e como começar sua coleção.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Panini",
      "Coleção",
      "Guia Completo",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Álbum Copa do Mundo 2026: Guia Completo de Figurinhas",
    description:
      "Tudo sobre o maior álbum de figurinhas da história: curiosidades, figurinhas especiais e como colecionar.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Quantas figurinhas tem o álbum da Copa do Mundo 2026?",
    answer:
      "O álbum oficial da Panini da Copa do Mundo 2026 tem 980 figurinhas no total, sendo 68 delas figurinhas especiais e douradas. Este é o maior álbum de figurinhas de Copa do Mundo já lançado, superando o recorde anterior de 681 figurinhas do álbum da Copa de 2018.",
  },
  {
    question: "Como é a distribuição de figurinhas por seleção no álbum 2026?",
    answer:
      "O álbum apresenta figurinhas de todas as 32 seleções participantes da Copa do Mundo 2026. Cada seleção tem aproximadamente 30 figurinhas, incluindo jogadores da equipe, tecnicos e figurinhas especiais. Existem também figurinhas de logotipos, estádios e temas especiais da competição.",
  },
  {
    question: "Quais são as figurinhas especiais e douradas do álbum 2026?",
    answer:
      "As 68 figurinhas especiais incluem: figurinhas holográficas, figurinhas douradas dos capitães, figurinhas em acrílico de jogadores lendários, e edições de foil (brilhante). Estas figurinhas são mais raras e aumentam o valor de um álbum completo para colecionadores.",
  },
  {
    question: "Quantos pacotinhos preciso comprar para completar o álbum?",
    answer:
      "Para completar apenas com pacotes, você precisaria de aproximadamente 1.050 a 1.400 pacotes de 7 figurinhas cada. Porém, devido às repetições, o custo aumenta significativamente. A solução mais econômica é usar trocas com outros colecionadores, reduzindo em até 60% o custo total.",
  },
  {
    question: "Existe diferença entre as edições: brochura, capa dura, prata e ouro?",
    answer:
      "As edições se diferem no material e acabamento da capa, mas o conteúdo de figurinhas é o mesmo. Brochura (R$ 24,90), Capa Dura (R$ 49,90), Edição Prata (R$ 69,90) e Edição Ouro (R$ 79,90) são apenas variações colecionáveis da capa do álbum.",
  },
  {
    question:
      "Como comparar com os álbuns de Copa anteriores em tamanho e quantidade?",
    answer:
      "Copa 2018: 681 figurinhas | Copa 2022: 670 figurinhas | Copa 2026: 980 figurinhas. O álbum de 2026 é 44% maior que o de 2018 e 46% maior que o de 2022. Este crescimento foi estratégico para aumentar o período de coleta e engajamento dos fãs.",
  },
];

export default function AlbumCopa2026Page() {
  const breadcrumbs = [
    { name: "Home", url: "/" },
    { name: "Blog", url: "/blog" },
    { name: "Álbum Copa 2026", url: ARTICLE_PATH },
  ];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: metadata.title as string,
    description: metadata.description as string,
    url: ARTICLE_URL,
    datePublished: PUBLISHED_AT,
    dateModified: MODIFIED_AT,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=1200&h=630&fit=crop",
  };

  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const faqSchema = generateFAQSchema(FAQS);
  const combinedSchema = generateCombinedSchema([
    articleSchema,
    breadcrumbSchema,
    faqSchema,
  ]);

  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-4 bg-blue-600 hover:bg-blue-700">
              Copa do Mundo 2026
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
              Álbum Copa do Mundo 2026: Guia Completo e Informativo
            </h1>
            <p className="text-xl md:text-2xl text-slate-700 mb-8 leading-relaxed">
              Descubra tudo sobre o maior álbum de figurinhas de Copa do Mundo
              da história: 980 figurinhas especiais, histórico da coleção e como
              começar sua jornada de colecionador.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                asChild
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Link href="/album-copa-do-mundo-2026">
                  Explorar Álbum <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/">
                  Encontrar Trocas <Zap className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-blue-600">980</p>
                  <p className="text-sm text-slate-600 mt-2">
                    Figurinhas Totais
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-blue-600">68</p>
                  <p className="text-sm text-slate-600 mt-2">
                    Figurinhas Especiais
                  </p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-blue-600">32</p>
                  <p className="text-sm text-slate-600 mt-2">Seleções</p>
                </CardContent>
              </Card>
              <Card className="border-0 bg-white/80 backdrop-blur">
                <CardContent className="pt-6">
                  <p className="text-3xl font-bold text-blue-600">44%</p>
                  <p className="text-sm text-slate-600 mt-2">Maior que 2018</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto space-y-12">
            {/* Section 1: O que é o álbum */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                O que é o Álbum da Copa do Mundo 2026?
              </h2>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                O álbum da Copa do Mundo 2026 é a coleção oficial de figurinhas
                lançada pela Panini para a competição que será realizada nos
                Estados Unidos, México e Canadá. É um projeto grandioso que
                marca um novo recorde na história dos álbuns de Copa: 980
                figurinhas, o maior número jamais produzido em uma coleção de
                Copa do Mundo.
              </p>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                Este álbum é uma celebração da paixão global pelo futebol e
                pela Copa do Mundo. Cada figurinha representa jogadores,
                técnicos, estádios e momentos especiais do torneio. A coleção
                foi meticulosamente planejada para oferecer uma experiência
                única e imersiva aos fãs e colecionadores.
              </p>
            </section>

            {/* Section 2: Especificações */}
            <section className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Especificações Técnicas do Álbum
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <Trophy className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      Total de Figurinhas
                    </h3>
                    <p className="text-slate-700">
                      980 figurinhas únicas no total, incluindo 68 figurinhas
                      especiais douradas e holográficas.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Sparkles className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      Figurinhas Especiais
                    </h3>
                    <p className="text-slate-700">
                      68 figurinhas especiais incluindo: capitães dourados,
                      holográficas, em foil e edições limitadas de acrílico.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Users className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      Cobertura de Seleções
                    </h3>
                    <p className="text-slate-700">
                      Todas as 32 seleções participantes com aproximadamente
                      30 figurinhas cada (jogadores, técnicos e figurinhas
                      especiais).
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-bold text-slate-900 text-lg">
                      Pacotinhos
                    </h3>
                    <p className="text-slate-700">
                      Cada pacote contém 7 figurinhas. Preço sugerido: R$ 7,00
                      por pacotinho.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Histórico */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Evolução dos Álbuns de Copa do Mundo
              </h2>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                Os álbuns de figurinhas da Copa do Mundo evoluíram
                significativamente ao longo das décadas. Veja como cresceram:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-l-4 border-l-blue-600">
                  <CardHeader>
                    <CardTitle className="text-xl">Copa 2018</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      681 figurinhas
                    </p>
                    <p className="text-slate-700">
                      Primeira grande expansão moderna dos álbuns de Copa.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-l-4 border-l-blue-600">
                  <CardHeader>
                    <CardTitle className="text-xl">Copa 2022</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold text-blue-600 mb-2">
                      670 figurinhas
                    </p>
                    <p className="text-slate-700">
                      Manteve o tamanho anterior com novas figurinhas especiais.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <Card className="border-2 border-blue-600 mt-4 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Copa 2026 - Recorde</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-blue-600 mb-2">
                    980 figurinhas
                  </p>
                  <p className="text-slate-700">
                    Aumento de 44% em relação a 2018. Maior álbum de Copa do
                    Mundo de todos os tempos, refletindo a importância
                    histórica do torneio realizado em três países.
                  </p>
                </CardContent>
              </Card>
            </section>

            {/* Section 4: Tipos de Figurinhas */}
            <section className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-lg p-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Tipos de Figurinhas no Álbum 2026
              </h2>
              <div className="space-y-4">
                <Card className="border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">👥</span> Figurinhas Comuns
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">
                      Jogadores regulares de cada seleção. A maioria do álbum
                      consiste nestas figurinhas, que são as mais comuns nos
                      pacotinhos.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">⭐</span> Figurinhas Especiais
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">
                      68 figurinhas raras incluindo capitães dourados,
                      holográficas e em foil. Estas figurinhas são muito mais
                      difíceis de encontrar.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">🏆</span> Figurinhas de Estádios
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">
                      Representam os estádios onde os jogos serão realizados nos
                      EUA, México e Canadá.
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-0 bg-white">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">🎖️</span> Figurinhas Temáticas
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-700">
                      Figurinhas especiais dos temas da Copa, momentos históricos
                      e referências culturais dos países anfitriões.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Section 5: Como começar */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Como Começar sua Coleção
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Escolha a Edição do Álbum
                    </h3>
                    <p className="text-slate-700 mt-2">
                      Brochura (R$ 24,90), Capa Dura (R$ 49,90), Edição Prata
                      (R$ 69,90) ou Edição Ouro (R$ 79,90). Todas têm o mesmo
                      conteúdo de figurinhas.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Comece a Colecionar Pacotinhos
                    </h3>
                    <p className="text-slate-700 mt-2">
                      Compre pacotinhos em bancas, farmácias, supermercados e
                      lojas de brinquedos. Preço: R$ 7,00 por pacote com 7
                      figurinhas.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Registre suas Figurinhas
                    </h3>
                    <p className="text-slate-700 mt-2">
                      Use plataformas como Figurinha Fácil para registrar quais
                      figurinhas você tem e quais faltam. Identifique fácil
                      porque usamos o código (ex: BRA-10, MEX-9).
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-600 text-white font-bold flex-shrink-0">
                    4
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-slate-900">
                      Troque com Outros Colecionadores
                    </h3>
                    <p className="text-slate-700 mt-2">
                      Encontre matches automáticos com outras pessoas na sua
                      cidade e troque figurinhas repetidas. Isso economiza muito
                      dinheiro na hora de completar o álbum.
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
                <Link href="/">
                  Começar a Colecionar Agora <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </section>

            {/* Section 6: Dicas para Colecionadores */}
            <section className="bg-white rounded-lg p-8 shadow-sm">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Dicas para Colecionadores
              </h2>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <p className="text-slate-700">
                    <strong>Organize por Seleção:</strong> Mantenha as
                    figurinhas organizadas por país para facilitar o acompanhamento
                    do progresso.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <p className="text-slate-700">
                    <strong>Guarde as Repetidas:</strong> Não descarte as
                    figurinhas repetidas! Elas são ouro para trocas com outros
                    colecionadores.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <p className="text-slate-700">
                    <strong>Use Plataformas de Troca:</strong> Plataformas como
                    Figurinha Fácil te conectam com colecionadores perto de você,
                    economizando até 60% comparado a comprar tudo.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <p className="text-slate-700">
                    <strong>Procure por Grupos Locais:</strong> Comunidades online
                    e offline de colecionadores são ótimas para encontrar figurinhas
                    específicas.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <p className="text-slate-700">
                    <strong>Acompanhe Promoções:</strong> Lojas frequentemente
                    oferecem promoções em pacotinhos. Fique atento para economizar.
                  </p>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 font-bold text-lg">✓</span>
                  <p className="text-slate-700">
                    <strong>Coleção de Longa Durabilidade:</strong> Guarde o álbum
                    em local seco e longe da luz solar direta para preservar a
                    qualidade das figurinhas.
                  </p>
                </li>
              </ul>
            </section>

            {/* FAQs */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold mb-8 text-slate-900">
                Perguntas Frequentes
              </h2>
              <div className="space-y-4">
                {FAQS.map((faq, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-slate-700">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 text-white text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Pronto para Começar sua Coleção?
              </h2>
              <p className="text-lg mb-8 text-blue-100 max-w-2xl mx-auto">
                Junte-se a milhares de colecionadores que estão completando o
                álbum da Copa do Mundo 2026 através de trocas inteligentes. Troque
                figurinhas repetidas e economize até 60% comparado a comprar
                tudo.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  <Link href="/">
                    Explorar Trocas Disponíveis <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white/10"
                >
                  <Link href="/blog">Ver Outros Artigos</Link>
                </Button>
              </div>
            </section>

            {/* Conclusion */}
            <section>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 text-slate-900">
                Conclusão
              </h2>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                O álbum da Copa do Mundo 2026 é um projeto histórico que marca
                um novo recorde em tamanho e abrangência. Com 980 figurinhas
                distribuídas entre 32 seleções, oferece uma experiência completa
                para colecionadores de todas as idades.
              </p>
              <p className="text-lg text-slate-700 mb-4 leading-relaxed">
                Começar sua coleção é simples: escolha uma edição do álbum,
                comece a comprar pacotinhos e registre suas figurinhas em
                plataformas de troca. A melhor parte? Você pode economizar
                significativamente trocando figurinhas com outros colecionadores
                na sua cidade.
              </p>
              <p className="text-lg text-slate-700 leading-relaxed">
                Seja você um colecionador veterano ou alguém descobrindo o
                mundo das figurinhas agora, o álbum de 2026 oferece uma jornada
                única de coleção. Comece hoje e junte-se à comunidade global de
                fãs de futebol que estão construindo esta coleção histórica!
              </p>
            </section>
          </div>
        </div>
      </main>

      <LandingFooter />
    </>
  );
}
