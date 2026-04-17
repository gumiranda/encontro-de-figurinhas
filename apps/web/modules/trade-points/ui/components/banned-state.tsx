"use client";

import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";

export function BannedState() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader className="items-center text-center">
          <ShieldAlert className="h-12 w-12 text-destructive" />
          <CardTitle>Conta suspensa</CardTitle>
          <CardDescription>
            Sua conta está suspensa e não pode acessar pontos de troca no momento.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Button asChild variant="outline">
            <Link href="/">Voltar para o início</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
