"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

type CaseVisualShowcaseProps = {
  image: string;
  alt: string;
};

const FRAME_RATIO = 3082 / 2287;

export function CaseVisualShowcase({ image, alt }: CaseVisualShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Initialize viewport with actual window dimensions to prevent jump
  const [viewport, setViewport] = useState(() => {
    if (typeof window !== "undefined") {
      return { width: window.innerWidth, height: window.innerHeight };
    }
    return { width: 1280, height: 720 };
  });
  const [mounted, setMounted] = useState(false);

  // Single effect to handle viewport updates and scroll reset
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    // Set viewport immediately to prevent jump
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    
    updateViewport();
    
    // Scroll to top immediately and only once
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    }
    
    // Set mounted state after viewport is set
    const id = requestAnimationFrame(() => {
      setMounted(true);
      
      // Recalculate scroll height after mount
      const recalculateScroll = () => {
        const lenis = getLenis();
        if (lenis) {
          lenis.resize();
        }
      };
      
      // Single recalculation after a short delay
      setTimeout(recalculateScroll, 100);
    });
    
    window.addEventListener("resize", updateViewport);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const isDesktop = viewport.width >= 768;
  const {
    targetWidth,
    targetHeight,
    startWidth,
    startHeight,
    screenTopInset,
    screenSideInset,
  } = useMemo(() => {
    const width = Math.min(
      viewport.width * (isDesktop ? 0.74 : 0.92),
      isDesktop ? 1160 : viewport.width * 0.94,
    );
    const height = width / FRAME_RATIO;
    const screenHeightRatio = 0.7745;
    const screenWidthRatio = 0.92;
    return {
      targetWidth: width,
      targetHeight: height,
      startWidth: viewport.width,
      startHeight: viewport.height,
      screenTopInset: (1 - screenHeightRatio) * 100,
      screenSideInset: ((1 - screenWidthRatio) / 2) * 100,
    };
  }, [isDesktop, viewport.height, viewport.width]);

  const targetOffsetY = Math.max(viewport.height - targetHeight, 0);
  const width = useTransform(scrollYProgress, [0, 0.62], [startWidth, targetWidth]);
  const height = useTransform(scrollYProgress, [0, 0.62], [startHeight, targetHeight]);
  const y = useTransform(scrollYProgress, [0, 0.62], [0, targetOffsetY]);
  const borderRadius = useTransform(
    scrollYProgress,
    [0.08, 0.7],
    [0, isDesktop ? 32 : 20],
  );
  const frameOpacity = useTransform(scrollYProgress, [0.68, 0.88], [0, isDesktop ? 1 : 0]);
  const clipPath = useTransform(scrollYProgress, [0.64, 0.86], [
    "inset(0% 0% 0% 0% round 0px)",
    `inset(0% ${screenSideInset}% ${screenTopInset}% ${screenSideInset}% round 12px)`,
  ]);

  const [frameVisible, setFrameVisible] = useState(false);

  useMotionValueEvent(frameOpacity, "change", (value) => {
    const nextVisible = value > 0.01;
    setFrameVisible((prev) => (prev === nextVisible ? prev : nextVisible));
  });

  if (!mounted) {
    return (
      <section
        ref={sectionRef}
        className="relative flex min-h-[220svh] w-full flex-col justify-start"
        aria-label="Project visual immersion"
      >
        <div className="pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
          <div className="relative h-full w-full">
            <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
            <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black via-black/25 to-transparent" style={{ willChange: "opacity" }} />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[220svh] w-full flex-col justify-start"
      aria-label="Project visual immersion"
    >
      <div className="pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{
            width,
            height,
            y,
            borderRadius,
          }}
          className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden"
        >
          <div className="relative h-full w-full">
            <motion.div style={{ clipPath }} className="absolute inset-0">
              <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black via-black/25 to-transparent" />
            {frameVisible ? (
              <motion.img
                src="/Pro Display XDR.svg"
                alt="Pro Display XDR Frame"
                className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none object-contain mix-blend-lighten"
                style={{ opacity: frameOpacity }}
              />
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

