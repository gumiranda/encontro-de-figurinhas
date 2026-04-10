import "@workspace/ui/styles/landing-theme.css";
import { Providers } from "@/components/providers";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="landing-theme dark min-h-screen bg-[#090e1c] stadium-gradient">
      <Providers>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--landing-primary)] focus:text-[var(--landing-on-primary)] focus:px-4 focus:py-2 focus:rounded-lg"
        >
          Pular para o conteudo principal
        </a>
        {children}
      </Providers>
    </div>
  );
}
