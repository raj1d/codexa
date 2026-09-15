"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  CheckCircle2,
  Flame,
  Code2,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface SubjectSummary {
  id: string;
  code: string;
  name: string;
  total: number;
  completed: number;
  percentage: number;
  units: {
    id: string;
    number: number;
    name: string;
    total: number;
    completed: number;
    percentage: number;
  }[];
}

interface DashboardData {
  semester: { id: string; number: number; name: string };
  stats: {
    overallPercentage: number;
    totalResources: number;
    completedResources: number;
    remainingResources: number;
  };
  subjects: SubjectSummary[];
  recentActivity: {
    id: string;
    completedAt: string;
    resourceId: string;
    title: string;
    fileType: string;
    subjectName: string;
    unitNumber: number;
  }[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [semesterNumber, setSemesterNumber] = React.useState(3);
  const [data, setData] = React.useState<DashboardData | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      try {
        const res = await fetch(
          `${API_URL}/dashboard/summary?semester=${semesterNumber}`,
          {
            headers: {
              Authorization: `Bearer ${(session as any)?.token || ""}`,
            },
          },
        );

        if (res.ok) {
          const summaryData = await res.json();
          setData(summaryData);
        } else {
          // Preview fallback
          setData({
            semester: {
              id: "sem-3",
              number: 3,
              name: "Semester 3 — Core CS Fundamentals",
            },
            stats: {
              overallPercentage: 65,
              totalResources: 20,
              completedResources: 13,
              remainingResources: 7,
            },
            subjects: [
              {
                id: "sub-1",
                code: "3130702",
                name: "Data Structures",
                total: 10,
                completed: 8,
                percentage: 80,
                units: [
                  { id: "u1", number: 1, name: "Arrays & Linked Lists", total: 2, completed: 2, percentage: 100 },
                  { id: "u2", number: 2, name: "Stacks and Queues", total: 2, completed: 2, percentage: 100 },
                  { id: "u3", number: 3, name: "Trees & BST", total: 2, completed: 2, percentage: 100 },
                  { id: "u4", number: 4, name: "Graphs & Traversals", total: 2, completed: 1, percentage: 50 },
                  { id: "u5", number: 5, name: "Hashing & Sorting", total: 2, completed: 1, percentage: 50 },
                ],
              },
              {
                id: "sub-2",
                code: "3130703",
                name: "Database Management Systems",
                total: 10,
                completed: 5,
                percentage: 50,
                units: [
                  { id: "u1", number: 1, name: "Database Architecture & ER", total: 2, completed: 2, percentage: 100 },
                  { id: "u2", number: 2, name: "Relational Algebra & SQL", total: 2, completed: 2, percentage: 100 },
                  { id: "u3", number: 3, name: "Normalization (1NF-BCNF)", total: 2, completed: 1, percentage: 50 },
                  { id: "u4", number: 4, name: "Transactions & Concurrency", total: 2, completed: 0, percentage: 0 },
                  { id: "u5", number: 5, name: "Indexing & Hashing", total: 2, completed: 0, percentage: 0 },
                ],
              },
            ],
            recentActivity: [
              {
                id: "a1",
                completedAt: new Date().toISOString(),
                resourceId: "r1",
                title: "Data Structures — Unit 3 Trees Lecture Notes",
                fileType: "NOTES",
                subjectName: "Data Structures",
                unitNumber: 3,
              },
            ],
          });
        }
      } catch (err) {
        console.error("Dashboard load failed:", err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboard();
  }, [session, semesterNumber]);

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-[#DEDBC8] text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">
              Personal Study Record
            </span>
            <h1
              className="text-3xl sm:text-4xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Student Progress Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Track syllabus completion, studied units, and remaining exam preparation.
            </p>
          </div>

          {/* Semester Selector */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101010] rounded-full border border-white/[0.08]">
            {[3, 4, 5, 6].map((num) => (
              <button
                key={num}
                onClick={() => setSemesterNumber(num)}
                className={`h-8 px-3.5 rounded-full font-mono text-xs transition-colors cursor-pointer ${
                  semesterNumber === num
                    ? "bg-[#DEDBC8] text-black font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Sem {num}
              </button>
            ))}
          </div>
        </div>

        {/* 4-Stat Indicator Cards */}
        {data && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <Card className="p-6 bg-[#101010] flex flex-col justify-between">
              <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider">
                Syllabus Done
              </span>
              <div className="my-3">
                <span className="font-mono text-3xl font-bold text-[#DEDBC8]">
                  {data.stats.overallPercentage}%
                </span>
              </div>
              <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#DEDBC8] transition-all duration-300"
                  style={{ width: `${data.stats.overallPercentage}%` }}
                />
              </div>
            </Card>

            {/* Stat 2 */}
            <Card className="p-6 bg-[#101010] flex flex-col justify-between">
              <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider">
                Units Studied
              </span>
              <div className="my-3">
                <span className="font-mono text-3xl font-bold text-white">
                  {data.stats.completedResources}
                  <span className="text-sm font-normal text-gray-500 ml-1">
                    / {data.stats.totalResources}
                  </span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-gray-400">
                {data.stats.remainingResources} units remaining
              </span>
            </Card>

            {/* Stat 3 */}
            <Card className="p-6 bg-[#101010] flex flex-col justify-between">
              <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-amber-400" />
                Active Streak
              </span>
              <div className="my-3">
                <span className="font-mono text-3xl font-bold text-amber-400">
                  4 <span className="text-sm font-normal text-gray-500">Days</span>
                </span>
              </div>
              <span className="font-mono text-[11px] text-amber-400/80">
                &bull; Active today
              </span>
            </Card>

            {/* Stat 4 */}
            <Card className="p-6 bg-[#101010] flex flex-col justify-between">
              <span className="font-mono text-[11px] text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Code2 className="h-3.5 w-3.5 text-[#5EEAD4]" />
                DSA Solves
              </span>
              <div className="my-3">
                <span className="font-mono text-3xl font-bold text-[#5EEAD4]">
                  12 <span className="text-sm font-normal text-gray-500">Problems</span>
                </span>
              </div>
              <Link
                href="/practice"
                className="font-mono text-[11px] text-[#5EEAD4] hover:underline"
              >
                Open Sandbox &rarr;
              </Link>
            </Card>
          </div>
        )}

        {/* Subject Progress Cards */}
        {data && (
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-medium text-white">
              Subject Progress &bull; Semester {data.semester.number}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.subjects.map((sub) => (
                <Card
                  key={sub.id}
                  className="p-7 bg-[#101010] flex flex-col justify-between gap-6"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="font-mono text-xs text-[#DEDBC8]">
                          GTU {sub.code}
                        </span>
                        <h3 className="text-lg font-medium text-white mt-0.5">
                          {sub.name}
                        </h3>
                      </div>
                      <span className="font-mono text-sm font-bold text-[#DEDBC8]">
                        {sub.percentage}%
                      </span>
                    </div>

                    <div className="w-full h-1 bg-black rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#DEDBC8] transition-all duration-300"
                        style={{ width: `${sub.percentage}%` }}
                      />
                    </div>

                    <div className="flex flex-col gap-1.5 pt-2">
                      {sub.units.map((u) => (
                        <div
                          key={u.id}
                          className="flex items-center justify-between font-mono text-xs text-gray-400 py-1 border-b border-white/[0.03] last:border-none"
                        >
                          <span className="truncate max-w-[240px]">
                            Unit {u.number}: {u.name}
                          </span>
                          <span
                            className={
                              u.completed > 0
                                ? "text-[#DEDBC8] font-medium"
                                : "text-gray-600"
                            }
                          >
                            {u.completed > 0 ? "Done" : "Pending"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={`/study-hub/subject/${sub.id}`}>
                    <Button variant="secondary" size="sm" className="w-full text-xs">
                      <BookOpen className="h-3.5 w-3.5" />
                      Continue Subject Study
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
