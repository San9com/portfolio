"use client";

import { useRef, ReactNode } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";

type ScrollOffsetConfig = NonNullable<Parameters<typeof useScroll>[0]>["offset"];

type ParallaxSectionProps = {
  children: ReactNode;
  speed?: number;
  className?: string;
  zIndex?: number;
  offset?: ScrollOffsetConfig;
};

export function ParallaxSection({
  children,
  speed = 0.5,
  className,
  zIndex = 1,
  offset = ["start end", "end start"],
}: ParallaxSectionProps) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset,
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, speed * 100]);

  return (
    <motion.section
      ref={ref}
      style={{ y, zIndex }}
      className={clsx("relative", className)}
    >
      {children}
    </motion.section>
  );
}

