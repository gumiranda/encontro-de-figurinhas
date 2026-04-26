import type { Metadata } from "next";
import { SeedAdminView } from "./seed-admin-view";

export const metadata: Metadata = {
  title: "Seed Database",
  robots: { index: false, follow: false },
};

export default function AdminSeedPage() {
  return <SeedAdminView />;
}
