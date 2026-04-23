import Link from "next/link";
import { Store, ArrowRight } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";

interface RelatedPoint {
  slug: string;
  name: string;
  address?: string;
}

interface RelatedPointsProps {
  points: RelatedPoint[];
  cityName: string;
  citySlug: string;
  currentPointSlug?: string;
}

export function RelatedPoints({
  points,
  cityName,
  citySlug,
  currentPointSlug,
}: RelatedPointsProps) {
  const filteredPoints = points.filter((p) => p.slug !== currentPointSlug);

  if (filteredPoints.length === 0) return null;

  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end justify-between mb-6 flex-wrap gap-4">
            <div>
              <h2 className="text-xl md:text-2xl font-headline font-bold">
                Outros pontos em {cityName}
              </h2>
              <p className="text-muted-foreground mt-1">
                {filteredPoints.length}{" "}
                {filteredPoints.length === 1
                  ? "ponto de troca próximo"
                  : "pontos de troca próximos"}
              </p>
            </div>
            <Link
              href={`/cidade/${citySlug}`}
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Ver todos em {cityName}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPoints.slice(0, 6).map((point) => (
              <li key={point.slug}>
                <Link
                  href={`/ponto/${point.slug}`}
                  className="group flex items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:border-primary/50 hover:bg-primary/5"
                >
                  <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Store className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium group-hover:text-primary truncate">
                      {point.name}
                    </p>
                    {point.address && (
                      <p className="text-sm text-muted-foreground truncate">
                        {point.address}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>

          {filteredPoints.length > 6 && (
            <div className="mt-4 text-center">
              <Link
                href={`/cidade/${citySlug}`}
                className="text-sm text-primary hover:underline"
              >
                Ver mais {filteredPoints.length - 6} pontos
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
