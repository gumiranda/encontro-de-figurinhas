import type { Metadata } from "next";
import Link from "next/link";
import { Home, Search, MapPin } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export const metadata: Metadata = {
  title: "Página não encontrada",
  description: "A página que você procura não existe. Encontre figurinhas para trocar no Figurinha Fácil.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-bold text-primary mb-4">404</div>
        <h1 className="text-2xl font-bold mb-4">Página não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          Parece que esta figurinha não está no álbum. A página que você procura
          não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild>
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Página inicial
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/como-funciona">
              <Search className="mr-2 h-4 w-4" />
              Como funciona
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-4">Páginas populares:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/cidade/sao-paulo"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <MapPin className="h-3 w-3" />
              São Paulo
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/cidade/rio-de-janeiro"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <MapPin className="h-3 w-3" />
              Rio de Janeiro
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/cidade/belo-horizonte"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              <MapPin className="h-3 w-3" />
              Belo Horizonte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
