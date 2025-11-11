"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
import { navigationLinks } from "@/data/navigation";
import { usePathname } from "next/navigation";

const MotionLink = motion(Link);

type HeaderProps = {
  overlay?: boolean;
};

export function Header({ overlay = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 24 : false
  );
  const [isHidden, setIsHidden] = useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const previousScroll = useRef<typeof scrollY.get()>(typeof window !== "undefined" ? window.scrollY : 0);

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

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (typeof window === "undefined") return;

    setHasScrolled(latest > 24);

    const prev = previousScroll.current;
    const delta = latest - prev;
    previousScroll.current = latest;

    if (overlay || menuOpen) {
      setIsHidden(false);
      return;
    }

    const doc = document.documentElement;
    const windowHeight = window.innerHeight;
    const scrollHeight = doc.scrollHeight;
    const atTop = latest <= 16;
    const atBottom = latest + windowHeight >= scrollHeight - 16;
    const scrollingDown = delta > 14;
    const scrollingUp = delta < -14;

    if (atTop || atBottom || scrollingUp) {
      setIsHidden(false);
    } else if (scrollingDown && latest > 80 && !atBottom) {
      setIsHidden(true);
    }
  });

  useEffect(() => {
    if (menuOpen) {
      setIsHidden(false);
    }
  }, [menuOpen]);

  const positionClasses = overlay ? "fixed inset-x-0 top-0" : "sticky top-0 transition-colors duration-500";
  const backgroundClasses =
    overlay || isCaseDetail || !hasScrolled ? "bg-transparent" : "bg-black/85 backdrop-blur";
  const translationClasses =
    !overlay && !isCaseDetail ? (isHidden ? "-translate-y-full" : "translate-y-0") : "translate-y-0";

  return (
    <header
      className={clsx(
        "z-30 flex w-full justify-center transition-transform duration-500",
        positionClasses,
        backgroundClasses,
        translationClasses
      )}
    >
      <div className="pointer-events-auto relative flex w-full max-w-6xl items-center justify-between px-6 py-6 sm:px-10">
        <Link href="/" className="text-sm text-foreground/80 transition-colors hover:text-foreground">
          <motion.span
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            murashka
          </motion.span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-normal md:flex">
          {navigationLinks.map((link) => (
            <MotionLink
              key={link.href}
              href={link.href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{
                rotate: [0, 1.6, -1.2, 0],
                scale: [1, 1.05, 0.98, 1],
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className={clsx("text-sm text-foreground/70 transition-colors hover:text-foreground")}
            >
              {link.label}
            </MotionLink>
          ))}
        </nav>

        <button
          type="button"
          className="flex items-center gap-2 rounded px-4 py-2 text-sm text-foreground/80 transition-colors hover:text-foreground md:hidden"
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
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="absolute left-0 top-full flex w-full flex-col gap-4 bg-black/95 px-6 py-6 text-sm text-foreground md:hidden"
            >
              {navigationLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label.charAt(0).toUpperCase() + link.label.slice(1)}
                </Link>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </header>
  );
}

