import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense>
      <Providers>
        <div className="dark min-h-screen min-w-0 overflow-x-clip bg-background text-foreground">
          {children}
        </div>
      </Providers>
    </Suspense>
  );
};
export default Layout;
