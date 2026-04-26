"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePaginatedQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Clock, Loader2 } from "lucide-react";

const PAGE_SIZE = 12;
const MAX_PAGES = 10;
const SSR_INITIAL_COUNT = 12;

type Mode =
  | { kind: "all" }
  | { kind: "category"; category: string };

interface LoadMorePostsProps {
  mode: Mode;
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

export function LoadMorePosts({ mode }: LoadMorePostsProps) {
  const [pageCount, setPageCount] = useState(1);

  const allQuery = usePaginatedQuery(
    api.blog.getPublishedPaginated,
    mode.kind === "all" ? {} : "skip",
    { initialNumItems: PAGE_SIZE }
  );
  const categoryQuery = usePaginatedQuery(
    api.blog.getByCategoryPaginated,
    mode.kind === "category" ? { category: mode.category } : "skip",
    { initialNumItems: PAGE_SIZE }
  );

  const { results, status, loadMore } =
    mode.kind === "all" ? allQuery : categoryQuery;

  // Skip the first SSR_INITIAL_COUNT posts — those are server-rendered above.
  const additional = results.slice(SSR_INITIAL_COUNT);

  const canLoadMore = status === "CanLoadMore" && pageCount < MAX_PAGES;
  const reachedCap = pageCount >= MAX_PAGES && status !== "Exhausted";

  function handleLoadMore() {
    if (!canLoadMore) return;
    setPageCount((p) => p + 1);
    loadMore(PAGE_SIZE);
  }

  if (additional.length === 0 && status !== "LoadingMore") {
    if (reachedCap) {
      return (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Atingiu o limite por sessão. Recarregue a página para ver mais ou use
          a busca por categoria.
        </p>
      );
    }
    if (status === "Exhausted") return null;
    if (canLoadMore) {
      return (
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-white/[0.08]"
          >
            Carregar mais artigos
          </button>
        </div>
      );
    }
    return null;
  }

  return (
    <>
      {additional.length > 0 && (
        <div className="bh-post-grid mt-6">
          {additional.map((post) => (
            <Link
              key={post._id}
              href={`/blog/${post.slug}`}
              className="bh-post-card"
            >
              <div className="bh-thumb">
                {post.coverImage && (
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    sizes="(min-width: 1080px) 33vw, (min-width: 720px) 50vw, 100vw"
                    className="object-cover"
                  />
                )}
                <span className="bh-cat">{post.category}</span>
              </div>
              <div className="bh-body">
                <h3>{post.title}</h3>
                <p className="bh-excerpt">{post.excerpt}</p>
                <div className="bh-meta">
                  <div className="bh-avatar">{initials(post.author.name)}</div>
                  <span>{post.author.name}</span>
                  <span className="bh-read-time">
                    <Clock className="h-3.5 w-3.5" />
                    {post.readingTime} min
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        {status === "LoadingMore" && (
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        )}
        {canLoadMore && (
          <button
            type="button"
            onClick={handleLoadMore}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-white/[0.08]"
          >
            Carregar mais artigos
          </button>
        )}
        {reachedCap && (
          <p className="text-center text-sm text-muted-foreground">
            Atingiu o limite por sessão. Recarregue a página para ver mais ou
            use a busca por categoria.
          </p>
        )}
      </div>
    </>
  );
}
