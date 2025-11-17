"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
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
  const desiredWidth = Math.min(
    viewport.width * (isDesktop ? 0.72 : 0.92),
    isDesktop ? 1160 : viewport.width * 0.92,
  );
  const finalScaleX = desiredWidth / viewport.width;
  let finalScaleY =
    (finalScaleX * viewport.width) / (FRAME_RATIO * viewport.height);
  if (!isDesktop) {
    finalScaleY = finalScaleX;
  }
  finalScaleY = Math.max(Math.min(finalScaleY, 1), 0.45);

  const containerScaleX = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, finalScaleX]);
  const containerScaleY = useTransform(scrollYProgress, [0, 0.6, 1], [1, 0.9, finalScaleY]);
  const containerRadius = useTransform(scrollYProgress, [0, 0.7, 1], [0, 0, isDesktop ? 22 : 14]);
  const frameOpacity = useTransform(scrollYProgress, [0.72, 0.88], [0, isDesktop ? 1 : 0]);

  const containerY = useMotionValue(0);
  const [frameVisible, setFrameVisible] = useState(false);
  useEffect(() => {
    const unsubscribe = containerScaleY.on("change", (value) => {
      const offset = (viewport.height * (1 - value)) / 2;
      containerY.set(offset);
    });
    return () => unsubscribe();
  }, [containerScaleY, viewport.height, containerY]);

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
        <motion.div
          style={{
            scaleX: containerScaleX,
            scaleY: containerScaleY,
            y: containerY,
            borderRadius: containerRadius,
          }}
          className="absolute inset-0 origin-top overflow-hidden"
        >
          <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
          {frameVisible ? (
            <motion.img
              src="/Pro Display XDR.svg"
              alt="Pro Display XDR Frame"
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-contain mix-blend-lighten"
              style={{ opacity: frameOpacity }}
            />
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}

