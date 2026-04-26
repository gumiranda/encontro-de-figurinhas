import { Button } from "@workspace/ui/components/button";
import { Home, Album, Search } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Figurinha não encontrada",
  description:
    "Esta figurinha não existe no álbum da Copa 2026. Busque outras figurinhas para trocar.",
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
        <h1 className="text-2xl font-bold mb-4">Figurinha não encontrada</h1>
        <p className="text-muted-foreground mb-8">
          Esta figurinha não existe no álbum da Copa do Mundo 2026 ou o link está incorreto.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <Button asChild>
            <Link href="/album-copa-do-mundo-2026">
              <Album className="mr-2 h-4 w-4" />
              Ver álbum completo
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/figurinhas">
              <Search className="mr-2 h-4 w-4" />
              Buscar figurinhas
            </Link>
          </Button>
        </div>

        <div className="text-sm text-muted-foreground">
          <p className="mb-4">Seleções populares:</p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/selecao/bra"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              🇧🇷 Brasil
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/selecao/arg"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              🇦🇷 Argentina
            </Link>
            <span className="text-muted-foreground">•</span>
            <Link
              href="/selecao/fra"
              className="inline-flex items-center gap-1 text-primary hover:underline"
            >
              🇫🇷 França
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
