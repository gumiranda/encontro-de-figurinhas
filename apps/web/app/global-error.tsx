"use client";

import { Button } from "@workspace/ui/components/button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="pt-BR">
      <body className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 p-8">
          <h2 className="text-2xl font-bold">Algo deu errado!</h2>
          <p className="text-muted-foreground">
            {error.digest
              ? `Código do erro: ${error.digest}`
              : "Ocorreu um erro inesperado."}
          </p>
          <Button onClick={() => reset()}>Tentar novamente</Button>
        </div>
      </body>
    </html>
  );
}