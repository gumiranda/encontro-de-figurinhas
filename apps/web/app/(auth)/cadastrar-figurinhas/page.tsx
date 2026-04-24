"use client";

import { VeryQuickRegisterView } from "@/modules/stickers/ui/views/very-quick-register-view";

export default function CadastrarFigurinhasPage() {
  return (
    <VeryQuickRegisterView
      registerModeSwitch={{
        href: "/cadastrar-figurinhas/quick",
        label: "Abrir modo completo (grade)",
      }}
    />
  );
}
