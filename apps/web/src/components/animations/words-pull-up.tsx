"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface WordsPullUpProps {
  text: string;
  className?: string;
  showAsterisk?: boolean;
}

export function WordsPullUp({
  text,
  className,
  showAsterisk = false,
}: WordsPullUpProps) {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true });

  const words = text.split(" ");

  return (
    <h1
      ref={ref}
      className={cn(
        "font-medium leading-[0.85] tracking-[-0.07em] flex flex-wrap justify-start items-baseline select-none",
        className,
      )}
      style={{ color: "#E1E0CC" }}
    >
      {words.map((word, i) => {
        const isLastWord = i === words.length - 1;
        return (
          <span
            key={i}
            className="inline-block relative overflow-hidden mr-[0.2em] last:mr-0"
          >
            <motion.span
              initial={{ y: "100%", opacity: 0 }}
              animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
              transition={{
                duration: 0.8,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="inline-block relative"
            >
              {word}
              {isLastWord && showAsterisk && (
                <span className="absolute top-[0.45em] -right-[0.35em] text-[0.32em] text-[#DEDBC8] font-normal select-none pointer-events-none">
                  *
                </span>
              )}
            </motion.span>
          </span>
        );
      })}
    </h1>
  );
}
