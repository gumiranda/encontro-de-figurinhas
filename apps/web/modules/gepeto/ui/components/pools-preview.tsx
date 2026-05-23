"use client";

import Link from "next/link";
import { Users, ChevronRight } from "lucide-react";
import { Card } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

interface Pool {
  id: string;
  name: string;
  emoji: string;
  rank: number;
  totalMembers: number;
  gepetoRank: number;
  hasPendingPrediction?: boolean;
  pendingCount?: number;
}

interface PoolsPreviewProps {
  pools: Pool[];
  className?: string;
}

function PoolRow({ pool }: { pool: Pool }) {
  return (
    <Link
      href={`/gepeto/boloes/${pool.id}`}
      className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
    >
      <div className="text-2xl">{pool.emoji}</div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm truncate">{pool.name}</div>
        <div className="text-xs text-muted-foreground">
          #{pool.rank} de {pool.totalMembers} · Gepeto #{pool.gepetoRank}
        </div>
      </div>

      {pool.hasPendingPrediction && pool.pendingCount && (
        <div className="px-2 py-0.5 rounded-md border border-amber-400/30 bg-amber-400/10 text-amber-400 font-mono text-xs font-bold">
          {pool.pendingCount} · falta
        </div>
      )}
    </Link>
  );
}

export function PoolsPreview({ pools, className }: PoolsPreviewProps) {
  if (pools.length === 0) {
    return (
      <Card className={cn("p-4 border-slate-700", className)}>
        <div className="flex items-center gap-2 mb-3">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-display text-sm font-semibold">Seus bolões</span>
        </div>
        <div className="text-center py-6">
          <div className="text-3xl mb-2">🎱</div>
          <div className="text-sm text-muted-foreground mb-3">
            Você ainda não participa de nenhum bolão
          </div>
          <Link
            href="/gepeto/boloes"
            className="text-primary text-sm font-medium hover:underline"
          >
            Criar ou entrar em um bolão
          </Link>
        </div>
      </Card>
    );
  }

  return (
    <Card className={cn("p-4 border-slate-700", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <span className="font-display text-sm font-semibold">Seus bolões</span>
        </div>
        <Link
          href="/gepeto/boloes"
          className="flex items-center gap-0.5 text-xs text-primary hover:underline"
        >
          Ver todos
          <ChevronRight className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="space-y-2">
        {pools.slice(0, 3).map((pool) => (
          <PoolRow key={pool.id} pool={pool} />
        ))}
      </div>
    </Card>
  );
}
