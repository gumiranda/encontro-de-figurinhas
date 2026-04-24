import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const alt = "Troca de Figurinhas";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const city = await fetchQuery(api.cities.getBySlug, { slug });

  const cityName = city?.name ?? "Cidade";
  const state = city?.state ?? "";

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
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              background: "white",
              borderRadius: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 48,
            }}
          >
            📍
          </div>
        </div>

        <h1
          style={{
            fontSize: 64,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          Troca de Figurinhas em
        </h1>

        <h2
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "white",
            margin: "16px 0 0 0",
            textAlign: "center",
          }}
        >
          {cityName}
        </h2>

        {state && (
          <p
            style={{
              fontSize: 32,
              color: "rgba(255, 255, 255, 0.9)",
              margin: "16px 0 0 0",
            }}
          >
            {state}
          </p>
        )}

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
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Copa 2026
          </div>
          <div
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              padding: "16px 32px",
              borderRadius: 12,
              color: "white",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            980 Figurinhas
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
