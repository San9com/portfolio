"use client";

import { ReactNode } from "react";
import { MotionProvider } from "./motion-provider";
import { TitleManager } from "@/components/title-manager";
import { CursorDot } from "@/components/cursor-dot";

type AppProvidersProps = {
  children: ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <MotionProvider>
      <TitleManager />
      <CursorDot />
      {children}
    </MotionProvider>
  );
}

