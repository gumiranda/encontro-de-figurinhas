"use client";

import { useState } from "react";
import { Check, Copy, Share2 } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { QRCanvas } from "./qr-canvas";

interface QRShareModuleProps {
  nickname: string;
}

export function QRShareModule({ nickname }: QRShareModuleProps) {
  const [copied, setCopied] = useState(false);
  const url = `figurinhafacil.com.br/u/${nickname}`;
  const fullUrl = `https://${url}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Fallback for older browsers
    }
  };

  const handleWhatsApp = () => {
    const text = `Veja meu perfil no Figurinha Fácil: ${fullUrl}`;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">
          Compartilhe seu perfil
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Outras pessoas escaneiam para ver suas trocas
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-[auto_1fr] items-center gap-3.5 rounded-xl border border-border bg-muted/50 p-3.5">
          <div className="rounded-lg border border-border bg-white p-2">
            <QRCanvas size={108} text={fullUrl} />
          </div>
          <div className="min-w-0">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              URL DO PERFIL
            </div>
            <div className="mt-1 break-all font-mono text-xs">{url}</div>
            <div className="mt-2.5 flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 px-2.5 text-xs"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-3 w-3" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
                {copied ? "Copiado" : "Copiar"}
              </Button>
              <Button
                size="sm"
                className="h-8 gap-1.5 bg-[#25d366] px-2.5 text-xs text-white hover:bg-[#128c7e]"
                onClick={handleWhatsApp}
              >
                <Share2 className="h-3 w-3" /> WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
