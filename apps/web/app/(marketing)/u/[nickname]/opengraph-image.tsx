import { ImageResponse } from "next/og";
import { fetchQuery } from "convex/nextjs";
import { api } from "@workspace/backend/_generated/api";

export const runtime = "edge";
export const contentType = "image/png";
export const size = { width: 1200, height: 630 };

type Props = {
  params: Promise<{ nickname: string }>;
};

export default async function Image({ params }: Props) {
  const { nickname } = await params;

  try {
    const profile = await fetchQuery(api.users.getPublicProfile, { nickname });

    if (!profile) {
      return new ImageResponse(
        (
          <div
            style={{
              width: "100%",
              height: "100%",
              background: "#0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#666",
            }}
          >
            <span style={{ fontSize: 48 }}>Perfil não encontrado</span>
          </div>
        ),
        { ...size }
      );
    }

    const initials = (profile.displayNickname || "?").slice(0, 2).toUpperCase() || "?";

    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 48,
          }}
        >
          <div
            style={{
              width: 140,
              height: 140,
              borderRadius: "50%",
              background: "#1a472a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            <span style={{ fontSize: 56, color: "#fff", fontWeight: 700 }}>
              {initials}
            </span>
          </div>

          <span
            style={{ fontSize: 42, color: "#fff", fontWeight: 700, marginBottom: 16 }}
          >
            @{profile.displayNickname}
          </span>

          <span style={{ fontSize: 28, color: "#888", marginBottom: 12 }}>
            {profile.duplicatesCount} figurinhas disponíveis para troca
          </span>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              marginTop: 8,
            }}
          >
            <span style={{ fontSize: 22, color: "#1a472a", fontWeight: 600 }}>
              {profile.albumCompletionPct.toFixed(1)}% completo
            </span>
            {profile.totalTrades > 0 && (
              <span style={{ fontSize: 22, color: "#666" }}>
                {profile.totalTrades} trocas realizadas
              </span>
            )}
          </div>

          <span
            style={{
              fontSize: 20,
              color: "#87d400",
              marginTop: 32,
              fontWeight: 500,
            }}
          >
            Figurinha Fácil
          </span>
        </div>
      ),
      {
        ...size,
        headers: {
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        },
      }
    );
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            background: "#0a0a0a",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#1a472a",
          }}
        >
          <span style={{ fontSize: 64, fontWeight: 700, color: "#87d400" }}>Figurinha Fácil</span>
        </div>
      ),
      { ...size }
    );
  }
}
