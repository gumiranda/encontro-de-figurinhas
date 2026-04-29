import { Metadata } from "next";
import { notFound } from "next/navigation";
import { convexServer, api } from "@/lib/convex-server";

import { PublicProfileCard } from "@/modules/profile/ui/components/public-profile-card";
import { AlbumProgressSection } from "@/modules/profile/ui/components/album-progress-section";
import { DuplicatesSection } from "@/modules/profile/ui/components/duplicates-section";
import { ProfileQRCode } from "@/modules/profile/ui/components/profile-qr-code";
import { WhatsAppShareButton } from "@/modules/profile/ui/components/whatsapp-share-button";

type Props = {
  params: Promise<{ nickname: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { nickname } = await params;
  const profile = await convexServer.query(api.users.getPublicProfile, {
    nickname,
  });

  if (!profile) {
    return {
      title: "Perfil não encontrado | Figurinha Fácil",
    };
  }

  return {
    title: `@${profile.nickname} | Figurinha Fácil`,
    description: `${profile.duplicatesCount} figurinhas disponíveis para troca. Álbum ${profile.albumCompletionPct.toFixed(1)}% completo.`,
    alternates: {
      canonical: `/u/${profile.nickname}`,
    },
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { nickname } = await params;
  const profile = await convexServer.query(api.users.getPublicProfile, {
    nickname,
  });

  if (!profile) {
    notFound();
  }

  const profileUrl = `https://figurinhafacil.com.br/u/${profile.nickname}`;

  return (
    <div className="container max-w-md mx-auto py-8 space-y-6">
      <PublicProfileCard
        displayNickname={profile.displayNickname}
        avatarSeed={profile.avatarSeed}
        albumCompletionPct={profile.albumCompletionPct}
        totalTrades={profile.totalTrades}
        ratingAvg={profile.ratingAvg}
        ratingCount={profile.ratingCount}
      />

      <AlbumProgressSection
        progress={profile.albumCompletionPct}
        albumProgress={profile.albumProgress}
      />

      <DuplicatesSection
        duplicates={profile.duplicatesSample}
        totalCount={profile.duplicatesCount}
      />

      <ProfileQRCode url={profileUrl} />

      <WhatsAppShareButton
        displayNickname={profile.displayNickname}
        nickname={profile.nickname!}
        duplicatesCount={profile.duplicatesCount}
        albumCompletionPct={profile.albumCompletionPct}
      />
    </div>
  );
}
