"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import { useRef } from "react";

type CaseVisualShowcaseProps = {
  image: string;
  alt: string;
};

export function CaseVisualShowcase({ image, alt }: CaseVisualShowcaseProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const heroScale = useTransform(scrollYProgress, [0, 0.55], [1.08, 0.68]);
  const heroOpacity = useTransform(scrollYProgress, [0.6, 0.92], [1, 0]);

  const frameOpacity = useTransform(scrollYProgress, [0.38, 0.82], [0, 1]);
  const frameScale = useTransform(scrollYProgress, [0.34, 1], [0.62, 1]);
  const frameTranslateY = useTransform(scrollYProgress, [0, 1], [140, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[220svh] w-full flex-col justify-center"
      aria-label="Project visual immersion"
    >
      <div className="pointer-events-none sticky top-0 h-[100svh] overflow-hidden">
        <motion.div
          style={{ scale: heroScale, opacity: heroOpacity }}
          className="relative h-full w-full overflow-hidden rounded-[16px] border border-white/4 bg-black"
        >
          <Image src={image} alt={alt} fill priority sizes="100vw" className="object-cover" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
        </motion.div>
      </div>

      <motion.div
        style={{ opacity: frameOpacity, scale: frameScale, y: frameTranslateY }}
        className="pointer-events-none relative mx-auto hidden w-full max-w-[1160px] px-6 sm:flex"
      >
        <div className="relative mx-auto w-full">
          <div className="relative mx-auto aspect-[3082/2287] w-full">
            <div
              className="absolute left-1/2 top-0 w-full -translate-x-1/2 overflow-hidden rounded-[26px] border border-white/6 shadow-[0_30px_80px_rgba(0,0,0,0.55)]"
              style={{
                width: "92%",
                height: "77.45%",
              }}
            >
              <Image
                src={image}
                alt={`${alt} framed preview`}
                fill
                sizes="(min-width: 1280px) 940px, (min-width: 768px) 70vw, 90vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <Image
              src="/Pro Display XDR.svg"
              alt="Pro Display XDR Frame"
              fill
              sizes="(min-width: 1280px) 1160px, (min-width: 768px) 80vw, 100vw"
              className="pointer-events-none select-none mix-blend-lighten"
              priority={false}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: frameOpacity }}
        className="pointer-events-none mt-16 flex w-full justify-center px-6 sm:hidden"
      >
        <div className="relative w-full max-w-[520px]">
          <div className="relative aspect-[3082/2287] w-full">
            <div
              className="absolute left-1/2 top-0 w-full -translate-x-1/2 overflow-hidden rounded-[18px] border border-white/6 shadow-[0_18px_50px_rgba(0,0,0,0.55)]"
              style={{
                width: "95%",
                height: "77.45%",
              }}
            >
              <Image
                src={image}
                alt={`${alt} framed preview`}
                fill
                sizes="90vw"
                className="object-cover"
                priority={false}
              />
            </div>
            <Image
              src="/Pro Display XDR.svg"
              alt="Pro Display XDR Frame"
              fill
              sizes="90vw"
              className="pointer-events-none select-none mix-blend-lighten"
              priority={false}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

