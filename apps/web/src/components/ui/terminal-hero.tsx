"use client";

import * as React from "react";
import { Terminal, Check, Circle } from "lucide-react";

export function TerminalHero() {
  const [lines, setLines] = React.useState<string[]>([]);
  const [currentPrompt, setCurrentPrompt] = React.useState("");

  const bootLines = [
    "$ codexa boot --curriculum=GTU-CSE-IT",
    "[OK] Initializing Postgres connection (pgvector enabled)",
    "[OK] Upstash Redis cache mounted",
    "[OK] Meilisearch index sync: 12 subjects loaded",
    "[OK] Monaco DSA code execution engine ready",
    "[OK] CODEXA ready at ~/home",
  ];

  React.useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < bootLines.length) {
        setLines((prev) => [...prev, bootLines[index]]);
        index += 1;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl rounded-lg bg-bg-surface border border-[rgba(255,255,255,0.08)] overflow-hidden shadow-2xl scanlines">
      {/* Terminal Titlebar */}
      <div className="h-9 bg-bg-surface-raised px-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between font-mono text-xs select-none">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-accent-alert/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-accent-amber/80" />
          <div className="h-2.5 w-2.5 rounded-full bg-accent-phosphor/80" />
        </div>
        <span className="text-text-dim text-[11px]">codexa-cli ~ bash</span>
        <div className="w-10" />
      </div>

      {/* Terminal Content Body */}
      <div className="p-5 font-mono text-xs text-text-muted flex flex-col gap-1.5 min-h-[200px]">
        {lines.map((line, i) => (
          <div
            key={i}
            className={`flex items-center gap-2 ${
              line.startsWith("$")
                ? "text-accent-phosphor font-medium"
                : line.startsWith("[OK]")
                  ? "text-text-primary"
                  : "text-text-muted"
            }`}
          >
            {line.startsWith("[OK]") && (
              <Check className="h-3 w-3 text-accent-phosphor shrink-0" />
            )}
            <span>{line.startsWith("[OK]") ? line.replace("[OK] ", "") : line}</span>
          </div>
        ))}

        {/* Live blinking cursor */}
        <div className="flex items-center gap-2 text-accent-phosphor pt-1">
          <span className="select-none">&gt;</span>
          <span className="inline-block w-2 h-4 bg-accent-phosphor animate-pulse" />
        </div>
      </div>
    </div>
  );
}
