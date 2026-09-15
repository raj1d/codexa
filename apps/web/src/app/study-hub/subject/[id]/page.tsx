"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/ui/entry-card";
import {
  ArrowLeft,
  FileText,
  Search,
  Upload,
} from "lucide-react";

import { API_URL } from "@/lib/api-config";

interface Unit {
  id: string;
  number: number;
  name: string;
  _count: { resources: number };
}

interface Subject {
  id: string;
  code: string;
  name: string;
  semester: { id: string; number: number; name: string };
  units: Unit[];
}

interface Resource {
  id: string;
  title: string;
  description: string;
  fileType: string;
  fileUrl: string;
  createdAt: string;
  unit: { id: string; number: number; name: string };
  uploader: { id: string; name: string; githubUsername?: string };
}

export default function SubjectPage() {
  const params = useParams();
  const subjectId = params?.id as string;

  const [subject, setSubject] = React.useState<Subject | null>(null);
  const [resources, setResources] = React.useState<Resource[]>([]);
  const [selectedUnitId, setSelectedUnitId] = React.useState<string | "ALL">("ALL");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedType, setSelectedType] = React.useState<string>("ALL");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      if (!subjectId) return;
      setLoading(true);
      try {
        const [subRes, resRes] = await Promise.all([
          fetch(`${API_URL}/study-hub/subjects/${subjectId}`),
          fetch(`${API_URL}/study-hub/resources?subjectId=${subjectId}`),
        ]);

        if (subRes.ok) {
          const subData = await subRes.json();
          setSubject(subData);
        }
        if (resRes.ok) {
          const resData = await resRes.json();
          setResources(resData);
        }
      } catch (err) {
        console.error("Failed to load subject data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [subjectId]);

  const filteredResources = resources.filter((res) => {
    const matchesUnit =
      selectedUnitId === "ALL" || res.unit.id === selectedUnitId;
    const matchesType =
      selectedType === "ALL" || res.fileType === selectedType;
    const matchesQuery =
      res.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.description &&
        res.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesUnit && matchesType && matchesQuery;
  });

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            href="/study-hub"
            className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&larr; Back to Semesters</span>
          </Link>

          <Link href="/study-hub/upload">
            <Button variant="default" size="sm">
              <Upload className="h-3.5 w-3.5" />
              Upload Notes
            </Button>
          </Link>
        </div>

        {/* Subject Header Banner */}
        {subject && (
          <div className="rounded-2xl bg-[#101010] p-8 border border-white/[0.06] flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
            <div>
              <span className="text-[#DEDBC8] text-xs font-mono block mb-2">
                GTU {subject.code} &bull; Semester {subject.semester.number}
              </span>
              <h1
                className="text-3xl sm:text-4xl text-white font-normal"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {subject.name}
              </h1>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                {subject.units.length} Syllabus Units &bull; {resources.length} Verified Study Materials
              </p>
            </div>
          </div>
        )}

        {/* Unit Filter Pills */}
        {subject && (
          <div className="flex flex-col gap-2">
            <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider">
              Filter by Unit:
            </span>
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <button
                onClick={() => setSelectedUnitId("ALL")}
                className={`h-9 px-4 rounded-full font-mono text-xs transition-all duration-150 shrink-0 border select-none cursor-pointer ${
                  selectedUnitId === "ALL"
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold shadow-md"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] hover:text-white bg-[#101010]"
                }`}
              >
                All Units ({resources.length})
              </button>
              {subject.units.map((unit) => {
                const isSelected = selectedUnitId === unit.id;
                const count = resources.filter((r) => r.unit.id === unit.id).length;
                return (
                  <button
                    key={unit.id}
                    onClick={() => setSelectedUnitId(unit.id)}
                    className={`h-9 px-4 rounded-full font-mono text-xs transition-all duration-150 shrink-0 border select-none cursor-pointer ${
                      isSelected
                        ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold shadow-md"
                        : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] hover:text-white bg-[#101010]"
                    }`}
                  >
                    Unit {unit.number}: {unit.name.slice(0, 22)}... ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Search & Type Filter Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search in this subject..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101010] border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#DEDBC8] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: "ALL", label: "All Formats" },
              { id: "NOTES", label: "Notes" },
              { id: "PYQ", label: "PYQs" },
              { id: "LAB_MANUAL", label: "Lab Manuals" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id)}
                className={`h-11 px-4 rounded-xl font-mono text-xs transition-all duration-150 shrink-0 border cursor-pointer ${
                  selectedType === t.id
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-medium"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] bg-[#101010]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Resources Grid */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs text-gray-500">
            Materials ({filteredResources.length} available)
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
          ) : filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((res) => (
                <EntryCard
                  key={res.id}
                  title={res.title}
                  meta={`Unit ${res.unit.number} • ${new Date(res.createdAt).toLocaleDateString()} • ${res.uploader.name}`}
                  tag={res.fileType}
                  tagVariant="cream"
                  actionLabel="View & Download"
                  actionHref={`/study-hub/resource/${res.id}`}
                  activeAccent="cream"
                >
                  <p className="line-clamp-2">
                    {res.description || "Verified semester curriculum material for student study and review."}
                  </p>
                </EntryCard>
              ))}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#101010] p-12 border border-white/[0.06] text-center flex flex-col items-center gap-3">
              <FileText className="h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-400">
                No materials match your selected filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
