"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import clsx from "clsx";
import { navigationLinks } from "@/data/navigation";
import { usePathname } from "next/navigation";

type HeaderProps = {
  overlay?: boolean;
};

export function Header({ overlay = false }: HeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(() =>
    typeof window !== "undefined" ? window.scrollY > 24 : false
  );
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

  useMotionValueEvent(scrollY, "change", (latest) => {
    setHasScrolled(latest > 24);
  });

  const positionClasses = overlay ? "fixed inset-x-0 top-0" : "sticky top-0 transition-colors duration-500";
  const backgroundClasses =
    overlay || isCaseDetail || !hasScrolled ? "bg-transparent" : "bg-black/85 backdrop-blur";

  return (
    <header className={clsx("z-30 flex w-full justify-center", positionClasses, backgroundClasses)}>
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
            <motion.div
              key={link.href}
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12, ease: "easeOut" }}
            >
              <Link
                href={link.href}
                className={clsx("text-sm text-foreground/70 transition-colors hover:text-foreground")}
              >
                <span>{link.label}</span>
              </Link>
            </motion.div>
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

