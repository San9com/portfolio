"use client";

import { useRef, RefObject, useEffect, useState } from "react";

type GlassExperienceCardCanvasProps = {
  cardRef: RefObject<HTMLElement>;
};

export function GlassExperienceCardCanvas({ cardRef }: GlassExperienceCardCanvasProps) {
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      if (rafId) return;
      
      rafId = requestAnimationFrame(() => {
        if (!cardRef.current) {
          rafId = null;
          return;
        }

        const rect = cardRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const cardCenter = rect.top + rect.height / 2;
        const viewportCenter = windowHeight / 2;
        const scrollProgress = (viewportCenter - cardCenter) / (windowHeight / 2);
        const clampedProgress = Math.max(-1, Math.min(1, scrollProgress));
        
        const rotationDeg = clampedProgress * 5;
        setRotation(rotationDeg);
        rafId = null;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [cardRef]);

  return (
    <div 
      className="pointer-events-none absolute inset-0 transition-transform duration-100 ease-out"
      style={{
        transform: `perspective(1000px) rotateX(${rotation}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Clear glass with subtle edge glow - removed backdrop-blur for performance */}
      <div className="absolute inset-0 rounded-xl border border-white/10 bg-white/[0.02] shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]" />
    </div>
  );
}

