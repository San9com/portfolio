"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
import { navigationLinks } from "@/data/navigation";
import { usePathname } from "next/navigation";
import { getLenis } from "@/components/providers/smooth-scroll-provider";

const MotionLink = motion(Link);
const MotionSpan = motion.span;

type HeaderProps = {
  overlay?: boolean;
};

export function Header({ overlay = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  const isCaseDetail =
    pathname?.startsWith("/work/") && pathname !== "/work";

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.requestAnimationFrame(() => setHasScrolled(window.scrollY > 24));
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasScrolled(latest > 24);
  });

  const positionClasses = overlay ? "fixed inset-x-0 top-0" : "sticky top-0";
  const backgroundClasses = "bg-transparent";

  const brandTextClasses = overlay
    ? "text-black hover:text-black"
    : "text-foreground/80 hover:text-foreground";
  const navLinkClasses = overlay
    ? "text-white/80 mix-blend-difference hover:text-white"
    : "text-foreground/70 hover:text-foreground";
  const mobileButtonClasses = overlay
    ? "text-white mix-blend-difference hover:text-white"
    : "text-foreground/80 hover:text-foreground";

  return (
    <header className={clsx("z-30 flex w-full justify-center", positionClasses, backgroundClasses)}>
      <div className="pointer-events-auto relative flex w-full items-center justify-between px-4 py-4 sm:px-6 sm:py-6 md:px-10 2xl:max-w-7xl 2xl:mx-auto">
        <Link href="/" className={clsx("text-sm transition-colors", brandTextClasses)}>
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            murashka
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-normal md:flex">
          {navigationLinks.map((link) => {
            const characters = Array.from(link.label);
            const handleClick = (e: React.MouseEvent) => {
              if (link.href.startsWith("#")) {
                e.preventDefault();
                const lenis = getLenis();
                if (lenis) {
                  const element = document.querySelector(link.href);
                  if (element) {
                    lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                    window.history.pushState(null, "", link.href);
                  }
                } else {
                  // Fallback to native smooth scroll
                  const element = document.querySelector(link.href);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" });
                    window.history.pushState(null, "", link.href);
                  }
                }
              }
            };
            return (
              <MotionLink
                key={link.href}
                href={link.href}
                onClick={handleClick}
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                className={clsx("text-sm transition-colors", navLinkClasses)}
              >
                <MotionSpan
                  initial="rest"
                  animate="rest"
                  whileHover="hover"
                  className="inline-flex"
                >
                  {characters.map((char, charIndex) => (
                    <MotionSpan
                      key={`${link.href}-${char}-${charIndex}`}
                      variants={{
                        rest: { y: 0, rotate: 0, scale: 1 },
                        hover: {
                          y: -4,
                          rotate: charIndex % 2 === 0 ? 3.5 : -3.5,
                          scale: 1.05,
                          transition: {
                            duration: 0.5,
                            ease: "easeInOut",
                            delay: charIndex * 0.022,
                            repeat: 1,
                            repeatType: "reverse",
                          },
                        },
                      }}
                    >
                      {char}
                    </MotionSpan>
                  ))}
                </MotionSpan>
              </MotionLink>
            );
          })}
        </nav>

        <button
          type="button"
          className={clsx(
            "flex scale-125 items-center gap-2 rounded px-4 py-2 text-base transition-colors md:hidden",
            mobileButtonClasses
          )}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        >
          {menuOpen ? "Close" : "☰"}
        </button>

        <AnimatePresence>
          {menuOpen ? (
            <motion.nav
              id="mobile-nav"
              key="mobile-nav"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="fixed inset-0 z-40 flex min-h-screen flex-col bg-black/95 text-foreground md:hidden"
            >
              <motion.button
                type="button"
                className="absolute right-6 top-6 rounded-full border border-white/20 px-4 py-2 text-sm text-foreground transition-colors hover:border-white/40 hover:text-white"
                onClick={() => setMenuOpen(false)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                Close
              </motion.button>

              <div className="flex h-full flex-col pt-24 pb-12">
                {navigationLinks.map((link, index) => {
                  const handleClick = (e: React.MouseEvent) => {
                    setMenuOpen(false);
                    if (link.href.startsWith("#")) {
                      e.preventDefault();
                      setTimeout(() => {
                        const lenis = getLenis();
                        if (lenis) {
                          const element = document.querySelector(link.href);
                          if (element) {
                            lenis.scrollTo(element, { offset: 0, duration: 1.2 });
                            window.history.pushState(null, "", link.href);
                          }
                        } else {
                          // Fallback to native smooth scroll
                          const element = document.querySelector(link.href);
                          if (element) {
                            element.scrollIntoView({ behavior: "smooth", block: "start" });
                            window.history.pushState(null, "", link.href);
                          }
                        }
                      }, 100);
                    }
                  };
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={handleClick}
                      className={clsx(
                        "flex flex-1 items-center px-10 text-[min(16vw,4rem)] font-light text-foreground/90 transition-colors hover:text-foreground",
                        index !== navigationLinks.length - 1 && "border-b border-white/[0.08]"
                      )}
                    >
                      {link.label.charAt(0).toUpperCase() + link.label.slice(1)}
                    </Link>
                  );
                })}
              </div>
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}

