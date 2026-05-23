"use client";

import { useEffect, useState } from "react";
import { cn } from "@workspace/ui/lib/utils";

interface FloatToastProps {
  message: string | null;
  duration?: number;
  onDismiss?: () => void;
}

export function FloatToast({ message, duration = 1500, onDismiss }: FloatToastProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
    setVisible(false);
  }, [message, duration, onDismiss]);

  if (!visible || !message) return null;

  return (
    <div
      className={cn(
        "fixed left-1/2 bottom-5 z-[200] -translate-x-1/2",
        "flex items-center gap-2 rounded-xl border border-primary bg-surface-container-highest px-3.5 py-2.5",
        "text-sm font-semibold shadow-2xl",
        "animate-in fade-in slide-in-from-bottom-2 duration-200"
      )}
    >
      {message}
    </div>
  );
}
