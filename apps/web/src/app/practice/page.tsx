"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/ui/entry-card";
import {
  Code2,
  Search,
} from "lucide-react";

import { API_URL } from "@/lib/api-config";

interface ProblemSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  totalTestCases: number;
  totalSubmissions: number;
}

export default function PracticePage() {
  const [problems, setProblems] = React.useState<ProblemSummary[]>([]);
  const [selectedTopic, setSelectedTopic] = React.useState<string>("ALL");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<string>("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProblems() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedDifficulty !== "ALL") queryParams.append("difficulty", selectedDifficulty);
        if (selectedTopic !== "ALL") queryParams.append("topic", selectedTopic);

        const res = await fetch(`${API_URL}/dsa/problems?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProblems(data);
        }
      } catch (err) {
        console.error("Failed to load problems:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProblems();
  }, [selectedTopic, selectedDifficulty]);

  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const topics = [
    { id: "ALL", label: "All Topics" },
    { id: "arrays", label: "Arrays" },
    { id: "stacks", label: "Stacks" },
    { id: "trees", label: "Trees" },
    { id: "dynamic-programming", label: "Dynamic Prog" },
    { id: "graphs", label: "Graphs" },
    { id: "dbms", label: "DBMS SQL" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-[#DEDBC8] text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">
              Coding & Algorithms
            </span>
            <h1
              className="text-3xl sm:text-4xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              DSA Practice Sandbox
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              In-browser Monaco coding editor with hidden test-case verification and GTU-aligned problems.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#DEDBC8]" />
            <span className="font-mono text-xs text-gray-400">
              Execution Sandbox Ready
            </span>
          </div>
        </div>

        {/* Topic Filters */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider">
            Filter by Topic:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {topics.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTopic(t.id)}
                className={`h-9 px-4 rounded-full font-mono text-xs transition-all duration-150 shrink-0 border select-none cursor-pointer ${
                  selectedTopic === t.id
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold shadow-md"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] hover:text-white bg-[#101010]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Difficulty Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems by title (e.g. Two Sum, Valid Parentheses, Knapsack)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101010] border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#DEDBC8] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "ALL", label: "All Difficulties" },
              { id: "EASY", label: "Easy" },
              { id: "MEDIUM", label: "Medium" },
              { id: "HARD", label: "Hard" },
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDifficulty(d.id)}
                className={`h-11 px-4 rounded-xl font-mono text-xs transition-all duration-150 shrink-0 border cursor-pointer ${
                  selectedDifficulty === d.id
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-medium"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] bg-[#101010]"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Problems Grid */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs text-gray-500">
            Problems ({filteredProblems.length} available)
          </span>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-44 rounded-2xl bg-[#101010] border border-white/[0.06] animate-pulse"
                />
              ))}
            </div>
          ) : filteredProblems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProblems.map((prob) => {
                const diffTag =
                  prob.difficulty === "EASY"
                    ? { tag: "EASY", variant: "cream" as const }
                    : prob.difficulty === "MEDIUM"
                      ? { tag: "MEDIUM", variant: "amber" as const }
                      : { tag: "HARD", variant: "alert" as const };

                return (
                  <EntryCard
                    key={prob.id}
                    title={prob.title}
                    meta={`topic: ${prob.topic} • test cases: ${prob.totalTestCases}`}
                    tag={diffTag.tag}
                    tagVariant={diffTag.variant}
                    actionLabel="Open Coding IDE"
                    actionHref={`/practice/${prob.slug}`}
                    activeAccent={diffTag.variant}
                  >
                    <div className="flex items-center justify-between text-xs text-gray-400 pt-1">
                      <span>Submissions:</span>
                      <span className="text-[#E1E0CC]">
                        {prob.totalSubmissions} attempts
                      </span>
                    </div>
                  </EntryCard>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#101010] p-12 border border-white/[0.06] text-center flex flex-col items-center gap-3">
              <Code2 className="h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-400">
                No problems match your current topic or difficulty selection.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
