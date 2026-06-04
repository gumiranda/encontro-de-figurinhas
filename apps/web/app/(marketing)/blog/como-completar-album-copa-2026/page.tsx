import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Users,
  TrendingUp,
  Zap,
  MapPin,
  Smartphone,
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

const ARTICLE_PATH = "/blog/como-completar-album-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-06-01T00:00:00Z";
const MODIFIED_AT = "2026-06-01T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Como Completar o Álbum da Copa 2026: Guia Completo de Trocas e Estratégias",
  description:
    "Descubra as melhores estratégias para completar o álbum da Copa do Mundo 2026. Guia completo com dicas de trocas, figurinhas raras, onde comprar e como economizar até 80%.",
  keywords: [
    "como completar álbum copa 2026",
    "álbum da copa 2026",
    "trocar figurinhas copa",
    "figurinhas raras copa 2026",
    "onde comprar figurinhas copa",
    "trocas figurinhas copa do mundo",
    "figurinha legend copa 2026",
    "estratégia completar álbum copa",
    "pontos de troca figurinhas",
    "grupos troca figurinhas online",
  ],
  openGraph: {
    title:
      "Como Completar o Álbum da Copa 2026: Guia Estratégias de Troca",
    description:
      "Descubra as melhores estratégias para completar o álbum da Copa 2026 com dicas de trocas, figurinhas raras e como economizar até 80%.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de Figurinhas",
      "Estratégias de Troca",
      "Coleção",
      "Figurinhas Raras",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Como Completar o Álbum da Copa 2026 com Trocas Estratégicas",
    description:
      "Guia completo de estratégias para completar seu álbum da Copa 2026 e economizar até 80%.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question:
      "Qual é a melhor estratégia para completar o álbum da Copa 2026?",
    answer:
      "A melhor estratégia é combinar compra de pacotinhos com trocas ativas. Use plataformas como Figurinha Fácil para encontrar colecionadores próximos à sua cidade, organize trocas presenciais e participe de grupos online. Isso reduz o custo final em até 80% comparado a comprar tudo.",
  },
  {
    question: "Por quanto sai completar o álbum da Copa fazendo trocas?",
    answer:
      "Com uma rede ativa de trocas, você pode completar o álbum gastando entre R$ 1.400 a R$ 2.500. Sem trocas, o custo sobe para R$ 7.000 ou mais. A economia vem das figurinhas repetidas que você pode trocar com outros colecionadores ao invés de comprar novos pacotinhos.",
  },
  {
    question: "Quais são as figurinhas mais raras do álbum da Copa 2026?",
    answer:
      "As figurinhas mais raras são as Legends (categoria especial com 20 jogadores). As versões douradas aparecem em apenas 1 a cada 1.900 pacotes. Vinícius Júnior é o único brasileiro na categoria Legend, junto com Messi, Cristiano Ronaldo e Mbappé.",
  },
  {
    question: "Onde encontrar grupos para trocar figurinhas da Copa?",
    answer:
      "Existem várias opções: Instagram e X (Twitter) têm muitos grupos de trocas regionais; Figurinha Fácil conecta colecionadores próximos; aplicativo FIFA Panini Collection permite trocas online; bancas de jornal e supermercados organizam encontros nos finais de semana.",
  },
  {
    question: "Como usar o Figurinha Fácil para completar o álbum?",
    answer:
      "Cadastre suas figurinhas repetidas e as que faltam no Figurinha Fácil. A plataforma encontra matches automáticos com colecionadores próximos à sua cidade. Organize a troca presencialmente ou online e complete seu álbum de forma prática e econômica.",
  },
  {
    question: "Quanto custa cada figurinha rara do álbum da Copa 2026?",
    answer:
      "Figurinhas roxas Legend custam em média R$ 150. As de bronze saem por R$ 200. Prata varia de R$ 180 a R$ 400. As raríssimas douradas podem custar de R$ 300 a R$ 5.000 dependendo de quem está vendendo.",
  },
];

const BREADCRUMB = [
  { name: "Início", url: "/" },
  { name: "Blog", url: "/blog" },
  { name: "Como Completar o Álbum da Copa 2026", url: ARTICLE_PATH },
];

