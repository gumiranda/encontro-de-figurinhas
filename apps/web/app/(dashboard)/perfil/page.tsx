"use client";

import { useQuery, useMutation } from "convex/react";
import { useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, QrCode, Share2 } from "lucide-react";

import { api } from "@workspace/backend/_generated/api";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Progress } from "@workspace/ui/components/progress";
import { QRCode } from "@workspace/ui/components/kibo-ui/qr-code";

import { MatchDicebearAvatar } from "@/modules/matches/ui/components/match-dicebear-avatar";

export default function PerfilPage() {
  const settings = useQuery(api.users.getProfileSettings);
  const updateSettings = useMutation(api.users.updateProfileSettings);
  const [isUpdating, setIsUpdating] = useState(false);

  if (settings === undefined) {
    return <ProfileSkeleton />;
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
      toast.success(checked ? "Trocas por correio ativadas" : "Trocas por correio desativadas");
    } catch {
      toast.error("Erro ao atualizar configuração");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Link copiado!");
  };

  const handleShare = () => {
    const shareText = [
      `Minhas figurinhas pra troca!`,
      `${settings.duplicatesCount} repetidas disponíveis`,
      ``,
      `Veja: ${profileUrl}`,
    ].join("\n");

    const shareUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(shareUrl, "_blank");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-headline text-3xl font-extrabold tracking-tight">
          Perfil
        </h1>
        <p className="text-muted-foreground">
          Gerencie suas configurações de perfil
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <MatchDicebearAvatar seed={settings.nickname ?? "user"} size={64} />
          <div className="flex-1">
            <CardTitle>@{settings.displayNickname ?? settings.nickname}</CardTitle>
            <CardDescription>
              {settings.albumCompletionPct.toFixed(1)}% do álbum completo
              {settings.totalTrades > 0 && ` • ${settings.totalTrades} trocas`}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <Progress value={settings.albumCompletionPct} className="h-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Configurações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Perfil público</Label>
              <p className="text-sm text-muted-foreground">
                Permite que outros vejam suas figurinhas via link
              </p>
            </div>
            <Checkbox
              id="public-profile"
              checked={settings.isProfilePublic}
              onCheckedChange={handleTogglePublic}
              disabled={isUpdating}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="accepts-mail">Aceito trocas por correio</Label>
              <p className="text-sm text-muted-foreground">
                Aparece para usuários de outras cidades
              </p>
            </div>
            <Checkbox
              id="accepts-mail"
              checked={settings.acceptsMail}
              onCheckedChange={handleToggleMail}
              disabled={isUpdating}
            />
          </div>
        </CardContent>
      </Card>

      {settings.isProfilePublic && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="size-5" />
              QR Code do perfil
            </CardTitle>
            <CardDescription>
              Compartilhe para que outros vejam suas figurinhas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-center">
              <div className="w-48 h-48 p-4 bg-white rounded-lg">
                <QRCode
                  data={profileUrl}
                  foreground="#1a472a"
                  background="#ffffff"
                  robustness="M"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                variant="outline"
                className="flex-1"
                onClick={handleCopyLink}
              >
                <Copy className="size-4 mr-2" />
                Copiar link
              </Button>
              <Button
                variant="outline"
                className="flex-1"
                asChild
              >
                <a href={profileUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-4 mr-2" />
                  Abrir perfil
                </a>
              </Button>
              <Button
                className="flex-1 bg-[#25D366] hover:bg-[#128C7E] text-white"
                onClick={handleShare}
              >
                <Share2 className="size-4 mr-2" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-5 w-64 mt-2" />
      </div>
      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Skeleton className="size-16 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-2 w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-48" />
            </div>
            <Skeleton className="size-4" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
