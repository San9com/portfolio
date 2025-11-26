"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { ExperienceSection } from "@/components/sections/experience";
import { Footer } from "@/components/footer";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

export default function Home() {
  useEffect(() => {
    // Handle hash navigation from detail pages
    if (typeof window === "undefined") return;
    
    const hash = window.location.hash;
    if (!hash) return;
    
    const scrollToHash = () => {
      const lenis = getLenis();
      const element = document.querySelector<HTMLElement>(hash);
      
      if (element) {
        if (lenis) {
          // Wait for Lenis to be ready and page to render
          setTimeout(() => {
            lenis.scrollTo(element, { offset: 0, duration: 1.2 });
          }, 400);
        } else {
          // Fallback to native scroll
          setTimeout(() => {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }, 400);
        }
      }
    };
    
    // Wait for page to be fully rendered and Lenis initialized
    const timeouts = [
      setTimeout(scrollToHash, 300),
      setTimeout(scrollToHash, 600),
      setTimeout(scrollToHash, 1000),
    ];
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  return (
    <div className="relative">
      <Header />
      <main className="relative">
        <HeroSection />
        <WorkSection />
        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
}
