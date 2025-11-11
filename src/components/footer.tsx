'use client';

import Link from "next/link";
import { motion } from "framer-motion";
import { contact, profile } from "@/data/site";

const MotionLink = motion(Link);

export function Footer() {
  return (
    <footer id="contact" className="relative isolate overflow-hidden border-t border-white/10 bg-[#050505]">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/[0.08] via-transparent to-transparent" />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 py-72 sm:px-20 sm:py-96">
        <div className="grid gap-14 text-sm text-foreground/70 sm:grid-cols-3">
          <div className="space-y-3">
            <p className="text-foreground/80">{profile.name}</p>
            <p className="text-foreground/60">{profile.title}</p>
            <p className="text-foreground/50">{contact.location}</p>
          </div>

          <div className="space-y-3">
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
            <div className="flex flex-col gap-2 text-foreground/70">
              <MotionLink
                href="#work"
                className="transition-colors hover:text-foreground"
                whileHover={{ rotate: [0, 1.6, -1.2, 0], scale: [1, 1.05, 0.98, 1] }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                Work
              </MotionLink>
              <MotionLink
                href="#experience"
                className="transition-colors hover:text-foreground"
                whileHover={{ rotate: [0, 1.6, -1.2, 0], scale: [1, 1.05, 0.98, 1] }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                Experience
              </MotionLink>
              <MotionLink
                href="#contact"
                className="transition-colors hover:text-foreground"
                whileHover={{ rotate: [0, 1.6, -1.2, 0], scale: [1, 1.05, 0.98, 1] }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                Contact
              </MotionLink>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

