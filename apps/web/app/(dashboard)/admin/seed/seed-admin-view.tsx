"use client";

import { api } from "@workspace/backend/_generated/api";
import { Badge } from "@workspace/ui/components/badge";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { useMutation } from "convex/react";
import { Album, CheckCircle, Database, Loader2, XCircle } from "lucide-react";
import { useState } from "react";

type SeedResult = {
  ok: boolean;
  results?: Record<string, unknown>;
  action?: string;
  version?: number;
  error?: string;
};

type SeedStatus = "idle" | "loading" | "success" | "error";

export function SeedAdminView() {
  const [allStatus, setAllStatus] = useState<SeedStatus>("idle");
  const [allResult, setAllResult] = useState<SeedResult | null>(null);

  const [albumStatus, setAlbumStatus] = useState<SeedStatus>("idle");
  const [albumResult, setAlbumResult] = useState<SeedResult | null>(null);

  const [blogStatus, setBlogStatus] = useState<SeedStatus>("idle");
  const [blogResult, setBlogResult] = useState<SeedResult | null>(null);

  const seedAll = useMutation(api.adminSeed.seedAll);
  const seedAlbum = useMutation(api.seedAlbumApi.seedAlbum);
  const seedBlog = useMutation(api.adminSeed.seedBlog);

  const handleSeedAll = async () => {
    setAllStatus("loading");
    setAllResult(null);
    try {
      const result = await seedAll({});
      setAllResult(result);
      setAllStatus("success");
    } catch (e) {
      setAllResult({
        ok: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
      setAllStatus("error");
    }
  };

  const handleSeedAlbum = async () => {
    setAlbumStatus("loading");
    setAlbumResult(null);
    try {
      const result = await seedAlbum({});
      setAlbumResult(result);
      setAlbumStatus("success");
    } catch (e) {
      setAlbumResult({
        ok: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
      setAlbumStatus("error");
    }
  };

  const handleSeedBlog = async () => {
    setBlogStatus("loading");
    setBlogResult(null);
    try {
      const result = await seedBlog({});
      setBlogResult(result);
      setBlogStatus("success");
    } catch (e) {
      setBlogResult({
        ok: false,
        error: e instanceof Error ? e.message : "Unknown error",
      });
      setBlogStatus("error");
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Seed Database</h1>
        <p className="text-muted-foreground">
          Popula banco com dados iniciais. Seeds são idempotentes (safe to re-run).
        </p>
      </div>

      <div className="grid gap-6">
        {/* Seed All */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Seed All</CardTitle>
                  <CardDescription>
                    Cities, Trade Points, Album Sections + Stickers, Boring Game, Blog Posts
                  </CardDescription>
                </div>
              </div>
              <StatusBadge status={allStatus} />
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSeedAll}
              disabled={allStatus === "loading"}
              className="w-full sm:w-auto"
            >
              {allStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Run All Seeds
            </Button>
            {allResult && <ResultDisplay result={allResult} />}
          </CardContent>
        </Card>

        {/* Seed Album */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Album className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Seed Album</CardTitle>
                  <CardDescription>
                    Album config + 1074 sticker details (Copa 2026)
                  </CardDescription>
                </div>
              </div>
              <StatusBadge status={albumStatus} />
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSeedAlbum}
              disabled={albumStatus === "loading"}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {albumStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Seed Album Only
            </Button>
            {albumResult && <ResultDisplay result={albumResult} />}
          </CardContent>
        </Card>

        {/* Seed Blog */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database className="h-6 w-6 text-primary" />
                <div>
                  <CardTitle>Seed Blog</CardTitle>
                  <CardDescription>
                    ~60+ blog posts para SEO e conteúdo
                  </CardDescription>
                </div>
              </div>
              <StatusBadge status={blogStatus} />
            </div>
          </CardHeader>
          <CardContent>
            <Button
              onClick={handleSeedBlog}
              disabled={blogStatus === "loading"}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {blogStatus === "loading" && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Seed Blog Only
            </Button>
            {blogResult && <ResultDisplay result={blogResult} />}
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Info</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground space-y-2">
            <p>
              <strong>Cities:</strong> 54 cidades brasileiras
            </p>
            <p>
              <strong>Trade Points:</strong> 80 pontos de troca exemplo
            </p>
            <p>
              <strong>Album:</strong> 1074 figurinhas com nomes de jogadores
            </p>
            <p>
              <strong>Boring Game:</strong> Rodadas do jogo mais chato
            </p>
            <p>
              <strong>Blog:</strong> ~60+ posts de seleções e dicas
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: SeedStatus }) {
  if (status === "idle") return null;

  if (status === "loading") {
    return (
      <Badge variant="secondary" className="gap-1">
        <Loader2 className="h-3 w-3 animate-spin" />
        Running
      </Badge>
    );
  }

  if (status === "success") {
    return (
      <Badge variant="default" className="gap-1 bg-green-600">
        <CheckCircle className="h-3 w-3" />
        Done
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-1">
      <XCircle className="h-3 w-3" />
      Error
    </Badge>
  );
}

function ResultDisplay({ result }: { result: SeedResult }) {
  return (
    <pre className="mt-4 p-4 bg-muted rounded-lg text-xs overflow-auto max-h-48">
      {JSON.stringify(result, null, 2)}
    </pre>
  );
}
