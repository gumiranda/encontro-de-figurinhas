"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { RoleBadge } from "@/components/role-badge";
import { MobileBottomNav } from "@/modules/shared/ui/components/mobile-bottom-nav";
import { UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { useConvexAuth, useQuery } from "convex/react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  Map as MapIcon,
  MapPin,
  MapPinPlus,
  Menu,
  StickyNote,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

interface SidebarContentProps {
  groups: NavGroup[];
  pathname: string;
  onNavigate?: () => void;
}

function SidebarContent({ groups, pathname, onNavigate }: SidebarContentProps) {
  return (
    <>
      <div className="p-6">
        <h1 className="font-[var(--font-headline)] text-xl font-bold tracking-tight">
          Figurinha Fácil
        </h1>
      </div>
      <nav className="space-y-6 px-4">
        {groups.map((group) => (
          <div key={group.title} className="space-y-1">
            <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-widest text-muted-foreground">
              {group.title}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                    isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
    </>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const isSuperadminOrCeo =
    currentUser?.role === "superadmin" || currentUser?.role === "ceo";

  const navGroups: NavGroup[] = [
    {
      title: "Principal",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
        { label: "Meu Álbum", href: "/album", icon: StickyNote },
        { label: "Encontrar trocas", href: "/encontrar-trocas", icon: ArrowLeftRight },
        { label: "Mapa da arena", href: "/map", icon: MapIcon },
      ],
    },
    {
      title: "Meus dados",
      items: [
        { label: "Meus pontos", href: "/meus-pontos", icon: MapPin },
        { label: "Sugerir ponto", href: "/ponto/solicitar", icon: MapPinPlus },
      ],
    },
    ...(isSuperadminOrCeo
      ? [
          {
            title: "Admin",
            items: [{ label: "Usuários", href: "/admin/users", icon: UserCog }],
          },
        ]
      : []),
  ];

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
        <SidebarContent groups={navGroups} pathname={pathname} />
      </aside>

      <div className="flex-1">
        <header className="h-14 border-b flex items-center justify-between px-6">
          <div className="flex items-center gap-2">
            <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <SidebarContent
                  groups={navGroups}
                  pathname={pathname}
                  onNavigate={() => setSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>

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
