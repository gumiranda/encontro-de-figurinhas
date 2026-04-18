import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      {children}
    </div>
  );
};
export default Layout;
