"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { HeroCanvas } from "@/components/hero/hero-canvas";
import { heroCopy, profile } from "@/data/site";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

const SEQUENCE_LENGTH = 5; // Number of title stages
const SCROLL_MULTIPLIER = 1.2; // How many viewport heights per stage

const heroMotion = {
  canvas: {
    initial: { opacity: 0, y: 32 },
    animate: { opacity: 1, y: 0 },
  },
};

export function HeroSection() {
  const headlineLines = heroCopy.headlineLines ?? [heroCopy.headline];
  const sectionRef = useRef<HTMLElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Calculate the total scroll height needed for the sequence
  const totalHeight = `${100 + SEQUENCE_LENGTH * SCROLL_MULTIPLIER * 100}vh`;

  // Track scroll progress within the hero section
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll progress so title/lens transitions feel premium
  const smoothScrollYProgress = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    mass: 0.7,
  });

  // Update scroll progress state for passing to canvas
  useMotionValueEvent(smoothScrollYProgress, "change", (latest) => {
    // Map scroll progress to 0-1 for the title sequence
    const adjustedProgress = Math.max(0, Math.min(1, latest));
    setScrollProgress(adjustedProgress);
  });

  // Snap-to-stage after scroll settles so you don't skip titles awkwardly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const section = sectionRef.current;
    if (!section) return;

    let snapTimer: ReturnType<typeof setTimeout> | undefined;
    let isSnapping = false;

    const count = SEQUENCE_LENGTH;
    const inv = (stage: number) => (stage + 0.3) / (count + 0.6); // inverse of getStageFloat mapping

    const onScroll = () => {
      if (isSnapping) return;
      if (snapTimer) clearTimeout(snapTimer);

      snapTimer = setTimeout(() => {
        const rect = section.getBoundingClientRect();
        const inHero = rect.top <= 0 && rect.bottom >= window.innerHeight;
        if (!inHero) return;

        // Avoid snapping when user is essentially leaving the hero.
        const p = scrollProgress;
        if (p > 0.95) return;

        const stageFloat = Math.max(0, Math.min(count - 0.001, p * (count + 0.6) - 0.3));
        const targetStage = Math.round(stageFloat);
        const targetProgress = Math.max(0, Math.min(1, inv(targetStage)));

        const heroTop = section.offsetTop;
        const maxScroll = section.offsetHeight - window.innerHeight;
        const targetY = heroTop + targetProgress * maxScroll;

        const lenis = getLenis();
        isSnapping = true;
        if (lenis) {
          lenis.scrollTo(targetY, { duration: 0.65 });
          setTimeout(() => {
            isSnapping = false;
          }, 700);
        } else {
          window.scrollTo({ top: targetY, behavior: "smooth" });
          setTimeout(() => {
            isSnapping = false;
          }, 700);
        }
      }, 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, [scrollProgress]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof document === "undefined") return;

    return () => {
      document.body.classList.remove("hero-cursor-hidden");
      document.documentElement.classList.remove("hero-cursor-hidden");
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate w-full"
      style={{
        height: totalHeight,
        zIndex: 1,
      }}
    >
      {/* Sticky container that stays in view during scroll */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 flex min-h-[100svh] w-full items-center justify-center overflow-hidden grain-overlay hero-no-cursor"
        style={{
          cursor: "none",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.cursor = "none";
          document.body.style.cursor = "none";
          document.documentElement.style.cursor = "none";
        }}
        onMouseMove={(e) => {
          e.currentTarget.style.cursor = "none";
          document.body.style.cursor = "none";
          document.documentElement.style.cursor = "none";
        }}
        onMouseLeave={() => {
          document.body.style.cursor = "";
          document.documentElement.style.cursor = "";
        }}
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
          onMouseEnter={(e) => {
            e.currentTarget.style.cursor = "none";
            const canvas = e.currentTarget.querySelector("canvas");
            if (canvas) canvas.style.cursor = "none";
          }}
          onMouseMove={(e) => {
            e.currentTarget.style.cursor = "none";
            const canvas = e.currentTarget.querySelector("canvas");
            if (canvas) canvas.style.cursor = "none";
          }}
        >
          <HeroCanvas
            headlineLines={headlineLines}
            description={heroCopy.description}
            portraitSrc={profile.portrait}
            introScript={heroCopy.introScript}
            scrollProgress={scrollProgress}
          />
        </motion.div>

        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
          style={{ opacity: 0 }}
        />
      </div>
    </section>
  );
}
