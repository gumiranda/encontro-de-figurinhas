"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { RoleBadge } from "@/components/role-badge";
import { MobileBottomNav } from "@/modules/shared/ui/components/mobile-bottom-nav";
import {
  AppNavDrawer,
  AppSidebarContent,
  useAppNavGroups,
} from "@/modules/shared/ui/components/app-nav-drawer";
import { UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { useConvexAuth, useQuery } from "convex/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const isSuperadminOrCeo =
    currentUser?.role === "superadmin" || currentUser?.role === "ceo";

  const navGroups = useAppNavGroups();

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
            <UserButton />
          </div>
        </header>
        <main className="p-6 pb-24 lg:pb-6">{children}</main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
