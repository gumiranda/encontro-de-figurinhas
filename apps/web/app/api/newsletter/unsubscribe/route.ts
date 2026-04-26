import type { NextRequest } from "next/server";
import { convexServer, api } from "@/lib/convex-server";

const CONFIRMATION_HTML = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Inscrição cancelada · Figurinha Fácil</title>
    <style>
      :root { color-scheme: dark; }
      body {
        margin: 0;
        min-height: 100dvh;
        display: grid;
        place-items: center;
        background: #090e1c;
        color: #e1e4fa;
        font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
        padding: 24px;
      }
      .card {
        max-width: 480px;
        text-align: center;
        background: #13192b;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 20px;
        padding: 40px 32px;
      }
      h1 { font-size: 1.5rem; margin: 0 0 12px; letter-spacing: -0.02em; }
      p { color: #a6aabf; line-height: 1.55; margin: 0 0 20px; }
      a {
        display: inline-block;
        padding: 10px 18px;
        border-radius: 9999px;
        background: linear-gradient(135deg, #95aaff, #3766ff);
        color: #00247e;
        font-weight: 600;
        text-decoration: none;
      }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Inscrição cancelada</h1>
      <p>Você não receberá mais a newsletter Figurinha Fácil. Mudou de ideia? Reinscreva-se quando quiser pelo blog.</p>
      <a href="/blog">Voltar ao blog</a>
    </div>
  </body>
</html>`;

/**
 * Extract the client IP from common proxy headers, in order of trust.
 *
 * Vercel + Cloudflare + Fly.io are all production targets; each sets a
 * different header. If none are present (direct connection, missing reverse
 * proxy config, or local dev) the bucket key falls through to "anon", which
 * means anonymous traffic shares one rate-limit bucket — a known degradation
 * documented here so it shows up in monitoring rather than as a silent DoS
 * on legitimate users. Operationally: ensure at least one of these headers
 * is set by the deployment edge.
 */
function clientIp(req: NextRequest): string {
  const candidates = [
    req.headers.get("cf-connecting-ip"),
    req.headers.get("fly-client-ip"),
    req.headers.get("x-vercel-forwarded-for"),
    req.headers.get("x-real-ip"),
    req.headers.get("x-forwarded-for")?.split(",")[0],
  ];
  for (const c of candidates) {
    const trimmed = c?.trim();
    if (trimmed) return trimmed;
  }
  return "anon";
}

function confirmation(): Response {
  return new Response(CONFIRMATION_HTML, {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "no-store, must-revalidate",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token") ?? "";
  try {
    await convexServer.mutation(api.newsletter.unsubscribe, {
      token,
      clientKey: clientIp(req),
    });
  } catch {
    // Swallow — response must be byte-identical to the success path so the
    // route can't be probed for token validity or service health.
  }
  return confirmation();
}
