"use client";

import { useState, useEffect, useCallback } from "react";
import { Link2, Share2, MessageCircle, Heart, Bookmark } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";

function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  let id = localStorage.getItem("blog_visitor_id");
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem("blog_visitor_id", id);
  }
  return id;
}

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
  const [hasNativeShare, setHasNativeShare] = useState(false);
  const [visitorId, setVisitorId] = useState<string | null>(null);
  const toggleMetric = useMutation(api.blog.toggleMetric);

  // Fetch metrics with visitorId once available
  const metrics = useQuery(
    api.blog.getMetrics,
    visitorId ? { postId, visitorId } : "skip"
  );

  const [localCounts, setLocalCounts] = useState(initialCounts);
  const [userState, setUserState] = useState({ liked: false, saved: false });

  useEffect(() => {
    setHasNativeShare(typeof navigator !== "undefined" && "share" in navigator);
    setVisitorId(getVisitorId());
  }, []);

  // Sync with server data when available
  useEffect(() => {
    if (metrics) {
      setLocalCounts({ likes: metrics.likes, saves: metrics.saves });
      setUserState({ liked: metrics.userLiked, saved: metrics.userSaved });
    }
  }, [metrics]);

  const handleToggle = useCallback(
    async (metric: "likes" | "saves") => {
      if (!visitorId) return;

      const stateKey = metric === "likes" ? "liked" : "saved";
      const wasActive = userState[stateKey];
      const delta = wasActive ? -1 : 1;

      // Optimistic update
      setUserState((s) => ({ ...s, [stateKey]: !wasActive }));
      setLocalCounts((c) => ({ ...c, [metric]: Math.max(0, c[metric] + delta) }));

      try {
        await toggleMetric({ postId, visitorId, metric });
      } catch {
        // Revert on error
        setUserState((s) => ({ ...s, [stateKey]: wasActive }));
        setLocalCounts((c) => ({ ...c, [metric]: c[metric] - delta }));
      }
    },
    [postId, visitorId, userState, toggleMetric]
  );

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
          onClick={() => handleToggle("likes")}
          className="justify-start gap-2"
        >
          <Heart
            className={`size-4 ${userState.liked ? "fill-current text-red-500" : ""}`}
          />
          {userState.liked ? "Curtido" : "Curtir"}
          <span className="ml-auto text-xs text-muted-foreground font-medium hidden sm:inline">
            {localCounts.likes}
          </span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleToggle("saves")}
          className="justify-start gap-2"
        >
          <Bookmark
            className={`size-4 ${userState.saved ? "fill-current text-primary" : ""}`}
          />
          {userState.saved ? "Salvo" : "Salvar"}
          <span className="ml-auto text-xs text-muted-foreground font-medium hidden sm:inline">
            {localCounts.saves}
          </span>
        </Button>
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
