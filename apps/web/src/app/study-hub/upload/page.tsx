"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Upload,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  FileText,
  Info,
} from "lucide-react";

import { API_URL } from "@/lib/api-config";

interface Semester {
  id: string;
  number: number;
  name: string;
}

interface Subject {
  id: string;
  code: string;
  name: string;
  units: { id: string; number: number; name: string }[];
}

export default function UploadResourcePage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [selectedSemesterId, setSelectedSemesterId] = React.useState("");
  const [selectedSubjectId, setSelectedSubjectId] = React.useState("");
  const [selectedUnitId, setSelectedUnitId] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [fileType, setFileType] = React.useState("NOTES");
  const [fileUrl, setFileUrl] = React.useState("");

  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function loadSemesters() {
      try {
        const res = await fetch(`${API_URL}/study-hub/semesters`);
        if (res.ok) {
          const data = await res.json();
          setSemesters(data);
          if (data.length > 0) {
            setSelectedSemesterId(data[2]?.id || data[0].id);
          }
        }
      } catch (err) {
        console.error("Failed to load semesters:", err);
      }
    }
    loadSemesters();
  }, []);

  React.useEffect(() => {
    async function loadSubjects() {
      if (!selectedSemesterId) return;
      try {
        const res = await fetch(`${API_URL}/study-hub/subjects?semesterId=${selectedSemesterId}`);
        if (res.ok) {
          const data = await res.json();
          setSubjects(data);
          if (data.length > 0) {
            setSelectedSubjectId(data[0].id);
            if (data[0].units?.length > 0) {
              setSelectedUnitId(data[0].units[0].id);
            }
          } else {
            setSelectedSubjectId("");
            setSelectedUnitId("");
          }
        }
      } catch (err) {
        console.error("Failed to load subjects:", err);
      }
    }
    loadSubjects();
  }, [selectedSemesterId]);

  const activeSubject = subjects.find((s) => s.id === selectedSubjectId);
  React.useEffect(() => {
    if (activeSubject && activeSubject.units?.length > 0) {
      setSelectedUnitId(activeSubject.units[0].id);
    }
  }, [activeSubject]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/study-hub/resources`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.token || ""}`,
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          fileType,
          fileUrl: fileUrl || "https://uploads.codexa.dev/sample-notes.pdf",
          semesterId: selectedSemesterId,
          subjectId: selectedSubjectId,
          unitId: selectedUnitId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to submit resource");
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err?.message || "Failed to submit resource. Please make sure you are signed in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-2xl mx-auto py-4 flex flex-col gap-6">
        <Link
          href="/study-hub"
          className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>&larr; Back to Study Hub</span>
        </Link>

        <div>
          <span className="text-[#DEDBC8] text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">
            Community Contribution
          </span>
          <h1
            className="text-3xl sm:text-4xl text-white font-normal"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Contribute Study Material
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Share high quality notes, PYQs, and lab manuals tagged to GTU syllabus units.
          </p>
        </div>

        {success ? (
          <Card className="p-8 text-center flex flex-col items-center gap-4 border border-[#DEDBC8]/30">
            <div className="h-12 w-12 rounded-full border border-[#DEDBC8] flex items-center justify-center bg-[#DEDBC8]/10 text-[#DEDBC8]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h3 className="text-xl font-medium text-white">
              Submission Received!
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-md">
              Thank you for contributing to CODEXA. Your uploaded material has been submitted to the moderation queue for review before public indexing.
            </p>
            <div className="flex items-center gap-3 mt-2">
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  setSuccess(false);
                  setTitle("");
                  setDescription("");
                  setFileUrl("");
                }}
              >
                Upload Another
              </Button>
              <Link href="/study-hub">
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
                Resource Details
              </CardTitle>
              <CardDescription className="text-gray-400 text-xs mt-1">
                All approved notes will be indexed in Meilisearch and grounded in the AI Study Assistant.
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
                  <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                    <FileText className="h-3 w-3 text-[#DEDBC8]" />
                    Resource Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. DBMS Unit 1 — ER Model & Relational Algebra Lecture Notes"
                    className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400">
                    Description & Key Topics (optional)
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe what this document covers..."
                    className="p-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400">
                    File Type *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: "NOTES", label: "Notes" },
                      { id: "PYQ", label: "PYQ Paper" },
                      { id: "LAB_MANUAL", label: "Lab Manual" },
                      { id: "PDF", label: "E-Book" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setFileType(t.id)}
                        className={`h-9 px-3 rounded-lg font-mono text-xs border transition-colors select-none cursor-pointer ${
                          fileType === t.id
                            ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold"
                            : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] bg-black/40"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-400">
                      Semester *
                    </label>
                    <select
                      value={selectedSemesterId}
                      onChange={(e) => setSelectedSemesterId(e.target.value)}
                      className="h-10 px-2 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs focus:outline-none focus:border-[#DEDBC8]"
                    >
                      {semesters.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#101010]">
                          Semester {s.number}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-400">
                      Subject *
                    </label>
                    <select
                      value={selectedSubjectId}
                      onChange={(e) => setSelectedSubjectId(e.target.value)}
                      className="h-10 px-2 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs focus:outline-none focus:border-[#DEDBC8]"
                    >
                      {subjects.map((s) => (
                        <option key={s.id} value={s.id} className="bg-[#101010]">
                          {s.code} - {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-mono text-gray-400">
                      Unit/Topic *
                    </label>
                    <select
                      value={selectedUnitId}
                      onChange={(e) => setSelectedUnitId(e.target.value)}
                      className="h-10 px-2 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs focus:outline-none focus:border-[#DEDBC8]"
                    >
                      {activeSubject?.units?.map((u) => (
                        <option key={u.id} value={u.id} className="bg-[#101010]">
                          Unit {u.number}: {u.name.slice(0, 20)}...
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-mono text-gray-400 flex items-center gap-1.5">
                    <Upload className="h-3 w-3 text-[#DEDBC8]" />
                    Document Link / Storage URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={fileUrl}
                    onChange={(e) => setFileUrl(e.target.value)}
                    placeholder="https://drive.google.com/... or direct PDF URL"
                    className="h-11 px-3.5 rounded-xl bg-black/60 border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8] transition-colors"
                  />
                  <span className="font-mono text-[11px] text-gray-500 flex items-center gap-1">
                    <Info className="h-3 w-3" />
                    Zero egress downloads via Cloudflare R2 storage.
                  </span>
                </div>

                <Button
                  type="submit"
                  variant="default"
                  size="lg"
                  disabled={loading || !selectedUnitId}
                  className="w-full mt-3 font-medium"
                >
                  <Upload className="h-4 w-4" />
                  {loading ? "Submitting..." : "Submit Material for Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </AppShell>
  );
}
