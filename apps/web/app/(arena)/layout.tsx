import type { Metadata } from "next";
import { MobileBottomNav } from "@/modules/shared/ui/components/mobile-bottom-nav";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="pb-24 lg:pb-0">{children}</div>
      <MobileBottomNav />
    </div>
  );
}
