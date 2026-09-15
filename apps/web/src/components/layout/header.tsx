"use client";

import * as React from "react";
import Link from "next/link";
import { Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlobalSearchModal } from "./global-search-modal";
import { APP_NAME } from "@codexa/shared";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

interface HeaderProps {
  showBrandLogo?: boolean;
}

export function Header({ showBrandLogo = false }: HeaderProps) {
  const [searchOpen, setSearchOpen] = React.useState(false);

  // Global keyboard shortcut '/' or 'Ctrl+K' / 'Cmd+K' to open search
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.key === "/" || ((e.ctrlKey || e.metaKey) && e.key === "k")) &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)
      ) {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="h-16 border-b border-white/[0.06] bg-[#101010]/80 backdrop-blur-md sticky top-0 z-20 px-6 sm:px-8 flex items-center justify-between">
        {/* Brand Tag (Only shown when sidebar is collapsed) */}
        <div className="flex items-center gap-2">
          {showBrandLogo ? (
            <Link
              href="/"
              className="text-2xl tracking-tight text-white font-normal hover:opacity-90 transition-opacity"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              {APP_NAME}<sup className="text-xs ml-0.5 text-[#DEDBC8]">®</sup>
            </Link>
          ) : (
            <div className="w-4" />
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Universal Search Button Trigger */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="hidden md:flex items-center gap-2.5 px-3.5 py-1.5 rounded-full border border-white/[0.08] bg-[#212121] text-gray-400 hover:text-white hover:border-white/[0.16] text-xs font-mono transition-all cursor-pointer"
          >
            <Search className="h-3.5 w-3.5 text-[#DEDBC8]" />
            <span>Search notes, DSA, projects...</span>
            <kbd className="text-[10px] bg-black px-1.5 py-0.5 rounded border border-white/[0.08] text-gray-400">
              /
            </kbd>
          </button>

          {/* GitHub link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full text-gray-400 hover:text-white hover:bg-[#212121] transition-colors"
            title="GitHub Repository"
            aria-label="GitHub Repository"
          >
            <GithubIcon className="h-4 w-4" />
          </a>

          {/* Sign In CTA */}
          <Link href="/auth/login">
            <Button variant="default" size="sm" className="text-xs">
              <User className="h-3.5 w-3.5" />
              Sign In
            </Button>
          </Link>
        </div>
      </header>

      {/* Global Categorized Search Modal */}
      <GlobalSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
    </>
  );
}
