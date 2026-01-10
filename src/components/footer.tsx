 "use client";

import { useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, useScroll, useTransform } from "framer-motion";
import { contact, profile } from "@/data/site";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

export function Footer() {
  const pathname = usePathname();
  const router = useRouter();
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
      className={isCasePage ? "relative isolate overflow-hidden bg-black text-white min-h-screen grain-overlay" : "sticky top-0 isolate overflow-hidden bg-black text-white min-h-screen grain-overlay"}
      style={{ zIndex: 4, cursor: "auto" }}
    >
      <motion.div
        ref={containerRef}
        style={{ y }}
        className="relative flex min-h-screen flex-col justify-between"
      >
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-32 bg-gradient-to-t from-black to-transparent" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-col gap-16 px-8 pt-32 pb-16 sm:px-12 lg:px-16 sm:pt-40 sm:pb-20">
        {/* Big name display */}
        <span 
          className="block text-white"
          style={{ 
            fontFamily: "var(--font-handwritten), cursive",
            fontSize: "clamp(3.5rem, 10vw, 10rem)",
            lineHeight: 0.9,
          }}
        >
          {profile.name}
        </span>

        <div className="grid gap-12 sm:grid-cols-3">
          {/* Info Column */}
          <div className="flex flex-col gap-4">
            <span className="section-label text-white/40">INFO</span>
            <div className="flex flex-col gap-2">
              <p className="body-text text-white/50">{profile.title}</p>
              <p className="body-text text-white/40">{contact.location}</p>
            </div>
          </div>

          {/* Connect Column */}
          <div className="flex flex-col gap-4">
            <span className="section-label text-white/40">CONTACT</span>
            <div className="flex flex-col gap-2">
              {contact.socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-fit body-text text-white/60 transition-colors hover:text-white"
                  whileHover={{ x: 4 }}
                  target={social.href.startsWith("http") ? "_blank" : undefined}
                  rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                >
                  {social.label}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Navigate Column */}
          <div className="flex flex-col gap-4">
            <span className="section-label text-white/40">NAVIGATE</span>
            <div className="flex flex-col gap-2">
              {[
                { href: "#work", label: "Work" },
                { href: "#experience", label: "Experience" },
                { href: "#contact", label: "Contact" },
              ].map((item) => {
                const handleClick = (e: React.MouseEvent) => {
                  e.preventDefault();
                  
                  // If on detail page, navigate to home first, then scroll
                  if (isCasePage) {
                    router.push(`/${item.href}`);
                    return;
                  }
                  
                  // Otherwise, scroll to section on current page
                  const scrollToElement = () => {
                    const element = document.querySelector<HTMLElement>(item.href);
                    if (!element) return;
                    
                    const lenis = getLenis();
                    if (lenis) {
                      // For work section, scroll to show the content (account for sticky positioning)
                      if (item.href === "#work") {
                        // Scroll to the section with a small offset to show content
                        const rect = element.getBoundingClientRect();
                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                        const targetY = scrollTop + rect.top - 100; // 100px offset from top
                        lenis.scrollTo(targetY, { duration: 1.2 });
                      } else {
                        lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                      }
                    } else {
                      // Fallback to native smooth scroll
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                    window.history.pushState(null, "", item.href);
                  };
                  
                  // Wait a bit to ensure DOM is ready
                  setTimeout(scrollToElement, 100);
                };
                
                // Use full path for detail pages, hash for home page
                const linkHref = isCasePage && item.href.startsWith("#") 
                  ? `/${item.href}` 
                  : item.href;
                
                return (
                  <motion.div key={item.href} whileHover={{ x: 4 }}>
                    <Link
                      href={linkHref}
                      onClick={handleClick}
                      className="w-fit body-text text-white/60 transition-colors hover:text-white"
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

      {/* Background strip */}
      <div 
        className="relative h-48 overflow-hidden"
        style={{
          backgroundImage: "url('/codioful-formerly-gradienta-t-Rt42Wl1RQ-unsplash.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      </motion.div>
    </footer>
  );
}

