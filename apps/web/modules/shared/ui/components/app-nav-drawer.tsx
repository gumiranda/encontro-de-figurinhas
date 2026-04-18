"use client";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { useConvexAuth, useQuery } from "convex/react";
import {
  ArrowLeftRight,
  LayoutDashboard,
  ListPlus,
  Map as MapIcon,
  MapPin,
  MapPinPlus,
  Menu,
  StickyNote,
  UserCog,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export function useAppNavGroups(): NavGroup[] {
  const { isAuthenticated } = useConvexAuth();
  const currentUser = useQuery(
    api.users.getCurrentUser,
    isAuthenticated ? {} : "skip"
  );

  return useMemo<NavGroup[]>(() => {
    const isSuperadminOrCeo =
      currentUser?.role === "superadmin" || currentUser?.role === "ceo";

    return [
      {
        title: "Principal",
        items: [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Meu Álbum", href: "/album", icon: StickyNote },
          { label: "Cadastrar figurinhas", href: "/cadastrar-figurinhas", icon: ListPlus },
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
  }, [currentUser?.role]);
}

interface SidebarContentProps {
  groups: NavGroup[];
  pathname: string;
  onNavigate?: () => void;
}

export function AppSidebarContent({ groups, pathname, onNavigate }: SidebarContentProps) {
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

interface AppNavDrawerProps {
  className?: string;
  variant?: "ghost" | "outline";
  size?: "icon" | "sm" | "default";
}

export function AppNavDrawer({
  className,
  variant = "ghost",
  size = "icon",
}: AppNavDrawerProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const groups = useAppNavGroups();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={className}
          aria-label="Abrir menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64 p-0">
        <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
        <AppSidebarContent
          groups={groups}
          pathname={pathname}
          onNavigate={() => setOpen(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
