"use client";

import { QuickRegisterView } from "@/modules/stickers/ui/views/quick-register-view";

export default function CadastrarFigurinhasPage() {
  return (
    <QuickRegisterView
      registerModeSwitch={{
        href: "/cadastrar-figurinhas",
        label: "Usar cadastro compacto",
      }}
    />
  );
}
