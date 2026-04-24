import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { MobileBottomNav } from "@/modules/shared/ui/components/mobile-bottom-nav";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

function MobileNavSkeleton() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-surface-container-low/95 backdrop-blur-xl h-16 lg:hidden" />
  );
}

export default function ArenaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <Providers>
        <div className="dark min-h-screen bg-background text-foreground">
          <div className="pb-24 lg:pb-0">{children}</div>
          <Suspense fallback={<MobileNavSkeleton />}>
            <MobileBottomNav />
          </Suspense>
        </div>
      </Providers>
    </Suspense>
  );
}
