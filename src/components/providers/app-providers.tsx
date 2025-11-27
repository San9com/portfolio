"use client";

import { ReactNode } from "react";
import { MotionProvider } from "./motion-provider";
import { SmoothScrollProvider } from "./smooth-scroll-provider";
import { TitleManager } from "@/components/title-manager";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionProvider>
      <SmoothScrollProvider>
        <TitleManager />
        {children}
      </SmoothScrollProvider>
    </MotionProvider>
  );
}

