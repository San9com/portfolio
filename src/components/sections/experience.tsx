"use client";

import { useMemo, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import Image from "next/image";
import { experience } from "@/data/experience";
import { ExperienceGlassItem } from "./experience-glass-canvas";

// Experience section component
export function ExperienceSection() {
  const items = useMemo(() => experience, []);
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Parallax effect for the image
  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  // Smooth spring for parallax - subtle effect
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const imageY = useTransform(smoothProgress, [0, 1], ["0%", "15%"]);
  const imageScale = useTransform(smoothProgress, [0, 0.5, 1], [1.08, 1.04, 1]);

  // Shape types for each experience item
  const shapes = ["phone", "cap", "star", "logo"] as const;

  return (
    <section ref={sectionRef} id="experience" className="relative bg-black px-8 pb-40 pt-0 sm:px-12 lg:px-16 lg:pt-24" style={{ zIndex: 10 }}>
      {/* Decorative image - Cinematic reveal with parallax */}
      <div 
        ref={imageContainerRef}
        className="relative -mx-8 sm:-mx-12 lg:-mx-16 mb-24 overflow-hidden"
        style={{ height: "clamp(200px, 30vw, 400px)" }}
      >
        {/* Reveal mask container */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          whileInView={{ clipPath: "inset(0% 0 0 0)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ 
            duration: 1.4, 
            ease: [0.76, 0, 0.24, 1],
            delay: 0.1
          }}
        >
          {/* Parallax image wrapper */}
          <motion.div
            className="absolute inset-[-10%] w-[120%] h-[120%]"
            style={{ y: imageY, scale: imageScale }}
          >
            <Image
              src="/rQVjSWhMpr6dh2f06IgOpTNcQ.jpg.webp"
              alt="Experience visual"
              fill
              className="object-cover grayscale"
              sizes="100vw"
              priority
            />
          </motion.div>
          
          {/* Animated grain overlay */}
          <motion.div 
            className="absolute inset-0 pointer-events-none mix-blend-overlay"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.15 }}
            viewport={{ once: true }}
            transition={{ duration: 2, delay: 0.8 }}
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            }}
          />
        </motion.div>

        {/* Horizontal reveal lines */}
        <motion.div
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.3 }}
        />
        <motion.div
          className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.76, 0, 0.24, 1], delay: 0.5 }}
        />

        {/* Gradient overlays for depth */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.6 }}
          style={{ opacity: 0.6 }}
        />
        
        {/* Side vignette */}
        <motion.div 
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 2, delay: 0.8 }}
          style={{
            background: "radial-gradient(ellipse 80% 100% at 50% 50%, transparent 40%, rgba(0,0,0,0.7) 100%)",
          }}
        />

        {/* Shimmer effect that sweeps across */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ x: "-100%" }}
          whileInView={{ x: "200%" }}
          viewport={{ once: true }}
          transition={{ 
            duration: 2, 
            ease: [0.4, 0, 0.2, 1],
            delay: 0.6
          }}
          style={{
            width: "50%",
            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
          }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-32">
        {/* Header */}
        <div className="flex flex-col gap-6">
          <span className="section-label text-white/40">
            EXPERIENCE
          </span>
          <h2 
            className="text-white font-serif"
            style={{ 
              fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
              lineHeight: 1.1,
              fontWeight: 300,
            }}
          >
            Designing since 2019
          </h2>
        </div>

        {/* Experience List - Two Column Layout with Glass Objects */}
        <div className="flex flex-col gap-40">
          {items.map((item, idx) => {
            const isTextRight = idx % 2 === 1;
            
            return (
              <motion.article
                key={item.id}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
                className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center min-h-[400px]"
              >
                {/* Text Content */}
                <div 
                  className={`flex flex-col gap-6 ${isTextRight ? 'lg:order-2 lg:text-right lg:items-end' : 'lg:order-1'}`}
                >
                  {/* Date as accent */}
                  <span className="section-label text-white/40">
                    {item.start} — {item.end}
                  </span>

                  {/* Company name - big handwritten */}
                  <h3 
                    className="text-white"
                    style={{ 
                      fontFamily: "var(--font-handwritten), cursive",
                      fontSize: "clamp(2.5rem, 6vw, 5rem)",
                      lineHeight: 1.0,
                    }}
                  >
                    {item.company}
                  </h3>

                  {/* Role */}
                  <span 
                    className="section-label text-white/50"
                    style={{ fontSize: "clamp(14px, 1.2vw, 18px)" }}
                  >
                    {item.role.toUpperCase()}
                  </span>

                  {/* Story/Summary */}
                  <p 
                    className="text-white max-w-2xl"
                    style={{
                      fontSize: "clamp(1rem, 1.5vw, 1.25rem)",
                      lineHeight: 1.7,
                    }}
                  >
                    {item.summary}
                  </p>
                </div>

                {/* Glass Object Container */}
                <div 
                  className={`relative h-[300px] lg:h-[400px] hidden lg:flex items-center justify-center ${isTextRight ? 'lg:order-1' : 'lg:order-2'}`}
                >
                  <ExperienceGlassItem shapeType={shapes[idx % shapes.length]} />
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

