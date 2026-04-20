"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useQuery } from "convex/react";
import { ArrowRight, ListPlus, Sparkles, StickyNote } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function AlbumPage() {
  const data = useQuery(api.stickers.getUserStickers);

  useEffect(() => {
    if (data) {
      if (process.env.NODE_ENV === "development") {
        console.log("[analytics] album_viewed");
      }
    }
  }, [data]);

  if (data === undefined) {
    return <AlbumSkeleton />;
  }

  const { totalStickers, duplicates, missing } = data;
  const have = totalStickers - missing.length;
  const progress = Math.round((have / totalStickers) * 100);
  const hasStickers = missing.length < totalStickers;

  if (!hasStickers) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Meu Álbum</h1>
          <p className="text-muted-foreground">Copa do Mundo 2026</p>
        </div>

        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <StickyNote className="mb-4 size-12 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              Nenhuma figurinha cadastrada
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Comece a cadastrar suas figurinhas para acompanhar seu progresso.
            </p>
            <Button asChild className="mt-6">
              <Link href="/cadastrar-figurinhas/quick">
                <ListPlus className="mr-2 size-4" />
                Adicionar figurinhas
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Meu Álbum</h1>
        <p className="text-muted-foreground">Copa do Mundo 2026</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Progresso</CardDescription>
            <CardTitle className="text-4xl">{progress}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Tenho</CardDescription>
            <CardTitle className="text-4xl text-primary">{have}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              de {totalStickers} figurinhas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Faltam</CardDescription>
            <CardTitle className="text-4xl text-destructive">
              {missing.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">para completar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Repetidas</CardDescription>
            <CardTitle className="text-4xl text-secondary">
              {duplicates.length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">disponíveis p/ troca</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/cadastrar-figurinhas/quick">
            <ListPlus className="mr-2 size-4" />
            Adicionar figurinhas
          </Link>
        </Button>

        {hasStickers && (
          <Button asChild variant="outline">
            <Link href="/matches">
              <Sparkles className="mr-2 size-4" />
              Ver matches
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

function AlbumSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-40" />
        <Skeleton className="mt-2 h-5 w-48" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-16" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-2 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Skeleton className="h-10 w-44" />
        <Skeleton className="h-10 w-32" />
      </div>
    </div>
  );
}
