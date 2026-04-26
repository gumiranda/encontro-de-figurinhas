"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from "react";

const ReadingProgressContext = createContext(0);

export function useReadingProgress() {
  return useContext(ReadingProgressContext);
}

export function ReadingProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const newPct =
        docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      const clamped = Math.min(100, Math.max(0, newPct));
      setProgress((prev) => (prev === clamped ? prev : clamped));
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(updateProgress);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    updateProgress();

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ReadingProgressContext.Provider value={progress}>
      {children}
    </ReadingProgressContext.Provider>
  );
}
