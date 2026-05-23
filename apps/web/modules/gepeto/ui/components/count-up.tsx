"use client";

import { useEffect, useState } from "react";

interface CountUpProps {
  to: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export function CountUp({
  to,
  duration = 1200,
  suffix = "",
  prefix = "",
}: CountUpProps) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start: number;
    let raf: number;

    const step = (timestamp: number) => {
      if (!start) start = timestamp;
      const progress = Math.min(1, (timestamp - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(to * eased));
      if (progress < 1) {
        raf = requestAnimationFrame(step);
      }
    };

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [to, duration]);

  return (
    <>
      {prefix}
      {value.toLocaleString("pt-BR")}
      {suffix}
    </>
  );
}
