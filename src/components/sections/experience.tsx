"use client";

import { useRef } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { experience } from "@/data/experience";
import { GlassExperienceCardCanvas } from "@/components/experience/glass-experience-card";
import { AnimatedText, AnimatedTextReveal } from "@/components/animated-text";

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.8", "end start"],
  });

  // Subtle parallax - elegant and simple
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  return (
    <section 
      id="experience" 
      ref={sectionRef}
      className="sticky top-0 bg-black px-6 pb-32 pt-24 sm:px-10 sm:pb-40 sm:pt-32"
      style={{ zIndex: 3 }}
    >
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="relative"
      >
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-20">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <AnimatedText
            as="h2"
            className="text-[3.5rem] leading-[1.1] tracking-tight text-foreground sm:text-[4.5rem] lg:text-[5.5rem] xl:text-[6.5rem]"
            delay={0.1}
          >
            Craft Through<br />The Years
          </AnimatedText>
          <motion.p
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
            className="max-w-md text-base leading-relaxed text-muted/90 sm:text-lg lg:max-w-lg"
          >
            <AnimatedTextReveal
              text="From solo product experiments to collaborative agency work, every chapter explores how motion, storytelling, and research elevate the interface."
              delay={0.2}
              stagger={0.02}
            />
          </motion.p>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {experience.map((item, index) => (
            <ExperienceCard key={item.id} item={item} index={index} />
          ))}
        </div>
      </div>
      </motion.div>
    </section>
  );
}

type ExperienceCardProps = {
  item: (typeof experience)[number];
  index: number;
};

function ExperienceCard({ item, index }: ExperienceCardProps) {
  const ref = useRef<HTMLElement>(null);

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={clsx(
        "relative overflow-hidden rounded-xl",
        item.image ? "min-h-[380px]" : "min-h-[340px]"
      )}
      style={{ perspective: "1200px" }}
    >
      {/* 3D rotating clear glass */}
      <GlassExperienceCardCanvas cardRef={ref} />

      {/* HTML text content - crisp and clean */}
      <div className={clsx(
        "relative z-10 flex flex-col gap-8 p-8 md:p-10 lg:p-12",
        item.image && "lg:flex-row lg:items-center lg:gap-16"
      )}>
        <div className="flex flex-1 flex-col gap-6">
          <AnimatedText
            as="div"
            className="flex items-center gap-4 text-sm text-muted/70"
            delay={0.1}
          >
            <span className="text-foreground/90">{item.start}</span>
            <span className="h-px w-16 bg-border-subtle/40" aria-hidden="true" />
            <span>{item.end}</span>
          </AnimatedText>
          <div className="space-y-4">
            <AnimatedText
              as="h3"
              className="text-[1.75rem] leading-tight text-foreground sm:text-[2rem] lg:text-[2.4rem]"
              delay={0.15}
            >
              {item.role}
            </AnimatedText>
            <AnimatedText
              as="p"
              className="text-base text-muted/80 sm:text-lg"
              delay={0.2}
            >
              {item.company}
            </AnimatedText>
            <AnimatedText
              as="p"
              className="text-base leading-relaxed text-muted sm:text-lg sm:leading-relaxed"
              delay={0.25}
            >
              {item.summary}
            </AnimatedText>
          </div>
        </div>

        {item.image ? (
          <div className="relative h-48 w-full overflow-hidden rounded-lg sm:h-56 lg:h-48 lg:max-w-md lg:flex-shrink-0">
            <Image
              src={item.image}
              alt={`${item.role} visual`}
              fill
              className={clsx(
                "object-cover object-center transition-transform duration-700 ease-out",
                "hover:scale-[1.04]"
              )}
            />
          </div>
        ) : null}
      </div>
    </motion.article>
  );
}

