"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ArrowLeftRight,
  ListPlus,
  MapPinPlus,
  Menu,
  StickyNote,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useConvexAuth, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { FullPageLoader } from "@/components/full-page-loader";
import { RoleBadge } from "@/components/role-badge";
import { MobileBottomNav } from "@/modules/shared/ui/components/mobile-bottom-nav";
import {
  AppNavDrawer,
  AppSidebarContent,
  useAppNavGroups,
} from "@/modules/shared/ui/components/app-nav-drawer";
import { useEffect } from "react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const isSuperadminOrCeo =
    currentUser?.role === "superadmin" || currentUser?.role === "ceo";

  const navGroups = useAppNavGroups();

  // NÃO mover pra middleware: onboarding state vem de useQuery do Convex,
  // que hidrata apenas no cliente. Convex não expõe esse estado em server/edge
  // sem duplicar a camada de auth. react-doctor flagga, mas é o padrão correto.
  useEffect(() => {
    if (!isAuthenticated || authLoading || currentUser === undefined) return;
    if (currentUser === null || !currentUser.hasCompletedOnboarding) {
      router.replace("/complete-profile");
    } else if (!currentUser.hasCompletedStickerSetup) {
      router.replace("/cadastrar-figurinhas");
    } else if (!currentUser.locationSource) {
      router.replace("/selecionar-localizacao");
    }
  }, [isAuthenticated, authLoading, currentUser, router]);

  const isFullyOnboarded =
    currentUser?.hasCompletedOnboarding &&
    currentUser?.hasCompletedStickerSetup &&
    currentUser?.locationSource;

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
        <header className="h-14 border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <AppNavDrawer className="md:hidden" />

            {isSuperadminOrCeo && <RoleBadge role={currentUser.role} />}
          </div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="hidden gap-2 md:flex"
                >
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
            <UserButton />
          </div>
        </header>
        <main className="p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
