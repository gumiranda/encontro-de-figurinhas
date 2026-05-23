"use client";

import { Globe, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Switch } from "@workspace/ui/components/switch";

interface SettingsModuleProps {
  isProfilePublic: boolean;
  acceptsMail: boolean;
  onProfilePublicChange: (value: boolean) => void;
  onAcceptsMailChange: (value: boolean) => void;
}

function ToggleRow({
  icon: Icon,
  title,
  desc,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <div
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
          checked ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs text-muted-foreground">{desc}</div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function SettingsModule({
  isProfilePublic,
  acceptsMail,
  onProfilePublicChange,
  onAcceptsMailChange,
}: SettingsModuleProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-semibold">Configurações</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <ToggleRow
          icon={Globe}
          title="Perfil público"
          desc="Outras pessoas podem ver suas figurinhas via link"
          checked={isProfilePublic}
          onChange={onProfilePublicChange}
        />
        <div className="border-t border-border" />
        <ToggleRow
          icon={Mail}
          title="Aceito trocas por correio"
          desc="Aparece para usuários de outras cidades"
          checked={acceptsMail}
          onChange={onAcceptsMailChange}
        />
      </CardContent>
    </Card>
  );
}
