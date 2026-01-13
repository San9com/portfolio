"use client";

import { ReactNode } from "react";

type SmoothScrollProviderProps = {
  children: ReactNode;
};

export function getLenis() {
  return null;
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  return <>{children}</>;
}

