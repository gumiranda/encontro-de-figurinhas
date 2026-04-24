"use client";

import { useEffect, useRef, useState, type RefObject } from "react";

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
): [RefObject<T | null>, boolean] {
  const { threshold = 0.1, rootMargin = "0px 0px -50px 0px", triggerOnce = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return [ref, isVisible];
}

export function useScrollRevealGroup(
  count: number,
  options: UseScrollRevealOptions = {}
): [RefObject<HTMLDivElement | null>, boolean[]] {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = useState<boolean[]>(Array(count).fill(false));
  const { threshold = 0.1, rootMargin = "0px 0px -30px 0px", triggerOnce = true } = options;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setVisibleItems(Array(count).fill(true));
      return;
    }

    const children = Array.from(container.children);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = children.indexOf(entry.target as HTMLElement);
          if (index !== -1 && entry.isIntersecting) {
            setVisibleItems((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          }
        });
      },
      { threshold, rootMargin }
    );

    children.forEach((child) => observer.observe(child));

    return () => observer.disconnect();
  }, [count, threshold, rootMargin, triggerOnce]);

  return [containerRef, visibleItems];
}
