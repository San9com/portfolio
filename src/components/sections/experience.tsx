"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import clsx from "clsx";
import { motion, useScroll, useTransform } from "framer-motion";
import { experience } from "@/data/experience";
import { GlassExperienceCardCanvas } from "@/components/experience/glass-experience-card";
import { AnimatedText, AnimatedTextReveal } from "@/components/animated-text";

export function ExperienceSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax - elegant and simple
  const y = useTransform(scrollYProgress, [0, 1], [0, 40]);

  // Track which card is closest to center
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const viewportCenter = windowHeight / 2;
      
      let closestIndex: number | null = null;
      let closestDistance = Infinity;

      cardRefs.current.forEach((cardRef, index) => {
        if (!cardRef) return;
        
        const rect = cardRef.getBoundingClientRect();
        const cardCenter = rect.top + rect.height / 2;
        const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
        
        // Only consider cards that are visible and reasonably close to center
        if (rect.bottom > 0 && rect.top < windowHeight && distanceFromCenter < closestDistance) {
          closestDistance = distanceFromCenter;
          closestIndex = index;
        }
      });

      setActiveCardIndex(closestIndex);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

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
              text="From solo product experiments to app agency work. As every chapter brings something new, my love for great design stays."
              delay={0.2}
              stagger={0.02}
            />
          </motion.p>
        </div>

        <div className="space-y-10 sm:space-y-12">
          {experience.map((item, index) => (
            <ExperienceCard
              key={item.id}
              item={item}
              index={index}
              isActive={activeCardIndex === index}
              cardRef={(el) => {
                cardRefs.current[index] = el;
              }}
            />
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
  isActive: boolean;
  cardRef: (el: HTMLElement | null) => void;
};

function ExperienceCard({ item, index, isActive, cardRef }: ExperienceCardProps) {
  const ref = useRef<HTMLElement>(null);
  const [centerProgress, setCenterProgress] = useState(0);

  // Track scroll position relative to viewport center for smooth animation
  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Calculate distance from center
      const distanceFromCenter = Math.abs(cardCenter - viewportCenter);
      const maxDistance = windowHeight * 0.5; // Animation range
      
      // Calculate progress: 1 when centered, 0 when far away
      const progress = 1 - Math.min(distanceFromCenter / maxDistance, 1);
      setCenterProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, []);

  // Set ref callback
  useEffect(() => {
    if (ref.current) {
      cardRef(ref.current);
    }
    return () => {
      cardRef(null);
    };
  }, [cardRef]);

  const isLit = isActive && centerProgress > 0.3;

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-120px" }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={clsx(
        "relative overflow-hidden rounded-xl transition-colors duration-700 ease-out",
        item.image ? "min-h-[380px]" : "min-h-[340px]",
        isLit ? "bg-white" : "bg-transparent"
      )}
      style={{ perspective: "1200px" }}
    >
      {/* 3D rotating clear glass - hide when lit */}
      {!isLit && <GlassExperienceCardCanvas cardRef={ref} />}

      {/* HTML text content - crisp and clean */}
      <div className={clsx(
        "relative z-10 flex flex-col gap-8 p-8 md:p-10 lg:p-12",
        item.image && "lg:flex-row lg:items-center lg:gap-16"
      )}>
        <div className="flex flex-1 flex-col gap-6">
          <motion.div
            className="flex items-center gap-4 text-sm transition-colors duration-700"
            style={{ color: isLit ? "rgba(0, 0, 0, 0.6)" : "rgba(255, 255, 255, 0.7)" }}
          >
            <motion.span
              style={{ color: isLit ? "rgba(0, 0, 0, 0.9)" : "rgba(255, 255, 255, 0.9)" }}
              transition={{ duration: 0.7 }}
            >
              {item.start}
            </motion.span>
            <span
              className="h-px w-16 transition-colors duration-700"
              style={{ backgroundColor: isLit ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)" }}
              aria-hidden="true"
            />
            <span>{item.end}</span>
          </motion.div>
          <div className="space-y-4">
            <motion.h3
              className="text-[1.75rem] leading-tight sm:text-[2rem] lg:text-[2.4rem] transition-colors duration-700"
              style={{ color: isLit ? "#000000" : "rgba(255, 255, 255, 1)" }}
            >
              {item.role}
            </motion.h3>
            <motion.p
              className="text-base sm:text-lg transition-colors duration-700"
              style={{ color: isLit ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.8)" }}
            >
              {item.company}
            </motion.p>
            <motion.p
              className="text-base leading-relaxed sm:text-lg sm:leading-relaxed transition-colors duration-700"
              style={{ color: isLit ? "rgba(0, 0, 0, 0.7)" : "rgba(255, 255, 255, 0.7)" }}
            >
              {item.summary}
            </motion.p>
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

