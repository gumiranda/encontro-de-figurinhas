import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Geist, Geist_Mono, Space_Grotesk, Manrope } from "next/font/google";

import "@workspace/ui/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@workspace/ui/components/sonner";

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const fontHeadline = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const fontBody = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const BASE_URL = "https://figurinhafacil.com.br";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#090e1c" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Figurinha Fácil | Troque Figurinhas da Copa 2026 Perto de Você",
    template: "%s | Figurinha Fácil",
  },
  description:
    "A maior rede de troca de figurinhas do Brasil. O álbum da Copa 2026 tem 980 figurinhas - economize até R$ 5.000 trocando com colecionadores em São Paulo, Rio de Janeiro, BH e mais de 100 cidades.",
  keywords: [
    "troca de figurinhas",
    "figurinhas copa 2026",
    "troca de figurinhas copa 2026",
    "álbum copa do mundo 2026",
    "trocar figurinhas repetidas",
    "onde trocar figurinhas",
    "figurinhas perto de mim",
    "pontos de troca figurinhas",
    "completar álbum panini",
    "figurinhas legends copa 2026",
    "colecionadores figurinhas",
    "app troca figurinhas",
  ],
  authors: [{ name: "Figurinha Fácil" }],
  creator: "Figurinha Fácil",
  publisher: "Figurinha Fácil",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: BASE_URL,
    siteName: "Figurinha Fácil",
    title: "Figurinha Fácil | Troque Figurinhas da Copa 2026",
    description:
      "O álbum da Copa 2026 tem 980 figurinhas. Economize até R$ 5.000 trocando com colecionadores em mais de 100 cidades brasileiras.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Figurinha Fácil - Plataforma de troca de figurinhas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Figurinha Fácil | Troque Figurinhas da Copa 2026",
    description:
      "980 figurinhas no álbum da Copa 2026. Encontre colecionadores e economize trocando suas repetidas.",
    images: ["/og-image.png"],
    creator: "@figurinhafacil",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: BASE_URL,
  },
  category: "shopping",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontHeadline.variable} ${fontBody.variable} font-body antialiased`}
      >
        <Suspense>
          <Providers>
            <Toaster />
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
