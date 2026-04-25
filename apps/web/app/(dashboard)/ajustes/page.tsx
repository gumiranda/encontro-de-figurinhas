import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ajustes | Figurinha Fácil",
  robots: { index: false, follow: false },
};

export default function AjustesPage() {
  return (
    <div className="space-y-2">
      <h1 className="font-headline text-3xl font-extrabold tracking-tight">
        Ajustes
      </h1>
      <p className="text-on-surface-variant">Em breve.</p>
    </div>
  );
}
