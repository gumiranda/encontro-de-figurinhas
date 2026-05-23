"use client";

import { useMemo } from "react";

interface QRCanvasProps {
  size?: number;
  text?: string;
}

export function QRCanvas({ size = 140, text = "" }: QRCanvasProps) {
  const grid = 21;

  const cells = useMemo(() => {
    let h = 5381;
    for (let i = 0; i < text.length; i++) {
      h = ((h << 5) + h) ^ text.charCodeAt(i);
    }

    const arr: number[] = [];
    for (let y = 0; y < grid; y++) {
      for (let x = 0; x < grid; x++) {
        const isFinder =
          (x < 7 && y < 7) ||
          (x > grid - 8 && y < 7) ||
          (x < 7 && y > grid - 8);

        if (isFinder) {
          const inX = x < 7 ? x : grid - 1 - x;
          const inY = y < 7 ? y : grid - 1 - y;
          const onRing = inX === 0 || inY === 0 || inX === 6 || inY === 6;
          const onCenter = inX >= 2 && inX <= 4 && inY >= 2 && inY <= 4;
          arr.push(onRing || onCenter ? 1 : 0);
          continue;
        }

        h = (h * 16807) % 2147483647;
        arr.push((h >> ((x + y) % 7)) & 1);
      }
    }
    return arr;
  }, [text]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${grid} ${grid}`}
      className="block"
    >
      <rect width={grid} height={grid} fill="white" />
      {cells.map((v, i) =>
        v ? (
          <rect
            key={i}
            x={i % grid}
            y={Math.floor(i / grid)}
            width={1}
            height={1}
            fill="#0d1323"
          />
        ) : null
      )}
    </svg>
  );
}
