"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

type CaseImageProps = {
  image: string;
  alt: string;
};

export function CaseImage({ image, alt }: CaseImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Smooth parallax effect - image moves slower than scroll
  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);

  return (
    <div ref={ref} className="relative w-full overflow-hidden bg-[#0a0a0a]">
      <div className="relative mx-auto w-full" style={{ maxWidth: "min(100%, 1400px)" }}>
        <motion.div
          style={{ y }}
          className="relative"
        >
          <Image
            src={image}
            alt={alt}
            width={1400}
            height={1400}
            quality={95}
            className="h-auto w-full object-contain"
            style={{ 
              maxWidth: "100%", 
              height: "auto",
              display: "block"
            }}
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 100vw, 1400px"
          />
        </motion.div>
      </div>
    </div>
  );
}

