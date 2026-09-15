"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Code2,
  Sparkles,
  FolderGit2,
  LayoutDashboard,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { APP_NAME } from "@codexa/shared";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  tag: string;
}

const navItems: NavItem[] = [
  {
    label: "Study Hub",
    href: "/study-hub",
    icon: BookOpen,
    tag: "01",
  },
  {
    label: "DSA Practice",
    href: "/practice",
    icon: Code2,
    tag: "02",
  },
  {
    label: "AI Assistant",
    href: "/ai-assistant",
    icon: Sparkles,
    tag: "03",
  },
  {
    label: "Projects Hub",
    href: "/projects",
    icon: FolderGit2,
    tag: "04",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    tag: "05",
  },
  {
    label: "Leaderboard",
    href: "/leaderboard",
    icon: Trophy,
    tag: "06",
  },
];

interface SidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ collapsed = false, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        "relative flex flex-col justify-between h-screen sticky top-0 bg-[#101010] select-none z-30 transition-all duration-200 ease-in-out border-r border-white/[0.06]",
        collapsed ? "w-16" : "w-64",
      )}
      aria-label="Sidebar navigation"
    >
      {/* Top Header / Logo */}
      <div className="flex flex-col">
        <div className="h-16 flex items-center justify-between px-5 border-b border-white/[0.06]">
          <Link
            href="/"
            className="flex items-center overflow-hidden focus-visible:outline-none"
          >
            {!collapsed ? (
              <span
                className="text-2xl tracking-tight text-white font-normal whitespace-nowrap hover:opacity-90 transition-opacity"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {APP_NAME}<sup className="text-xs ml-0.5 text-[#DEDBC8]">®</sup>
              </span>
            ) : (
              <span
                className="text-2xl font-normal text-white"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                C<sup className="text-[10px] text-[#DEDBC8]">®</sup>
              </span>
            )}
          </Link>
          <button
            onClick={onToggleCollapse}
            className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-[#212121] transition-colors cursor-pointer ml-auto"
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Section Tag */}
        {!collapsed && (
          <div className="px-5 py-2.5 text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/[0.03]">
            Navigation
          </div>
        )}

        {/* Navigation list */}
        <nav className="flex flex-col gap-1 p-2.5">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs transition-all duration-150 border",
                  isActive
                    ? "bg-[#212121] text-white border-white/[0.12] shadow-sm font-medium"
                    : "border-transparent text-gray-400 hover:text-[#E1E0CC] hover:bg-[#181818] hover:border-white/[0.04]",
                )}
                title={collapsed ? item.label : undefined}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-[#DEDBC8]" : "")} />
                {!collapsed && (
                  <div className="flex items-center justify-between w-full overflow-hidden">
                    <span className="truncate">{item.label}</span>
                    <span className="text-[10px] text-gray-600 font-mono ml-2 shrink-0">
                      {item.tag}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Status */}
      <div className="p-4 border-t border-white/[0.06] bg-[#0c0c0c]">
        {!collapsed ? (
          <div className="flex items-center justify-between text-[11px] font-mono text-gray-500">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DEDBC8]" />
              GTU 2026
            </span>
            <span>Open Source</span>
          </div>
        ) : (
          <div className="flex justify-center">
            <span className="h-1.5 w-1.5 rounded-full bg-[#DEDBC8]" />
          </div>
        )}
      </div>
    </aside>
  );
}
