"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

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

  const [viewport, setViewport] = useState({ width: 1280, height: 720 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const update = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  useEffect(() => {
    // Ensure component is mounted and gradient is visible
    setMounted(true);
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
    // On mobile, start full screen (100vh)
    const mobileStartHeight = typeof window !== "undefined" ? window.innerHeight : viewport.height;
    return {
      targetWidth: width,
      targetHeight: height,
      startWidth: viewport.width,
      startHeight: isDesktop ? viewport.height : mobileStartHeight,
      screenTopInset: (1 - screenHeightRatio) * 100,
      screenSideInset: ((1 - screenWidthRatio) / 2) * 100,
    };
  }, [isDesktop, viewport.height, viewport.width]);

  const targetOffsetY = Math.max(viewport.height - targetHeight, 0);
  const width = useTransform(scrollYProgress, [0, 0.62], [startWidth, targetWidth], {
    clamp: false,
  });
  const height = useTransform(scrollYProgress, [0, 0.62], [startHeight, targetHeight], {
    clamp: false,
  });
  const y = useTransform(scrollYProgress, [0, 0.62], [0, targetOffsetY], {
    clamp: false,
  });
  const borderRadius = useTransform(
    scrollYProgress,
    [0.08, 0.7],
    [0, isDesktop ? 32 : 20],
    { clamp: false },
  );
  const frameOpacity = useTransform(scrollYProgress, [0.68, 0.88], [0, 1], {
    clamp: false,
  });
  const clipPath = useTransform(scrollYProgress, [0.64, 0.86], [
    "inset(0% 0% 0% 0% round 0px)",
    `inset(0% ${screenSideInset}% ${screenTopInset}% ${screenSideInset}% round 12px)`,
  ], { clamp: false });

  const [frameVisible, setFrameVisible] = useState(false);

  useMotionValueEvent(frameOpacity, "change", (value) => {
    const nextVisible = value > 0.01;
    setFrameVisible((prev) => (prev === nextVisible ? prev : nextVisible));
  });

  if (!mounted) {
    return (
      <section
        ref={sectionRef}
        className="relative flex min-h-[300svh] w-full flex-col justify-start"
        aria-label="Project visual immersion"
      >
        <div className="pointer-events-none sticky top-0 h-[100dvh] overflow-hidden">
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
      className="relative flex min-h-[300svh] w-full flex-col justify-start"
      aria-label="Project visual immersion"
    >
      <div className="pointer-events-none sticky top-0 h-[100dvh] overflow-hidden">
        <motion.div
          style={{
            width,
            height,
            y,
            borderRadius,
            willChange: "transform",
          }}
          className="absolute left-1/2 top-0 -translate-x-1/2 overflow-hidden"
        >
          <div className="relative h-full w-full">
            <motion.div 
              style={{ 
                clipPath,
                willChange: "clip-path",
              }} 
              className="absolute inset-0"
            >
              <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
            </motion.div>
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black via-black/25 to-transparent" />
            {frameVisible ? (
              <motion.img
                src="/Pro Display XDR.svg"
                alt="Pro Display XDR Frame"
                className="pointer-events-none absolute inset-0 z-30 h-full w-full select-none object-contain mix-blend-lighten"
                style={{ 
                  opacity: frameOpacity,
                  willChange: "opacity",
                }}
              />
            ) : null}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

