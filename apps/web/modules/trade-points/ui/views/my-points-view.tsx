"use client";

import { useQuery } from "convex/react";
import Link from "next/link";
import { MapPin, MapPinPlus, Users, Clock } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Badge } from "@workspace/ui/components/badge";
import { Skeleton } from "@workspace/ui/components/skeleton";

function formatDate(timestamp: number) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

function PointCardSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
      </CardContent>
    </Card>
  );
}

export function MyPointsView() {
  const points = useQuery(api.userTradePoints.getMyPoints);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Pontos</h1>
          <p className="text-sm text-muted-foreground">
            Pontos de troca que você participa
          </p>
        </div>
        <Button asChild>
          <Link href="/map">
            <MapPinPlus className="mr-2 size-4" />
            Explorar mapa
          </Link>
        </Button>
      </div>

      {points === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <PointCardSkeleton key={i} />
          ))}
        </div>
      ) : points.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <MapPin className="mb-4 size-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold">Encontre seu ponto de troca</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Pontos são locais verificados onde colecionadores se encontram. Escolha um perto de você no mapa.
            </p>
            <Button asChild className="mt-4">
              <Link href="/map">Explorar pontos no mapa</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {points.map((point) => (
            <Card key={point._id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base leading-tight">
                    {point.name}
                  </CardTitle>
                  <Badge
                    variant={point.status === "approved" ? "default" : "secondary"}
                    className="shrink-0"
                  >
                    {point.status === "approved" ? "Ativo" : point.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-1">
                  {point.cityName ?? point.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1 tabular-nums">
                    <Users className="size-4" />
                    {point.participantCount ?? 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="size-4" />
                    {formatDate(point.joinedAt)}
                  </span>
                </div>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link href={`/points/${point._id}`}>Ver detalhes</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
