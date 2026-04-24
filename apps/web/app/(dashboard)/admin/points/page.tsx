import type { Metadata } from "next";
import { AdminPointsView } from "@/modules/admin/ui/admin-points-view";

export const metadata: Metadata = {
  title: "Aprovar pontos",
  robots: { index: false, follow: false },
};

export default function AdminPointsPage() {
  return <AdminPointsView />;
}
