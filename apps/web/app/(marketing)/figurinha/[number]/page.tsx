import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { ArrowRight, Sparkles, Star, ArrowLeft, ArrowRightIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { LandingHeader } from "@/modules/landing/ui/components/landing-header";
import { LandingFooter } from "@/modules/landing/ui/components/landing-footer";
import { convexServer, api } from "@/lib/convex-server";
import {
  generateStickerMetadata,
  generateBreadcrumbSchema,
  generateProductSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

interface StickerPageProps {
  params: Promise<{ number: string }>;
}

export const revalidate = 86400;

const loadSticker = (number: number) =>
  unstable_cache(
    async (n: number) =>
      convexServer.query(api.album.getStickerByNumber, { number: n }),
    ["figurinha-by-number"],
    { tags: [`figurinha:${number}`], revalidate: 86400 }
  )(number);

export async function generateMetadata({
  params,
}: StickerPageProps): Promise<Metadata> {
  const { number: numberStr } = await params;
  const number = parseInt(numberStr, 10);

  if (isNaN(number) || number < 1) {
    return { title: "Figurinha não encontrada" };
  }

  const sticker = await loadSticker(number);

  if (!sticker) {
    return { title: "Figurinha não encontrada" };
  }

  return generateStickerMetadata(
    sticker.number,
    sticker.teamName,
    sticker.flagEmoji ?? "",
    sticker.isGolden,
    sticker.isLegend,
    sticker.legendName
  );
}

export async function generateStaticParams() {
  const numbers = await convexServer.query(api.album.getAllStickerNumbers, {});
  return numbers.map((number) => ({ number: String(number) }));
}

export default async function StickerPage({ params }: StickerPageProps) {
  const { number: numberStr } = await params;
  const number = parseInt(numberStr, 10);

  if (isNaN(number) || number < 1) {
    notFound();
  }

  const sticker = await loadSticker(number);

  if (!sticker) {
    notFound();
  }

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Álbum Copa 2026", url: `${BASE_URL}/album-copa-do-mundo-2026` },
    { name: sticker.teamName, url: `${BASE_URL}/selecao/${sticker.teamSlug}` },
    { name: `Figurinha ${number}` },
  ]);

  const productSchema = generateProductSchema(
    number,
    sticker.teamName,
    sticker.isGolden,
    sticker.isLegend,
    sticker.legendName
  );

  const prevNumber = number > 1 ? number - 1 : null;
  const nextNumber = number < sticker.totalStickers ? number + 1 : null;

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <JsonLd data={productSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16 md:py-24">
          <div className="container mx-auto px-4">
            <nav className="mb-8 text-sm text-muted-foreground">
              <ol className="flex items-center gap-2 flex-wrap">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    href="/album-copa-do-mundo-2026"
                    className="hover:text-primary"
                  >
                    Álbum
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    href={`/selecao/${sticker.teamSlug}`}
                    className="hover:text-primary"
                  >
                    {sticker.teamName}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-foreground font-medium">#{number}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-4 flex-wrap">
                <span className="text-5xl">{sticker.flagEmoji}</span>
                <Badge variant="outline" className="text-lg px-3 py-1">
                  #{number}
                </Badge>
                {sticker.isGolden && (
                  <Badge className="bg-yellow-500 text-yellow-950">
                    <Star className="h-3 w-3 mr-1" />
                    Dourada
                  </Badge>
                )}
                {sticker.isLegend && (
                  <Badge className="bg-purple-500 text-white">
                    <Sparkles className="h-3 w-3 mr-1" />
                    Lenda
                  </Badge>
                )}
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-4">
                Figurinha {number}
                {sticker.isLegend && sticker.legendName && (
                  <span className="block text-primary">{sticker.legendName}</span>
                )}
              </h1>

              <p className="text-xl text-muted-foreground mb-2">
                <Link
                  href={`/selecao/${sticker.teamSlug}`}
                  className="hover:text-primary hover:underline"
                >
                  {sticker.teamName}
                </Link>{" "}
                - Copa do Mundo 2026
              </p>

              <p className="text-lg text-muted-foreground mb-8">
                {sticker.isLegend && sticker.legendName
                  ? `Figurinha especial de ${sticker.legendName}, uma das mais procuradas do álbum.`
                  : sticker.isGolden
                    ? `Figurinha dourada da ${sticker.teamName}. Mais rara e valiosa para colecionadores.`
                    : `Figurinha da seleção ${sticker.teamName} para completar seu álbum da Copa 2026.`}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild>
                  <Link href="/sign-up">
                    Encontrar para trocar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href={`/selecao/${sticker.teamSlug}`}>
                    Ver todas da {sticker.teamName}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="py-8 border-b">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center max-w-xl mx-auto">
              {prevNumber ? (
                <Link
                  href={`/figurinha/${prevNumber}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Figurinha {prevNumber}</span>
                </Link>
              ) : (
                <div />
              )}
              <span className="text-sm text-muted-foreground">
                {number} de {sticker.totalStickers}
              </span>
              {nextNumber ? (
                <Link
                  href={`/figurinha/${nextNumber}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
                >
                  <span>Figurinha {nextNumber}</span>
                  <ArrowRightIcon className="h-4 w-4" />
                </Link>
              ) : (
                <div />
              )}
            </div>
          </div>
        </section>

        {/* Info Cards */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{sticker.flagEmoji}</span>
                    Seleção
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{sticker.teamName}</p>
                  <p className="text-sm text-muted-foreground">
                    Código FIFA: {sticker.teamCode}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Raridade</CardTitle>
                </CardHeader>
                <CardContent>
                  {sticker.isLegend ? (
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500" />
                      <span className="text-lg font-semibold text-purple-600">
                        Lenda
                      </span>
                    </div>
                  ) : sticker.isGolden ? (
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      <span className="text-lg font-semibold text-yellow-600">
                        Dourada
                      </span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold">Comum</span>
                  )}
                  <p className="text-sm text-muted-foreground mt-1">
                    {sticker.isLegend
                      ? "Figurinha de jogador lendário"
                      : sticker.isGolden
                        ? "Figurinha especial mais rara"
                        : "Figurinha padrão do álbum"}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Como trocar</CardTitle>
                </CardHeader>
                <CardContent>
                  <ol className="text-sm text-muted-foreground space-y-1">
                    <li>1. Cadastre-se grátis</li>
                    <li>2. Marque como "tenho" ou "preciso"</li>
                    <li>3. Encontre um match</li>
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* SEO Content Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto prose prose-lg dark:prose-invert">
              <h2>Sobre a figurinha {number}</h2>
              <p>
                A figurinha número {number} faz parte da coleção da{" "}
                <Link href={`/selecao/${sticker.teamSlug}`}>{sticker.teamName}</Link>{" "}
                {sticker.flagEmoji} no álbum oficial da Copa do Mundo 2026.
                {sticker.isLegend && sticker.legendName && (
                  <>
                    {" "}Esta é uma figurinha especial de <strong>{sticker.legendName}</strong>,
                    um dos jogadores mais icônicos da seleção e uma das figurinhas
                    mais buscadas pelos colecionadores.
                  </>
                )}
                {sticker.isGolden && !sticker.isLegend && (
                  <>
                    {" "}Esta é uma <strong>figurinha dourada</strong>, mais rara que
                    as figurinhas comuns e especialmente valorizada pelos
                    colecionadores.
                  </>
                )}
              </p>

              <h3>Como conseguir a figurinha {number}</h3>
              <p>
                A melhor forma de conseguir a figurinha {number} é através de
                trocas com outros colecionadores. No Figurinha Fácil, você pode:
              </p>
              <ul>
                <li>
                  Marcar que precisa da figurinha {number} no seu perfil
                </li>
                <li>
                  Encontrar colecionadores que têm ela repetida
                </li>
                <li>
                  Combinar uma troca presencial em um ponto de troca seguro
                </li>
              </ul>

              <h3>Outras figurinhas da {sticker.teamName}</h3>
              <p>
                A {sticker.teamName} possui diversas figurinhas no álbum da Copa
                2026.{" "}
                <Link href={`/selecao/${sticker.teamSlug}`}>
                  Veja todas as figurinhas da {sticker.teamName}
                </Link>{" "}
                e encontre as que você precisa para completar a seção.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Precisa da figurinha {number}?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se gratuitamente e encontre colecionadores que têm essa
              figurinha para trocar.
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
