import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Blog Figurinha Fácil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchQuery(api.blog.getBySlug, { slug });

  const title = post?.title ?? "Blog";
  const category = post?.category ?? "Artigo";
  const author = post?.author?.name ?? "Figurinha Fácil";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-end",
          padding: 60,
          background:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              background: "#6366f1",
              padding: "8px 16px",
              borderRadius: 8,
              color: "white",
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {category}
          </div>
          <div
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 20,
            }}
          >
            por {author}
          </div>
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            margin: 0,
            lineHeight: 1.15,
            maxWidth: "95%",
          }}
        >
          {title.length > 80 ? title.slice(0, 77) + "..." : title}
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginTop: 40,
          }}
        >
          <div
            style={{
              fontSize: 28,
            }}
          >
            ⚽
          </div>
          <p
            style={{
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.8)",
              fontWeight: 600,
              margin: 0,
            }}
          >
            figurinhafacil.com.br/blog
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}
