"use client";

import { ReactNode } from "react";
import { MotionProvider } from "./motion-provider";
import { SmoothScrollProvider } from "./smooth-scroll-provider";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionProvider>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </MotionProvider>
  );
}

