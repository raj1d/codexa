"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  text: string;
  speed?: number; // ms per character, default 30ms (DESIGN.md §6)
  onComplete?: () => void;
  className?: string;
  cursor?: boolean;
}

export function Typewriter({
  text,
  speed = 30,
  onComplete,
  className,
  cursor = true,
}: TypewriterProps) {
  const [displayedLength, setDisplayedLength] = React.useState(0);
  const [isSkipped, setIsSkipped] = React.useState(false);

  // Check prefers-reduced-motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  React.useEffect(() => {
    if (prefersReducedMotion || isSkipped) {
      setDisplayedLength(text.length);
      onComplete?.();
      return;
    }

    setDisplayedLength(0);
    let current = 0;

    const interval = setInterval(() => {
      current += 1;
      setDisplayedLength(current);

      if (current >= text.length) {
        clearInterval(interval);
        onComplete?.();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed, prefersReducedMotion, isSkipped, onComplete]);

  const handleSkip = () => {
    if (displayedLength < text.length) {
      setIsSkipped(true);
      setDisplayedLength(text.length);
      onComplete?.();
    }
  };

  const isDone = displayedLength >= text.length;

  return (
    <span
      onClick={handleSkip}
      className={cn("cursor-pointer select-text", className)}
      title={!isDone ? "Click to reveal full text" : undefined}
    >
      {text.slice(0, displayedLength)}
      {cursor && !isDone && (
        <span className="inline-block w-2 h-4 ml-0.5 bg-accent-phosphor animate-pulse align-middle" />
      )}
    </span>
  );
}
