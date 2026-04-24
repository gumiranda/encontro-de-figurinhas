import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

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
  "/ponto/id(.*)",
  // /ponto/[slug] público (SEO) exceto /ponto/solicitar (autenticado)
  /^\/ponto\/(?!solicitar(?:\/|$))[^/]+(?:\/.*)?$/,
]);

// Routes that require auth but allow incomplete onboarding
// Onboarding redirect is handled client-side via useProfileRedirect hook
const isOnboardingRoute = createRouteMatcher([
  "/complete-profile",
]);

export default clerkMiddleware(async (auth, req) => {
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
