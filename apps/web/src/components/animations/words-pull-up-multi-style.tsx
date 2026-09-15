"use client";

import * as React from "react";
import { motion, useInView } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TextSegment {
  text: string;
  className?: string;
}

interface WordsPullUpMultiStyleProps {
  segments: TextSegment[];
  className?: string;
}

export function WordsPullUpMultiStyle({
  segments,
  className,
}: WordsPullUpMultiStyleProps) {
  const ref = React.useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Flatten segments into an array of individual words preserving classes
  const wordsList: { word: string; className?: string }[] = [];
  segments.forEach((seg) => {
    const parts = seg.text.split(" ");
    parts.forEach((p) => {
      if (p.length > 0) {
        wordsList.push({ word: p, className: seg.className });
      }
    });
  });

  return (
    <h2
      ref={ref}
      className={cn(
        "inline-flex flex-wrap justify-center items-baseline text-center leading-[0.95] sm:leading-[0.9]",
        className,
      )}
    >
      {wordsList.map((item, idx) => (
        <span
          key={idx}
          className="inline-block relative overflow-hidden mx-[0.12em]"
        >
          <motion.span
            initial={{ y: "100%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
            transition={{
              duration: 0.7,
              delay: idx * 0.05,
              ease: [0.16, 1, 0.3, 1],
            }}
            className={cn("inline-block", item.className)}
          >
            {item.word}
          </motion.span>
        </span>
      ))}
    </h2>
  );
}
