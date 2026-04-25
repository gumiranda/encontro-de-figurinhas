import type { Metadata } from "next";
import Link from "next/link";
import { cacheLife, cacheTag } from "next/cache";
import {
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  HandCoins,
  MapPin,
  Package,
  Repeat,
  ShoppingBag,
  XCircle,
} from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateBreadcrumbSchema,
  generateFAQSchema,
  BASE_URL,
  SITE_NAME,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

const TITLE = `Onde Comprar Figurinhas Copa 2026 | ${SITE_NAME}`;
const DESCRIPTION =
  "Onde comprar figurinhas da Copa do Mundo 2026: pacotes Panini, bancas, marketplace online e troca P2P grátis. Compare preços, custo total do álbum e veja onde achar na sua cidade.";

const CAPITALS: Array<{ name: string; slug: string; uf: string }> = [
  { name: "São Paulo", slug: "sao-paulo-sp", uf: "SP" },
  { name: "Rio de Janeiro", slug: "rio-de-janeiro-rj", uf: "RJ" },
  { name: "Brasília", slug: "brasilia-df", uf: "DF" },
  { name: "Salvador", slug: "salvador-ba", uf: "BA" },
  { name: "Fortaleza", slug: "fortaleza-ce", uf: "CE" },
  { name: "Belo Horizonte", slug: "belo-horizonte-mg", uf: "MG" },
  { name: "Manaus", slug: "manaus-am", uf: "AM" },
  { name: "Curitiba", slug: "curitiba-pr", uf: "PR" },
  { name: "Recife", slug: "recife-pe", uf: "PE" },
  { name: "Porto Alegre", slug: "porto-alegre-rs", uf: "RS" },
  { name: "Belém", slug: "belem-pa", uf: "PA" },
  { name: "Goiânia", slug: "goiania-go", uf: "GO" },
  { name: "Guarulhos", slug: "guarulhos-sp", uf: "SP" },
  { name: "Campinas", slug: "campinas-sp", uf: "SP" },
  { name: "São Luís", slug: "sao-luis-ma", uf: "MA" },
  { name: "Maceió", slug: "maceio-al", uf: "AL" },
  { name: "Natal", slug: "natal-rn", uf: "RN" },
  { name: "Teresina", slug: "teresina-pi", uf: "PI" },
  { name: "Campo Grande", slug: "campo-grande-ms", uf: "MS" },
  { name: "João Pessoa", slug: "joao-pessoa-pb", uf: "PB" },
  { name: "Cuiabá", slug: "cuiaba-mt", uf: "MT" },
  { name: "Aracaju", slug: "aracaju-se", uf: "SE" },
  { name: "Florianópolis", slug: "florianopolis-sc", uf: "SC" },
  { name: "Vitória", slug: "vitoria-es", uf: "ES" },
  { name: "Porto Velho", slug: "porto-velho-ro", uf: "RO" },
  { name: "Macapá", slug: "macapa-ap", uf: "AP" },
  { name: "Rio Branco", slug: "rio-branco-ac", uf: "AC" },
  { name: "Boa Vista", slug: "boa-vista-rr", uf: "RR" },
  { name: "Palmas", slug: "palmas-to", uf: "TO" },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "onde comprar figurinhas copa 2026",
    "comprar figurinhas copa do mundo 2026",
    "pacote figurinhas panini copa 2026",
    "figurinhas copa 2026 preço",
    "figurinhas copa 2026 banca",
    "álbum copa 2026 onde comprar",
  ],
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/onde-comprar-figurinhas-copa-2026`,
    type: "website",
  },
  twitter: { title: TITLE, description: DESCRIPTION },
  alternates: {
    canonical: `${BASE_URL}/onde-comprar-figurinhas-copa-2026`,
  },
};

async function loadAlbumTotal() {
  "use cache";
  cacheTag("album-total");
  cacheLife("days");
  const sections = await convexServer.query(api.album.getSections, {});
  return sections.reduce((acc, s) => acc + s.stickerCount, 0);
}

export default async function WhereToBuyPage() {
  const totalStickers = await loadAlbumTotal();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Onde Comprar Figurinhas Copa 2026" },
  ]);

  const faqs = [
    {
      question: "Onde comprar figurinhas da Copa do Mundo 2026?",
      answer:
        "Você compra pacotes oficiais Panini em bancas de jornal, supermercados, papelarias e marketplaces online (Mercado Livre, Amazon, Shopee). Cada pacote traz 5 figurinhas. Para conseguir as que faltam sem comprar mais pacotes, troque com outros colecionadores grátis no Figurinha Fácil.",
    },
    {
      question: "Qual o preço do pacote de figurinhas Copa 2026?",
      answer:
        "O preço sugerido pela Panini varia entre R$ 5 e R$ 6 por pacote de 5 figurinhas. Em bancas o preço pode subir para R$ 7-8. Online costuma ter promoção em caixas fechadas (50-100 pacotes).",
    },
    {
      question: "Quanto custa fechar o álbum da Copa 2026?",
      answer: `O álbum tem ${totalStickers} figurinhas. Comprando só pacotes, o custo médio passa de R$ 2.500 por causa das repetidas. Trocando as repetidas com outros colecionadores você reduz drasticamente o custo — muitos fecham por menos de R$ 500.`,
    },
    {
      question: "É melhor comprar pacote ou trocar figurinhas?",
      answer:
        "Combine os dois. Compre pacotes para ganhar massa de figurinhas no início e troque as repetidas para fechar o álbum. Trocar é grátis e elimina o desperdício de comprar repetidas.",
    },
    {
      question: "Onde comprar figurinhas raras (douradas e lendas)?",
      answer:
        "As raras saem aleatoriamente nos pacotes oficiais. Para conseguir uma específica, o caminho mais barato é trocar — alguém em algum lugar tem repetida. No Figurinha Fácil você marca a rara que procura e o sistema encontra colecionadores próximos com ela.",
    },
    {
      question: "Tem como comprar figurinha avulsa da Copa 2026?",
      answer:
        "Em marketplaces (Mercado Livre, OLX) sim — vendedores oferecem figurinhas avulsas e raras com preços variando de R$ 2 a R$ 50+ dependendo da raridade. Cuidado com falsificações: prefira vendedores com avaliação e fotos reais.",
    },
  ];
  const faqSchema = generateFAQSchema(faqs);

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={faqSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">
                  Onde Comprar Figurinhas
                </li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4">
                <ShoppingBag className="h-3 w-3 mr-1" />
                Guia completo 2026
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Onde Comprar Figurinhas{" "}
                <span className="text-primary">Copa do Mundo 2026</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-8">
                Pacotes Panini, bancas, online e troca P2P grátis. Compare as
                opções, veja preços médios e descubra como economizar fechando
                o álbum de {totalStickers} figurinhas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Trocar grátis (economize R$ 2.000+)
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/custo-album-copa-2026">
                    Ver custo total do álbum
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparativo */}
        <section className="py-16 md:py-24 border-y">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-3">
                Comparativo: 4 formas de conseguir figurinhas
              </h2>
              <p className="text-muted-foreground mb-10">
                Cada caminho serve para um momento diferente do álbum. O ideal
                é combinar.
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="border-primary/30">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-lg">Pacote Panini</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      5 figurinhas / pacote
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-3">R$ 5–6</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Oficial e novinhas</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Disponível em todo Brasil</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Você ganha repetidas</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Aleatório (não escolhe)</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-orange-500/10 flex items-center justify-center mb-2">
                      <MapPin className="h-5 w-5 text-orange-600" />
                    </div>
                    <CardTitle className="text-lg">Banca / mercado</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Pacotes avulsos
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-3">R$ 5–8</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Compra na hora</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Sem frete</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Markup de até 30%</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Pode acabar rápido</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2">
                      <ExternalLink className="h-5 w-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Marketplace</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      ML, Amazon, Shopee
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-3">R$ 4–10</p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Caixa fechada barateia</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Avulsas raras</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Frete + espera</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Risco de falsificação</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="border-emerald-500/40 bg-emerald-500/5">
                  <CardHeader>
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-2">
                      <Repeat className="h-5 w-5 text-emerald-600" />
                    </div>
                    <CardTitle className="text-lg">
                      Troca P2P{" "}
                      <Badge
                        variant="outline"
                        className="ml-1 border-emerald-500 text-emerald-700"
                      >
                        grátis
                      </Badge>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Figurinha Fácil
                    </p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold mb-3 text-emerald-600">
                      R$ 0
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Pega exata que falta</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Usa repetidas como moeda</span>
                      </li>
                      <li className="flex gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>Match por proximidade</span>
                      </li>
                      <li className="flex gap-2">
                        <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                        <span>Depende de outro colecionador</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Cost breakdown */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Quanto custa fechar o álbum só comprando?</h2>
              <p>
                Probabilidade diz: para juntar as {totalStickers} figurinhas
                únicas comprando só pacotes, você precisa abrir entre{" "}
                <strong>500 e 700 pacotes</strong>. Isso dá{" "}
                <strong>R$ 2.500–4.000</strong>. A maior parte do custo são
                figurinhas repetidas — você compra a mesma BRA-3 dez vezes.
              </p>

              <h2>Como economizar 70%+ trocando</h2>
              <p>
                A equação muda se você troca. Comprar só uns{" "}
                <strong>50–80 pacotes (R$ 250–500)</strong> gera massa de
                figurinhas suficiente. As repetidas viram moeda de troca. Você
                pega só o que falta com outros colecionadores.
              </p>
              <p>
                <Link href="/custo-album-copa-2026">
                  Ver simulação completa de custo do álbum
                </Link>
                .
              </p>

              <h2>Onde comprar online (caixas fechadas)</h2>
              <p>
                Caixa Panini com 50 pacotes sai entre R$ 230 e R$ 280 — economia
                de até 20% vs banca. Prefira lojas oficiais Panini ou
                marketplaces com vendedor verificado. Evite anúncios sem foto
                real do produto.
              </p>

              <h2>Cuidado com figurinhas falsificadas</h2>
              <ul>
                <li>
                  Acabamento das douradas (foil) é o ponto fraco das
                  falsificações — verifique brilho e relevo
                </li>
                <li>Verso autêntico tem logo Panini bem nítido</li>
                <li>
                  Preço muito abaixo do mercado é red flag (R$ 1 por dourada =
                  desconfie)
                </li>
                <li>
                  Compre de vendedor com avaliação alta e histórico em
                  marketplace
                </li>
              </ul>

              <h2>Veja também</h2>
              <ul>
                <li>
                  <Link href="/album-copa-do-mundo-2026">
                    Álbum Copa do Mundo 2026 — guia completo
                  </Link>
                </li>
                <li>
                  <Link href="/raras">
                    Figurinhas raras Copa 2026 (lendas e douradas)
                  </Link>
                </li>
                <li>
                  <Link href="/custo-album-copa-2026">
                    Custo total do álbum
                  </Link>
                </li>
                <li>
                  <Link href="/como-funciona">
                    Como funciona a troca grátis no Figurinha Fácil
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Capitais */}
        <section className="py-16 md:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-3">
                Onde achar figurinhas na sua cidade
              </h2>
              <p className="text-muted-foreground mb-10">
                Veja colecionadores e pontos de troca ativos nas capitais. Quem
                tem oferta perto de você reduz custo e tempo de fechar o álbum.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {CAPITALS.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/cidade/${c.slug}`}
                    className="flex items-center justify-between gap-2 p-3 rounded-lg border bg-background hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="text-sm font-medium truncate">
                      {c.name}
                    </span>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {c.uf}
                    </Badge>
                  </Link>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mt-6 text-center">
                <Link href="/cidades" className="text-primary hover:underline">
                  Ver todas as cidades
                </Link>{" "}
                ·{" "}
                <Link href="/estados" className="text-primary hover:underline">
                  Buscar por estado
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-headline font-bold mb-10 text-center">
                Perguntas frequentes
              </h2>
              <div className="space-y-6">
                {faqs.map((faq) => (
                  <Card key={faq.question}>
                    <CardHeader>
                      <CardTitle className="text-lg">{faq.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-primary/10 via-background to-emerald-500/10">
          <div className="container mx-auto px-4 text-center">
            <HandCoins className="h-12 w-12 text-primary mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Economize trocando — é grátis
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastro com email leva 30 segundos. Marca o que você tem e o que
              falta. O sistema encontra quem tem a sua e quer a sua repetida.
              Sem taxa, sem assinatura.
            </p>
            <Button size="lg" asChild>
              <Link href="/sign-up">
                Criar conta grátis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </section>
      </main>
      <LandingFooter />
    </>
  );
}
