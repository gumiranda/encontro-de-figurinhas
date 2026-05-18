"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Download, Loader2 } from "lucide-react";

export function DataExportCard() {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = useQuery(api.lgpd.exportMyData, isExporting ? {} : "skip");

  const handleExport = async () => {
    setError(null);
    setIsExporting(true);
  };

  if (isExporting && data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `meus-dados-figurinhafacil-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setIsExporting(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Meus Dados</CardTitle>
        <CardDescription>
          Exporte todos os seus dados em formato JSON (LGPD Art. 18 -
          Portabilidade)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          onClick={handleExport}
          disabled={isExporting}
          variant="outline"
        >
          {isExporting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Exportando...
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Exportar meus dados
            </>
          )}
        </Button>
        {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
      </CardContent>
    </Card>
  );
}
