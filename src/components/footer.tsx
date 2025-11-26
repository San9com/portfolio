 "use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { contact, profile } from "@/data/site";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

export function Footer() {
  const skills = ["UI/UX design", "Web design", "Code", "iOS design"];
  const pathname = usePathname();
  const isCasePage = pathname?.startsWith("/work/");
  
  const footerRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Only apply parallax on home page
  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end start"],
  });

  // Subtle parallax - elegant and simple (only on home page)
  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const y = isCasePage ? 0 : parallaxY;

  return (
    <footer
      id="contact"
      ref={footerRef}
      className={isCasePage ? "relative isolate overflow-hidden border-t border-white/10 bg-[#101010] text-white" : "sticky top-0 isolate overflow-hidden border-t border-white/10 bg-[#101010] text-white"}
      style={{ zIndex: 4 }}
    >
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="relative"
      >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-[#101010] to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-36 sm:px-20 sm:py-48">
        <div className="grid gap-14 text-sm text-white/70 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-white/80">{profile.name}</p>
            <p className="text-white/60">{profile.title}</p>
            <p className="text-white/50">{contact.location}</p>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2">
              {contact.socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-fit text-white/70 transition-colors hover:text-white"
                  whileHover={{ x: 6 }}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {social.label}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex flex-col gap-2 text-white/70">
              {[
                { href: "#work", label: "Work" },
                { href: "#experience", label: "Experience" },
                { href: "#contact", label: "Contact" },
              ].map((item) => {
                const handleClick = (e: React.MouseEvent) => {
                  e.preventDefault();
                  const lenis = getLenis();
                  if (lenis) {
                    const element = document.querySelector<HTMLElement>(item.href);
                    if (element) {
                      lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                      window.history.pushState(null, "", item.href);
                    }
                  } else {
                    // Fallback to native smooth scroll
                    const element = document.querySelector<HTMLElement>(item.href);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                      window.history.pushState(null, "", item.href);
                    }
                  }
                };
                return (
                  <motion.div key={item.href} whileHover={{ x: 6 }}>
                    <Link
                      href={item.href}
                      onClick={handleClick}
                      className="w-fit transition-colors hover:text-white"
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <div className="overflow-hidden border-t border-white/10 bg-[#101010]">
        <div className="flex flex-col items-center gap-8 py-12 sm:gap-10 sm:py-16">
          <div className="relative w-full overflow-hidden" style={{ minHeight: "200px" }}>
            <div className="clients-marquee" style={{ willChange: "transform" }}>
              {[...skills, ...skills, ...skills].map((skill, index) => (
                <span
                  key={`${skill}-${index}`}
                  className="clients-marquee-text px-10 leading-tight sm:px-14 md:px-20"
                  style={{ 
                    fontFamily: "SeasonMix, var(--font-sans-base)", 
                    color: "rgba(255, 255, 255, 0.5)",
                    whiteSpace: "nowrap",
                    fontSize: "clamp(200px, 25vw, 500px) !important"
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </footer>
  );
}

