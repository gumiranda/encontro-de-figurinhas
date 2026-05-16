import { Metadata } from "next";
import { notFound } from "next/navigation";

import { convexServer, api } from "@/lib/convex-server";
import {
  PublicProfileView,
  type PublicProfileV2,
} from "@/modules/profile/ui/components/profile-v2";

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

  const profileNickname = profile.nickname ?? nickname;
  const displayNickname = profile.displayNickname ?? profileNickname;

  return {
    title: `@${displayNickname} | Figurinha Fácil`,
    description: `${profile.duplicatesCount} repetidas e ${profile.missingCount} faltantes. Álbum ${profile.albumCompletionPct.toFixed(1)}% completo.`,
    alternates: {
      canonical: `/u/${profileNickname}`,
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

  const profileNickname = profile.nickname ?? nickname;
  const profileUrl = `https://figurinhafacil.com.br/u/${profileNickname}`;

  return (
    <main id="main-content">
      <PublicProfileView
        profile={profile as PublicProfileV2}
        profileUrl={profileUrl}
      />
    </main>
  );
}
