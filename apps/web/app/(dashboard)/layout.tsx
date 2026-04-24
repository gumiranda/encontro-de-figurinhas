import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { DashboardShell } from "./dashboard-shell";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <Providers>
        <DashboardShell>{children}</DashboardShell>
      </Providers>
    </Suspense>
  );
}
