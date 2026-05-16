"use client";

import { Lock } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

export type Achievement = {
  id: string;
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
};

type AchievementsModuleProps = {
  achievements: Achievement[];
};

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first",
    icon: "🎯",
    name: "Primeira troca",
    description: "Realizou sua 1ª troca",
    unlocked: false,
  },
  {
    id: "tenTrades",
    icon: "🤝",
    name: "10 trocas",
    description: "Completou 10 trocas",
    unlocked: false,
  },
  {
    id: "halfAlbum",
    icon: "📖",
    name: "Meio álbum",
    description: "Colou 50% do álbum",
    unlocked: false,
  },
  {
    id: "explorer",
    icon: "🌍",
    name: "Explorador",
    description: "Trocou em 3 cidades",
    unlocked: false,
  },
  {
    id: "highRated",
    icon: "⭐",
    name: "5 estrelas",
    description: "Recebeu 25 avaliações 5★",
    unlocked: false,
  },
  {
    id: "fullAlbum",
    icon: "🏆",
    name: "Álbum cheio",
    description: "Completou 100% do álbum",
    unlocked: false,
  },
];

export function deriveAchievements(stats: {
  totalTrades: number;
  albumCompletionPct: number;
  ratingCount: number;
  ratingAvg?: number;
  citiesTraded?: number;
}): Achievement[] {
  return DEFAULT_ACHIEVEMENTS.map((achievement) => {
    let unlocked = false;

    switch (achievement.id) {
      case "first":
        unlocked = stats.totalTrades >= 1;
        break;
      case "tenTrades":
        unlocked = stats.totalTrades >= 10;
        break;
      case "halfAlbum":
        unlocked = stats.albumCompletionPct >= 50;
        break;
      case "explorer":
        unlocked = (stats.citiesTraded ?? 0) >= 3;
        break;
      case "highRated":
        unlocked = stats.ratingCount >= 25 && (stats.ratingAvg ?? 0) >= 5;
        break;
      case "fullAlbum":
        unlocked = stats.albumCompletionPct >= 100;
        break;
    }

    return { ...achievement, unlocked };
  });
}

export function AchievementsModule({ achievements }: AchievementsModuleProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <Card className="border-white/10 bg-surface-container">
      <CardHeader className="pb-3">
        <CardTitle className="font-headline text-base">Conquistas</CardTitle>
        <CardDescription>
          {unlockedCount} de {achievements.length} desbloqueadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={cn(
                "relative rounded-xl p-3 text-center transition-all",
                achievement.unlocked
                  ? "bg-surface-container-high border border-outline-variant"
                  : "bg-surface-dim/50 opacity-40"
              )}
              title={achievement.description}
            >
              <div
                className={cn(
                  "text-2xl leading-none mb-1.5",
                  !achievement.unlocked && "grayscale"
                )}
              >
                {achievement.icon}
              </div>
              <div className="text-[11px] font-semibold truncate">
                {achievement.name}
              </div>
              {!achievement.unlocked && (
                <div className="absolute top-1.5 right-1.5 text-muted-foreground">
                  <Lock className="size-2.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
