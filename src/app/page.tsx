"use client";

import { useEffect } from "react";
import { Header } from "@/components/header";
import { HeroSection } from "@/components/sections/hero";
import { WorkSection } from "@/components/sections/work";
import { ExperienceSection } from "@/components/sections/experience";
import { Footer } from "@/components/footer";

export default function Home() {
  useEffect(() => {
    // Handle hash navigation from detail pages
    if (typeof window === "undefined") return;
    
    const hash = window.location.hash;
    if (!hash) return;
    
    const scrollToHash = () => {
      const element = document.querySelector<HTMLElement>(hash);
      
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "auto", block: "start" });
        }, 400);
      }
    };
    
    // Wait for page to be fully rendered
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
      <Header overlay />
      <main className="relative">
        <HeroSection />
        <WorkSection />
        <ExperienceSection />
      </main>
      <Footer />
    </div>
  );
}
