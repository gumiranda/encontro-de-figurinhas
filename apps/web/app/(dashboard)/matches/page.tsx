"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import {
  ArrowLeftRight,
  ListPlus,
  MapPin,
  Sparkles,
  User,
} from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import type { MatchView } from "@workspace/backend/convex/matches";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Badge } from "@workspace/ui/components/badge";

const DISTANCE_LABELS: Record<string, string> = {
  near: "A poucos passos",
  close: "No seu bairro",
  mid: "Na sua cidade",
  far: "Região próxima",
  unknown: "Localização pendente",
};

export default function MatchesPage() {
  const data = useQuery(api.matches.findUserMatches, {});

  useEffect(() => {
    if (data && data.status === "ready") {
      if (process.env.NODE_ENV === "development") {
        console.log("[analytics] matches_viewed", {
          count: data.matches.length,
        });
      }
    }
  }, [data]);

  if (data === undefined) {
    return <MatchesSkeleton />;
  }

  if (data.status === "needs-city") {
    return (
      <EmptyState
        icon={MapPin}
        title="Onde você troca?"
        description="Informe sua cidade para encontrar colecionadores perto de você."
        ctaHref="/selecionar-localizacao"
        ctaLabel="Informar minha cidade"
      />
    );
  }

  if (data.status === "needs-setup") {
    return (
      <EmptyState
        icon={ListPlus}
        title="Quais figurinhas você tem?"
        description="Cadastre suas repetidas e faltantes. Leva menos de 1 minuto."
        ctaHref="/cadastrar-figurinhas/quick"
        ctaLabel="Cadastrar minhas figurinhas"
      />
    );
  }

  if (data.status === "computing") {
    return <MatchesSkeleton showText />;
  }

  if (data.matches.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="Seus matches estão a caminho"
        description="Novos colecionadores entram todo dia. Volte em breve ou atualize suas figurinhas para ampliar as chances."
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Matches</h1>
        <p className="text-muted-foreground">
          Usuários com figurinhas compatíveis
        </p>
      </div>

      {data.matches.length === 30 && (
        <p className="text-sm text-muted-foreground">
          Exibindo 30 melhores matches
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data.matches.map((match) => (
          <MatchCard key={match.otherUserId} match={match} />
        ))}
      </div>
    </div>
  );
}

function MatchCard({ match }: { match: MatchView }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-muted">
              <User className="size-5 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base">
                {match.displayNickname}
              </CardTitle>
              <CardDescription className="text-xs">
                {DISTANCE_LABELS[match.distanceBucket]}
              </CardDescription>
            </div>
          </div>
          {match.isPremium && (
            <Badge variant="secondary" className="text-xs">
              Premium
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Eu tenho</p>
            <p className="font-semibold text-primary">{match.ihaveCount}</p>
            {match.ihaveSample.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Ex: {match.ihaveSample.join(", ")}
              </p>
            )}
          </div>
          <ArrowLeftRight className="size-5 text-muted-foreground" />
          <div className="text-right">
            <p className="text-muted-foreground">Eu preciso</p>
            <p className="font-semibold text-destructive">{match.ineedCount}</p>
            {match.ineedSample.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Ex: {match.ineedSample.join(", ")}
              </p>
            )}
          </div>
        </div>

        {match.hasSpecial && (
          <Badge variant="outline" className="text-xs">
            <Sparkles className="mr-1 size-3" />
            Inclui especial
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  ctaHref,
  ctaLabel,
  personality = "encouraging",
}: {
  icon: typeof Sparkles;
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
  personality?: "encouraging" | "playful" | "calm";
}) {
  const personalityStyles = {
    encouraging: {
      iconBg: "bg-gradient-to-br from-secondary/20 to-secondary-dim/30",
      iconColor: "text-secondary",
      glow: "shadow-[0_0_30px_rgba(79,243,37,0.15)]",
    },
    playful: {
      iconBg: "bg-gradient-to-br from-tertiary/20 to-tertiary-dim/30",
      iconColor: "text-tertiary",
      glow: "shadow-[0_0_30px_rgba(255,201,101,0.15)]",
    },
    calm: {
      iconBg: "bg-gradient-to-br from-primary/15 to-primary-dim/25",
      iconColor: "text-primary",
      glow: "shadow-[0_0_30px_rgba(149,170,255,0.15)]",
    },
  }[personality];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Matches</h1>
        <p className="text-muted-foreground">
          Usuários com figurinhas compatíveis
        </p>
      </div>

      <Card className="border-dashed animate-fade-in-up">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div
            className={`mb-6 flex h-20 w-20 items-center justify-center rounded-2xl ${personalityStyles.iconBg} ${personalityStyles.glow}`}
          >
            <Icon className={`size-10 ${personalityStyles.iconColor}`} strokeWidth={1.5} />
          </div>
          <h2 className="text-xl font-headline font-bold">{title}</h2>
          <p className="mt-2 max-w-md text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
          {ctaHref && ctaLabel && (
            <Button asChild className="mt-8 btn-primary-gradient">
              <Link href={ctaHref}>{ctaLabel}</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MatchesSkeleton({ showText = false }: { showText?: boolean }) {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="mt-2 h-5 w-64" />
      </div>

      {showText && (
        <p className="text-sm text-muted-foreground">Calculando matches...</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-full" />
                <div>
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between">
                <Skeleton className="h-12 w-16" />
                <Skeleton className="h-12 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
