import type { Metadata } from "next";
import { SettingsPage } from "@/modules/settings/ui/components/settings-page";

export const metadata: Metadata = {
  title: "Ajustes",
  robots: { index: false, follow: false },
};

export default function AjustesPage() {
  return <SettingsPage />;
}
