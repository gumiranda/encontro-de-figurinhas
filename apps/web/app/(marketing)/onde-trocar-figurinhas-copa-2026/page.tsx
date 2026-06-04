import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  Users,
  Smartphone,
  Store,
  Clock,
  AlertCircle,
  CheckCircle2,
  MessageSquare,
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

const ARTICLE_PATH = "/onde-trocar-figurinhas-copa-2026";
const ARTICLE_URL = `${BASE_URL}${ARTICLE_PATH}`;
const PUBLISHED_AT = "2026-05-12T00:00:00Z";
const MODIFIED_AT = "2026-05-12T00:00:00Z";

export const metadata: Metadata = {
  title:
    "Onde Trocar Figurinhas da Copa 2026: Guia com Pontos de Troca Perto de Você",
  description:
    "Descubra onde trocar figurinhas da Copa 2026 no Brasil. Veja pontos de troca por cidade, apps para encontrar colecionadores, dicas de segurança e como economizar até 80% completando o álbum por troca.",
  keywords: [
    "onde trocar figurinhas copa 2026",
    "como trocar figurinhas copa 2026",
    "pontos de troca figurinhas copa 2026",
    "onde trocar figurinhas perto de mim",
    "trocar figurinhas copa 2026",
    "lugares para trocar figurinhas",
    "grupos de troca figurinhas copa",
    "app para trocar figurinhas 2026",
    "encontro de figurinhas copa 2026",
    "troca segura de figurinhas",
  ],
  openGraph: {
    title:
      "Onde Trocar Figurinhas da Copa 2026: Guia Completo com Pontos de Troca",
    description:
      "Encontre onde trocar figurinhas da Copa 2026 perto de você. Veja todos os pontos de troca, apps, grupos e dicas para economizar.",
    url: ARTICLE_URL,
    type: "article",
    publishedTime: PUBLISHED_AT,
    modifiedTime: MODIFIED_AT,
    authors: [SITE_NAME],
    tags: [
      "Copa do Mundo 2026",
      "Álbum de figurinhas",
      "Troca de figurinhas",
      "Dicas",
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Onde Trocar Figurinhas da Copa 2026: Guia com Pontos de Troca Perto de Você",
    description:
      "Descubra onde trocar figurinhas da Copa 2026. Apps, pontos de troca por cidade e dicas de segurança.",
  },
  alternates: {
    canonical: ARTICLE_URL,
  },
};

const FAQS = [
  {
    question: "Qual é o melhor lugar para trocar figurinhas da Copa 2026?",
    answer:
      "Os melhores lugares são plataformas como o Figurinha Fácil, que conecta colecionadores próximos automaticamente. Secundariamente, pontos de troca em shoppings, praças e grupos de redes sociais são ótimas opções. Plaformas online oferecem segurança, praticidade e garantem matches compatíveis.",
  },
  {
    question: "Como faço para trocar figurinhas de forma segura?",
    answer:
      "Use plataformas verificadas com reputação estabelecida, escolha locais públicos com movimento (shoppings, praças), leve um colega, verifique as figurinhas antes de fazer a troca, e confira a lista de repetidas do outro colecionador. Apps como Figurinha Fácil facilitam trocas seguras com sistema de matches.",
  },
  {
    question: "Qual app é melhor para trocar figurinhas da Copa 2026?",
    answer:
      "O Figurinha Fácil é a maior plataforma de troca do Brasil, com mais de 2 milhões de usuários. A app oficial 'FIFA Panini Collection' também oferece trocas online. Ambas conectam colecionadores: Figurinha Fácil para trocas presenciais e FIFA Panini para trocas digitais instantâneas.",
  },
  {
    question: "Quanto posso economizar trocando figurinhas?",
    answer:
      "Dados mostram que usar trocas pode reduzir o custo em até 80% comparado a apenas comprar pacotinhos. Se gastar R$ 2.500 na loteria, com trocas você pode completar por R$ 500-700. Quanto mais troca, maior a economia.",
  },
  {
    question: "Existe algum horário específico para trocar figurinhas?",
    answer:
      "Não há horário oficial. A maioria dos pontos de troca funciona durante horário comercial (das 10h às 22h em shoppings). Grupos nas redes sociais frequentemente organizam encontros nos fins de semana. Sempre confirme com o local ou grupo antes de ir.",
  },
  {
    question: "Preciso ter o álbum completo para começar a trocar?",
    answer:
      "Não. Você pode começar a trocar desde o primeiro dia. Basta ter algumas figurinhas repetidas para oferecer. Quanto mais repetidas você acumular, mais chances terá de fazer trocas vantajosas com outros colecionadores.",
  },
];

const breadcrumbSchema = generateBreadcrumbSchema([
  { name: "Início", url: BASE_URL },
  { name: "Onde Trocar Figurinhas Copa 2026", url: ARTICLE_URL },
]);

const faqSchema = generateFAQSchema(FAQS);

const articleSchema = {
  "@context": "https://schema.org",
  "@type": "Article",
  headline:
    "Onde Trocar Figurinhas da Copa 2026: Guia com Pontos de Troca Perto de Você",
  description:
    "Guia completo sobre onde trocar figurinhas da Copa 2026 no Brasil: plataformas, apps, pontos de troca por cidade, dicas de segurança e como economizar.",
  image: `${BASE_URL}/opengraph-image`,
  datePublished: PUBLISHED_AT,
  dateModified: MODIFIED_AT,
  author: {
    "@type": "Organization",
    name: SITE_NAME,
    url: BASE_URL,
  },
  publisher: {
    "@type": "Organization",
    name: SITE_NAME,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/logo.svg`,
    },
  },
  mainEntityOfPage: {
    "@type": "WebPage",
    "@id": ARTICLE_URL,
  },
  keywords: [
    "onde trocar figurinhas copa 2026",
    "como trocar figurinhas",
    "pontos de troca",
  ],
  inLanguage: "pt-BR",
};

const combinedSchema = generateCombinedSchema([
  articleSchema,
  breadcrumbSchema,
  faqSchema,
]);

const tradingMethods = [
  {
    icon: Smartphone,
    title: "Figurinha Fácil (App)",
    description:
      "Maior plataforma de troca do Brasil com 2M+ usuários. Cadastre repetidas e faltantes, encontre matches automáticos com colecionadores perto de você.",
    highlight: "Mais popular",
    color: "text-blue-500",
  },
  {
    icon: Users,
    title: "Encontros em Shoppings",
    description:
      "Diversos shoppings no Brasil sediam pontos de troca oficiais. Confira horários e localização no website da Coca-Cola e Panini.",
    highlight: "Presencial",
    color: "text-green-500",
  },
  {
    icon: MessageSquare,
    title: "Grupos no Telegram & WhatsApp",
    description:
      "Comunidades locais organizam encontros regularmente. Busque pelo nome da sua cidade + 'figurinhas copa 2026'.",
    highlight: "Gratuito",
    color: "text-purple-500",
  },
  {
    icon: Store,
    title: "Bancas e Pontos de Venda",
    description:
      "Muitas bancas e lojas que vendem figurinhas também intermediam trocas entre clientes. Pergunte ao vendedor sobre possibilidades.",
    highlight: "Local",
    color: "text-orange-500",
  },
];

const tradingTips = [
  {
    icon: CheckCircle2,
    title: "Organize suas figurinhas antes",
    description:
      "Faça uma lista clara de repetidas e faltantes. Use numeração padrão (ex: BRA-10, CAN-5) para não gerar dúvidas.",
  },
  {
    icon: MapPin,
    title: "Encontre locais públicos e movimentados",
    description:
      "Praças, shoppings e espaços com câmeras são mais seguros. Evite encontros em locais isolados.",
  },
  {
    icon: Users,
    title: "Leve um colega ou amigo",
    description:
      "Ir acompanhado aumenta a segurança e torna a experiência mais divertida. Além disso, facilita validação das figurinhas.",
  },
  {
    icon: Clock,
    title: "Confirme antecipadamente",
    description:
      "Sempre confirme hora e local com o outro colecionador. Apps como Figurinha Fácil facilitam essa coordenação.",
  },
  {
    icon: AlertCircle,
    title: "Verifique as figurinhas antes de concordar",
    description:
      "Examine número, condição e autenticidade das figurinhas oferecidas. Rejeite se tiver dúvida sobre a qualidade.",
  },
  {
    icon: Zap,
    title: "Prefira trocas com múltiplas figurinhas",
    description:
      "Trocas de lote (ex: 5 repetidas por 3 faltantes) são mais vantajosas que trocas individuais.",
  },
];

const topCities = [
  {
    name: "São Paulo",
    estimate: "30+ pontos de troca",
    locations:
      "Shopping Imigrantes, Shopping Morumbi, Praça da Sé, parques municipais",
  },
  {
    name: "Rio de Janeiro",
    estimate: "25+ pontos de troca",
    locations:
      "Shopping Nova América, Saara, Rua da Carioca, Copacabana e Barra",
  },
  {
    name: "Minas Gerais (BH)",
    estimate: "18+ pontos de troca",
    locations:
      "Belo Horizonte Shopping, Praça da Liberdade, parques da região",
  },
  {
    name: "Brasília",
    estimate: "12+ pontos de troca",
    locations: "Brasília Shopping, Esplanada, pontos comerciais do DF",
  },
  {
    name: "Salvador",
    estimate: "15+ pontos de troca",
    locations: "Shopping Barra, bairro do Rio Vermelho, praças públicas",
  },
  {
    name: "Recife",
    estimate: "12+ pontos de troca",
    locations: "Shopping Recife, Cais do Porto, bairros da zona norte",
  },
];

export default function OndeTracarFigurinhasCopaPage() {
  return (
    <>
      <JsonLd data={combinedSchema} />
      <LandingHeader />
      <main
        id="main-content"
        className="pt-24 min-h-screen text-[var(--on-surface)]"
      >
        {/* Hero */}
        <section className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 md:py-24">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 text-sm text-[var(--outline)]"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Início
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/album-copa-do-mundo-2026"
                  className="hover:text-[var(--primary)] transition-colors"
                >
                  Álbum Copa 2026
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li className="text-[var(--on-surface)] font-medium">
                Onde Trocar Figurinhas
              </li>
            </ol>
          </nav>

          <div className="space-y-6">
            <Badge className="bg-[var(--secondary-container)]/20 text-[var(--secondary)] border border-[var(--secondary)]/20 uppercase tracking-widest text-[10px] font-bold">
              Guia de Troca Copa 2026
            </Badge>

            <h1 className="font-[var(--font-headline)] text-3xl font-black leading-tight tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
              Onde Trocar Figurinhas da Copa 2026:{" "}
              <span className="text-gradient-primary">
                guia com pontos de troca perto de você
              </span>
            </h1>

            <p className="text-lg md:text-xl text-[var(--on-surface-variant)] max-w-3xl leading-relaxed">
              Descobrir onde trocar figurinhas da Copa 2026 é o segredo para{" "}
              <strong>completar o álbum gastando menos</strong>. Neste guia você
              encontra <strong>apps gratuitos</strong>, <strong>pontos de troca por
              cidade</strong>, <strong>dicas de segurança</strong> e como economizar{" "}
              <strong>até 80%</strong> em relação a só comprar pacotinhos.
            </p>

            <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-widest text-[var(--outline)]">
              <span>Publicado em 12/05/2026</span>
              <span aria-hidden="true">•</span>
              <span>Leitura de 8 min</span>
              <span aria-hidden="true">•</span>
              <span>100+ pontos de troca mapeados</span>
            </div>
          </div>
        </section>

        {/* Intro */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Por que trocar figurinhas?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Trocar figurinhas é a <strong>forma mais econômica</strong> para
              completar o álbum da Copa 2026. Enquanto comprar apenas
              pacotinhos até fechar o álbum custa em média <strong>R$ 2.500</strong>,
              quem faz trocas consegue reduzir esse valor para{" "}
              <strong>R$ 500-700</strong>.
            </p>
            <p>
              Além da economia, trocar é <strong>divertido</strong>,{" "}
              <strong>conecta colecionadores</strong> de sua região e{" "}
              <strong>acelera a conclusão do álbum</strong>. Com apps como o
              Figurinha Fácil encontrando matches automáticos, nunca foi tão
              fácil trocar figurinhas de forma segura e prática.
            </p>
          </div>
        </section>

        {/* Trading Methods */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            4 Formas de Trocar Figurinhas da Copa 2026
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Você tem várias opções para encontrar colecionadores e fazer trocas.
            Escolha a que mais se adequa ao seu perfil:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {tradingMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card
                  key={method.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[var(--primary)]/10 to-transparent rounded-bl-3xl" />
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 relative z-10">
                      <div>
                        <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center mb-3">
                          <Icon
                            className={`h-5 w-5 ${method.color}`}
                            aria-hidden="true"
                          />
                        </div>
                        <CardTitle className="text-lg">{method.title}</CardTitle>
                      </div>
                      <Badge className="bg-[var(--secondary)]/10 text-[var(--secondary)] border-0 text-[10px] font-bold">
                        {method.highlight}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[var(--on-surface-variant)]">
                      {method.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Top Cities */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Pontos de Troca por Cidade
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Existem <strong>100+ pontos de troca</strong> em mais de 29 cidades
            brasileiras. Confira os principais:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {topCities.map((city) => (
              <Card
                key={city.name}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin
                      className="h-5 w-5 text-[var(--primary)]"
                      aria-hidden="true"
                    />
                    <CardTitle className="text-lg">{city.name}</CardTitle>
                  </div>
                  <Badge variant="outline" className="w-fit">
                    {city.estimate}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-[var(--on-surface-variant)]">
                    <strong>Locais:</strong> {city.locations}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <p className="text-sm text-[var(--outline)] mt-6 max-w-3xl">
            <strong>Dica:</strong> Use plataformas como Figurinha Fácil para
            encontrar pontos de troca e colecionadores específicos próximos de você.
          </p>
        </section>

        {/* Safety Tips */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            6 Dicas para Trocar Figurinhas de Forma Segura
          </h2>
          <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-8 max-w-3xl">
            Trocas seguras começam com planejamento. Siga essas dicas:
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            {tradingTips.map((tip) => {
              const Icon = tip.icon;
              return (
                <Card
                  key={tip.title}
                  className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0 mt-1">
                        <Icon
                          className="h-5 w-5 text-[var(--primary)]"
                          aria-hidden="true"
                        />
                      </div>
                      <CardTitle className="text-base">{tip.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-[var(--on-surface-variant)]">
                      {tip.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* App Comparison */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="space-y-6">
              <div>
                <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-2">
                  Apps para Trocar Figurinhas
                </h2>
                <p className="text-[var(--on-surface-variant)]">
                  Plataformas que facilitam encontrar e conectar com outros
                  colecionadores:
                </p>
              </div>

              <div className="space-y-4">
                <div className="rounded-lg border border-[var(--outline-variant)]/10 bg-[var(--surface)] p-4">
                  <h3 className="font-bold text-[var(--on-surface)] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--primary)]" />
                    Figurinha Fácil
                  </h3>
                  <p className="text-sm text-[var(--on-surface-variant)] mb-2">
                    Maior plataforma do Brasil com 2M+ usuários. Cadastre
                    figurinhas repetidas e faltantes, a app encontra matches automáticos
                    com colecionadores da sua região.
                  </p>
                  <ul className="text-xs text-[var(--on-surface-variant)] space-y-1">
                    <li>✓ Busca automática de matches</li>
                    <li>✓ Sistema de reputação</li>
                    <li>✓ Coordenação de encontros integrada</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-[var(--outline-variant)]/10 bg-[var(--surface)] p-4">
                  <h3 className="font-bold text-[var(--on-surface)] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[var(--secondary)]" />
                    FIFA Panini Collection
                  </h3>
                  <p className="text-sm text-[var(--on-surface-variant)] mb-2">
                    App oficial com trocas 100% digitais. Abra pacotes grátis diariamente
                    e troque figurinhas instantaneamente com colecionadores no mundo todo.
                  </p>
                  <ul className="text-xs text-[var(--on-surface-variant)] space-y-1">
                    <li>✓ Trocas digitais instantâneas</li>
                    <li>✓ Pacotes grátis diários</li>
                    <li>✓ Escopo global</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-[var(--outline-variant)]/10 bg-[var(--surface)] p-4">
                  <h3 className="font-bold text-[var(--on-surface)] mb-2 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Grupos em Telegram/WhatsApp
                  </h3>
                  <p className="text-sm text-[var(--on-surface-variant)] mb-2">
                    Comunidades locais onde colecionadores organizam encontros
                    presenciais. Busque &quot;[sua-cidade] figurinhas copa 2026&quot;.
                  </p>
                  <ul className="text-xs text-[var(--on-surface-variant)] space-y-1">
                    <li>✓ Comunidade local ativa</li>
                    <li>✓ Encontros frequentes</li>
                    <li>✓ Gratuito</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Economia Section */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-6">
            Quanto Você Economiza Trocando?
          </h2>
          <div className="space-y-4 text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed">
            <p>
              Os números falam por si. Segundo dados de plataformas de troca,
              colecionadores que usam trocas conseguem reduzir custos em até{" "}
              <strong>80%</strong> comparado a quem só compra pacotinhos.
            </p>

            <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-6">
              <h3 className="font-semibold mb-4 text-[var(--on-surface)]">
                Comparação de Custos
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                  <span className="font-medium">Só pacotinhos (loteria)</span>
                  <span className="font-mono text-lg font-bold text-red-600">
                    ~R$ 2.500
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20">
                  <span className="font-medium">Pacotinhos + poucas trocas</span>
                  <span className="font-mono text-lg font-bold text-orange-600">
                    ~R$ 1.500
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <span className="font-medium">Muitas trocas + app</span>
                  <span className="font-mono text-lg font-bold text-green-600">
                    ~R$ 500
                  </span>
                </div>
              </div>
              <p className="text-xs text-[var(--on-surface-variant)] mt-4">
                Valores aproximados baseados em dados de plataformas de troca.
                Resultados podem variar conforme estratégia pessoal.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-12">
          <div className="rounded-2xl border border-[var(--outline-variant)]/20 bg-[var(--surface-container-high)] p-8 md:p-12">
            <div className="flex items-center gap-3 mb-4">
              <Users
                className="h-6 w-6 text-[var(--primary)]"
                aria-hidden="true"
              />
              <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold">
                Comece a Trocar Agora
              </h2>
            </div>
            <p className="text-[var(--on-surface-variant)] text-base md:text-lg leading-relaxed mb-6 max-w-2xl">
              Milhares de colecionadores brasileiros usam o{" "}
              <strong>Figurinha Fácil</strong> para completar o álbum gastando
              muito menos. Cadastre-se grátis, encontre colecionadores perto de
              você e comece suas trocas hoje mesmo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-lg border-0 bg-gradient-to-r from-[var(--primary)] to-[var(--primary-dim)] text-[var(--on-primary-container)] font-bold hover:opacity-95"
              >
                <Link href="/sign-up">
                  Criar conta grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-lg border-[var(--outline-variant)]/30 bg-transparent text-[var(--on-surface)] hover:bg-[var(--surface-variant)]"
              >
                <Link href="/album-copa-do-mundo-2026">
                  Ver guia do álbum
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-labelledby="faq-heading"
          className="mx-auto max-w-3xl px-4 sm:px-6 py-12"
        >
          <h2
            id="faq-heading"
            className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8"
          >
            Perguntas Frequentes sobre Troca de Figurinhas
          </h2>
          <div className="space-y-4">
            {FAQS.map((item) => (
              <Card
                key={item.question}
                className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)]"
              >
                <CardHeader>
                  <CardTitle className="text-base md:text-lg">
                    {item.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-[var(--on-surface-variant)]">
                    {item.answer}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Related Articles */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24">
          <h2 className="font-[var(--font-headline)] text-2xl md:text-3xl font-bold mb-8">
            Leia Também
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--outline-variant)]/30 transition-colors cursor-pointer group">
              <CardHeader>
                <Link href="/album-copa-do-mundo-2026" className="space-y-2">
                  <CardTitle className="group-hover:text-[var(--primary)] transition-colors">
                    Álbum da Copa 2026: Guia Completo
                  </CardTitle>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    Saiba quantas figurinhas tem, preços e como completar o
                    álbum oficial da Panini.
                  </CardDescription>
                </Link>
              </CardHeader>
            </Card>
            <Card className="bg-[var(--surface-container-high)] border-[var(--outline-variant)]/10 text-[var(--on-surface)] hover:border-[var(--outline-variant)]/30 transition-colors cursor-pointer group">
              <CardHeader>
                <Link href="/como-funciona" className="space-y-2">
                  <CardTitle className="group-hover:text-[var(--primary)] transition-colors">
                    Como o Figurinha Fácil Funciona
                  </CardTitle>
                  <CardDescription className="text-[var(--on-surface-variant)]">
                    Entenda como nossa plataforma conecta colecionadores e
                    facilita trocas seguras.
                  </CardDescription>
                </Link>
              </CardHeader>
            </Card>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
