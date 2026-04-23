import { Providers } from "@/components/providers";
import "@/components/overdrive/scroll-cinema.css";

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dark min-h-screen bg-background stadium-gradient">
      <Providers>
        {/* Scroll progress indicator */}
        <div className="scroll-progress" aria-hidden="true" />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
        >
          Pular para o conteudo principal
        </a>
        {children}
      </Providers>
    </div>
  );
}
