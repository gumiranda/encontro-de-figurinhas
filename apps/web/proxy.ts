import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL;

const isPublicRoute = createRouteMatcher([
  // Landing + auth
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",

  // SEO / metadata endpoints (Next gera automaticamente)
  "/sitemap.xml",
  "/robots.txt",
  "/manifest.webmanifest",
  "/opengraph-image(.*)",
  "/twitter-image(.*)",
  "/icon(.*)",
  "/apple-icon(.*)",

  // Ponte de invalidação Convex→Next (autenticada via REVALIDATE_SECRET)
  "/api/revalidate",

  // Páginas marketing públicas (SEO)
  "/sobre",
  "/como-funciona",
  "/contato",
  "/termos",
  "/privacidade",
  "/album-copa-do-mundo-2026(.*)",
  "/blog(.*)",
  "/cidade(.*)",
  "/estado(.*)",
  "/cidades",
  "/estados",
  "/selecoes",
  "/selecao(.*)",
  "/figurinha(.*)",
  "/figurinhas",
  "/raras(.*)",
  "/jogo-mais-chato(.*)",
  "/onde-comprar-figurinhas-copa-2026",
  "/ponto/id(.*)",
  "/pontos",
  // /ponto/[slug] público (SEO) exceto /ponto/solicitar (autenticado)
  /^\/ponto\/(?!solicitar(?:\/|$))[^/]+(?:\/.*)?$/,
]);

async function resolveNumericStickerRedirect(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/figurinha\/(\d+)$/);
  if (!match) {
    return null;
  }

  const num = match[1];

  try {
    const response = await fetch(`${CONVEX_URL}/api/sticker-slug?num=${num}`, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(3000),
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as { slug?: unknown };
    if (typeof data.slug === "string") {
      const url = request.nextUrl.clone();
      url.pathname = `/figurinha/${data.slug}`;
      return NextResponse.redirect(url, 301);
    }
  } catch {
    // Let the route handle missing or unavailable sticker lookups.
  }

  return null;
}

export default clerkMiddleware(async (auth, req) => {
  const stickerRedirect = await resolveNumericStickerRedirect(req);
  if (stickerRedirect) {
    return stickerRedirect;
  }

  if (req.nextUrl.pathname.startsWith('/org-selection')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Autenticado: precisa passar pelo Clerk (auth() em server components).
    "/ponto/solicitar/:path*",
    // Excluir rotas públicas ISR (sem auth needs) + assets + endpoints metadata.
    "/((?!_next|ponto|cidade|blog|sobre|como-funciona|termos|privacidade|contato|album-copa-do-mundo-2026|sitemap|robots|favicon|apple-icon|opengraph-image|twitter-image|icon|manifest\\.webmanifest|api/revalidate|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // API/trpc mantêm middleware Clerk, exceto /api/revalidate (secret-based).
    "/(api(?!/revalidate)|trpc)(.*)",
  ],
};
