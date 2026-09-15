"use client";

import * as React from "react";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { EntryCard } from "@/components/ui/entry-card";
import {
  BookOpen,
  Search,
  Upload,
  Layers,
  FileText,
} from "lucide-react";

import { API_URL } from "@/lib/api-config";

interface Semester {
  id: string;
  number: number;
  name: string;
  _count: { subjects: number };
}

interface Subject {
  id: string;
  code: string;
  name: string;
  semesterId: string;
  _count: { units: number };
  units?: {
    id: string;
    number: number;
    name: string;
    _count: { resources: number };
  }[];
}

export default function StudyHubPage() {
  const [semesters, setSemesters] = React.useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = React.useState<number>(3);
  const [subjects, setSubjects] = React.useState<Subject[]>([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedFileType, setSelectedFileType] = React.useState<string>("ALL");
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadSemesters() {
      try {
        const res = await fetch(`${API_URL}/study-hub/semesters`);
        if (res.ok) {
          const data = await res.json();
          setSemesters(data);
        }
      } catch (err) {
        console.error("Failed to load semesters:", err);
      }
    }
    loadSemesters();
  }, []);

  React.useEffect(() => {
    async function loadSubjects() {
      setLoading(true);
      try {
        const currentSem = semesters.find((s) => s.number === selectedSemester);
        const url = currentSem
          ? `${API_URL}/study-hub/subjects?semesterId=${currentSem.id}`
          : `${API_URL}/study-hub/subjects`;

        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setSubjects(data);
        }
      } catch (err) {
        console.error("Failed to load subjects:", err);
      } finally {
        setLoading(false);
      }
    }
    if (semesters.length > 0) {
      loadSubjects();
    }
  }, [selectedSemester, semesters]);

  const filteredSubjects = subjects.filter((sub) => {
    const matchesQuery =
      sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sub.code.includes(searchQuery);
    return matchesQuery;
  });

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-[#DEDBC8] text-[10px] sm:text-xs uppercase tracking-[0.2em] font-mono block mb-1">
              GTU IT / CSE Curriculum
            </span>
            <h1
              className="text-3xl sm:text-4xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Centralized Study Hub
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Curated notes, PYQ papers, and lab manuals organized by Semester &rarr; Subject &rarr; Unit.
            </p>
          </div>

          <Link href="/study-hub/upload">
            <Button variant="default" size="default">
              <Upload className="h-4 w-4" />
              Upload Material
            </Button>
          </Link>
        </div>

        {/* Semester Filter Tabs (1 to 8) */}
        <div className="flex flex-col gap-2.5">
          <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider">
            Select Semester:
          </span>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((semNum) => {
              const isSelected = selectedSemester === semNum;
              return (
                <button
                  key={semNum}
                  onClick={() => setSelectedSemester(semNum)}
                  className={`h-9 px-4 rounded-full font-mono text-xs transition-all duration-150 shrink-0 border select-none cursor-pointer ${
                    isSelected
                      ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-semibold shadow-md"
                      : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] hover:text-white bg-[#101010]"
                  }`}
                >
                  Sem {semNum}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search & Format Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search subjects by name or GTU code (e.g. DBMS, 3130702)..."
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-[#101010] border border-white/[0.08] text-[#E1E0CC] font-mono text-xs placeholder:text-gray-500 focus:outline-none focus:border-[#DEDBC8] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {[
              { id: "ALL", label: "All Formats" },
              { id: "NOTES", label: "Notes" },
              { id: "PYQ", label: "PYQs" },
              { id: "LAB_MANUAL", label: "Lab Manuals" },
            ].map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedFileType(type.id)}
                className={`h-11 px-4 rounded-xl font-mono text-xs transition-all duration-150 shrink-0 border cursor-pointer ${
                  selectedFileType === type.id
                    ? "border-[#DEDBC8] text-black bg-[#DEDBC8] font-medium"
                    : "border-white/[0.08] text-gray-400 hover:border-white/[0.16] bg-[#101010]"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Subject Grid */}
        <div className="flex flex-col gap-4">
          <span className="font-mono text-xs text-gray-500">
            Semester {selectedSemester} Subjects ({filteredSubjects.length} found)
          </span>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-48 rounded-2xl bg-[#101010] border border-white/[0.06] animate-pulse"
                />
              ))}
            </div>
          ) : filteredSubjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredSubjects.map((subject) => {
                const totalResources =
                  subject.units?.reduce(
                    (acc, u) => acc + (u._count?.resources || 0),
                    0,
                  ) || 0;

                return (
                  <EntryCard
                    key={subject.id}
                    title={subject.name}
                    meta={`GTU ${subject.code} • ${subject.units?.length || 5} units`}
                    tag={`GTU ${subject.code}`}
                    tagVariant="cream"
                    actionLabel="Explore Units & Notes"
                    actionHref={`/study-hub/subject/${subject.id}`}
                    activeAccent="cream"
                  >
                    <div className="flex flex-col gap-2 pt-1">
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Syllabus Breakdown:</span>
                        <span className="text-[#E1E0CC]">
                          {subject.units?.length || 5} Units
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>Study Material:</span>
                        <span className="text-[#DEDBC8]">
                          {totalResources > 0 ? `${totalResources} files ready` : "Notes available"}
                        </span>
                      </div>
                    </div>
                  </EntryCard>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl bg-[#101010] p-12 border border-white/[0.06] text-center flex flex-col items-center gap-3">
              <Layers className="h-8 w-8 text-gray-600" />
              <p className="text-sm text-gray-400">
                No subjects found for Semester {selectedSemester}.
              </p>
              <Link href="/study-hub/upload">
                <Button variant="default" size="sm" className="mt-2">
                  <Upload className="h-3.5 w-3.5" />
                  Contribute Subject Notes
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
