"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";
import "lenis/dist/lenis.css";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

/**
 * Site-wide Lenis smooth scroll — heavy inertia, premium deceleration.
 * Tuned for Awwwards / Linear-style scroll weight (low lerp + soft wheel).
 */
export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.075,
        duration: 1.4,
        smoothWheel: true,
        syncTouch: false,
        wheelMultiplier: 0.85,
        touchMultiplier: 1.15,
        orientation: "vertical",
        gestureOrientation: "vertical",
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      }}
    >
      {children}
    </ReactLenis>
  );
}
