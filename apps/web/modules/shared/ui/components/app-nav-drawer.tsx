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
  BookOpen,
  Inbox,
  LayoutDashboard,
  ListPlus,
  Map as MapIcon,
  MapPin,
  MapPinPlus,
  Menu,
  ShieldCheck,
  StickyNote,
  User,
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
  badgeCount?: number;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

interface RenderedNavItem extends NavItem {
  ariaDisabled: boolean;
}

interface RenderedNavGroup {
  title: string;
  items: RenderedNavItem[];
}

const ONBOARDING_ALLOWED_HREFS = new Set<string>([
  "/cadastrar-figurinhas",
  "/cadastrar-figurinhas/quick",
]);

export function useAppNavGroups(): RenderedNavGroup[] {
  const { isAuthenticated } = useConvexAuth();
  const navContext = useQuery(api.users.getNavContext, isAuthenticated ? {} : "skip");

  return useMemo<RenderedNavGroup[]>(() => {
    const isSuperadminOrCeo =
      navContext?.role === "superadmin" || navContext?.role === "ceo";

    // Fail-closed: enquanto navContext === undefined (primeiro tick) ou null (not authed),
    // desabilitar tudo exceto /cadastrar-figurinhas. Evita flash clicável que dispararia
    // o redirect loop do DashboardShell antes do setup completar.
    const setupCompleted = navContext?.hasCompletedStickerSetup === true;
    const pendingProposalsCount = navContext?.pendingProposalsCount ?? 0;

    const baseGroups: NavGroup[] = [
      {
        title: "Principal",
        items: [
          { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
          { label: "Meu Álbum", href: "/album", icon: StickyNote },
          {
            label: "Cadastrar figurinhas",
            href: "/cadastrar-figurinhas/quick",
            icon: ListPlus,
          },
          { label: "Encontrar trocas", href: "/matches", icon: ArrowLeftRight },
          {
            label: "Propostas",
            href: "/propostas",
            icon: Inbox,
            badgeCount: pendingProposalsCount,
          },
          { label: "Mapa da arena", href: "/map", icon: MapIcon },
        ],
      },
      {
        title: "Meus dados",
        items: [
          { label: "Perfil", href: "/perfil", icon: User },
          { label: "Meus pontos", href: "/meus-pontos", icon: MapPin },
          { label: "Sugerir ponto", href: "/ponto/solicitar", icon: MapPinPlus },
        ],
      },
      ...(isSuperadminOrCeo
        ? [
            {
              title: "Admin",
              items: [
                { label: "Aprovar pontos", href: "/admin/points", icon: ShieldCheck },
                { label: "Usuários", href: "/admin/users", icon: UserCog },
                { label: "Blog", href: "/admin/blog", icon: BookOpen },
              ],
            },
          ]
        : []),
    ];

    return baseGroups.map((group) => ({
      title: group.title,
      items: group.items.map((item) => ({
        ...item,
        ariaDisabled: !setupCompleted && !ONBOARDING_ALLOWED_HREFS.has(item.href),
      })),
    }));
  }, [
    navContext?.role,
    navContext?.hasCompletedStickerSetup,
    navContext?.pendingProposalsCount,
  ]);
}

interface SidebarContentProps {
  groups: RenderedNavGroup[];
  pathname: string;
  onNavigate?: () => void;
}

export function AppSidebarContent({ groups, pathname, onNavigate }: SidebarContentProps) {
  return (
    <>
      <div className="flex items-center gap-2 px-6 py-5">
        <div className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground font-headline text-sm font-black">
          FF
        </div>
        <span className="font-headline text-base font-bold tracking-tight">
          figurinhafácil
        </span>
      </div>
      <nav className="space-y-6 px-4">
        {groups.map((group, groupIndex) => (
          <div key={group.title || `group-${groupIndex}`} className="space-y-1">
            {group.title && (
              <p className="px-3 pb-1 text-[0.6875rem] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.title}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              const baseClass = cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              );

              const badge =
                item.badgeCount && item.badgeCount > 0 ? (
                  <span
                    aria-label={`${item.badgeCount} pendentes`}
                    className={cn(
                      "ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 font-mono text-[10px] font-bold tabular-nums",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-tertiary text-tertiary-foreground"
                    )}
                  >
                    {item.badgeCount > 99 ? "99+" : item.badgeCount}
                  </span>
                ) : null;

              if (item.ariaDisabled) {
                return (
                  <span
                    key={item.href}
                    aria-disabled="true"
                    tabIndex={-1}
                    className={cn(baseClass, "pointer-events-none opacity-50")}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                    {badge}
                  </span>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={baseClass}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {badge}
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
