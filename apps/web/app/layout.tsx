import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Space_Grotesk, Manrope } from "next/font/google";

import { Analytics } from "@vercel/analytics/next";
import "@workspace/ui/globals.css";
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
    "Troque figurinhas da Copa 2026 perto de você. 980 figurinhas no álbum, mais de 100 cidades, colecionadores ativos. Cadastre repetidas e faltantes — grátis.",
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
    title: "Figurinha Fácil — Troque Figurinhas da Copa 2026",
    description:
      "980 figurinhas no álbum da Copa 2026. Encontre colecionadores em mais de 100 cidades e troque suas repetidas — grátis.",
    images: [
      {
        url: `${BASE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Figurinha Fácil — Troque Figurinhas da Copa 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Figurinha Fácil — Troque Figurinhas da Copa 2026",
    description:
      "980 figurinhas no álbum da Copa 2026. Encontre colecionadores e troque suas repetidas — grátis.",
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
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} ${fontHeadline.variable} ${fontBody.variable} font-body antialiased`}
      >
        <Toaster />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
