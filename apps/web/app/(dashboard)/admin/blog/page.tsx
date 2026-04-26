"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useMutation, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { Badge } from "@workspace/ui/components/badge";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@workspace/ui/components/tabs";
import {
  Eye,
  Heart,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";

type StatusFilter = "all" | "draft" | "published";

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return "—";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(timestamp));
}

export default function AdminBlogPage() {
  const [status, setStatus] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const stats = useQuery(api.blog.adminStats, {});
  const posts = useQuery(api.blog.listForAdmin, {
    status,
    search: search.trim() || undefined,
  });
  const remove = useMutation(api.blog.remove);

  const counts = useMemo(() => {
    if (!stats) return { all: 0, published: 0, drafts: 0 };
    return {
      all: stats.total,
      published: stats.published,
      drafts: stats.drafts,
    };
  }, [stats]);

  async function handleDelete(id: Id<"blogPosts">, title: string) {
    if (!window.confirm(`Excluir "${title}"? Esta ação não pode ser desfeita.`)) {
      return;
    }
    try {
      await remove({ id });
      toast.success(`"${title}" foi excluído.`);
    } catch (err) {
      toast.error("Não foi possível excluir.");
      console.error(err);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Blog
          </h1>
          <p className="text-muted-foreground">
            Gerencie posts, rascunhos e métricas.
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/blog/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo post
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatTile label="Total" value={stats?.total ?? "—"} />
        <StatTile
          label="Publicados"
          value={stats?.published ?? "—"}
          accent="text-emerald-500"
        />
        <StatTile
          label="Rascunhos"
          value={stats?.drafts ?? "—"}
          accent="text-amber-500"
        />
        <StatTile
          label="Visualizações"
          value={stats?.totalViews?.toLocaleString("pt-BR") ?? "—"}
          accent="text-primary"
        />
      </div>

      {/* Toolbar */}
      <div className="mt-8 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por título, slug ou categoria…"
            className="pl-9"
          />
        </div>
        <Tabs
          value={status}
          onValueChange={(v) => setStatus(v as StatusFilter)}
        >
          <TabsList>
            <TabsTrigger value="all">
              Todos <Badge variant="secondary" className="ml-2">{counts.all}</Badge>
            </TabsTrigger>
            <TabsTrigger value="published">
              Publicados <Badge variant="secondary" className="ml-2">{counts.published}</Badge>
            </TabsTrigger>
            <TabsTrigger value="draft">
              Rascunhos <Badge variant="secondary" className="ml-2">{counts.drafts}</Badge>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Table */}
      <Card className="mt-6">
        <CardContent className="p-0">
          {posts === undefined ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              Nenhum post encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Post</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead className="text-right">Métricas</TableHead>
                  <TableHead>Atualizado</TableHead>
                  <TableHead className="w-24 text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {posts.map((p) => (
                  <TableRow key={p._id}>
                    <TableCell>
                      <div>
                        <Link
                          href={`/admin/blog/${p._id}`}
                          className="font-medium hover:text-primary"
                        >
                          {p.title}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          /{p.slug}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={p.status === "published" ? "default" : "outline"}
                        className={
                          p.status === "published"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "text-muted-foreground"
                        }
                      >
                        {p.status === "published" ? "Publicado" : "Rascunho"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{p.category}</TableCell>
                    <TableCell className="text-sm">{p.author}</TableCell>
                    <TableCell className="text-right text-sm">
                      <div className="inline-flex items-center gap-3 tabular-nums">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Eye className="h-3.5 w-3.5" />
                          {p.views.toLocaleString("pt-BR")}
                        </span>
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Heart className="h-3.5 w-3.5" />
                          {p.likes.toLocaleString("pt-BR")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(p.updatedAt)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="inline-flex gap-1">
                        <Button asChild variant="ghost" size="icon">
                          <Link href={`/admin/blog/${p._id}`}>
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Editar</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDelete(p._id, p.title)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatTile({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={`font-headline text-2xl font-bold tabular-nums ${accent ?? ""}`}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );
}
