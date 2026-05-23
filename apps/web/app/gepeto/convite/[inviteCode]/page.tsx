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

export default async function GepetoInvitePage({ params }: PageProps) {
  const { inviteCode } = await params;

  return (
    <Suspense>
      <Providers>
        <GepetoInviteJoinView inviteCode={inviteCode} />
      </Providers>
    </Suspense>
  );
}
