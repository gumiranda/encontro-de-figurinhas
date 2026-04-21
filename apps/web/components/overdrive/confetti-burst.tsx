"use client";

import { useEffect, useRef, useCallback } from "react";

interface ConfettiPiece {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rotation: number;
  rotationSpeed: number;
  width: number;
  height: number;
  color: string;
  gravity: number;
  drag: number;
}

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
  colors?: string[];
  originX?: number;
  originY?: number;
}

const DEFAULT_COLORS = [
  "#95AAFF", // primary
  "#4FF325", // secondary
  "#FFB800", // tertiary
  "#FF6B6B", // accent red
  "#A855F7", // purple
];

export function ConfettiBurst({
  trigger,
  onComplete,
  colors = DEFAULT_COLORS,
  originX = 0.5,
  originY = 0.5,
}: ConfettiBurstProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const piecesRef = useRef<ConfettiPiece[]>([]);
  const animationRef = useRef<number>(0);
  const reducedMotion = useRef(false);

  const burst = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion.current) {
      onComplete?.();
      return;
    }

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    const startX = rect.width * originX;
    const startY = rect.height * originY;
    const pieces: ConfettiPiece[] = [];

    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 12 + 6;

      pieces.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * velocity,
        vy: Math.sin(angle) * velocity - 5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        width: Math.random() * 8 + 4,
        height: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)]!,
        gravity: 0.3 + Math.random() * 0.2,
        drag: 0.98 + Math.random() * 0.015,
      });
    }

    piecesRef.current = pieces;
  }, [colors, originX, originY, onComplete]);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pieces = piecesRef.current;
    if (pieces.length === 0) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let alive = 0;

    for (const p of pieces) {
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;

      if (p.y < canvas.height + 50) {
        alive++;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.width / 2, -p.height / 2, p.width, p.height);
        ctx.restore();
      }
    }

    if (alive > 0) {
      animationRef.current = requestAnimationFrame(animate);
    } else {
      piecesRef.current = [];
      onComplete?.();
    }
  }, [onComplete]);

  useEffect(() => {
    reducedMotion.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (trigger) {
      burst();
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [trigger, burst, animate]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[9999]"
      aria-hidden="true"
    />
  );
}
