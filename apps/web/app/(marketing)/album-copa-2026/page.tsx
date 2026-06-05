import Link from "next/link";

export default function Page() {
  return (
    <main className="pt-24 min-h-screen container mx-auto px-4 py-16">
      <h1 className="text-3xl font-headline font-bold mb-6">Álbum Copa 2026</h1>
      <div className="flex flex-col gap-2">
        <Link href="/" className="text-primary hover:underline">
          Início
        </Link>
        <Link href="/album-copa" className="text-primary hover:underline">
          Álbum da Copa
        </Link>
        <Link href="/blog" className="text-primary hover:underline">
          Blog
        </Link>
      </div>
    </main>
  );
}
