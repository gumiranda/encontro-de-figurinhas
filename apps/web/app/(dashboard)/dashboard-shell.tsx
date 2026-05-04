"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { RoleBadge } from "@/components/role-badge";
import {
  AppNavDrawer,
  AppSidebarContent,
  useAppNavGroups,
} from "@/modules/shared/ui/components/app-nav-drawer";
import { MobileBottomNav } from "@/modules/shared/ui/components/mobile-bottom-nav";
import { UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { cn } from "@workspace/ui/lib/utils";
import { useConvexAuth, useQuery } from "convex/react";
import {
  ArrowLeftRight,
  Bell,
  ChevronRight,
  HelpCircle,
  ListPlus,
  MapPinPlus,
  Menu,
  StickyNote,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const ROUTE_LABELS: Record<string, string> = {
  "/dashboard": "Início",
  "/album": "Meu álbum",
  "/matches": "Encontrar trocas",
  "/propostas": "Propostas de troca",
  "/map": "Mapa",
  "/comunidade": "Comunidade",
  "/perfil": "Perfil",
  "/ajustes": "Ajustes",
  "/meus-pontos": "Meus pontos",
  "/cadastrar-figurinhas/quick": "Adicionar figurinhas",
};

function titleCase(segment: string): string {
  if (!segment) return "";
  return segment
    .split("-")
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(" ");
}

function TopbarBreadcrumb({ pathname }: { pathname: string }) {
  const isRoot = pathname === "/dashboard";
  const label =
    ROUTE_LABELS[pathname] ?? titleCase(pathname.split("/").filter(Boolean).at(-1) ?? "");

  return (
    <nav aria-label="Breadcrumb" className="hidden text-sm md:block">
      <ol className="flex items-center gap-2">
        {isRoot ? (
          <li className="font-medium text-on-surface">Início</li>
        ) : (
          <>
            <li>
              <Link
                href="/dashboard"
                className="text-on-surface-variant transition-colors hover:text-primary"
              >
                Início
              </Link>
            </li>
            <li aria-hidden>
              <ChevronRight className="size-3.5 text-on-surface-variant/60" />
            </li>
            <li className="font-medium text-on-surface" aria-current="page">
              {label}
            </li>
          </>
        )}
      </ol>
    </nav>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const onboardingGateRef = useRef({
    isAuthenticated,
    authLoading,
    currentUser,
  });
  onboardingGateRef.current = { isAuthenticated, authLoading, currentUser };

  const isSuperadminOrCeo =
    currentUser?.role === "superadmin" || currentUser?.role === "ceo";

  const navGroups = useAppNavGroups();

  // NÃO mover pra middleware: onboarding state vem de useQuery do Convex,
  // que hidrata apenas no cliente. Convex não expõe esse estado em server/edge
  // sem duplicar a camada de auth. react-doctor flagga, mas é o padrão correto.
  //
  // Debounce: após setLocation + router.replace("/dashboard"), o primeiro snapshot
  // de getCurrentUser pode ser obsoleto por um frame e disparar redirect errado
  // (ex.: volta para /cadastrar-figurinhas).
  useEffect(() => {
    if (!isAuthenticated || authLoading || currentUser === undefined) return;

    const id = window.setTimeout(() => {
      const {
        isAuthenticated: ia,
        authLoading: al,
        currentUser: u,
      } = onboardingGateRef.current;
      if (!ia || al || u === undefined) return;
      if (u === null || !u.hasCompletedOnboarding) {
        router.replace("/complete-profile");
      } else if (!u.locationSource) {
        router.replace("/selecionar-localizacao");
      }
    }, 120);

    return () => window.clearTimeout(id);
  }, [isAuthenticated, authLoading, currentUser, router]);

  const isFullyOnboarded =
    currentUser?.hasCompletedOnboarding && currentUser?.locationSource;

  const isLoading = authLoading || !isAuthenticated || currentUser === undefined;
  if (isLoading || !currentUser || !isFullyOnboarded) {
    return <FullPageLoader />;
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-64 border-r bg-muted/40">
        <AppSidebarContent groups={navGroups} pathname={pathname} />
      </aside>

      <div className="flex-1">
        <header className="flex h-14 items-center justify-between border-b px-6">
          <div className="flex items-center gap-3">
            <AppNavDrawer className="md:hidden" />
            <TopbarBreadcrumb pathname={pathname} />
            {isSuperadminOrCeo && <RoleBadge role={currentUser.role} />}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              aria-label="Notificações"
              className={cn("size-9 rounded-full")}
            >
              <Bell className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Ajuda"
              className="size-9 rounded-full"
            >
              <HelpCircle className="size-4" />
            </Button>
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="hidden gap-2 md:flex">
                    <Menu className="size-4" />
                    Ações rápidas
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/cadastrar-figurinhas/quick">
                      <ListPlus className="mr-2 size-4" />
                      Adicionar figurinhas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/album">
                      <StickyNote className="mr-2 size-4" />
                      Ver álbum
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/matches">
                      <ArrowLeftRight className="mr-2 size-4" />
                      Buscar trocas
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/ponto/solicitar">
                      <MapPinPlus className="mr-2 size-4" />
                      Sugerir ponto
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <UserButton />
          </div>
        </header>
        <main className="p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
