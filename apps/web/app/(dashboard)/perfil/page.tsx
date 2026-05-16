"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";

import { api } from "@workspace/backend/_generated/api";

import {
  PrivateProfileView,
  ProfilePageSkeletonV2,
  type ProfileSettingsV2,
  type ProfileTradeRow,
} from "@/modules/profile/ui/components/profile-v2";

export default function PerfilPage() {
  const settings = useQuery(api.users.getProfileSettings);
  const trades = useQuery(api.trades.listMyTrades);
  const updateSettings = useMutation(api.users.updateProfileSettings);
  const [isUpdating, setIsUpdating] = useState(false);

  if (settings === undefined) {
    return <ProfilePageSkeletonV2 />;
  }

  if (settings === null) {
    return (
      <div className="space-y-2">
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">
          Perfil
        </h1>
        <p className="text-muted-foreground">
          Complete seu cadastro para acessar o perfil.
        </p>
      </div>
    );
  }

  const displayNickname = settings.displayNickname ?? settings.nickname;
  const profileUrl = `https://figurinhafacil.com.br/u/${settings.nickname}`;

  const handleTogglePublic = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await updateSettings({ isProfilePublic: checked });
      toast.success(
        checked ? "Perfil agora é público" : "Perfil agora é privado"
      );
    } catch {
      toast.error("Erro ao atualizar configuração");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleToggleMail = async (checked: boolean) => {
    setIsUpdating(true);
    try {
      await updateSettings({ acceptsMail: checked });
      toast.success(
        checked
          ? "Trocas por correio ativadas"
          : "Trocas por correio desativadas"
      );
    } catch {
      toast.error("Erro ao atualizar configuração");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(profileUrl);
      toast.success("Link copiado");
    } catch {
      toast.error("Não foi possível copiar o link");
    }
  };

  const handleShare = () => {
    const shareText = [
      `Figurinhas do @${displayNickname}`,
      `Álbum: ${settings.albumCompletionPct.toFixed(1)}% completo`,
      `${settings.duplicatesCount} repetidas disponíveis`,
      "",
      `Veja: ${profileUrl}`,
    ].join("\n");

    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareText)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <PrivateProfileView
      profile={settings as ProfileSettingsV2}
      trades={(trades ?? []) as ProfileTradeRow[]}
      isTradesLoading={trades === undefined}
      profileUrl={profileUrl}
      isUpdating={isUpdating}
      onTogglePublic={handleTogglePublic}
      onToggleMail={handleToggleMail}
      onCopyLink={() => void handleCopyLink()}
      onShare={handleShare}
    />
  );
}
