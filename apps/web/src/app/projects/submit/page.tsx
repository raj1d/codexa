"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  FolderGit2,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Plus,
  Code,
  Globe,
  FileText,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

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

export default function SubmitProjectPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [repoUrl, setRepoUrl] = React.useState("");
  const [demoUrl, setDemoUrl] = React.useState("");
  const [docsUrl, setDocsUrl] = React.useState("");
  const [tagsInput, setTagsInput] = React.useState("Web Dev, React, TypeScript");

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [createdSlug, setCreatedSlug] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    try {
      const res = await fetch(`${API_URL}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.token || ""}`,
        },
        body: JSON.stringify({
          title,
          description,
          repoUrl,
          demoUrl: demoUrl || undefined,
          docsUrl: docsUrl || undefined,
          tags,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit project");
      }

      setCreatedSlug(data.slug);
      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit project. Please ensure you are logged in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-4 flex flex-col gap-6">
        <Link
          href="/projects"
          className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>&larr; Back to Project Hub</span>
        </Link>

        <div>
          <span className="text-[#DEDBC8] text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">
            Student Showcase
          </span>
          <h1
            className="text-3xl sm:text-4xl text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Submit Open-Source Project
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Share your academic capstone, tool, or engineering repository with the GTU developer community.
          </p>
        </div>

        {success ? (
          <Card className="p-8 text-center flex flex-col items-center gap-4 border border-[#DEDBC8]/30">
            <div className="h-12 w-12 rounded-full border border-[#DEDBC8] flex items-center justify-center bg-[#DEDBC8]/10 text-[#DEDBC8]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-white">
              Project Listed Successfully!
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md">
              Your open-source project is now live on CODEXA for other engineering students to explore, star, and review.
            </p>
            <div className="flex items-center gap-3 mt-2">
              {createdSlug && (
                <Link href={`/projects/${createdSlug}`}>
                  <Button variant="default" size="sm">
                    View Project Page &rarr;
                  </Button>
                </Link>
              )}
              <Link href="/projects">
                <Button variant="secondary" size="sm">
                  Return to Hub
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card className="p-7 sm:p-8">
            <CardHeader className="p-0 pb-6">
              <CardTitle className="text-xl font-medium text-[#E1E0CC]">
                Repository Information
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs mt-1">
                Provide public repository links and tags for indexing across the platform.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-0 flex flex-col gap-5">
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs font-mono">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. GTU Grade Calculator & Syllabus Tracker"
                    className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400">
                    Description & Overview *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe what the project does, key features, and problem it solves for engineering students..."
                    className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                    <GithubIcon className="h-3 w-3 text-[#DEDBC8]" />
                    GitHub Repository URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/project-repo"
                    className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                      <Globe className="h-3 w-3 text-[#DEDBC8]" />
                      Live Demo URL (optional)
                    </label>
                    <input
                      type="url"
                      value={demoUrl}
                      onChange={(e) => setDemoUrl(e.target.value)}
                      placeholder="https://project.vercel.app"
                      className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                      <FileText className="h-3 w-3 text-[#DEDBC8]" />
                      Documentation URL (optional)
                    </label>
                    <input
                      type="url"
                      value={docsUrl}
                      onChange={(e) => setDocsUrl(e.target.value)}
                      placeholder="https://docs.project.dev"
                      className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400">
                    Tech Stack Tags (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Web Dev, React, TypeScript, Next.js, AI/ML, Python"
                    className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors"
                  />
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={loading}
                  className="w-full mt-3 font-medium"
                >
                  <Plus className="h-4 w-4" />
                  {loading ? "Publishing Project..." : "Publish to Open-Source Hub"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
