"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useMotionValueEvent, useSpring } from "framer-motion";
import { HeroCanvas } from "@/components/hero/hero-canvas";
import { heroCopy, profile } from "@/data/site";

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
  const getIsMobile = () => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(max-width: 767px)").matches;
  };
  // Important: initialize from matchMedia so mobile never runs desktop-only snapping.
  const [isMobile, setIsMobile] = useState(getIsMobile);

  // Calculate the total scroll height needed for the sequence
  const totalHeightValue = 100 + SEQUENCE_LENGTH * SCROLL_MULTIPLIER * 100;

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
    if (isMobile) return;
    // Map scroll progress to 0-1 for the title sequence
    const adjustedProgress = Math.max(0, Math.min(1, latest));
    setScrollProgress(adjustedProgress);
  });

  // Keep isMobile in sync with matchMedia changes.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();
    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }
    (media as any).addListener?.(update);
    return () => (media as any).removeListener?.(update);
  }, []);

  // Mobile scroll progress (avoid Framer's scrollYProgress inconsistencies with sticky + iOS viewport)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!isMobile) return;

    const section = sectionRef.current;
    if (!section) return;

    let raf = 0;
    const updateProgress = () => {
      raf = 0;
      const rect = section.getBoundingClientRect();
      const vh = window.visualViewport?.height ?? window.innerHeight;
      const maxScroll = section.offsetHeight - vh;
      if (maxScroll <= 0) {
        setScrollProgress(0);
        return;
      }
      const progressed = Math.max(0, Math.min(1, (-rect.top) / maxScroll));
      setScrollProgress(progressed);
    };

    const onScroll = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    window.visualViewport?.addEventListener("resize", onScroll, { passive: true } as any);
    window.visualViewport?.addEventListener("scroll", onScroll, { passive: true } as any);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.visualViewport?.removeEventListener("resize", onScroll as any);
      window.visualViewport?.removeEventListener("scroll", onScroll as any);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [isMobile]);

  // Snap-to-stage after scroll settles so you don't skip titles awkwardly.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (isMobile) return;
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

        isSnapping = true;
        window.scrollTo({ top: targetY, behavior: "auto" });
        setTimeout(() => {
          isSnapping = false;
        }, 700);
      }, 140);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (snapTimer) clearTimeout(snapTimer);
    };
  }, [scrollProgress, isMobile]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof document === "undefined") return;

    return () => {
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="relative isolate w-full"
      style={{
        height: `${totalHeightValue}${isMobile ? "svh" : "vh"}`,
        zIndex: 1,
      }}
    >
      {/* Sticky container that stays in view during scroll */}
      <div
        ref={stickyRef}
        className="sticky top-0 left-0 relative flex min-h-[100svh] w-full items-center justify-center overflow-hidden grain-overlay hero-no-cursor"
    >
        {/* Mobile safety: ensure we never flash default canvas gray while WebGL assets load */}
        <div className="pointer-events-none absolute inset-0 bg-[url('/bgd-test-2.png')] bg-cover bg-center md:hidden" />

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
