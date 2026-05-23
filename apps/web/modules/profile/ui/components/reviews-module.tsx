"use client";

import { Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";

export interface Review {
  name: string;
  rating: number;
  text: string;
  when: string;
}

interface ReviewsModuleProps {
  reviews: Review[];
  averageRating: number;
  totalCount: number;
}

export function ReviewsModule({
  reviews,
  averageRating,
  totalCount,
}: ReviewsModuleProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-semibold">Avaliações</CardTitle>
        <span className="inline-flex items-center gap-1 text-sm">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-mono font-bold">{averageRating}</span>
          <span className="text-muted-foreground">· {totalCount}</span>
        </span>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {reviews.map((r, i) => (
          <div
            key={i}
            className="rounded-xl border border-border bg-muted/50 p-3"
          >
            <div className="mb-1 flex items-center justify-between">
              <span className="text-sm font-semibold">{r.name}</span>
              <span className="inline-flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-2.5 w-2.5 ${
                      n <= r.rating
                        ? "fill-amber-400 text-amber-400"
                        : "text-border"
                    }`}
                  />
                ))}
              </span>
            </div>
            <div className="text-sm leading-relaxed text-muted-foreground">
              "{r.text}"
            </div>
            <div className="mt-1.5 text-[11px] text-muted-foreground/60">
              {r.when}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
