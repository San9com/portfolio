"use client";

import { useRef, useState } from "react";
import { motion, useMotionTemplate, useMotionValue, useSpring } from "framer-motion";
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
  const [isPointerActive, setIsPointerActive] = useState(false);
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 140, damping: 22, mass: 0.2 });
  const springY = useSpring(pointerY, { stiffness: 140, damping: 22, mass: 0.2 });
  const interactiveGlow = useMotionTemplate`radial-gradient(360px at ${springX}px ${springY}px, rgba(177,165,167,0.22), transparent 70%)`;

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate flex min-h-[100svh] w-full items-end justify-center overflow-hidden bg-black px-3 pb-16 pt-28 sm:px-10 sm:pb-20 lg:pb-24"
      onMouseMove={(event) => {
        const bounds = sectionRef.current?.getBoundingClientRect();
        if (!bounds) return;
        pointerX.set(event.clientX - bounds.left);
        pointerY.set(event.clientY - bounds.top);
        if (!isPointerActive) setIsPointerActive(true);
      }}
      onMouseLeave={() => setIsPointerActive(false)}
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
        style={{
          background: interactiveGlow,
          opacity: isPointerActive ? 1 : 0,
        }}
      />
    </section>
  );
}

