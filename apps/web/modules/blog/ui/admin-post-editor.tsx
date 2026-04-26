"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Textarea } from "@workspace/ui/components/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { Card, CardContent } from "@workspace/ui/components/card";
import { ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

type PostStatus = "draft" | "published";

export interface AdminPostEditorProps {
  mode: "create" | "edit";
  postId?: Id<"blogPosts">;
  initial?: {
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    coverImage?: string;
    category: string;
    tags: string[];
    seoTitle?: string;
    seoDescription?: string;
    status: PostStatus;
    titleHighlight?: string;
    isTrending?: boolean;
    authorRole?: string;
  };
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type EditorState = NonNullable<AdminPostEditorProps["initial"]>;

const DEFAULT: EditorState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  category: "Guias",
  tags: [],
  status: "draft",
};

export function AdminPostEditor({ mode, postId, initial }: AdminPostEditorProps) {
  const router = useRouter();
  const create = useMutation(api.blog.create);
  const update = useMutation(api.blog.update);

  const start: EditorState = initial ?? DEFAULT;
  const [title, setTitle] = useState(start.title);
  const [slug, setSlug] = useState(start.slug);
  const [excerpt, setExcerpt] = useState(start.excerpt);
  const [content, setContent] = useState(start.content);
  const [coverImage, setCoverImage] = useState(start.coverImage ?? "");
  const [category, setCategory] = useState(start.category);
  const [tagsInput, setTagsInput] = useState(start.tags.join(", "));
  const [seoTitle, setSeoTitle] = useState(start.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(start.seoDescription ?? "");
  const [status, setStatus] = useState<PostStatus>(start.status);
  const [titleHighlight, setTitleHighlight] = useState(
    start.titleHighlight ?? ""
  );
  const [authorRole, setAuthorRole] = useState(start.authorRole ?? "");
  const [isTrending, setIsTrending] = useState(!!start.isTrending);
  const [pending, setPending] = useState(false);

  const slugDirty =
    mode === "edit" || (slug !== "" && slug !== slugify(title));

  function onTitleChange(v: string) {
    setTitle(v);
    if (!slugDirty) setSlug(slugify(v));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;
    if (!title.trim()) return toast.error("Título obrigatório");
    if (!slug.trim()) return toast.error("Slug obrigatório");
    if (!excerpt.trim()) return toast.error("Resumo obrigatório");
    if (!content.trim()) return toast.error("Conteúdo obrigatório");
    if (!category.trim()) return toast.error("Categoria obrigatória");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    setPending(true);
    try {
      if (mode === "create") {
        const id = await create({
          title: title.trim(),
          slug: slug.trim(),
          excerpt: excerpt.trim(),
          content,
          coverImage: coverImage.trim() || undefined,
          category: category.trim(),
          tags,
          seoTitle: seoTitle.trim() || undefined,
          seoDescription: seoDescription.trim() || undefined,
          status,
          titleHighlight: titleHighlight.trim() || undefined,
          isTrending: isTrending || undefined,
          authorRole: authorRole.trim() || undefined,
        });
        toast.success("Post criado.");
        router.push(`/admin/blog/${id}`);
      } else if (postId) {
        await update({
          id: postId,
          title: title.trim(),
          excerpt: excerpt.trim(),
          content,
          coverImage: coverImage.trim() || undefined,
          category: category.trim(),
          tags,
          seoTitle: seoTitle.trim() || undefined,
          seoDescription: seoDescription.trim() || undefined,
          status,
          titleHighlight: titleHighlight.trim() || undefined,
          isTrending: isTrending || undefined,
          authorRole: authorRole.trim() || undefined,
        });
        toast.success("Post atualizado.");
      }
    } catch (err) {
      toast.error(
        err instanceof Error ? err.message : "Erro ao salvar post"
      );
      console.error(err);
    } finally {
      setPending(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="container mx-auto max-w-5xl px-4 py-8"
    >
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button asChild variant="ghost" size="icon">
            <Link href="/admin/blog">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight">
              {mode === "create" ? "Novo post" : "Editar post"}
            </h1>
            {mode === "edit" && postId && (
              <p className="text-xs text-muted-foreground">ID: {postId}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as PostStatus)}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Rascunho</SelectItem>
              <SelectItem value="published">Publicado</SelectItem>
            </SelectContent>
          </Select>
          <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Salvar
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_320px]">
        <Card>
          <CardContent className="space-y-5 pt-6">
            <Field label="Título">
              <Input
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                placeholder="Título do post"
                required
                maxLength={200}
              />
            </Field>
            <Field
              label="Slug"
              hint="URL amigável (apenas letras, números e hífens)."
            >
              <Input
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="meu-post"
                required
                disabled={mode === "edit"}
              />
            </Field>
            <Field label="Resumo" hint="Aparece nos cards e meta descrição.">
              <Textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={2}
                maxLength={300}
                required
              />
            </Field>
            <Field
              label="Conteúdo"
              hint="HTML ou Markdown. Cabeçalhos, links, listas e código suportados."
            >
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={20}
                required
                className="font-mono text-sm"
              />
            </Field>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-4 pt-6">
              <Field label="Categoria">
                <Input
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Guias"
                  required
                />
              </Field>
              <Field label="Tags" hint="Separe por vírgula.">
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="copa, raras, troca"
                />
              </Field>
              <Field label="Imagem de capa (URL)">
                <Input
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://..."
                />
              </Field>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={isTrending}
                  onChange={(e) => setIsTrending(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Marcar como em alta
              </label>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="space-y-4 pt-6">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                SEO
              </h3>
              <Field label="SEO title">
                <Input
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  maxLength={70}
                  placeholder="Título otimizado (opcional)"
                />
              </Field>
              <Field label="SEO description">
                <Textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  maxLength={160}
                  placeholder="Meta descrição (opcional)"
                />
              </Field>
              <Field label="Title highlight">
                <Input
                  value={titleHighlight}
                  onChange={(e) => setTitleHighlight(e.target.value)}
                  maxLength={50}
                  placeholder="Trecho do título a destacar"
                />
              </Field>
              <Field label="Cargo do autor">
                <Input
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  maxLength={200}
                  placeholder="Editor sênior"
                />
              </Field>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}
