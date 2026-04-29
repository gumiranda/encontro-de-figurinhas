"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Progress } from "@workspace/ui/components/progress";

type Props = {
  progress: number;
  albumProgress: number;
};

export function AlbumProgressSection({ progress, albumProgress }: Props) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Progresso do álbum</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">{progress.toFixed(1)}% completo</span>
          <span className="font-medium">{albumProgress}/980</span>
        </div>
        <Progress value={progress} className="h-3" />
      </CardContent>
    </Card>
  );
}
