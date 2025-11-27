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
      className="bg-black px-6 pb-32 sm:px-10 sm:pb-40 lg:sticky lg:top-0"
      style={{ zIndex: 2 }}
    >
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="relative"
      >
      <div id="work-content" className="mx-auto flex w-full max-w-7xl flex-col gap-12">
        <div className="flex flex-col items-center gap-2 pb-6 text-center lg:-mt-[99.9vh] lg:pt-[100vh]">
          <AnimatedText
            as="p"
            className="flex items-center gap-2 text-sm text-foreground/70"
            delay={0.1}
          >
            <span>These are my favourite</span>
            <span aria-hidden="true" className="text-base leading-none">
              ↓
            </span>
          </AnimatedText>
        </div>

        <div className="flex flex-col gap-6 lg:h-[48rem] lg:flex-row">
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
  const translateY = useTransform(scrollYProgress, [0, 1], isDesktop ? [-40, 40] : [0, 0]);
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
      tabIndex={0}
      style={{ backfaceVisibility: "hidden" }}
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
          willChange: "transform",
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
          className="relative z-10 flex flex-col gap-4 p-6"
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
          <motion.div 
            className="text-xs text-white/80"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.2, delay: isActive ? 0.05 : 0 }}
          >
            {project.year}
          </motion.div>
          
          <motion.h3 
            className="text-3xl text-foreground lg:text-[2.4rem]"
            initial={false}
            animate={{ opacity: isActive ? 1 : 0 }}
            transition={{ duration: 0.25, delay: isActive ? 0.08 : 0 }}
          >
            {project.title}
          </motion.h3>
          
          <motion.p 
            className="text-sm leading-relaxed text-muted"
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
            className="pointer-events-none mt-3 inline-flex items-center gap-2 text-sm font-normal text-white"
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
            Read case
            <span aria-hidden="true" className="text-lg">
              ↗
            </span>
          </motion.span>
        </motion.div>
      ) : (
        <div className="relative z-10 flex flex-col gap-4 p-6">
          <AnimatedText
            as="div"
            className="text-xs text-white/80"
            delay={0.1 + index * 0.08}
          >
            {project.year}
          </AnimatedText>
          
          <AnimatedText
            as="h3"
            className="text-3xl text-foreground"
            delay={0.15 + index * 0.08}
          >
            {project.title}
          </AnimatedText>
          
          <AnimatedText
            as="p"
            className="text-sm leading-relaxed text-muted"
            delay={0.2 + index * 0.08}
          >
            {project.description}
          </AnimatedText>
          
          <AnimatedText
            as="span"
            className="pointer-events-none mt-3 inline-flex items-center gap-2 text-sm font-normal text-white"
            delay={0.25 + index * 0.08}
          >
            Read case
            <span aria-hidden="true" className="text-lg">
              ↗
            </span>
          </AnimatedText>
        </div>
      )}
    </motion.article>
  );
}

