"use client";

import Link from "next/link";
import { Button } from "@workspace/ui/components/button";
import { Home, RefreshCw } from "lucide-react";

export default function MarketingError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 p-8">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold">Oops! Algo deu errado</h2>
        <p className="text-muted-foreground max-w-md">
          Nao conseguimos carregar esta pagina. Por favor, tente novamente.
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={() => reset()}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Tentar novamente
        </Button>
        <Button variant="outline" asChild>
          <Link href="/">
            <Home className="mr-2 h-4 w-4" />
            Voltar ao inicio
          </Link>
        </Button>
      </div>
    </div>
  );
}
