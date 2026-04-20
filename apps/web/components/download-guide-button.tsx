"use client";

import { Download } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

export function DownloadGuideButton() {
  return (
    <Button variant="outline" asChild className="gap-2">
      <a href="/api/guia-copa-2026" download="guia-album-copa-2026.txt">
        <Download className="h-4 w-4" />
        Baixar Guia Completo
      </a>
    </Button>
  );
}
