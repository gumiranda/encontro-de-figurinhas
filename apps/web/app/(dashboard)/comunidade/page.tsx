import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comunidade | Figurinha Fácil",
  robots: { index: false, follow: false },
};

export default function ComunidadePage() {
  return (
    <div className="space-y-2">
      <h1 className="font-headline text-3xl font-extrabold tracking-tight">
        Comunidade
      </h1>
      <p className="text-on-surface-variant">Em breve.</p>
    </div>
  );
}
