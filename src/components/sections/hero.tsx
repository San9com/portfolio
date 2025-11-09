"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeroCanvas } from "@/components/hero/hero-canvas";
import { heroCopy, profile } from "@/data/site";

const heroMotion = {
  canvas: {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
  },
  cta: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
  },
};

export function HeroSection() {
  const headlineLines = heroCopy.headlineLines ?? [heroCopy.headline];

  return (
    <section
      id="top"
      className="relative isolate flex min-h-[100svh] w-full items-end justify-center overflow-hidden bg-[#050505] px-3 pb-16 pt-28 sm:px-10 sm:pb-20 lg:pb-24"
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

      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(177,165,167,0.12),transparent_65%)]"
        aria-hidden="true"
      />

      <motion.div
        variants={heroMotion.cta}
        initial="initial"
        animate="animate"
        transition={{ delay: 0.6, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex w-full items-center justify-start gap-3 px-3 text-muted sm:px-0"
      >
        <Link href="#work" className="group inline-flex items-center gap-2 text-sm font-normal transition-colors hover:text-foreground">
          <span>{heroCopy.ctaLabel.charAt(0).toUpperCase() + heroCopy.ctaLabel.slice(1)}</span>
          <span aria-hidden="true" className="transition-transform group-hover:translate-y-1">
            ↓
          </span>
        </Link>
      </motion.div>
    </section>
  );
}

