"use client";

import { motion } from "framer-motion";
import clsx from "clsx";

type AnimatedTextProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

export function AnimatedText({
  children,
  className,
  delay = 0,
  duration = 0.6,
  as: Component = "div",
}: AnimatedTextProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }} // Reduced margin for better performance
      transition={{ duration, delay, ease: [0.4, 0, 0.2, 1] }}
      className={clsx(className)}
    >
      {Component === "h1" && <h1 className={className}>{children}</h1>}
      {Component === "h2" && <h2 className={className}>{children}</h2>}
      {Component === "h3" && <h3 className={className}>{children}</h3>}
      {Component === "p" && <p className={className}>{children}</p>}
      {Component === "span" && <span className={className}>{children}</span>}
      {Component === "div" && <div className={className}>{children}</div>}
    </motion.div>
  );
}

type AnimatedTextRevealProps = {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
};

export function AnimatedTextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.03,
  as: Component = "span",
}: AnimatedTextRevealProps) {
  const words = text.split(" ");

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }} // Reduced margin for better performance
      className={clsx("inline-block", className)}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{
            duration: 0.4,
            delay: delay + index * stagger,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="inline-block"
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </motion.span>
      ))}
    </motion.span>
  );
}

