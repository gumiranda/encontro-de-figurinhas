import type { Metadata } from "next";
import { unstable_cache } from "next/cache";
import Link from "next/link";
import { MapPin, ArrowRight } from "lucide-react";
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
  generateCitiesHubMetadata,
  generateBreadcrumbSchema,
  BASE_URL,
} from "@/lib/seo";
import { JsonLd } from "@/components/json-ld";

export const revalidate = 3600;

export const metadata: Metadata = generateCitiesHubMetadata();

const loadCities = () =>
  unstable_cache(
    async () => convexServer.query(api.cities.listAllGroupedByState, {}),
    ["cities-grouped"],
    { tags: ["cities"], revalidate: 3600 }
  )();

export default async function CitiesHubPage() {
  const citiesByState = await loadCities();

  const breadcrumbSchema = generateBreadcrumbSchema([
    { name: "Início", url: BASE_URL },
    { name: "Cidades" },
  ]);

  const totalCities = citiesByState.reduce(
    (acc, s) => acc + s.cities.length,
    0
  );

  return (
    <>
      <JsonLd data={breadcrumbSchema} />
      <LandingHeader />
      <main className="pt-24 min-h-screen">
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
                <li className="text-foreground font-medium">Cidades</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold tracking-tight mb-6">
                Troca de Figurinhas em{" "}
                <span className="text-primary">{totalCities} Cidades</span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground">
                Encontre colecionadores de figurinhas da Copa do Mundo 2026 em
                todas as regiões do Brasil. Selecione sua cidade e comece a trocar.
              </p>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8">
              {citiesByState.map((group) => (
                <Card key={group.state}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      {group.state}
                      <Badge variant="secondary" className="ml-2">
                        {group.cities.length} cidades
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {group.cities.map((city) => (
                        <Link key={city.slug} href={`/cidade/${city.slug}`}>
                          <Badge
                            variant="outline"
                            className="hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                          >
                            {city.name}
                          </Badge>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-2xl md:text-3xl font-headline font-bold mb-6">
              Sua cidade não está na lista?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Cadastre-se e seja o primeiro colecionador da sua cidade. Você ajuda
              a expandir a rede e será notificado quando houver colecionadores
              próximos.
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
