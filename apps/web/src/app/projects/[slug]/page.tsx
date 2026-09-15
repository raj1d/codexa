"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  ArrowLeft,
  Star,
  Bookmark,
  ExternalLink,
  Code,
  FileText,
  User,
  Calendar,
  Sparkles,
  CheckCircle2,
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

interface ProjectDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  repoUrl: string;
  demoUrl?: string;
  docsUrl?: string;
  tags: string[];
  starsCount: number;
  avgRating: number;
  isBookmarked: boolean;
  userRating: number | null;
  createdAt: string;
  submitter: {
    id: string;
    name: string;
    githubUsername?: string;
  };
  ratings: {
    id: string;
    score: number;
    feedback?: string;
    createdAt: string;
    user: {
      name: string;
      githubUsername?: string;
    };
  }[];
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: session } = useSession();

  const [project, setProject] = React.useState<ProjectDetail | null>(null);
  const [bookmarked, setBookmarked] = React.useState(false);
  const [userScore, setUserScore] = React.useState<number>(0);
  const [feedback, setFeedback] = React.useState("");
  const [ratingSubmitted, setRatingSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProject() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/projects/${slug}`, {
          headers: {
            Authorization: `Bearer ${(session as any)?.token || ""}`,
          },
        });
        if (res.ok) {
          const data = await res.json();
          setProject(data);
          setBookmarked(data.isBookmarked);
          if (data.userRating) setUserScore(data.userRating);
        }
      } catch (err) {
        console.error("Failed to load project:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProject();
  }, [slug, session]);

  const handleBookmarkToggle = async () => {
    if (!project) return;
    setBookmarked(!bookmarked);

    if ((session as any)?.token) {
      try {
        await fetch(`${API_URL}/projects/${project.id}/bookmark`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(session as any)?.token}`,
          },
        });
      } catch (err) {
        console.error("Failed to toggle bookmark:", err);
      }
    }
  };

  const handleRate = async (score: number) => {
    if (!project) return;
    setUserScore(score);

    if ((session as any)?.token) {
      try {
        const res = await fetch(`${API_URL}/projects/${project.id}/rate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any)?.token}`,
          },
          body: JSON.stringify({ score, feedback: feedback || undefined }),
        });
        if (res.ok) {
          const result = await res.json();
          setProject((prev) => (prev ? { ...prev, avgRating: result.avgRating } : null));
          setRatingSubmitted(true);
        }
      } catch (err) {
        console.error("Failed to rate project:", err);
      }
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="py-8 flex flex-col gap-6 animate-pulse">
          <div className="h-6 w-36 bg-[#101010] rounded" />
          <div className="h-48 bg-[#101010] rounded-2xl" />
          <div className="h-96 bg-[#101010] rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  if (!project) {
    return (
      <AppShell>
        <div className="py-12 text-center flex flex-col items-center gap-4">
          <h2 className="text-2xl font-medium text-white">Project Not Found</h2>
          <Link href="/projects">
            <Button variant="default" size="sm">
              &larr; Back to Project Hub
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/projects"
            className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&larr; Back to All Projects</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant={bookmarked ? "default" : "secondary"}
              size="sm"
              onClick={handleBookmarkToggle}
              className="text-xs"
            >
              <Bookmark className={`h-3.5 w-3.5 ${bookmarked ? "fill-black text-black" : ""}`} />
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </Button>

            <a href={project.repoUrl} target="_blank" rel="noopener noreferrer">
              <Button variant="default" size="sm" className="text-xs">
                <GithubIcon className="h-3.5 w-3.5" />
                GitHub Repository
              </Button>
            </a>
          </div>
        </div>

        {/* Project Header Banner */}
        <div className="rounded-2xl bg-[#101010] p-8 border border-white/[0.06] flex flex-col gap-5 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              {project.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-0.5 rounded-full border border-white/[0.08] bg-[#212121] text-xs font-mono text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 font-mono text-xs text-gray-400">
              <span className="flex items-center gap-1 text-[#DEDBC8] font-bold text-sm">
                ★ {project.avgRating}
              </span>
              <span>&bull;</span>
              <span>{project.starsCount} Stars</span>
            </div>
          </div>

          <h1
            className="text-3xl sm:text-4xl text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {project.title}
          </h1>

          <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-4xl font-normal">
            {project.description}
          </p>

          {/* Links & Submitter metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/[0.06] text-xs font-mono text-gray-400">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-[#DEDBC8]" />
                Built by {project.submitter.name}
                {project.submitter.githubUsername && (
                  <span className="text-gray-500">(@{project.submitter.githubUsername})</span>
                )}
              </span>
              <span>&bull;</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#DEDBC8]" />
                {new Date(project.createdAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#DEDBC8] hover:text-white flex items-center gap-1 font-medium transition-colors"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {project.docsUrl && (
                <a
                  href={project.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <span>Documentation</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Rating & Community Review Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Rate this project */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-7 flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">
                Rate this Project
              </h3>
              <p className="text-xs text-gray-400">
                Help fellow student contributors discover exceptional engineering repos by leaving a star rating.
              </p>

              {/* Star selector */}
              <div className="flex items-center gap-2 py-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRate(star)}
                    className="p-1 text-2xl hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star
                      className={`h-7 w-7 ${
                        star <= userScore
                          ? "fill-[#DEDBC8] text-[#DEDBC8]"
                          : "text-gray-600 hover:text-gray-400"
                      }`}
                    />
                  </button>
                ))}
              </div>

              {ratingSubmitted && (
                <div className="flex items-center gap-2 font-mono text-xs text-[#DEDBC8] pt-1">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Rating recorded successfully!</span>
                </div>
              )}
            </Card>
          </div>

          {/* Reviews & Feedback List */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <Card className="p-7 flex flex-col gap-4">
              <h3 className="text-lg font-medium text-white">
                Community Ratings & Insights
              </h3>

              {project.ratings && project.ratings.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {project.ratings.map((r) => (
                    <div
                      key={r.id}
                      className="p-4 rounded-xl bg-black/60 border border-white/[0.06] flex flex-col gap-1.5"
                    >
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[#E1E0CC] font-medium">{r.user.name}</span>
                        <span className="text-[#DEDBC8]">{'★'.repeat(r.score)}</span>
                      </div>
                      {r.feedback && (
                        <p className="text-xs text-gray-400 mt-1">{r.feedback}</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-500 font-mono py-4">
                  Be the first to rate and review this open-source repository!
                </p>
              )}
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
