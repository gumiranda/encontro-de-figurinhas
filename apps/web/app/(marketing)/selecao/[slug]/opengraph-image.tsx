import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Figurinhas da Seleção";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const section = await fetchQuery(api.album.getSectionBySlug, { slug });

  const teamName = section?.name ?? "Seleção";
  const flagEmoji = section?.flagEmoji ?? "🏳️";
  const stickerCount = section?.stickerCount ?? 20;

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #059669 0%, #10b981 50%, #34d399 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            marginBottom: 24,
          }}
        >
          {flagEmoji}
        </div>

        <h1
          style={{
            fontSize: 72,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          Figurinhas {teamName}
        </h1>

        <p
          style={{
            fontSize: 36,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "24px 0 0 0",
          }}
        >
          Copa do Mundo 2026
        </p>

        <div
          style={{
            display: "flex",
            gap: 24,
            marginTop: 48,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "16px 32px",
              borderRadius: 12,
              color: "white",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            {stickerCount} Figurinhas
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "16px 32px",
              borderRadius: 12,
              color: "white",
              fontSize: 28,
              fontWeight: 600,
            }}
          >
            Troque Agora
          </div>
        </div>

        <p
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.8)",
            fontWeight: 600,
          }}
        >
          figurinhafacil.com.br
        </p>
      </div>
    ),
    { ...size }
  );
}
