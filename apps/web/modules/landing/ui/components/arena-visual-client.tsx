"use client";

import { Landmark } from "lucide-react";
import { ArenaParticles } from "@/components/overdrive/arena-particles";

export function ArenaVisualClient() {
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[26rem]"
      role="img"
      aria-label="Arena visual com colecionadores ativos em cidades próximas"
    >
      {/* Particle system layer */}
      <ArenaParticles className="absolute inset-0 z-0" />

      {/* Background glow */}
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(55,102,255,0.12)_0%,transparent_70%)] glow-pulse" />

      {/* Animated rings */}
      <div className="absolute inset-[5%] rounded-full border border-primary/15 arena-ring arena-ring-1" />
      <div className="absolute inset-[18%] rounded-full border border-secondary/10 arena-ring arena-ring-2" />
      <div className="absolute inset-[32%] rounded-full border border-tertiary/8 arena-ring arena-ring-3" />

      {/* Radar sweep */}
      <div className="radar-sweep opacity-60" aria-hidden="true" />

      {/* Center landmark */}
      <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="rounded-full p-[3px] bg-primary/20 ring-1 ring-primary/30">
          <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-primary shadow-[0_4px_24px_-4px_rgba(149,170,255,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)]">
            <Landmark
              className="h-7 w-7 text-on-primary"
              aria-hidden="true"
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>

      {/* Floating pins with proximity effect */}
      <PeripheralPin top="10%" left="55%" value="12" tone="secondary" />
      <PeripheralPin top="60%" left="12%" value="8" tone="tertiary" />
      <PeripheralPin top="75%" left="78%" value="23" tone="primary" />
      <PeripheralPin top="30%" left="85%" value="5" tone="secondary" />
    </div>
  );
}

function PeripheralPin({
  top,
  left,
  value,
  tone,
}: {
  top: string;
  left: string;
  value: string;
  tone: "primary" | "secondary" | "tertiary";
}) {
  const toneStyles = {
    primary: {
      shell: "bg-primary/15 ring-1 ring-primary/25",
      core: "bg-primary",
      text: "text-on-primary",
    },
    secondary: {
      shell: "bg-secondary/12 ring-1 ring-secondary/20",
      core: "bg-secondary",
      text: "text-on-secondary",
    },
    tertiary: {
      shell: "bg-tertiary/12 ring-1 ring-tertiary/20",
      core: "bg-tertiary",
      text: "text-on-tertiary",
    },
  }[tone];

  return (
    <div
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-[2px] animate-float-pin pin-proximity ${toneStyles.shell}`}
      style={{ top, left }}
      aria-hidden="true"
    >
      <div className={`flex h-9 w-9 items-center justify-center rounded-full font-headline text-xs font-semibold shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)] ${toneStyles.core} ${toneStyles.text}`}>
        {value}
      </div>
    </div>
  );
}
