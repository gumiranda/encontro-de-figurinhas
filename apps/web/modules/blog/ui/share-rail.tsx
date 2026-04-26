"use client";

import { useEffect, useState } from "react";
import { Link2, Share2, MessageCircle, Heart, Bookmark } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { usePostMetrics } from "@/modules/blog/hooks/use-save-post";
import {
  copyToClipboard,
  hasNativeShare,
  nativeShare,
  openWhatsApp,
} from "@/modules/blog/lib/share";

interface ShareRailProps {
  title: string;
  url: string;
  postId: Id<"blogPosts">;
  initialCounts: { likes: number; saves: number };
  className?: string;
  style?: React.CSSProperties;
}

export function ShareRail({
  title,
  url,
  postId,
  initialCounts,
  className,
  style,
}: ShareRailProps) {
  const [copied, setCopied] = useState(false);
  const [showNativeShare, setShowNativeShare] = useState(false);
  const { counts, userState, toggle } = usePostMetrics(postId, {
    initialCounts,
  });

  useEffect(() => {
    setShowNativeShare(hasNativeShare());
  }, []);

  const handleCopy = async () => {
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          onClick={() => toggle("likes")}
          className="justify-start gap-2"
        >
          <Heart
            className={`size-4 ${userState.liked ? "fill-current text-red-500" : ""}`}
          />
          {userState.liked ? "Curtido" : "Curtir"}
          <span className="ml-auto text-xs text-muted-foreground font-medium hidden sm:inline">
            {counts.likes}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => toggle("saves")}
          className="justify-start gap-2"
        >
          <Bookmark
            className={`size-4 ${userState.saved ? "fill-current text-primary" : ""}`}
          />
          {userState.saved ? "Salvo" : "Salvar"}
          <span className="ml-auto text-xs text-muted-foreground font-medium hidden sm:inline">
            {counts.saves}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="justify-start gap-2"
        >
          <Link2 className="size-4" />
          {copied ? "Copiado!" : "Copiar link"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => openWhatsApp(title, url)}
          className="justify-start gap-2"
        >
          <MessageCircle className="size-4" />
          WhatsApp
        </Button>
        {showNativeShare && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => nativeShare(title, url)}
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
