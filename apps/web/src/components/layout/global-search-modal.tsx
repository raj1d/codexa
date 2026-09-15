"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  BookOpen,
  Code2,
  FolderGit2,
  X,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from "lucide-react";

import { API_URL } from "@/lib/api-config";

interface SearchResults {
  studyHub: {
    id: string;
    title: string;
    fileType: string;
    subjectName: string;
    unitNumber: number;
    href: string;
  }[];
  dsaProblems: {
    id: string;
    slug: string;
    title: string;
    difficulty: "EASY" | "MEDIUM" | "HARD";
    topic: string;
    href: string;
  }[];
  projects: {
    id: string;
    slug: string;
    title: string;
    tags: string[];
    avgRating: number;
    href: string;
  }[];
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const router = useRouter();
  const [query, setQuery] = React.useState("");
  const [results, setResults] = React.useState<SearchResults>({
    studyHub: [],
    dsaProblems: [],
    projects: [],
  });
  const [loading, setLoading] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Auto focus input when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery("");
      setResults({ studyHub: [], dsaProblems: [], projects: [] });
    }
  }, [isOpen]);

  // Handle ESC key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Debounced live search
  React.useEffect(() => {
    if (!query.trim()) {
      setResults({ studyHub: [], dsaProblems: [], projects: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query.trim())}`);
        if (res.ok) {
          const data = await res.json();
          setResults(data);
        }
      } catch (err) {
        console.error("Global search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isOpen) return null;

  const hasResults =
    results.studyHub.length > 0 ||
    results.dsaProblems.length > 0 ||
    results.projects.length > 0;

  const handleSelect = (href: string) => {
    onClose();
    router.push(href);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Search Modal Container */}
      <div className="relative z-10 w-full max-w-2xl bg-[#101010] border border-white/[0.12] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-5 border-b border-white/[0.08] bg-[#161616]">
          <Search className="h-5 w-5 text-[#DEDBC8] shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search across Study Hub, DSA Problems, and Projects..."
            className="w-full h-14 bg-transparent text-[#E1E0CC] font-mono text-sm placeholder:text-gray-500 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-gray-500 hover:text-white p-1 rounded-md transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="ml-2 px-2 py-0.5 rounded bg-black border border-white/[0.1] text-[10px] font-mono text-gray-500">
            ESC
          </kbd>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto flex flex-col gap-5">
          {loading && (
            <div className="p-6 text-center text-xs font-mono text-gray-400 flex items-center justify-center gap-2">
              <div className="h-3.5 w-3.5 border-2 border-[#DEDBC8] border-t-transparent rounded-full animate-spin" />
              <span>Searching CODEXA platform...</span>
            </div>
          )}

          {!loading && query && !hasResults && (
            <div className="p-8 text-center text-gray-500 font-mono text-xs">
              No matching results found for &ldquo;{query}&rdquo;.
            </div>
          )}

          {!query && (
            <div className="p-6 flex flex-col gap-3">
              <span className="text-[10px] font-mono uppercase tracking-wider text-gray-500">
                Popular Quick Searches:
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  "DBMS Normalization",
                  "Two Sum",
                  "Operating Systems Paging",
                  "Binary Trees",
                  "GTU Grade Calculator",
                  "0/1 Knapsack",
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(item)}
                    className="px-3 py-1.5 rounded-full bg-[#212121] border border-white/[0.06] text-xs font-mono text-gray-300 hover:text-white hover:border-white/[0.16] transition-colors cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 1. Study Hub Notes Category */}
          {results.studyHub.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2 text-[11px] font-mono uppercase tracking-wider text-[#DEDBC8]">
                <BookOpen className="h-3.5 w-3.5" />
                <span>Study Hub Notes ({results.studyHub.length})</span>
              </div>
              <div className="flex flex-col gap-1">
                {results.studyHub.map((r) => (
                  <button
                    key={r.id}
                    onClick={() => handleSelect(r.href)}
                    className="w-full text-left p-3 rounded-xl bg-black/40 hover:bg-[#212121] border border-white/[0.04] hover:border-white/[0.12] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-[#DEDBC8] transition-colors">
                        {r.title}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                        {r.subjectName} &bull; Unit {r.unitNumber} &bull; {r.fileType}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. DSA Practice Problems Category */}
          {results.dsaProblems.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2 text-[11px] font-mono uppercase tracking-wider text-[#5EEAD4]">
                <Code2 className="h-3.5 w-3.5" />
                <span>DSA Practice Problems ({results.dsaProblems.length})</span>
              </div>
              <div className="flex flex-col gap-1">
                {results.dsaProblems.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleSelect(p.href)}
                    className="w-full text-left p-3 rounded-xl bg-black/40 hover:bg-[#212121] border border-white/[0.04] hover:border-white/[0.12] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-[#5EEAD4] transition-colors">
                        {p.title}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                        Topic: {p.topic} &bull; Difficulty: {p.difficulty}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. Open-Source Projects Category */}
          {results.projects.length > 0 && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 px-2 text-[11px] font-mono uppercase tracking-wider text-amber-400">
                <FolderGit2 className="h-3.5 w-3.5" />
                <span>Open-Source Projects ({results.projects.length})</span>
              </div>
              <div className="flex flex-col gap-1">
                {results.projects.map((pr) => (
                  <button
                    key={pr.id}
                    onClick={() => handleSelect(pr.href)}
                    className="w-full text-left p-3 rounded-xl bg-black/40 hover:bg-[#212121] border border-white/[0.04] hover:border-white/[0.12] transition-colors flex items-center justify-between group cursor-pointer"
                  >
                    <div>
                      <div className="text-xs font-medium text-white group-hover:text-amber-300 transition-colors">
                        {pr.title}
                      </div>
                      <div className="text-[11px] font-mono text-gray-500 mt-0.5">
                        Tags: {pr.tags.join(", ")} &bull; {pr.avgRating} ★
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-600 group-hover:text-white transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
