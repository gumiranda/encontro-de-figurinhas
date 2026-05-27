"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Progress } from "@workspace/ui/components/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { ArrowUp, BookOpen, Loader2, MapPin, Trophy } from "lucide-react";

function getCityLabel(city: { name: string; state: string } | null) {
  return city ? `${city.name} (${city.state})` : "Sem cidade";
}

function getAlbumPercent(value: number | undefined): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export default function AdminRankingPage() {
  const currentUser = useQuery(api.users.getCurrentUser);
  const isSuperadmin = currentUser?.role === "superadmin";
  const isCeo = currentUser?.role === "ceo";
  const canView = isSuperadmin || isCeo;

  const [cursor, setCursor] = useState(0);
  const limit = 50;

  const rankingData = useQuery(
    api.users.getRankedUsersByMissing,
    canView ? { cursor, limit } : "skip",
  );

  if (currentUser === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!canView) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-muted-foreground">
          Voce nao tem permissao para acessar esta pagina.
        </p>
      </div>
    );
  }

  const isLoading = rankingData === undefined;
  const users = rankingData?.page ?? [];
  const total = rankingData?.total ?? 0;
  const nextCursor = rankingData?.nextCursor;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ranking de Colecionadores</h1>
        <p className="text-muted-foreground">
          Usuarios ordenados por menor quantidade de figurinhas faltando (mais
          perto de completar o album).
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Top Colecionadores
          </CardTitle>
          <CardDescription>
            Exibindo {users.length} de {total} usuarios qualificados (excluindo
            usuarios sem cidade e com mais de 1000 figurinhas faltando)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Usuario</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead className="text-right">
                        <span className="inline-flex items-center gap-1">
                          <ArrowUp className="h-3 w-3" />
                          Faltando
                        </span>
                      </TableHead>
                      <TableHead className="text-right">Repetidas</TableHead>
                      <TableHead className="min-w-40">Progresso</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user, idx) => {
                      const rank = cursor + idx + 1;
                      const albumPercent = getAlbumPercent(
                        user.albumCompletionPct,
                      );

                      return (
                        <TableRow key={user._id}>
                          <TableCell className="font-mono text-muted-foreground">
                            {rank}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar className="h-8 w-8">
                                {user.avatarUrl && (
                                  <AvatarImage src={user.avatarUrl} />
                                )}
                                <AvatarFallback className="text-xs">
                                  {getInitials(user.displayNickname || user.nickname || user.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium">
                                  {user.displayNickname || user.nickname || user.name}
                                </div>
                                {user.nickname && user.nickname !== user.name && (
                                  <div className="text-xs text-muted-foreground">
                                    {user.name}
                                  </div>
                                )}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2 text-sm">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span>{getCityLabel(user.city)}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right font-medium tabular-nums">
                            {user.missingCount}
                          </TableCell>
                          <TableCell className="text-right tabular-nums text-muted-foreground">
                            {user.duplicatesCount}
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between text-sm">
                                <span className="flex items-center gap-1">
                                  <BookOpen className="h-3 w-3 text-muted-foreground" />
                                  {albumPercent.toFixed(1)}%
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.albumProgress} completas
                                </span>
                              </div>
                              <Progress value={albumPercent} className="h-2" />
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCursor(Math.max(0, cursor - limit))}
                  disabled={cursor === 0}
                >
                  Anterior
                </Button>
                <span className="text-sm text-muted-foreground">
                  Mostrando {cursor + 1}-{Math.min(cursor + users.length, total)}{" "}
                  de {total}
                </span>
                <Button
                  variant="outline"
                  onClick={() => nextCursor != null && setCursor(nextCursor)}
                  disabled={nextCursor === null}
                >
                  Proximo
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