export default function Page() {
  const breadcrumbSchema = generateBreadcrumbSchema(BREADCRUMB);
  const faqSchema = generateFAQSchema(FAQS);
  const combinedSchema = generateCombinedSchema([
    breadcrumbSchema,
    faqSchema,
  ]);

  return (
    <>
      <JsonLd data={combinedSchema} />

      <LandingHeader />

      <main className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
        <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Header Section */}
          <header className="mb-12">
            <nav className="mb-6 flex items-center gap-2 text-sm text-slate-500">
              {BREADCRUMB.map((crumb, index) => (
                <div key={crumb.url} className="flex items-center gap-2">
                  {index > 0 && <span>/</span>}
                  <Link
                    href={crumb.url}
                    className="hover:text-slate-700 transition-colors"
                  >
                    {crumb.name}
                  </Link>
                </div>
              ))}
            </nav>

            <div className="mb-6 flex flex-wrap gap-2">
              <Badge variant="secondary">Dicas & Estratégias</Badge>
              <Badge variant="outline">Copa 2026</Badge>
              <Badge variant="outline">Trocas</Badge>
            </div>

            <h1 className="mb-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              Como Completar o Álbum da Copa 2026
            </h1>

            <p className="mb-6 text-xl text-slate-600">
              Guia completo com estratégias de trocas, dicas de figurinhas raras
              e como economizar até 80% na sua coleção.
            </p>

            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <span>📅</span>
                <time dateTime={PUBLISHED_AT}>1º de junho de 2026</time>
              </div>
              <div className="flex items-center gap-2">
                <span>⏱️</span>
                <span>8 min de leitura</span>
              </div>
            </div>
          </header>

          {/* Introduction */}
          <section className="mb-12 space-y-4">
            <p className="text-lg text-slate-700">
              O álbum da Copa do Mundo 2026 é um dos maiores lançamentos de
              figurinhas dos últimos anos, com 980 figurinhas no total. Mas
              completar o álbum pode ser caro se você não souber as estratégias
              certas de troca e compra.
            </p>

            <p className="text-lg text-slate-700">
              Este guia completo te mostra exatamente como economizar até 80% ao
              completar seu álbum usando trocas estratégicas, plataformas de
              conectividade e dicas de especialistas colecionadores.
            </p>
          </section>

          {/* Strategy Cards */}
          <section className="mb-12 grid gap-6 md:grid-cols-2">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle2 className="h-5 w-5 text-blue-600" />
                  Estratégia 1: Trocas Presenciais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>
                  Organize encontros com colecionadores da sua cidade. Leve suas
                  figurinhas repetidas e troque pelas que faltam.
                </p>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Economia: até 60%</li>
                  <li>Melhor em: bancas e parques aos fins de semana</li>
                  <li>Tempo: 1-2 meses para completar</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Smartphone className="h-5 w-5 text-green-600" />
                  Estratégia 2: Plataformas Online
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>
                  Use Figurinha Fácil, grupos no Instagram/X e o app FIFA
                  Panini Collection para trocas automáticas.
                </p>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Economia: até 70%</li>
                  <li>Melhor em: trocas regionais e online</li>
                  <li>Tempo: 2-3 meses para completar</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-purple-200 bg-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Users className="h-5 w-5 text-purple-600" />
                  Estratégia 3: Comunidades de Colecionadores
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>
                  Participe de comunidades ativas com muitos membros para ter
                  mais matches de trocas.
                </p>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Economia: até 80%</li>
                  <li>Melhor em: grupos regionais e cidades grandes</li>
                  <li>Tempo: 1-2 meses com comunidade ativa</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-orange-200 bg-orange-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                  Estratégia 4: Compra Estratégica + Trocas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-slate-700">
                <p>
                  Combine compra de pacotinhos com trocas ativas para otimizar
                  gastos.
                </p>
                <ul className="space-y-2 pl-5 list-disc">
                  <li>Economia: até 70%</li>
                  <li>Melhor em: combo de estratégias</li>
                  <li>Tempo: 4-6 semanas</li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* Main Content */}
          <section className="mb-12 space-y-8">
            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                🎯 Por Que as Trocas São Essenciais?
              </h2>

              <div className="space-y-4 text-slate-700">
                <p>
                  O álbum da Copa 2026 tem 980 figurinhas diferentes. Se você
                  comprar apenas pacotinhos sem fazer trocas, vai gastar em
                  média <strong>R$ 7.000 a R$ 8.000</strong> porque terá muitas
                  repetidas no final.
                </p>

                <p>
                  Mas se você fizer trocas ativas com outros colecionadores,
                  pode <strong>reduzir esse custo para R$ 1.400 a R$ 2.500</strong>
                  . É uma economia de até 80%!
                </p>

                <p className="rounded-lg bg-blue-50 p-4 border-l-4 border-blue-500">
                  <strong>💡 Exemplo Real:</strong> Uma pesquisa recente mostrou
                  que colecionadores que participam de redes ativas de trocas
                  gastam em média 80% menos para completar o álbum.
                </p>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                🏪 Onde Comprar Figurinhas da Copa 2026?
              </h2>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Pontos Físicos</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>✅ Bancas de jornal</p>
                    <p>✅ Supermercados</p>
                    <p>✅ Livrarias</p>
                    <p>✅ Lojas de brinquedos</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Plataformas Online</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>✅ Amazon</p>
                    <p>✅ Mercado Livre</p>
                    <p>✅ Apps de delivery</p>
                    <p>✅ Site oficial Panini</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                ⭐ As Figurinhas Mais Raras do Álbum
              </h2>

              <div className="space-y-4">
                <p className="text-slate-700">
                  Nem todas as figurinhas têm a mesma raridade. As mais procuradas
                  são:
                </p>

                <Card className="border-amber-200 bg-amber-50">
                  <CardHeader>
                    <CardTitle className="text-lg">
                      👑 Figurinhas Legend (Ouro)
                    </CardTitle>
                    <CardDescription>
                      Raridade: 1 em cada 1.900 pacotes
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 text-slate-700">
                    <p>
                      A categoria especial com 20 das maiores estrelas do futebol
                      mundial. As versões douradas são as mais raras.
                    </p>
                    <p>
                      <strong>Preço:</strong> R$ 300 a R$ 5.000 (dependendo do
                      jogador)
                    </p>
                    <p className="text-sm">
                      <strong>Jogadores:</strong> Messi, Cristiano Ronaldo, Mbappé,
                      Vinícius Júnior e outros.
                    </p>
                  </CardContent>
                </Card>

                <div className="grid gap-4 md:grid-cols-3">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Legend Prata</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-semibold">R$ 180 - R$ 400</p>
                      <p className="text-slate-500">Rara</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Legend Bronze</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-semibold">R$ 200</p>
                      <p className="text-slate-500">Menos rara</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Legend Roxa</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <p className="font-semibold">R$ 150</p>
                      <p className="text-slate-500">Comum (legend)</p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                🔄 Plataformas de Troca Recomendadas
              </h2>

              <div className="space-y-3">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Figurinha Fácil</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-slate-700">
                      A plataforma mais popular para trocas regionais no Brasil.
                      Você cadastra suas figurinhas e encontra matches automáticos
                      com colecionadores próximos à sua cidade.
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      → Economia: até 80%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      FIFA Panini Collection (App)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-slate-700">
                      App oficial que permite trocas digitais de figurinhas com
                      pessoas de qualquer lugar do mundo. Versão moderna e
                      tecnológica.
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      → Economia: até 70%
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Grupos no Instagram e X (Twitter)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-slate-700">
                      Comunidades regionais muito ativas. Pesquise por "troca
                      figurinhas [sua cidade]" e você encontrará grupos com
                      centenas de membros.
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      → Economia: até 75%
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                📋 Passo a Passo para Completar seu Álbum
              </h2>

              <div className="space-y-4">
                {[
                  {
                    step: "1",
                    title: "Compre o Álbum e os Primeiros Pacotinhos",
                    desc: "Invista em 10-15 pacotinhos para começar sua coleção e ter figurinhas para trocar.",
                  },
                  {
                    step: "2",
                    title: "Cadastre-se no Figurinha Fácil",
                    desc: "Registre suas figurinhas repetidas e as que faltam para encontrar matches automáticos.",
                  },
                  {
                    step: "3",
                    title: "Participe de Grupos de Trocas",
                    desc: "Junte-se a grupos no Instagram, X ou comunidades locais de colecionadores.",
                  },
                  {
                    step: "4",
                    title: "Organize Trocas Presenciais",
                    desc: "Combine encontros em bancas, parques ou pontos de troca nos fins de semana.",
                  },
                  {
                    step: "5",
                    title: "Repita e Estude o Álbum",
                    desc: "Continue comprando pacotinhos estrategicamente e fazendo trocas até completar.",
                  },
                  {
                    step: "6",
                    title: "Celebre sua Conquista!",
                    desc: "Você completou o álbum economizando até 80%! 🎉",
                  },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-white font-bold">
                      {item.step}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900">
                        {item.title}
                      </h3>
                      <p className="text-slate-600">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-4 text-3xl font-bold text-slate-900">
                💰 Estimativa de Custos Reais
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300">
                      <th className="py-3 px-4 text-left font-semibold text-slate-900">
                        Estratégia
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-slate-900">
                        Custo Total
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-slate-900">
                        Economia
                      </th>
                      <th className="py-3 px-4 text-left font-semibold text-slate-900">
                        Tempo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-slate-200">
                      <td className="py-3 px-4">Apenas pacotinhos (sem trocas)</td>
                      <td className="py-3 px-4 font-semibold">R$ 7.000+</td>
                      <td className="py-3 px-4 text-red-600">-</td>
                      <td className="py-3 px-4">2-3 meses</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-3 px-4">Trocas presenciais</td>
                      <td className="py-3 px-4 font-semibold">R$ 2.800</td>
                      <td className="py-3 px-4 text-green-600">60%</td>
                      <td className="py-3 px-4">1-2 meses</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="py-3 px-4">Figurinha Fácil + grupos</td>
                      <td className="py-3 px-4 font-semibold">R$ 2.100</td>
                      <td className="py-3 px-4 text-green-600">70%</td>
                      <td className="py-3 px-4">2-3 meses</td>
                    </tr>
                    <tr>
                      <td className="py-3 px-4">Comunidades ativas</td>
                      <td className="py-3 px-4 font-semibold">R$ 1.400</td>
                      <td className="py-3 px-4 text-green-600">80%</td>
                      <td className="py-3 px-4">1-2 meses</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* FAQs */}
          <section className="mb-12">
            <h2 className="mb-8 text-3xl font-bold text-slate-900">
              ❓ Perguntas Frequentes
            </h2>

            <div className="space-y-4">
              {FAQS.map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-base">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-slate-600">
                    {faq.answer}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-8 py-12 text-white">
            <div className="max-w-2xl">
              <h2 className="mb-4 text-3xl font-bold">
                Comece a Completar seu Álbum Hoje!
              </h2>
              <p className="mb-6 text-lg text-blue-100">
                Use as estratégias deste guia para economizar até 80% e completar
                seu álbum da Copa 2026 em menos tempo.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-blue-50"
                >
                  <Link href="/">
                    Acessar Figurinha Fácil
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-blue-700"
                >
                  <Link href="/blog">Ver Outros Artigos</Link>
                </Button>
              </div>
            </div>
          </section>

          {/* Conclusion */}
          <section className="space-y-4 border-t border-slate-200 pt-12">
            <h2 className="text-2xl font-bold text-slate-900">Conclusão</h2>

            <p className="text-slate-700">
              Completar o álbum da Copa 2026 não precisa ser um investimento
              gigantesco. Com as estratégias certas de troca, você pode economizar
              até 80% do custo final. Use plataformas como Figurinha Fácil,
              participe de comunidades ativas e organize trocas presenciais para
              otimizar seus gastos.
            </p>

            <p className="text-slate-700">
              A chave é começar cedo, ser estratégico nas compras e conectar-se
              com outros colecionadores. Assim você terá um álbum completo em 1-2
              meses gastando apenas R$ 1.400 a R$ 2.500 em vez de R$ 7.000+.
            </p>

            <p className="font-semibold text-slate-900">
              Boa sorte na sua jornada colecionista! 🎉
            </p>
          </section>
        </article>
      </main>

      <LandingFooter />
    </>
  );
}
