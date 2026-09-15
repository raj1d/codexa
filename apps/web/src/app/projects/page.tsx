"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/ui/entry-card";
import {
  FolderGit2,
  Search,
  Plus,
  Star,
  Bookmark,
  ExternalLink,
  TrendingUp,
} from "lucide-react";

import { API_URL } from "@/lib/api-config";

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

interface ProjectSummary {
  id: string;
  slug: string;
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  tags: string[];
  starsCount: number;
  avgRating: number;
  createdAt: string;
  submitter: {
    id: string;
    name: string;
    githubUsername?: string;
  };
  _count: {
    ratings: number;
    bookmarks: number;
  };
}

export default function ProjectsPage() {
  const [projects, setProjects] = React.useState<ProjectSummary[]>([]);
  const [selectedTag, setSelectedTag] = React.useState<string>("ALL");
  const [sortOption, setSortOption] = React.useState<string>("rating");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProjects() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (selectedTag !== "ALL") queryParams.append("tag", selectedTag);
        if (sortOption) queryParams.append("sort", sortOption);

        const res = await fetch(`${API_URL}/projects?${queryParams.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load projects:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, [selectedTag, sortOption]);

  const filteredProjects = projects.filter((p) =>
    p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())),
  );

  const tags = [
    { id: "ALL", label: "All Categories" },
    { id: "Web Dev", label: "Web Dev" },
    { id: "AI/ML", label: "AI / ML" },
    { id: "Cyber Security", label: "Cyber Security" },
    { id: "Cloud", label: "Cloud & Distributed" },
    { id: "Python", label: "Python" },
    { id: "React", label: "React" },
    { id: "Go", label: "Go" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-[#DEDBC8] text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">
              Student Open-Source Repositories
            </span>
            <h1
              className="text-3xl sm:text-4xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Open-Source Project Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Discover, star, and contribute to verified student capstones and open-source software built for engineering education.
            </p>
          </div>

          <Link href="/projects/submit">
            <Button variant="default" size="default">
              <Plus className="h-4 w-4" />
              Submit Project
            </Button>
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider">
            Filter by Domain:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {tags.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTag(t.id)}
                className={`h-9 px-4 rounded-full font-mono text-xs transition-all duration-150 shrink-0 border select-none cursor-pointer ${
                  selectedTag === t.id
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold shadow-md"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] hover:text-white bg-[#101010]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search & Sort Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search projects by title, tech stack or keywords (e.g. Next.js, U-Net, Raft)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101010] border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#DEDBC8] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "rating", label: "Top Rated" },
              { id: "stars", label: "Most Stars" },
              { id: "newest", label: "Newest" },
            ].map((s) => (
              <button
                key={s.id}
                onClick={() => setSortOption(s.id)}
                className={`h-11 px-4 rounded-xl font-mono text-xs transition-all duration-150 shrink-0 border cursor-pointer ${
                  sortOption === s.id
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-medium"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] bg-[#101010]"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs text-gray-500">
            Open-Source Projects ({filteredProjects.length} listed)
          </span>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-56 rounded-2xl bg-[#101010] border border-white/[0.06] animate-pulse"
                />
              ))}
            </div>
          ) : filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProjects.map((proj) => (
                <EntryCard
                  key={proj.id}
                  title={proj.title}
                  meta={`by ${proj.submitter.name} • ${proj.starsCount} stars`}
                  tag={`${proj.avgRating} ★`}
                  tagVariant="cream"
                  actionLabel="Inspect Project & Code"
                  actionHref={`/projects/${proj.slug}`}
                  activeAccent="cream"
                >
                  <p className="line-clamp-3 mb-3">
                    {proj.description}
                  </p>

                  {/* Tech stack pill tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.tags.slice(0, 3).map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-white/[0.06] text-gray-400"
                      >
                        {t}
                      </span>
                    ))}
                    {proj.tags.length > 3 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 text-gray-500">
                        +{proj.tags.length - 3}
                      </span>
                    )}
                  </div>
                </EntryCard>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#101010] p-12 border border-white/[0.06] text-center flex flex-col items-center gap-3">
              <FolderGit2 className="h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-400">
                No open-source projects match your criteria.
              </p>
              <Link href="/projects/submit">
                <Button variant="default" size="sm" className="mt-2">
                  <Plus className="h-3.5 w-3.5" />
                  Submit Your Project
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
