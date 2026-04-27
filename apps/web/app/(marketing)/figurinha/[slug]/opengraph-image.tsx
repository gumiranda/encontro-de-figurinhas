import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Figurinha Copa 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const sticker = await fetchQuery(api.album.getStickerDetailBySlug, { slug });

  const teamName = sticker?.sectionName ?? "Seleção";
  const flagEmoji = sticker?.flagEmoji ?? "🏳️";
  const displayNum = sticker?.absoluteNum ?? 0;

  const bgGradient = sticker?.variant && sticker.variant !== "base"
    ? "linear-gradient(135deg, #f59e0b 0%, #fbbf24 50%, #fcd34d 100%)"
    : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)";

  const specialLabel = sticker?.variant && sticker.variant !== "base"
    ? sticker.variant.toUpperCase()
    : null;

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
          background: bgGradient,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {specialLabel && (
          <div
            style={{
              position: "absolute",
              top: 40,
              right: 40,
              background: "rgba(0, 0, 0, 0.3)",
              padding: "8px 24px",
              borderRadius: 8,
              color: "white",
              fontSize: 20,
              fontWeight: 700,
              letterSpacing: 2,
            }}
          >
            {specialLabel}
          </div>
        )}

        <div
          style={{
            width: 160,
            height: 200,
            background: "white",
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            marginBottom: 32,
          }}
        >
          <span style={{ fontSize: 64 }}>{flagEmoji}</span>
          <span
            style={{
              fontSize: 48,
              fontWeight: 800,
              color: "#1f2937",
              marginTop: 8,
            }}
          >
            {displayNum}
          </span>
        </div>

        <h1
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
          }}
        >
          Figurinha {displayNum}
        </h1>

        <p
          style={{
            fontSize: 36,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "16px 0 0 0",
          }}
        >
          {teamName}
        </p>

        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "12px 24px",
              borderRadius: 8,
              color: "white",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Copa 2026
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "12px 24px",
              borderRadius: 8,
              color: "white",
              fontSize: 20,
              fontWeight: 600,
            }}
          >
            Encontre quem tem
          </div>
        </div>

        <p
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 22,
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
