"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Info } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "@workspace/ui/components/card";
import { Input } from "@workspace/ui/components/input";
import { Label } from "@workspace/ui/components/label";
import { Checkbox } from "@workspace/ui/components/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@workspace/ui/components/tooltip";

const TOTAL_STICKERS = 980;
const PACKET_PRICE = 7;
const LUCK_AVERAGE_COST = 5000;
const TRADES_OPTIMISTIC_COST = 1500;

function calculateRemainingCost(stickersOwned: number, usesTrades: boolean): number {
  const clamped = Math.min(Math.max(stickersOwned, 0), TOTAL_STICKERS);
  const percentComplete = clamped / TOTAL_STICKERS;

  if (usesTrades) {
    return Math.round(TRADES_OPTIMISTIC_COST * (1 - percentComplete));
  } else {
    const remaining = 1 - percentComplete;
    return Math.round(LUCK_AVERAGE_COST * Math.pow(remaining, 0.6));
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function CalculatorClient() {
  const [packetsOwned, setPacketsOwned] = useState(0);
  const [stickersOwned, setStickersOwned] = useState(0);
  const [usesTrades, setUsesTrades] = useState(true);

  const result = useMemo(() => {
    const costSoFar = packetsOwned * PACKET_PRICE;
    const remainingCost = calculateRemainingCost(stickersOwned, usesTrades);
    const estimatedTotal = costSoFar + remainingCost;

    const noTradesCost = costSoFar + calculateRemainingCost(stickersOwned, false);
    const savings = usesTrades ? Math.max(0, noTradesCost - estimatedTotal) : 0;

    return {
      costSoFar,
      remainingCost,
      estimatedTotal,
      savings,
      percentComplete: Math.round((stickersOwned / TOTAL_STICKERS) * 100),
    };
  }, [packetsOwned, stickersOwned, usesTrades]);

  const handlePacketsChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) {
      setPacketsOwned(0);
    } else {
      setPacketsOwned(Math.min(num, 2000));
    }
  };

  const handleStickersChange = (value: string) => {
    const num = parseInt(value, 10);
    if (isNaN(num) || num < 0) {
      setStickersOwned(0);
    } else {
      setStickersOwned(Math.min(num, TOTAL_STICKERS));
    }
  };

  return (
    <TooltipProvider>
      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-xl">Seus dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="packets">Pacotes já comprados</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Quantos pacotinhos de R$ 7 você já comprou?</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="packets"
                type="number"
                min={0}
                max={2000}
                value={packetsOwned || ""}
                onChange={(e) => handlePacketsChange(e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Cada pacote = R$ 7 (7 figurinhas)
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="stickers">Figurinhas únicas que você tem</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Conte apenas figurinhas diferentes (não repetidas)</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="stickers"
                type="number"
                min={0}
                max={TOTAL_STICKERS}
                value={stickersOwned || ""}
                onChange={(e) => handleStickersChange(e.target.value)}
                placeholder="0"
              />
              <p className="text-xs text-muted-foreground">
                Máximo: {TOTAL_STICKERS} figurinhas no álbum
              </p>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <Checkbox
                id="trades"
                checked={usesTrades}
                onCheckedChange={(checked) => setUsesTrades(checked === true)}
              />
              <div className="space-y-1">
                <Label htmlFor="trades" className="font-medium cursor-pointer">
                  Vou usar trocas no Figurinha Fácil
                </Label>
                <p className="text-xs text-muted-foreground">
                  Marque se pretende trocar figurinhas repetidas
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-primary bg-primary/5">
          <CardHeader>
            <CardTitle className="text-xl">Estimativa de custo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Progresso</span>
                <span className="font-semibold">
                  {stickersOwned} / {TOTAL_STICKERS} ({result.percentComplete}%)
                </span>
              </div>

              <div className="w-full bg-muted rounded-full h-3">
                <div
                  className="bg-primary h-3 rounded-full transition-all duration-300"
                  style={{ width: `${result.percentComplete}%` }}
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Já gastou</span>
                <span className="font-medium">{formatCurrency(result.costSoFar)}</span>
              </div>

              <div className="flex justify-between">
                <span className="text-muted-foreground">Ainda vai gastar</span>
                <span className="font-medium">{formatCurrency(result.remainingCost)}</span>
              </div>

              <div className="flex justify-between pt-3 border-t text-lg">
                <span className="font-semibold">Total estimado</span>
                <span className="font-bold text-primary">
                  {formatCurrency(result.estimatedTotal)}
                </span>
              </div>
            </div>

            {usesTrades && result.savings > 0 && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <p className="text-green-600 dark:text-green-400 font-semibold text-center">
                  Economia com trocas: {formatCurrency(result.savings)}
                </p>
              </div>
            )}

            {!usesTrades && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                <p className="text-yellow-600 dark:text-yellow-400 text-sm text-center">
                  Ative "Vou usar trocas" para ver quanto pode economizar!
                </p>
              </div>
            )}

            <Button className="w-full" size="lg" asChild>
              <Link href="/sign-up">
                Começar a trocar
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
