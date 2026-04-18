"use client";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  createContext,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { MapPinPlus, ArrowRight } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Heading, Text } from "@workspace/ui/components/typography";
import { AppNavDrawer } from "@/modules/shared/ui/components/app-nav-drawer";
import { useArenaMap } from "../../lib/use-arena-map";
import { TradePointCard } from "../components/trade-point-card";

export const MapSelectionContext = createContext<{
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
} | null>(null);

export function useMapSelection() {
  const ctx = useContext(MapSelectionContext);
  if (!ctx) throw new Error("useMapSelection outside provider");
  return ctx;
}

const DynamicMapView = dynamic(
  () => import("../components/map-view").then((m) => m.MapView),
  {
    ssr: false,
    loading: () => <div className="h-[50dvh] animate-pulse bg-muted" />,
  }
);

const MemoMapView = memo(DynamicMapView, (prev, next) => {
  if (prev.center[0] !== next.center[0] || prev.center[1] !== next.center[1])
    return false;
  if (prev.userLocation?.lat !== next.userLocation?.lat) return false;
  if (prev.userLocation?.lng !== next.userLocation?.lng) return false;
  if (prev.points.length !== next.points.length) return false;
  const nextIds = new Set(next.points.map((p) => p._id));
  return prev.points.every((p) => nextIds.has(p._id));
});

export function MapArenaView() {
  const router = useRouter();
  const { status, userCoords, mapCenter, points } = useArenaMap();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectionValue = useMemo(
    () => ({ selectedId, setSelectedId }),
    [selectedId]
  );

  useEffect(() => {
    if (status.kind === "needs-bootstrap") router.replace("/bootstrap");
  }, [status.kind, router]);

  if (status.kind === "needs-bootstrap") return null;

  const isLoading = status.kind === "loading";
  const needsCity = status.kind === "needs-city";
  const isReady = status.kind === "ready";

  return (
    <MapSelectionContext.Provider value={selectionValue}>
      <main className="relative flex min-h-[100dvh] flex-col bg-background text-foreground">
        <header className="sticky top-0 z-50 flex items-center justify-between bg-background/80 px-6 pt-[max(theme(spacing.4),env(safe-area-inset-top))] pb-4 backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <AppNavDrawer />
            <div className="flex flex-col">
              <Text
                variant="small"
                className="font-bold uppercase tracking-widest text-primary"
              >
                Figurinha Fácil
              </Text>
              <Heading level={1} className="text-xl">
                Mapa da Arena
              </Heading>
            </div>
          </div>
        </header>

        <div>
          <section className="relative">
            {isReady && mapCenter ? (
              <MemoMapView
                center={mapCenter}
                userLocation={userCoords}
                points={points}
              />
            ) : (
              <div className="h-[50dvh] animate-pulse bg-muted" />
            )}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-background/0 to-background"
            />
          </section>

          <section className="relative z-10 space-y-6 px-6 pt-6 pb-32">
            <div>
              <Heading level={2}>Pontos de Troca</Heading>
              <Text variant="muted">Encontre colecionadores perto de você</Text>
            </div>

            {needsCity && (
              <div className="rounded-xl border border-border bg-muted/40 p-6 text-center">
                <Text>Selecione sua cidade para ver pontos próximos.</Text>
                <Button
                  className="mt-4"
                  onClick={() => router.push("/selecionar-localizacao")}
                >
                  Escolher cidade <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            )}
            {isReady && points.length === 0 && (
              <div className="rounded-xl border border-border bg-muted/40 p-6 text-center">
                <Text>Nenhum ponto aprovado nesta cidade ainda.</Text>
                <Button asChild variant="outline" className="mt-4">
                  <Link href="/ponto/solicitar">Sugerir um ponto</Link>
                </Button>
              </div>
            )}
            {isLoading && (
              <>
                <div className="h-40 animate-pulse rounded-2xl bg-muted/40" />
                <div className="h-40 animate-pulse rounded-2xl bg-muted/40" />
              </>
            )}
            {isReady &&
              points.map((p) => <TradePointCard key={p._id} point={p} />)}
          </section>
        </div>

        <Button
          asChild
          size="icon"
          aria-label="Sugerir ponto"
          className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-xl"
        >
          <Link href="/ponto/solicitar">
            <MapPinPlus className="h-6 w-6" />
          </Link>
        </Button>
      </main>
    </MapSelectionContext.Provider>
  );
}
