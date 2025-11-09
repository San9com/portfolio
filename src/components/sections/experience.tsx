"use client";

import Image from "next/image";
import clsx from "clsx";
import { motion } from "framer-motion";
import { experience } from "@/data/experience";

export function ExperienceSection() {
  return (
    <section id="experience" className="px-6 pb-24 sm:px-10 sm:pb-32">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <div className="flex flex-wrap items-end justify-between gap-6 pt-10">
          <h2 className="text-[2.2rem] leading-tight text-foreground sm:text-[2.4rem]">Craft Through The Years</h2>
          <p className="max-w-sm text-sm leading-relaxed text-muted sm:text-base">
            From solo product experiments to collaborative agency work, every chapter explores how motion, storytelling,
            and research elevate the interface.
          </p>
        </div>

        <div className="space-y-6">
          {experience.map((item, index) => (
            <motion.article
              key={item.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-120px" }}
              transition={{ duration: 0.6, delay: index * 0.08 }}
              className={clsx(
                "flex flex-col gap-6 rounded bg-white/5 p-6 md:p-8",
                item.image && "md:flex-row md:items-center md:gap-10"
              )}
            >
              <div className="flex flex-1 flex-col gap-4">
                <div className="flex items-center gap-4 text-sm text-muted">
                  <span className="text-foreground/80">{item.start}</span>
                  <span className="h-px w-12 bg-border-subtle/30" aria-hidden="true" />
                  <span>{item.end}</span>
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl text-foreground md:text-3xl">{item.role}</h3>
                  <p className="text-sm text-muted">{item.company}</p>
                  <p className="text-base leading-relaxed text-muted">{item.summary}</p>
                </div>
              </div>

              {item.image ? (
                <div className="relative h-40 w-full overflow-hidden rounded md:h-32 md:max-w-sm">
                  <Image
                    src={item.image}
                    alt={`${item.role} visual`}
                    fill
                    className={clsx(
                      "object-cover object-center transition-transform duration-700 ease-out",
                      "hover:scale-[1.04]"
                    )}
                  />
                </div>
              ) : null}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

