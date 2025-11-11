"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { projects } from "@/data/projects";
import { useRouter } from "next/navigation";

export function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="work" className="px-6 pb-24 sm:px-10 sm:pb-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <div className="flex flex-col items-center gap-2 pt-[7vh] pb-6 text-center">
          <p className="flex items-center gap-2 text-sm text-foreground/70">
            <span>Discover projects</span>
            <span aria-hidden="true" className="text-base leading-none">
              ↓
            </span>
          </p>
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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const translateY = useTransform(scrollYProgress, [0, 1], [-40, 40]);
  const glowX = useMotionValue(0);
  const glowY = useMotionValue(0);
  const glowSpringX = useSpring(glowX, { stiffness: 220, damping: 28, mass: 0.3 });
  const glowSpringY = useSpring(glowY, { stiffness: 220, damping: 28, mass: 0.3 });
  const hoverGlow = useMotionTemplate`radial-gradient(260px at ${glowSpringX}px ${glowSpringY}px, rgba(255,255,255,0.16), transparent 70%)`;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.article
      ref={ref}
      onMouseEnter={() => {
        onActivate(index);
        setIsHovered(true);
      }}
      onMouseMove={() => {
        const bounds = ref.current?.getBoundingClientRect();
        if (!bounds) return;
        glowX.set(bounds.width / 2);
        glowY.set(bounds.height / 2);
      }}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => onActivate(index)}
      role="link"
      onClick={() => router.push(`/work/${project.slug}`)}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          router.push(`/work/${project.slug}`);
        }
      }}
      initial={false}
      animate={{
        flex: isActive ? 1.5 : 0.55,
      }}
      whileHover={{ rotateX: 1.5, rotateY: -1.5 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="group relative flex min-h-[33rem] flex-1 flex-col justify-end overflow-hidden rounded bg-black/40 transition-colors"
      tabIndex={0}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300"
        style={{
          background: hoverGlow,
          opacity: isHovered ? 1 : 0,
        }}
      />
      <motion.div className="absolute inset-0" style={{ y: translateY }}>
        <Image
          src={project.image}
          alt={`${project.title} preview`}
          fill
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          priority={index === 0}
        />
      </motion.div>
      <div
        className={clsx(
          "pointer-events-none absolute inset-x-0 bottom-0 h-full bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity duration-300 md:bg-gradient-to-t md:from-black md:via-black/20 md:to-transparent",
          isActive ? "opacity-100" : "opacity-60 lg:opacity-30"
        )}
      />

      <div
        className={clsx(
          "relative z-10 flex flex-col gap-4 p-6 transition-all duration-300",
          isActive ? "translate-y-0 opacity-100 lg:pointer-events-auto" : "lg:pointer-events-none lg:translate-y-10 lg:opacity-0"
        )}
      >
        <div className="text-xs text-white/80">{project.year}</div>
        <h3 className="text-3xl text-foreground lg:text-[2.4rem]">{project.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{project.description}</p>
        <motion.span
          className="pointer-events-none mt-3 inline-flex items-center gap-2 text-sm font-normal text-white transition-transform duration-300"
          whileHover={{ x: 4 }}
        >
          Read case
          <span aria-hidden="true" className="text-lg">
            ↗
          </span>
        </motion.span>
      </div>
    </motion.article>
  );
}

