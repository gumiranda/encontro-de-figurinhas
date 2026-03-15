"use client";

import "mapbox-gl/dist/mapbox-gl.css";
import Link from "next/link";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { Button } from "@workspace/ui/components/button";
import { Badge } from "@workspace/ui/components/badge";
import { MapPin, LogIn } from "lucide-react";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const activeCount = useQuery(api.spots.getActiveCount);

  return (
    <div className="relative h-dvh w-full">
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <Link
            href="/mapa"
            className="flex items-center gap-2 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-md"
          >
            <MapPin className="h-5 w-5 text-green-500" />
            <span className="font-bold text-sm">Encontro de Figurinhas</span>
          </Link>
          {activeCount !== undefined && activeCount > 0 && (
            <Badge
              variant="secondary"
              className="bg-green-500/10 text-green-600 border-green-500/20"
            >
              {activeCount} {activeCount === 1 ? "ponto ativo" : "pontos ativos"}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2 pointer-events-auto">
          <SignedIn>
            <Link href="/">
              <Button variant="ghost" size="sm" className="bg-background/90 backdrop-blur-sm shadow-md">
                Dashboard
              </Button>
            </Link>
            <div className="bg-background/90 backdrop-blur-sm rounded-full shadow-md p-1">
              <UserButton />
            </div>
          </SignedIn>
          <SignedOut>
            <Link href="/sign-in?redirect_url=/mapa">
              <Button
                size="sm"
                className="bg-background/90 backdrop-blur-sm shadow-md text-foreground hover:bg-background"
              >
                <LogIn className="h-4 w-4 mr-1" />
                Entrar
              </Button>
            </Link>
          </SignedOut>
        </div>
      </header>
      {children}
    </div>
  );
}
