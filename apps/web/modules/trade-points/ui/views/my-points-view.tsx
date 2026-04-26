"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { Download, Map, MapPin, MapPinPlus } from "lucide-react";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent } from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";

import {
  MyPointCard,
  MyPointCardSkeleton,
  type MyPointCardData,
} from "../components/my-point-card";
import { PointsKpiStrip } from "../components/points-kpi-strip";
import {
  PointsToolbar,
  type FilterTab,
  type LayoutMode,
  type SortKey,
} from "../components/points-toolbar";

const TABS: readonly FilterTab[] = ["all", "live", "frequent", "favorites"];
const SORTS: readonly SortKey[] = ["active", "recent", "score", "joined"];
const LAYOUTS: readonly LayoutMode[] = ["grid", "list"];

function pick<T extends string>(
  value: string | null,
  allowed: readonly T[],
  fallback: T
): T {
  return (allowed as readonly string[]).includes(value ?? "")
    ? (value as T)
    : fallback;
}

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(t);
  }, [value, delayMs]);
  return debounced;
}

export function MyPointsView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tab = pick(searchParams.get("tab"), TABS, "all");
  const sort = pick(searchParams.get("sort"), SORTS, "active");
  const layout = pick(searchParams.get("layout"), LAYOUTS, "grid");
  const initialQ = decodeURIComponent(searchParams.get("q") ?? "").slice(0, 100);

  const [qLocal, setQLocal] = useState(initialQ);
  const qDebounced = useDebouncedValue(qLocal, 300);

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const next = new URLSearchParams(searchParams.toString());
      mutate(next);
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  useEffect(() => {
    updateParams((p) => {
      if (qDebounced) p.set("q", encodeURIComponent(qDebounced));
      else p.delete("q");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qDebounced]);

  const dashboard = useQuery(api.userTradePoints.getMyPointsDashboard, {
    q: qDebounced || undefined,
    filter: tab,
    sort,
  });

  const points: MyPointCardData[] = useMemo(
    () => (dashboard?.points ?? []) as MyPointCardData[],
    [dashboard?.points]
  );

  const counts = useMemo(() => {
    if (!dashboard) return { all: 0, live: 0, frequent: 0, favorites: 0 };
    return {
      all: dashboard.cap.current,
      live: dashboard.points.filter((p) => p.activeCheckinsCount > 0).length,
      frequent: dashboard.points.filter(
        (p) => p.badge === "frequent" || p.badge === "organizer"
      ).length,
      favorites: dashboard.points.filter((p) => p.isFavorite).length,
    };
  }, [dashboard]);

  const hasActiveFilters = tab !== "all" || qDebounced.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight md:text-4xl">
            Meus pontos
          </h1>
          <p className="mt-1 max-w-xl text-sm text-on-surface-variant">
            Pontos de troca onde você fez check-in. Acompanhe atividade ao
            vivo, próximos encontros e quem está lá agora.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="gap-2">
            <Download className="size-4" aria-hidden />
            Exportar
          </Button>
          <Button asChild size="lg" className="gap-2">
            <Link href="/map">
              <Map className="size-4" aria-hidden />
              Explorar mapa
            </Link>
          </Button>
        </div>
      </div>

      {dashboard ? (
        <PointsKpiStrip stats={dashboard.stats} cap={dashboard.cap} />
      ) : (
        <KpiStripSkeleton />
      )}

      <PointsToolbar
        tab={tab}
        q={qLocal}
        sort={sort}
        layout={layout}
        counts={counts}
        onTabChange={(v) =>
          updateParams((p) =>
            v === "all" ? p.delete("tab") : p.set("tab", v)
          )
        }
        onSearchChange={setQLocal}
        onSortChange={(v) =>
          updateParams((p) =>
            v === "active" ? p.delete("sort") : p.set("sort", v)
          )
        }
        onLayoutChange={(v) =>
          updateParams((p) =>
            v === "grid" ? p.delete("layout") : p.set("layout", v)
          )
        }
      />

      {dashboard === undefined ? (
        <SkeletonGrid />
      ) : points.length === 0 ? (
        hasActiveFilters ? (
          <EmptyFiltered
            onClear={() =>
              updateParams((p) => {
                p.delete("tab");
                p.delete("q");
                setQLocal("");
              })
            }
          />
        ) : (
          <EmptyZeroPoints />
        )
      ) : (
        <PointsGrid points={points} layout={layout} />
      )}
    </div>
  );
}

function PointsGrid({
  points,
  layout,
}: {
  points: MyPointCardData[];
  layout: LayoutMode;
}) {
  return (
    <div
      className={cn(
        "grid gap-4",
        layout === "grid"
          ? "[grid-template-columns:repeat(auto-fill,minmax(420px,1fr))]"
          : "grid-cols-1"
      )}
    >
      {points.map((p) => (
        <MyPointCard key={p._id} point={p} layout={layout} />
      ))}
      <Link
        href="/ponto/solicitar"
        className="group flex min-h-[380px] flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-outline-variant/30 p-9 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary transition-transform group-hover:scale-110">
          <MapPinPlus className="size-7" aria-hidden />
        </div>
        <h3 className="font-headline text-base font-bold">
          Sugerir um novo ponto
        </h3>
        <p className="max-w-[260px] text-xs text-on-surface-variant">
          Conhece um lugar bom pra trocar figurinhas? Indique e ajude outros
          colecionadores a encontrarem.
        </p>
        <span className="rounded-full bg-tertiary/10 px-3 py-1 text-[0.7rem] font-bold text-tertiary">
          +50 pontos por sugestão aprovada
        </span>
      </Link>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="grid gap-4 [grid-template-columns:repeat(auto-fill,minmax(420px,1fr))]">
      {[0, 1, 2, 3].map((i) => (
        <MyPointCardSkeleton key={i} />
      ))}
    </div>
  );
}

function KpiStripSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {[0, 1, 2, 3].map((i) => (
        <Card
          key={i}
          className="h-[112px] gap-2 overflow-hidden border-outline-variant/10 bg-surface-container-low p-4"
        >
          <div className="h-3 w-24 animate-pulse rounded bg-muted" />
          <div className="h-7 w-16 animate-pulse rounded bg-muted" />
          <div className="h-3 w-20 animate-pulse rounded bg-muted" />
        </Card>
      ))}
    </div>
  );
}

function EmptyZeroPoints() {
  return (
    <Card className="border-dashed border-outline-variant/30 bg-transparent">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-16 text-center">
        <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
          <MapPin className="size-7" aria-hidden />
        </div>
        <h3 className="font-headline text-lg font-bold">
          Encontre seu ponto de troca
        </h3>
        <p className="max-w-md text-sm text-on-surface-variant">
          Pontos são locais verificados onde colecionadores se encontram.
          Escolha um perto de você no mapa.
        </p>
        <Button asChild className="mt-2">
          <Link href="/map">Explorar pontos no mapa</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function EmptyFiltered({ onClear }: { onClear: () => void }) {
  return (
    <Card className="border-dashed border-outline-variant/30 bg-transparent">
      <CardContent className="flex flex-col items-center justify-center gap-3 py-12 text-center">
        <h3 className="font-headline text-base font-bold">
          Nenhum ponto encontrado
        </h3>
        <p className="max-w-md text-sm text-on-surface-variant">
          Tente outros filtros ou termos de busca.
        </p>
        <Button variant="outline" size="sm" onClick={onClear}>
          Limpar filtros
        </Button>
      </CardContent>
    </Card>
  );
}
