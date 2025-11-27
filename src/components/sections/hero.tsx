"use client";

import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || typeof document === "undefined") return;

    const handleMouseEnter = () => {
      document.body.classList.add("hero-cursor-hidden");
      document.documentElement.classList.add("hero-cursor-hidden");
      document.body.style.cursor = "none";
      document.documentElement.style.cursor = "none";
    };

    const handleMouseLeave = () => {
      document.body.classList.remove("hero-cursor-hidden");
      document.documentElement.classList.remove("hero-cursor-hidden");
      document.body.style.cursor = "";
      document.documentElement.style.cursor = "";
    };

    const handleMouseMove = () => {
      if (section.matches(":hover")) {
        document.body.style.cursor = "none";
        document.documentElement.style.cursor = "none";
      }
    };

    section.addEventListener("mouseenter", handleMouseEnter);
    section.addEventListener("mouseleave", handleMouseLeave);
    section.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      section.removeEventListener("mouseenter", handleMouseEnter);
      section.removeEventListener("mouseleave", handleMouseLeave);
      section.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousemove", handleMouseMove);
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
      className="relative isolate flex min-h-[75svh] w-full items-end justify-center overflow-hidden bg-black px-3 pb-32 pt-56 sm:px-10 sm:pb-20 sm:pt-28 lg:pb-24 hero-no-cursor"
      style={{ zIndex: 1, cursor: "none" }}
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
        className="absolute inset-0 hero-no-cursor"
        style={{ cursor: "none" }}
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

