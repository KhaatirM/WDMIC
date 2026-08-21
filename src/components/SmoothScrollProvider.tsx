"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * Site-wide Lenis — imperative instance (no wrapper DOM) so CSS sticky
 * and Framer Motion useScroll stay reliable under App Router.
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      syncTouch: false,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      autoRaf: true,
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}
