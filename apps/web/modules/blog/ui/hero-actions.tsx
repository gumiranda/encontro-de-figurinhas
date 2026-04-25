"use client";

import { useEffect, useState } from "react";
import { Bookmark, Share2 } from "lucide-react";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { usePostMetrics } from "@/modules/blog/hooks/use-save-post";
import {
  copyToClipboard,
  hasNativeShare,
  nativeShare,
} from "@/modules/blog/lib/share";

interface HeroActionsProps {
  postId: Id<"blogPosts">;
  title: string;
  url: string;
  initialCounts: { likes: number; saves: number };
}

export function HeroActions({ postId, title, url, initialCounts }: HeroActionsProps) {
  const [copied, setCopied] = useState(false);
  const [showNative, setShowNative] = useState(false);
  const { userState, toggle } = usePostMetrics(postId, { initialCounts });

  useEffect(() => {
    setShowNative(hasNativeShare());
  }, []);

  const handleShare = async () => {
    if (showNative) {
      await nativeShare(title, url);
      return;
    }
    await copyToClipboard(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const baseBtn =
    "size-11 rounded-full border border-outline-variant/40 bg-surface-container/40 text-foreground hover:bg-surface-container/80 transition-colors flex items-center justify-center";

  return (
    <div className="flex items-center gap-2" aria-label="Ações do artigo">
      <button
        type="button"
        onClick={() => toggle("saves")}
        className={baseBtn}
        aria-label={userState.saved ? "Remover dos salvos" : "Salvar artigo"}
        aria-pressed={userState.saved}
      >
        <Bookmark
          className={`size-4 ${userState.saved ? "fill-current text-primary" : ""}`}
        />
      </button>
      <button
        type="button"
        onClick={handleShare}
        className={baseBtn}
        aria-label={copied ? "Link copiado" : "Compartilhar artigo"}
      >
        <Share2 className="size-4" />
      </button>
    </div>
  );
}
