import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Blog Figurinha Fácil";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const VALID_CATEGORIES: Record<string, { title: string; emoji: string; desc: string }> = {
  guias: {
    title: "Guias",
    emoji: "📖",
    desc: "Tutoriais e passo-a-passos",
  },
  historia: {
    title: "História",
    emoji: "📜",
    desc: "A saga dos álbuns da Copa",
  },
  raridades: {
    title: "Raridades",
    emoji: "💎",
    desc: "Figurinhas raras e lendárias",
  },
  "copa-2026": {
    title: "Copa 2026",
    emoji: "🏆",
    desc: "Novidades do álbum 2026",
  },
};

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const category = VALID_CATEGORIES[slug];
  if (!category) {
    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#1a1a2e",
            color: "white",
            fontSize: 48,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Blog <span style={{ color: "#87d400" }}>Figurinha Fácil</span>
        </div>
      ),
      { ...size }
    );
  }

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
              width: 100,
              height: 100,
              background: "white",
              borderRadius: 20,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 56,
            }}
          >
            {category.emoji}
          </div>
        </div>

        <p
          style={{
            fontSize: 28,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "0 0 8px 0",
            textTransform: "uppercase",
            letterSpacing: 4,
            fontWeight: 600,
          }}
        >
          Blog
        </p>

        <h1
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: "white",
            margin: 0,
            textAlign: "center",
            lineHeight: 1.1,
          }}
        >
          {category.title}
        </h1>

        <p
          style={{
            fontSize: 32,
            color: "rgba(255, 255, 255, 0.9)",
            margin: "24px 0 0 0",
            textAlign: "center",
            maxWidth: 800,
          }}
        >
          {category.desc}
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
              color: "#87d400",
              fontSize: 24,
              fontWeight: 600,
            }}
          >
            Figurinha Fácil
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
          figurinhafacil.com.br/blog
        </p>
      </div>
    ),
    { ...size }
  );
}
