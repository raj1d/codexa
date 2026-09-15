import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "./card";
import { ArrowRight } from "lucide-react";

export interface EntryCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  meta: string;
  tag?: string;
  tagVariant?: "phosphor" | "signal" | "amber" | "alert" | "cream" | "default";
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  interactive?: boolean;
  activeAccent?: "phosphor" | "signal" | "amber" | "alert" | "cream";
}

export function EntryCard({
  title,
  meta,
  tag,
  tagVariant = "default",
  actionLabel,
  onAction,
  actionHref,
  interactive = true,
  activeAccent,
  children,
  className,
  ...props
}: EntryCardProps) {
  const tagStyles = {
    cream: "border-[#DEDBC8]/30 text-[#DEDBC8] bg-[#DEDBC8]/5",
    phosphor: "border-[#DEDBC8]/30 text-[#DEDBC8] bg-[#DEDBC8]/5",
    signal: "border-[#5EEAD4]/30 text-[#5EEAD4] bg-[#5EEAD4]/5",
    amber: "border-[#FBBF24]/30 text-[#FBBF24] bg-[#FBBF24]/5",
    alert: "border-[#F87171]/30 text-[#F87171] bg-[#F87171]/5",
    default: "border-white/[0.08] text-gray-400 bg-white/[0.02]",
  };

  const accentBorder = activeAccent
    ? {
        cream: "border-[#DEDBC8]/30 hover:border-[#DEDBC8]/70",
        phosphor: "border-[#DEDBC8]/30 hover:border-[#DEDBC8]/70",
        signal: "border-[#5EEAD4]/30 hover:border-[#5EEAD4]/70",
        amber: "border-[#FBBF24]/30 hover:border-[#FBBF24]/70",
        alert: "border-[#F87171]/30 hover:border-[#F87171]/70",
      }[activeAccent]
    : "";

  return (
    <Card
      surface="21"
      interactive={interactive}
      className={cn(
        "p-6 sm:p-7 flex flex-col justify-between group rounded-2xl bg-[#212121] border border-white/[0.06] hover:border-white/[0.14] transition-all duration-200 shadow-xl",
        accentBorder,
        className,
      )}
      {...props}
    >
      <div>
        {/* Header row with Title & Tag */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h3 className="text-lg sm:text-xl font-medium text-[#E1E0CC] tracking-tight group-hover:text-white transition-colors">
            {title}
          </h3>
          {tag && (
            <span
              className={cn(
                "font-mono text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider shrink-0",
                tagStyles[tagVariant],
              )}
            >
              {tag}
            </span>
          )}
        </div>

        {/* 1-line metadata row */}
        <div className="font-mono text-xs text-gray-500 mb-4 flex items-center gap-1.5">
          <span className="text-[#DEDBC8]/60 select-none">&bull;</span>
          <span>{meta}</span>
        </div>

        {/* Body content */}
        {children && (
          <div className="text-xs sm:text-sm text-gray-400 leading-relaxed mb-4">
            {children}
          </div>
        )}
      </div>

      {/* Action Footer */}
      {(actionLabel || actionHref) && (
        <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between mt-auto">
          {actionHref ? (
            <a
              href={actionHref}
              className="text-xs text-[#DEDBC8] hover:text-white flex items-center justify-between w-full group/link transition-colors"
            >
              <span>{actionLabel || "View Details"}</span>
              <ArrowRight className="h-3.5 w-3.5 -rotate-45 group-hover/link:rotate-0 transition-transform duration-200" />
            </a>
          ) : (
            <button
              onClick={onAction}
              className="text-xs text-[#DEDBC8] hover:text-white flex items-center justify-between w-full group/link transition-colors"
            >
              <span>{actionLabel || "Open"}</span>
              <ArrowRight className="h-3.5 w-3.5 -rotate-45 group-hover/link:rotate-0 transition-transform duration-200" />
            </button>
          )}
        </div>
      )}
    </Card>
  );
}
