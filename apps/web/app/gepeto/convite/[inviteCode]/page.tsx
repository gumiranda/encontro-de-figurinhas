import type { Metadata } from "next";
import { Suspense } from "react";
import { Providers } from "@/components/providers";
import { GepetoInviteJoinView } from "@/modules/gepeto";

export const metadata: Metadata = {
  title: "Convite do bolão Gepeto | Figurinha Fácil",
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{ inviteCode: string }>;
}

function InviteFallback() {
  return (
    <main className="dark min-h-screen bg-[#070b17] px-4 py-10 text-[#dfe5ff]">
      <div className="mx-auto max-w-md rounded-2xl border border-[#444b65] bg-[#12192e] p-6">
        <p className="font-mono text-xs font-bold uppercase tracking-[0.22em] text-[#95aaff]">
          Convite Gepeto
        </p>
        <h1 className="mt-3 font-display text-3xl font-black">
          Carregando convite
        </h1>
      </div>
    </main>
  );
}

async function GepetoInviteContent({ params }: PageProps) {
  const { inviteCode } = await params;

  return (
    <Providers>
      <GepetoInviteJoinView inviteCode={inviteCode} />
    </Providers>
  );
}

export default function GepetoInvitePage({ params }: PageProps) {
  return (
    <Suspense fallback={<InviteFallback />}>
      <GepetoInviteContent params={params} />
    </Suspense>
  );
}
