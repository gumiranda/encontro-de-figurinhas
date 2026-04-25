"use client";

import { useState, useEffect } from "react";
import { Link2, Share2, MessageCircle } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

interface ShareRailProps {
  title: string;
  url: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ShareRail({ title, url, className, style }: ShareRailProps) {
  const [copied, setCopied] = useState(false);
  const [hasNativeShare, setHasNativeShare] = useState(false);

  useEffect(() => {
    setHasNativeShare(typeof navigator !== "undefined" && "share" in navigator);
  }, []);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleWhatsApp = () => {
    const text = encodeURIComponent(`${title}\n${url}`);
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleNativeShare = async () => {
    if (!navigator.share) return;
    try {
      await navigator.share({ title, url });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
    }
  };

  return (
    <aside
      className={`share-rail ${className ?? ""}`}
      style={style}
      aria-label="Compartilhar artigo"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Compartilhar
      </p>
      <div className="flex flex-col gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopyLink}
          className="justify-start gap-2"
        >
          <Link2 className="size-4" />
          {copied ? "Copiado!" : "Copiar link"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleWhatsApp}
          className="justify-start gap-2"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </Button>
        {hasNativeShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNativeShare}
            className="justify-start gap-2"
          >
            <Share2 className="size-4" />
            Compartilhar
          </Button>
        )}
      </div>
    </aside>
  );
}
