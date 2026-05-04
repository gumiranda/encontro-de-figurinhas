"use client";

import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@workspace/ui/components/card";
import {
  Banner,
  BannerIcon,
  BannerTitle,
  BannerAction,
} from "@workspace/ui/components/kibo-ui/banner";
import {
  Book,
  ArrowLeftRight,
  MessageSquare,
  MapPin,
  Star,
  Users,
  User,
  Settings,
  Plus,
  ListPlus,
} from "lucide-react";
import Link from "next/link";

const shortcuts = [
  {
    href: "/album",
    icon: Book,
    title: "Meu Álbum",
    description: "Gerencie suas figurinhas e veja seu progresso",
  },
  {
    href: "/encontrar-trocas",
    icon: ArrowLeftRight,
    title: "Encontrar Trocas",
    description: "Busque trocas compatíveis com colecionadores",
  },
  {
    href: "/propostas",
    icon: MessageSquare,
    title: "Propostas",
    description: "Veja e gerencie suas propostas de troca",
  },
  {
    href: "/mapa",
    icon: MapPin,
    title: "Mapa",
    description: "Encontre pontos de troca perto de você",
  },
  {
    href: "/meus-pontos",
    icon: Star,
    title: "Meus Pontos",
    description: "Gerencie seus pontos de troca favoritos",
  },
  {
    href: "/suggest-spot",
    icon: Plus,
    title: "Sugerir Ponto",
    description: "Sugira um novo ponto de troca",
  },
  {
    href: "/comunidade",
    icon: Users,
    title: "Comunidade",
    description: "Conecte-se com outros colecionadores",
  },
  {
    href: "/perfil",
    icon: User,
    title: "Meu Perfil",
    description: "Edite suas informações e preferências",
  },
  {
    href: "/ajustes",
    icon: Settings,
    title: "Ajustes",
    description: "Configure notificações e privacidade",
  },
];

export default function DashboardPage() {
  const currentUser = useQuery(api.users.getCurrentUser);

  const hasNoDuplicates = (currentUser?.duplicates?.length ?? 0) === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo{currentUser?.name ? `, ${currentUser.name}` : ""}!
        </p>
      </div>

      {hasNoDuplicates && (
        <Banner className="bg-amber-500 text-amber-950" inset>
          <BannerIcon icon={ListPlus} className="border-amber-950/20 bg-amber-950/10" />
          <BannerTitle>Você ainda não cadastrou figurinhas repetidas. Cadastre para começar a trocar!</BannerTitle>
          <BannerAction asChild className="border-amber-950/30 text-amber-950 hover:bg-amber-950/10 hover:text-amber-950">
            <Link href="/cadastrar-figurinhas/quick">Cadastrar figurinhas</Link>
          </BannerAction>
        </Banner>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {shortcuts.map((shortcut) => (
          <Link key={shortcut.href} href={shortcut.href}>
            <Card className="h-full transition-colors hover:bg-muted/50 cursor-pointer">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <shortcut.icon className="h-5 w-5 text-primary" />
                  <CardTitle className="text-lg">{shortcut.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{shortcut.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
