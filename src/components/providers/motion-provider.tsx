"use client";

import { MotionConfig } from "framer-motion";
import { ReactNode, useSyncExternalStore } from "react";

type MotionProviderProps = {
  children: ReactNode;
};

function subscribe(callback: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const handler = () => callback();
  mediaQuery.addEventListener("change", handler);
  return () => mediaQuery.removeEventListener("change", handler);
}

function getSnapshot() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MotionProvider({ children }: MotionProviderProps) {
  const shouldReduceMotion = useSyncExternalStore(subscribe, getSnapshot, () => false);

  return (
    <MotionConfig reducedMotion={shouldReduceMotion ? "always" : "never"}>
      {children}
    </MotionConfig>
  );
}

