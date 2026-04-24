"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, X, Star, Trophy, Sparkles, Filter } from "lucide-react";
import { Input } from "@workspace/ui/components/input";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

interface LegendNumber {
  number: number;
  name: string;
}

interface Team {
  name: string;
  code: string;
  slug: string;
  flagEmoji?: string;
  startNumber: number;
  endNumber: number;
  stickerCount: number;
  goldenNumbers: number[];
  legendNumbers: LegendNumber[];
}

interface StickersHubClientProps {
  teams: Team[];
}

type FilterType = "all" | "golden" | "legend";

export function StickersHubClient({ teams }: StickersHubClientProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredTeams = useMemo(() => {
    let result = teams;

    if (query.trim()) {
      const lowerQuery = query.toLowerCase().trim();
      const numQuery = parseInt(query, 10);

      result = result.map((team) => {
        const nameMatch = team.name.toLowerCase().includes(lowerQuery);
        const codeMatch = team.code.toLowerCase().includes(lowerQuery);

        if (nameMatch || codeMatch) return team;

        if (!isNaN(numQuery) && numQuery >= team.startNumber && numQuery <= team.endNumber) {
          return team;
        }

        return null;
      }).filter(Boolean) as Team[];
    }

    return result;
  }, [teams, query]);

  const getStickerNumbers = (team: Team) => {
    const numbers: number[] = [];
    for (let n = team.startNumber; n <= team.endNumber; n++) {
      if (filter === "golden" && !team.goldenNumbers.includes(n)) continue;
      if (filter === "legend" && !team.legendNumbers.find((l) => l.number === n)) continue;
      numbers.push(n);
    }
    return numbers;
  };

  const totalGolden = teams.reduce((acc, t) => acc + t.goldenNumbers.length, 0);
  const totalLegends = teams.reduce((acc, t) => acc + t.legendNumbers.length, 0);

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar por seleção ou número..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9 pr-9"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={() => setQuery("")}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Limpar busca</span>
            </Button>
          )}
        </div>

        <div className="flex gap-2 justify-center">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
            className="rounded-full"
          >
            <Filter className="h-3.5 w-3.5 mr-1" />
            Todas
          </Button>
          <Button
            variant={filter === "golden" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("golden")}
            className="rounded-full text-yellow-600 border-yellow-600 hover:bg-yellow-500 hover:text-black"
          >
            <Star className="h-3.5 w-3.5 mr-1 fill-current" />
            Douradas ({totalGolden})
          </Button>
          <Button
            variant={filter === "legend" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("legend")}
            className="rounded-full text-purple-600 border-purple-600 hover:bg-purple-600 hover:text-white"
          >
            <Trophy className="h-3.5 w-3.5 mr-1" />
            Lendas ({totalLegends})
          </Button>
        </div>
      </div>

      {/* Teams Grid */}
      <div className="space-y-12">
        {filteredTeams.map((team) => {
          const numbers = getStickerNumbers(team);
          if (numbers.length === 0 && filter !== "all") return null;

          return (
            <Card key={team.code} id={team.slug}>
              <CardHeader>
                <CardTitle className="flex items-center gap-3 text-xl">
                  {team.flagEmoji && <span className="text-3xl">{team.flagEmoji}</span>}
                  <Link
                    href={`/selecao/${team.slug}`}
                    className="hover:text-primary"
                  >
                    {team.name}
                  </Link>
                  <Badge variant="secondary">
                    {team.startNumber}-{team.endNumber}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {(filter === "all"
                    ? Array.from({ length: team.stickerCount }, (_, i) => team.startNumber + i)
                    : numbers
                  ).map((num) => {
                    const isGolden = team.goldenNumbers.includes(num);
                    const legend = team.legendNumbers.find((l) => l.number === num);

                    return (
                      <Link key={num} href={`/figurinha/${num}`}>
                        <Badge
                          variant={isGolden || legend ? "default" : "outline"}
                          className={`
                            cursor-pointer transition-colors hover:scale-105
                            ${isGolden ? "bg-yellow-500 hover:bg-yellow-600 text-black" : ""}
                            ${legend ? "bg-purple-600 hover:bg-purple-700" : ""}
                            ${!isGolden && !legend ? "hover:bg-primary hover:text-primary-foreground" : ""}
                          `}
                          title={legend?.name}
                        >
                          {num}
                          {isGolden && <Star className="h-3 w-3 ml-1 fill-current" />}
                          {legend && <Trophy className="h-3 w-3 ml-1" />}
                        </Badge>
                      </Link>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTeams.length === 0 && (
        <div className="text-center py-12">
          <Sparkles className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">Nenhuma figurinha encontrada</p>
          <p className="text-muted-foreground">
            Tente buscar por outro nome ou número
          </p>
        </div>
      )}
    </div>
  );
}
