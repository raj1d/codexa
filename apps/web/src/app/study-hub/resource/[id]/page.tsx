"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  FileText,
  Sparkles,
  CheckCircle2,
  Calendar,
  User,
  BookOpen,
  Printer,
  ExternalLink,
  Eye,
} from "lucide-react";
import { FullNotesContent } from "@/components/study-hub/full-notes-content";
import { SlidePresentationViewer } from "@/components/study-hub/slide-presentation-viewer";

import { API_URL } from "@/lib/api-config";

interface Resource {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
  unit: {
    id: string;
    number: number;
    name: string;
    subject: {
      id: string;
      code: string;
      name: string;
      semester: { number: number; name: string };
    };
  };
  uploader: {
    id: string;
    name: string;
    githubUsername?: string;
  };
}

export default function ResourceDetailPage() {
  const params = useParams();
  const resourceId = params?.id as string;
  const { data: session } = useSession();

  const [resource, setResource] = React.useState<Resource | null>(null);
  const [downloadUrl, setDownloadUrl] = React.useState<string | null>(null);
  const [completed, setCompleted] = React.useState(false);
  const [activeViewerTab, setActiveViewerTab] = React.useState<"embed" | "structured">("embed");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadResource() {
      if (!resourceId) return;
      setLoading(true);
      try {
        const [resRes, downloadRes] = await Promise.all([
          fetch(`${API_URL}/study-hub/resources/${resourceId}`),
          fetch(`${API_URL}/study-hub/resources/${resourceId}/download`),
        ]);

        if (resRes.ok) {
          const data = await resRes.json();
          setResource(data);
        }
        if (downloadRes.ok) {
          const dlData = await downloadRes.json();
          setDownloadUrl(dlData.url);
        }

        if ((session as any)?.token) {
          const checkRes = await fetch(
            `${API_URL}/dashboard/progress/check/${resourceId}`,
            {
              headers: {
                Authorization: `Bearer ${(session as any)?.token}`,
              },
            },
          );
          if (checkRes.ok) {
            const checkData = await checkRes.json();
            setCompleted(checkData.completed);
          }
        }
      } catch (err) {
        console.error("Failed to load resource:", err);
      } finally {
        setLoading(false);
      }
    }
    loadResource();
  }, [resourceId, session]);

  const handleMarkComplete = async () => {
    setCompleted(!completed);
    if ((session as any)?.token) {
      try {
        await fetch(`${API_URL}/dashboard/progress/toggle/${resourceId}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${(session as any)?.token}`,
          },
        });
      } catch (err) {
        console.error("Failed to toggle progress:", err);
      }
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
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

  if (!resource) {
    return (
      <AppShell>
        <div className="py-12 text-center flex flex-col items-center gap-4">
          <FileText className="h-12 w-12 text-gray-600" />
          <h2 className="text-2xl font-medium text-white">Resource Not Found</h2>
          <Link href="/study-hub">
            <Button variant="default" size="sm">
              &larr; Back to Study Hub
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const isDarshan = resource.title.includes("Darshan Uni");
  const isGtuRanker = resource.title.includes("GTURanker");
  const isPpt = resource.title.includes("Presentation Slides") || resource.title.includes("PPT");

  // Generate safe direct PDF / Google Docs Viewer embed URL
  const rawUrl = downloadUrl || resource.fileUrl;
  const embedViewerUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(
    rawUrl.startsWith("http") ? rawUrl : `https://gturanker.com/${resource.unit.subject.code}`,
  )}&embedded=true`;

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Navigation bar */}
        <div className="flex items-center justify-between">
          <Link
            href={`/study-hub/subject/${resource.unit.subject.id}`}
            className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&larr; Back to {resource.unit.subject.name}</span>
          </Link>

          <div className="flex items-center gap-3">
            <Button
              variant={completed ? "default" : "secondary"}
              size="sm"
              onClick={handleMarkComplete}
              className="text-xs"
            >
              <CheckCircle2
                className={`h-3.5 w-3.5 ${completed ? "text-black" : "text-[#DEDBC8]"}`}
              />
              {completed ? "Marked Done" : "Mark as Done"}
            </Button>

            <a
              href={resource.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" size="sm" className="text-xs hidden sm:flex">
                <ExternalLink className="h-3.5 w-3.5" />
                Open Source Portal
              </Button>
            </a>

            <Button
              variant="default"
              size="sm"
              onClick={handlePrint}
              className="text-xs"
            >
              <Download className="h-3.5 w-3.5" />
              {isPpt ? "Download PPT Deck" : "Download PDF Notes"}
            </Button>
          </div>
        </div>

        {/* Document Header Card */}
        <div className="rounded-2xl bg-[#101010] p-8 border border-white/[0.06] flex flex-col gap-4 shadow-xl">
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <span className="px-3 py-0.5 rounded-full border border-[#DEDBC8]/30 text-[#DEDBC8] bg-[#DEDBC8]/5">
              {resource.fileType}
            </span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-gray-400">
              GTU {resource.unit.subject.code} &bull; Semester {resource.unit.subject.semester.number}
            </span>
            <span className="text-gray-600">&bull;</span>
            <span className="text-[#DEDBC8]">
              Unit {resource.unit.number}: {resource.unit.name}
            </span>
          </div>

          <h1
            className="text-3xl sm:text-4xl text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            {resource.title}
          </h1>

          {resource.description && (
            <p className="text-sm text-gray-300 leading-relaxed max-w-4xl">
              {resource.description}
            </p>
          )}

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-white/[0.06] font-mono text-xs text-gray-500">
            <div className="flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-[#DEDBC8]" />
              <span>Verified Publisher: {resource.uploader.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-[#DEDBC8]" />
              <span>{new Date(resource.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5 text-[#DEDBC8]" />
              <span>GTU Academic Curriculum</span>
            </div>
          </div>
        </div>

        {/* AI Assistant Callout */}
        <div className="rounded-2xl bg-[#101010] p-6 border border-white/[0.08] flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="h-10 w-10 rounded-xl border border-white/[0.1] bg-[#212121] flex items-center justify-center shrink-0 text-[#DEDBC8]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-base font-medium text-[#E1E0CC]">
                Have questions about this material?
              </h4>
              <p className="text-xs text-gray-400 mt-0.5">
                Ask the AI Study Assistant to explain step-by-step or predict exam viva questions with citations.
              </p>
            </div>
          </div>

          <Link href={`/ai-assistant?doc=${resource.id}`}>
            <Button variant="secondary" size="sm" className="shrink-0 text-xs">
              <Sparkles className="h-3.5 w-3.5 text-[#DEDBC8]" />
              Ask AI Assistant
            </Button>
          </Link>
        </div>

        {/* Interactive Multi-Mode Document & PDF Viewer */}
        <div className="rounded-2xl bg-[#101010] border border-white/[0.08] overflow-hidden flex flex-col shadow-2xl">
          {/* Viewer Navigation Bar */}
          <div className="h-14 bg-[#161616] px-6 border-b border-white/[0.06] flex items-center justify-between font-mono text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveViewerTab("embed")}
                className={`h-8 px-3.5 rounded-full font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeViewerTab === "embed"
                    ? "bg-[#DEDBC8] text-black font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <Eye className="h-3.5 w-3.5" />
                <span>{isPpt ? "Presentation Deck & Slides" : "Document & Slide Viewer"}</span>
              </button>

              <button
                onClick={() => setActiveViewerTab("structured")}
                className={`h-8 px-3.5 rounded-full font-mono text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                  activeViewerTab === "structured"
                    ? "bg-[#DEDBC8] text-black font-semibold"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                <BookOpen className="h-3.5 w-3.5" />
                <span>Structured Notes & 7-Mark PYQs</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={resource.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white flex items-center gap-1 text-[11px]"
              >
                <span>Direct University Source</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>

          {/* TAB 1: Live Presentation Slide Canvas or Document Viewer */}
          {activeViewerTab === "embed" ? (
            isPpt ? (
              <SlidePresentationViewer
                subjectName={resource.unit.subject.name}
                subjectCode={resource.unit.subject.code}
                unitNumber={resource.unit.number}
                unitName={resource.unit.name}
                fileUrl={resource.fileUrl}
              />
            ) : (
              <div className="flex flex-col bg-black">
                <div className="w-full h-[720px] relative bg-[#1c1c1c] flex items-center justify-center">
                  <iframe
                    src={embedViewerUrl}
                    className="w-full h-full border-none"
                    title={resource.title}
                    loading="lazy"
                  />
                </div>

                <div className="p-4 bg-[#141414] border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-mono text-gray-400 px-6">
                  <span>
                    Source: {isDarshan ? "Darshan University (DIET)" : isGtuRanker ? "GTURanker University Archive" : "Verified Academic Portal"}
                  </span>
                  <div className="flex items-center gap-3">
                    <a
                      href={resource.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#DEDBC8] hover:underline flex items-center gap-1 font-medium"
                    >
                      <span>Open in Fullscreen Tab</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            )
          ) : (
            /* TAB 2: Formatted Academic Notes & 7-Mark PYQ Solutions */
            <div className="p-8 sm:p-12 md:p-14 bg-black/60 max-w-4xl mx-auto w-full">
              <FullNotesContent
                subjectName={resource.unit.subject.name}
                subjectCode={resource.unit.subject.code}
                unitNumber={resource.unit.number}
                unitName={resource.unit.name}
                resourceTitle={resource.title}
              />
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
