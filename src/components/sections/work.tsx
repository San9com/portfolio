"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";
import { projects } from "@/data/projects";

export function WorkSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="work" className="px-6 pb-24 sm:px-10 sm:pb-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <h2 className="text-[2.3rem] leading-tight text-foreground sm:text-[2.6rem]">Discover Projects</h2>

        <div className="flex flex-col gap-6 lg:h-[48rem] lg:flex-row">
          {projects.map((project, index) => {
            const isActive = activeIndex === index;

            return (
              <motion.article
                key={project.id}
                onMouseEnter={() => setActiveIndex(index)}
                onFocus={() => setActiveIndex(index)}
                initial={false}
                animate={{
                  flex: isActive ? 1.5 : 0.55,
                }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className={clsx(
                  "group relative flex min-h-[33rem] flex-1 flex-col justify-end overflow-hidden rounded bg-black/40 transition-colors",
                  isActive ? "lg:shadow-[0_30px_60px_rgba(177,165,167,0.25)]" : "lg:shadow-none"
                )}
                tabIndex={0}
              >
                <Image
                  src={project.image}
                  alt={`${project.title} preview`}
                  fill
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  priority={index === 0}
                />
                <div
                  className={clsx(
                    "absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent transition-opacity duration-300",
                    isActive ? "opacity-100" : "opacity-60 lg:opacity-30"
                  )}
                />

                <div
                  className={clsx(
                    "relative z-10 flex flex-col gap-4 p-6 transition-all duration-300",
                    isActive ? "opacity-100 translate-y-0 lg:pointer-events-auto" : "lg:pointer-events-none lg:translate-y-10 lg:opacity-0"
                  )}
                >
                  <div className="text-xs text-white/80">{project.year}</div>
                  <h3 className="text-3xl text-foreground lg:text-[2.4rem]">
                    {project.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted">{project.description}</p>
                  <Link
                    href={`/work/${project.slug}`}
                    className="inline-flex items-center gap-3 text-sm text-foreground transition-colors hover:text-accent"
                  >
                    Read case
                    <span
                      aria-hidden="true"
                      className="inline-flex h-8 w-8 items-center justify-center rounded bg-white/10"
                    >
                      ↘
                    </span>
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

