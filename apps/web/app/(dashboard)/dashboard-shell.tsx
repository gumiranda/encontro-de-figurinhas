"use client";

import { FullPageLoader } from "@/components/full-page-loader";
import { RoleBadge } from "@/components/role-badge";
import { UserButton } from "@clerk/nextjs";
import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import { Sheet, SheetContent, SheetTrigger } from "@workspace/ui/components/sheet";
import { cn } from "@workspace/ui/lib/utils";
import { useConvexAuth, useQuery } from "convex/react";
import { LayoutDashboard, Menu, UserCog, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useMemo, useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface SidebarContentProps {
  navItems: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}

function SidebarContent({ navItems, pathname, onNavigate }: SidebarContentProps) {
  return (
    <>
      <div className="p-6">
        <h1 className="text-xl font-bold">Template App</h1>
      </div>
      <nav className="px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useConvexAuth();

  const currentUser = useQuery(api.users.getCurrentUser, isAuthenticated ? {} : "skip");

  const isSuperadminOrCeo =
    currentUser?.role === "superadmin" || currentUser?.role === "ceo";

  const navItems = useMemo(
    () => [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      ...(isSuperadminOrCeo
        ? [{ label: "Users", href: "/admin/users", icon: UserCog }]
        : []),
    ],
    [isSuperadminOrCeo]
  );

  // Middleware handles auth redirect to /sign-in
  if (authLoading || !isAuthenticated || currentUser === undefined) {
    return <FullPageLoader />;
  }

  // Needs onboarding - redirect to complete profile
  if (!currentUser?.hasCompletedOnboarding) {
    redirect("/complete-profile");
  }

  const isSuperadmin = currentUser.role === "superadmin";
  const isCeo = currentUser.role === "ceo";

  return (
    <div className="flex min-h-screen">
      <aside className="hidden md:block w-64 border-r bg-muted/40">
        <SidebarContent navItems={navItems} pathname={pathname} />
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
                  navItems={navItems}
                  pathname={pathname}
                  onNavigate={() => setSidebarOpen(false)}
                />
              </SheetContent>
            </Sheet>

            {(isSuperadmin || isCeo) && <RoleBadge role={currentUser.role} />}
          </div>
          <div className="flex items-center gap-4">
            <UserButton />
          </div>
        </header>
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
