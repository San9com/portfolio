"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

// Store Lenis instance globally for access
let lenisInstance: Lenis | null = null;

export function getLenis() {
  return lenisInstance;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      document.documentElement.style.scrollBehavior = "auto";
      return;
    }

    const lenis = new Lenis({
      lerp: 0.1, // Faster lerp for better performance
      smoothWheel: true,
      duration: 1.2, // Slightly faster duration
    });

    lenisInstance = lenis;

    let animationFrame: number;

    const onFrame = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(onFrame);
    };

    animationFrame = requestAnimationFrame(onFrame);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  return <>{children}</>;
}

