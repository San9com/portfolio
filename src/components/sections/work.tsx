"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { projects } from "@/data/projects";
import { useRouter } from "next/navigation";
import { AnimatedText } from "@/components/animated-text";

export function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Subtle parallax - elegant and simple (desktop only)
  const y = useTransform(scrollYProgress, [0, 1], [0, isDesktop ? 30 : 0]);

  return (
    <section
      id="work"
      ref={sectionRef}
      className="bg-black px-8 pt-[12vh] pb-[18vh] sm:px-12 lg:px-16 sm:pb-[18vh] lg:pt-[15vh] lg:pb-[24vh]"
      style={{ zIndex: 2 }}
    >
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="relative"
      >
      <div id="work-content" className="mx-auto flex w-full max-w-7xl flex-col gap-20">
        <div className="flex flex-col items-center gap-4 pb-16 text-center">
          <AnimatedText
            as="span"
            className="section-label text-foreground/45"
            delay={0.05}
          >
            SELECTED WORK
          </AnimatedText>
          <motion.span
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
            className="block text-white"
            style={{ 
              fontFamily: "var(--font-handwritten), cursive",
              fontSize: "calc(clamp(2.5rem, 5vw, 4rem) * 1.3)",
            }}
          >
            Projects I'm proud of
          </motion.span>
        </div>

        <div className="flex flex-col gap-8 lg:h-[48rem] lg:flex-row">
          {projects.map((project, index) => {
            const isActive = activeIndex === index;

            return (
              <ProjectCard
                key={project.id}
                project={project}
                index={index}
                isActive={isActive}
                onActivate={setActiveIndex}
              />
            );
          })}
        </div>
      </div>
      </motion.div>
    </section>
  );
}

type ProjectCardProps = {
  project: (typeof projects)[number];
  index: number;
  isActive: boolean;
  onActivate: (index: number) => void;
};

function ProjectCard({ project, index, isActive, onActivate }: ProjectCardProps) {
  const router = useRouter();
  const ref = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  
  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDesktop();
    window.addEventListener("resize", checkDesktop);
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  // Smooth parallax - stronger on desktop, moderate on mobile
  const translateY = useTransform(scrollYProgress, [0, 1], isDesktop ? [-50, 50] : [-30, 30]);
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    onActivate(index);
    setIsHovered(true);
  }, [index, onActivate]);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const handleClick = useCallback(() => {
    router.push(`/work/${project.slug}`);
  }, [router, project.slug]);

  const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      router.push(`/work/${project.slug}`);
    }
  }, [router, project.slug]);

  return (
    <motion.article
      ref={ref}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => onActivate(index)}
      role="link"
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      initial={false}
      animate={isDesktop ? {
        flex: isActive ? 2.2 : 0.4,
      } : {}}
      transition={isDesktop ? { 
        duration: 0.35, // Faster for better performance
        ease: [0.4, 0, 0.2, 1],
        layout: { duration: 0.35 } // Faster layout transitions
      } : {}}
      className="group relative flex min-h-[42rem] flex-1 flex-col justify-end overflow-hidden rounded bg-black/40 will-change-[flex] cursor-pointer lg:min-h-[33rem]"
      style={{ 
        transform: "translateZ(0)", // Force GPU acceleration
        backfaceVisibility: "hidden",
      }}
      tabIndex={0}
    >
      {/* Subtle hover glow - optimized */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
                initial={false}
                animate={{
          opacity: isHovered ? 0.12 : 0,
                }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.2), transparent 70%)",
          willChange: "opacity",
        }}
      />

      {/* Image with parallax */}
      <motion.div 
        className="absolute inset-0"
        style={{ 
          y: translateY,
          willChange: isDesktop ? "transform" : "auto",
          transform: "translateZ(0)", // Force GPU acceleration
        }}
      >
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
          className={clsx(
            "h-full w-full object-cover transition-all duration-500 ease-out will-change-transform",
            isHovered ? "scale-[1.02] grayscale" : "scale-100 grayscale-0"
          )}
                  priority={index === 0}
                />
      </motion.div>

      {/* Gradient overlay */}
      <motion.div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/30 to-transparent md:via-black/20"
        initial={false}
        animate={{
          opacity: isDesktop ? (isActive ? 1 : 0.6) : 1,
        }}
        transition={{ duration: 0.3 }}
                />

      {/* Content with smooth animations */}
      {isDesktop ? (
        <motion.div
          className="relative z-10 flex flex-col gap-3 p-6"
          initial={false}
          animate={{
            y: isActive ? 0 : 10,
            opacity: isActive ? 1 : 0,
          }}
          transition={{
            duration: 0.35,
            ease: [0.4, 0, 0.2, 1],
            opacity: { duration: 0.25 }
          }}
          style={{
            pointerEvents: isActive ? "auto" : "none",
            willChange: "transform, opacity",
          }}
        >
          <motion.span 
            className="section-label text-white/50"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isActive ? 0.05 : 0 }}
          >
            {project.year}
          </motion.span>
          
          <motion.h3 
            className="section-title text-foreground"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.25, delay: isActive ? 0.08 : 0 }}
          >
            {project.title}
          </motion.h3>
          
          <motion.p 
            className="body-text text-white/60 max-w-md"
            initial={false}
            animate={{ 
              opacity: isActive ? 1 : 0,
              y: isActive ? 0 : 8,
            }}
            transition={{ 
              duration: 0.3, 
              delay: isActive ? 0.12 : 0,
              ease: [0.4, 0, 0.2, 1]
            }}
          >
            {project.description}
          </motion.p>
          
          <motion.span
            className="pointer-events-none mt-2 inline-flex items-center gap-2 section-label text-white/70"
            initial={false}
            animate={{ 
              opacity: isActive ? 1 : 0,
              x: isHovered ? 4 : 0,
            }}
            transition={{ 
              opacity: { duration: 0.25, delay: isActive ? 0.15 : 0 },
              x: { duration: 0.2, ease: "easeOut" }
            }}
          >
            READ CASE
            <span aria-hidden="true" className="text-sm">↗</span>
          </motion.span>
        </motion.div>
      ) : (
        <div className="relative z-10 flex flex-col gap-3 p-6">
          <AnimatedText
            as="span"
            className="section-label text-white/50"
            delay={0.1 + index * 0.08}
          >
            {project.year}
          </AnimatedText>
          
          <AnimatedText
            as="h3"
            className="section-title text-foreground"
            delay={0.15 + index * 0.08}
          >
            {project.title}
          </AnimatedText>
          
          <AnimatedText
            as="p"
            className="body-text text-white/60"
            delay={0.2 + index * 0.08}
          >
            {project.description}
          </AnimatedText>
          
          <AnimatedText
            as="span"
            className="pointer-events-none mt-2 inline-flex items-center gap-2 section-label text-white/70"
            delay={0.25 + index * 0.08}
          >
            READ CASE
            <span aria-hidden="true" className="text-sm">↗</span>
          </AnimatedText>
        </div>
      )}
    </motion.article>
  );
}

