'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { contact, profile } from "@/data/site";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer id="contact" className="relative isolate overflow-hidden border-t border-white/10 bg-[#050505]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-24 sm:px-12 sm:py-32">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-[clamp(2.6rem,6vw,4.4rem)] font-light leading-[0.95] text-foreground"
          >
            Let’s build a web experience that feels alive.
          </motion.h2>

          <motion.a
            href={`mailto:${contact.email}`}
            className="inline-flex items-center gap-3 rounded-full border border-white/15 px-6 py-3 text-sm text-foreground transition-colors hover:border-white/35 hover:text-white"
            whileHover={{ x: 6 }}
            whileTap={{ scale: 0.98 }}
          >
            Start a project
            <motion.span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10"
              animate={{ rotate: 18 }}
              transition={{ repeat: Infinity, repeatDelay: 2.8, duration: 4, ease: "linear" }}
            >
              ↗
            </motion.span>
          </motion.a>
        </div>

        <div className="grid gap-10 text-sm text-foreground/70 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-foreground/80">{profile.name}</p>
            <p className="text-foreground/60">{profile.title}</p>
            <p className="text-foreground/50">{contact.location}</p>
          </div>

          <div className="space-y-3">
            <span className="text-foreground/80">Stay in touch</span>
            <div className="flex flex-col gap-2">
              {contact.socials.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  className="w-fit text-foreground/70 transition-colors hover:text-foreground"
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
            <span className="text-foreground/80">Navigate</span>
            <div className="flex flex-col gap-2 text-foreground/70">
              <Link href="#work" className="transition-colors hover:text-foreground">
                Work
              </Link>
              <Link href="#experience" className="transition-colors hover:text-foreground">
                Experience
              </Link>
              <Link href="#contact" className="transition-colors hover:text-foreground">
                Contact
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 text-xs text-foreground/50 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © {year} {profile.name}
          </span>
          <span>Design & code crafted with curiosity.</span>
        </div>
      </div>
    </footer>
  );
}

