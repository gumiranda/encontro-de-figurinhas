"use client";

import { use } from "react";
import { useQuery } from "convex/react";
import { Loader2 } from "lucide-react";
import { api } from "@workspace/backend/_generated/api";
import type { Id } from "@workspace/backend/_generated/dataModel";
import { AdminPostEditor } from "@/modules/blog/ui/admin-post-editor";

interface AdminBlogEditPageProps {
  params: Promise<{ id: string }>;
}

export default function AdminBlogEditPage({ params }: AdminBlogEditPageProps) {
  const { id } = use(params);
  const post = useQuery(api.blog.getByIdForAdmin, {
    id: id as Id<"blogPosts">,
  });

  if (post === undefined) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (post === null) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Post não encontrado.
      </div>
    );
  }

  return (
    <AdminPostEditor
      mode="edit"
      postId={post._id}
      initial={{
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        coverImage: post.coverImage,
        category: post.category,
        tags: post.tags,
        seoTitle: post.seoTitle,
        seoDescription: post.seoDescription,
        status: post.status,
        titleHighlight: post.titleHighlight,
        isTrending: post.isTrending,
        authorRole: post.author.role,
      }}
    />
  );
}
