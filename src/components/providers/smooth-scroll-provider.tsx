"use client";

import { ReactNode, useEffect } from "react";
import Lenis from "lenis";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mediaQuery.matches) {
      document.documentElement.style.scrollBehavior = "auto";
      return;
    }

    const lenis = new Lenis({
      lerp: 0.07,
      smoothWheel: true,
    });

    let animationFrame: number;

    const onFrame = (time: number) => {
      lenis.raf(time);
      animationFrame = requestAnimationFrame(onFrame);
    };

    animationFrame = requestAnimationFrame(onFrame);

    return () => {
      cancelAnimationFrame(animationFrame);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}

