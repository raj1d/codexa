"use client";

import * as React from "react";
import { motion, useScroll, useTransform, MotionValue } from "framer-motion";

interface ScrollRevealedTextProps {
  text: string;
  className?: string;
}

function AnimatedLetter({
  char,
  progress,
  range,
}: {
  char: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const opacity = useTransform(progress, range, [0.2, 1]);

  return (
    <motion.span style={{ opacity }} className="inline">
      {char}
    </motion.span>
  );
}

export function ScrollRevealedText({ text, className }: ScrollRevealedTextProps) {
  const containerRef = React.useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.85", "end 0.25"],
  });

  const characters = text.split("");
  const totalChars = characters.length;

  return (
    <p
      ref={containerRef}
      className={className}
      style={{ color: "#DEDBC8" }}
    >
      {characters.map((char, index) => {
        const charProgress = index / totalChars;
        const start = Math.max(0, charProgress - 0.1);
        const end = Math.min(1, charProgress + 0.05);

        return (
          <AnimatedLetter
            key={index}
            char={char}
            progress={scrollYProgress}
            range={[start, end]}
          />
        );
      })}
    </p>
  );
}
