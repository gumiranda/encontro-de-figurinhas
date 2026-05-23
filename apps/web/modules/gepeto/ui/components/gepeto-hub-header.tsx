"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { GepetoAvatar } from "./gepeto-avatar";
import { cn } from "@workspace/ui/lib/utils";

interface GepetoHubHeaderProps {
  onBack?: () => void;
  backHref?: string;
}

const TABS = [
  { id: "hub", label: "Hub", href: "/gepeto" },
  { id: "jogos", label: "Jogos", href: "/gepeto/jogos" },
  { id: "boloes", label: "Bolões", href: "/gepeto/boloes" },
  { id: "capitulo", label: "Capítulo", href: "/gepeto/semana-1" },
  { id: "ranking", label: "Vs IA", href: "/gepeto/ranking" },
] as const;

export function GepetoHubHeader({ onBack, backHref }: GepetoHubHeaderProps) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (pathname === "/gepeto" || pathname === "/gepeto/") return "hub";
    if (pathname.includes("/jogos")) return "jogos";
    if (pathname.includes("/boloes")) return "boloes";
    if (pathname.includes("/semana")) return "capitulo";
    if (pathname.includes("/ranking")) return "ranking";
    return "hub";
  };

  const activeTab = getActiveTab();

  return (
    <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-md border-b border-border">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3">
        {backHref ? (
          <Link
            href={backHref}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Link>
        ) : onBack ? (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
        ) : (
          <div className="w-16" />
        )}

        <div className="flex items-center gap-2.5">
          <GepetoAvatar size={32} mood="neutral" glow={false} />
          <div className="text-center">
            <div className="font-display text-base font-semibold">Gepeto</div>
            <div className="font-mono text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              HUMANO × IA
            </div>
          </div>
        </div>

        <div className="w-16" />
      </div>

      {/* Tabs */}
      <div className="flex px-3 pb-2 gap-1 overflow-x-auto scrollbar-hide">
        {TABS.map((tab) => (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors",
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
