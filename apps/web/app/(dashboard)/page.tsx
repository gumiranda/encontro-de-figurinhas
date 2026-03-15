"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { MapPin, TrendingUp, ThumbsUp, CalendarPlus } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const activeCount = useQuery(api.spots.getActiveCount);

  const isAdmin =
    currentUser?.role === "superadmin" || currentUser?.role === "ceo";
  const stats = useQuery(api.spots.getStats, isAdmin ? {} : "skip");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo{currentUser?.name ? `, ${currentUser.name}` : ""}!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Active spots card - visible to all */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-500" />
              <CardTitle>Pontos Ativos</CardTitle>
            </div>
            <CardDescription>
              Pontos de troca de figurinhas no mapa
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end justify-between">
              <div className="text-3xl font-bold">
                {activeCount !== undefined ? (
                  activeCount
                ) : (
                  <Skeleton className="h-9 w-12 inline-block" />
                )}
              </div>
              <Link href="/mapa">
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  <MapPin className="h-4 w-4 mr-1" />
                  Ver no Mapa
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Admin-only stats */}
        {isAdmin && (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <CardTitle>Total de Pontos</CardTitle>
                </div>
                <CardDescription>
                  Todos os pontos já criados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats ? (
                    stats.totalSpots
                  ) : (
                    <Skeleton className="h-9 w-12 inline-block" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-primary" />
                  <CardTitle>Total de Votos</CardTitle>
                </div>
                <CardDescription>
                  Votos registrados na plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats ? (
                    stats.totalVotes
                  ) : (
                    <Skeleton className="h-9 w-12 inline-block" />
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CalendarPlus className="h-5 w-5 text-primary" />
                  <CardTitle>Pontos Hoje</CardTitle>
                </div>
                <CardDescription>
                  Pontos criados nas últimas 24 horas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats ? (
                    stats.spotsCreatedToday
                  ) : (
                    <Skeleton className="h-9 w-12 inline-block" />
                  )}
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
}
