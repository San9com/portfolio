"use client";

import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

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

  const isDesktop = viewport.width >= 768;
  const targetWidth = Math.min(
    viewport.width * (isDesktop ? 0.72 : 0.9),
    isDesktop ? 1160 : viewport.width * 0.92,
  );
  const targetHeight = targetWidth / FRAME_RATIO;
  const coverScale = Math.max(
    viewport.width / targetWidth,
    viewport.height / targetHeight,
  );

  const scale = useTransform(scrollYProgress, [0, 0.6], [coverScale, 1]);
  const containerRadius = useTransform(
    scrollYProgress,
    [0.12, 0.68],
    [0, isDesktop ? 22 : 16],
  );
  const frameOpacity = useTransform(scrollYProgress, [0.62, 0.82], [0, isDesktop ? 1 : 0]);

  const [frameVisible, setFrameVisible] = useState(false);

  useMotionValueEvent(frameOpacity, "change", (value) => {
    const nextVisible = value > 0.01;
    setFrameVisible((prev) => (prev === nextVisible ? prev : nextVisible));
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[220svh] w-full flex-col justify-center"
      aria-label="Project visual immersion"
    >
      <div className="pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
        <div className="relative h-full w-full">
          <motion.div
            style={{
              scale,
              borderRadius: containerRadius,
            }}
            className="absolute left-1/2 top-0 w-[min(1160px,90vw)] origin-top -translate-x-1/2 overflow-hidden"
          >
            <div
              className="relative w-full"
              style={{ paddingBottom: `${(1 / FRAME_RATIO) * 100}%` }}
            >
              <Image
                src={image}
                alt={alt}
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              {frameVisible ? (
                <motion.img
                  src="/Pro Display XDR.svg"
                  alt="Pro Display XDR Frame"
                  className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain mix-blend-lighten"
                  style={{ opacity: frameOpacity }}
                />
              ) : null}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

