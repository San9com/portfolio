"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { HeroCanvas } from "@/components/hero/hero-canvas";
import { heroCopy, profile } from "@/data/site";

const heroMotion = {
  canvas: {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
  },
};

export function HeroSection() {
  const headlineLines = heroCopy.headlineLines ?? [heroCopy.headline];
  const sectionRef = useRef<HTMLElement | null>(null);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] w-full items-end justify-center overflow-hidden bg-black px-3 pb-16 pt-28 sm:px-10 sm:pb-20 lg:pb-24"
    >
      <div className="sr-only">
        <p>{heroCopy.introScript}</p>
        <h1>{heroCopy.headline}</h1>
        <p>{heroCopy.description}</p>
      </div>

      <motion.div
        variants={heroMotion.canvas}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
        className="absolute inset-0"
      >
        <HeroCanvas
          headlineLines={headlineLines}
          description={heroCopy.description}
          portraitSrc={profile.portrait}
          introScript={heroCopy.introScript}
        />
      </motion.div>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
    </section>
  );
}

