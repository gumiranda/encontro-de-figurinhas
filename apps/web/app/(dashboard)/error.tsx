"use client";

import { Button } from "@workspace/ui/components/button";
import { AlertTriangle } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 p-8">
      <AlertTriangle className="h-12 w-12 text-destructive" />
      <h2 className="text-xl font-semibold">Erro ao carregar</h2>
      <p className="text-muted-foreground text-center max-w-md">
        Ocorreu um erro ao carregar esta pagina. Por favor, tente novamente.
      </p>
      {error.digest && (
        <p className="text-xs text-muted-foreground">
          Codigo: {error.digest}
        </p>
      )}
      <Button onClick={() => reset()}>Tentar novamente</Button>
    </div>
  );
}
