"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";
import { navigationLinks } from "@/data/navigation";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-30 flex w-full justify-center bg-black/85 backdrop-blur">
      <div className="relative flex w-full max-w-6xl items-center justify-between px-6 py-4 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-sm text-foreground/80"
        >
          murashka
        </motion.div>

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

