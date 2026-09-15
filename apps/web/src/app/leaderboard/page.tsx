"use client";

import * as React from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Trophy,
  Flame,
  Code2,
  Upload,
  Calendar,
  Plus,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
} from "lucide-react";

import { API_URL } from "@/lib/api-config";

interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  githubUsername?: string;
  solves: number;
  streakDays: number;
  uploads: number;
  badgesCount: number;
  badges: { name: string; slug: string; icon: string }[];
  totalPoints: number;
}

interface DeadlineItem {
  id: string;
  title: string;
  dueDate: string;
  subjectCode?: string;
  isCompleted: boolean;
}

interface BadgeItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  points: number;
}

export default function LeaderboardPage() {
  const { data: session } = useSession();
  const [leaderboard, setLeaderboard] = React.useState<LeaderboardEntry[]>([]);
  const [badges, setBadges] = React.useState<BadgeItem[]>([]);
  const [deadlines, setDeadlines] = React.useState<DeadlineItem[]>([]);
  const [newDeadlineTitle, setNewDeadlineTitle] = React.useState("");
  const [newDeadlineDate, setNewDeadlineDate] = React.useState("");
  const [newDeadlineSubject, setNewDeadlineSubject] = React.useState("");
  const [showAddDeadline, setShowAddDeadline] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [lbRes, badgeRes] = await Promise.all([
          fetch(`${API_URL}/gamification/leaderboard`),
          fetch(`${API_URL}/gamification/badges`),
        ]);

        if (lbRes.ok) {
          const lbData = await lbRes.json();
          setLeaderboard(lbData);
        }
        if (badgeRes.ok) {
          const badgeData = await badgeRes.json();
          setBadges(badgeData);
        }

        if ((session as any)?.token) {
          const dlRes = await fetch(`${API_URL}/gamification/deadlines`, {
            headers: {
              Authorization: `Bearer ${(session as any)?.token}`,
            },
          });
          if (dlRes.ok) {
            const dlData = await dlRes.json();
            setDeadlines(dlData);
          }
        }
      } catch (err) {
        console.error("Failed to load leaderboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [session]);

  const handleAddDeadline = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadlineTitle.trim() || !newDeadlineDate) return;

    if ((session as any)?.token) {
      try {
        const res = await fetch(`${API_URL}/gamification/deadlines`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(session as any)?.token}`,
          },
          body: JSON.stringify({
            title: newDeadlineTitle,
            dueDate: new Date(newDeadlineDate).toISOString(),
            subjectCode: newDeadlineSubject || undefined,
          }),
        });

        if (res.ok) {
          const created = await res.json();
          setDeadlines((prev) => [...prev, created]);
          setNewDeadlineTitle("");
          setNewDeadlineDate("");
          setNewDeadlineSubject("");
          setShowAddDeadline(false);
        }
      } catch (err) {
        console.error("Failed to add deadline:", err);
      }
    } else {
      // Local state fallback
      const localItem: DeadlineItem = {
        id: String(Date.now()),
        title: newDeadlineTitle,
        dueDate: new Date(newDeadlineDate).toISOString(),
        subjectCode: newDeadlineSubject || undefined,
        isCompleted: false,
      };
      setDeadlines((prev) => [...prev, localItem]);
      setNewDeadlineTitle("");
      setNewDeadlineDate("");
      setNewDeadlineSubject("");
      setShowAddDeadline(false);
    }
  };

  const handleToggleDeadline = async (id: string) => {
    setDeadlines((prev) =>
      prev.map((d) => (d.id === id ? { ...d, isCompleted: !d.isCompleted } : d)),
    );

    if ((session as any)?.token) {
      try {
        await fetch(`${API_URL}/gamification/deadlines/${id}/toggle`, {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${(session as any)?.token}`,
          },
        });
      } catch (err) {
        console.error("Failed to toggle deadline:", err);
      }
    }
  };

  return (
    <AppShell>
      <div className="flex flex-col gap-8 py-2">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
          <div>
            <span className="text-[#DEDBC8] text-[10px] font-mono uppercase tracking-[0.2em] block mb-1">
              Community Standings
            </span>
            <h1
              className="text-3xl sm:text-4xl text-white font-normal"
              style={{ fontFamily: "'Instrument Serif', serif" }}
            >
              Academic Leaderboard & Deadlines
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">
              Compete with GTU peers in DSA problem solves, maintain daily study streaks, and track exam deadlines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#DEDBC8]" />
            <span className="font-mono text-xs text-gray-400">
              Redis Sorted-Set Sync Live
            </span>
          </div>
        </div>

        {/* Top Standings Banner / 3 Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Leaderboard Table (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            <Card className="p-0 overflow-hidden border border-white/[0.08] shadow-2xl">
              {/* Table Header */}
              <div className="bg-[#161616] px-6 py-4 border-b border-white/[0.06] flex items-center justify-between font-mono text-xs text-gray-400">
                <span className="w-12 text-center">Rank</span>
                <span className="flex-1 ml-4">Student Contributor</span>
                <span className="w-20 text-center hidden sm:inline-block">Solves</span>
                <span className="w-20 text-center hidden sm:inline-block">Streak</span>
                <span className="w-24 text-right">Points</span>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-white/[0.04]">
                {loading ? (
                  <div className="p-8 text-center text-gray-500 font-mono text-xs">
                    Loading global rankings...
                  </div>
                ) : leaderboard.length > 0 ? (
                  leaderboard.map((entry) => {
                    const isTopThree = entry.rank <= 3;
                    const rankColor =
                      entry.rank === 1
                        ? "text-[#DEDBC8] font-bold"
                        : entry.rank === 2
                          ? "text-gray-300 font-semibold"
                          : entry.rank === 3
                            ? "text-amber-500 font-semibold"
                            : "text-gray-500";

                    return (
                      <div
                        key={entry.id}
                        className="px-6 py-4 flex items-center justify-between font-mono text-xs hover:bg-[#181818] transition-colors"
                      >
                        {/* Rank */}
                        <span className={`w-12 text-center text-sm ${rankColor}`}>
                          #{String(entry.rank).padStart(2, "0")}
                        </span>

                        {/* Student Details */}
                        <div className="flex-1 ml-4 flex flex-col">
                          <span className="text-[#E1E0CC] font-medium text-sm">
                            {entry.name}
                          </span>
                          <div className="flex items-center gap-2 text-gray-500 text-[11px] mt-0.5">
                            {entry.githubUsername && (
                              <span>@{entry.githubUsername}</span>
                            )}
                            {entry.badges.length > 0 && (
                              <span className="text-[#DEDBC8]">
                                &bull; {entry.badges[0].name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* DSA Solves */}
                        <div className="w-20 text-center text-gray-300 hidden sm:flex items-center justify-center gap-1">
                          <Code2 className="h-3 w-3 text-[#5EEAD4]" />
                          <span>{entry.solves}</span>
                        </div>

                        {/* Daily Streak */}
                        <div className="w-20 text-center text-gray-300 hidden sm:flex items-center justify-center gap-1">
                          <Flame className="h-3 w-3 text-amber-400" />
                          <span>{entry.streakDays}d</span>
                        </div>

                        {/* Total Points */}
                        <div className="w-24 text-right">
                          <span className="text-[#DEDBC8] font-bold text-sm">
                            {entry.totalPoints.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-gray-500 block">PTS</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-gray-500 font-mono text-xs">
                    No leaderboard activity recorded yet.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Right Column: Deadlines & Unlockable Badges (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Upcoming Deadlines Widget */}
            <Card className="p-6 sm:p-7 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-[#DEDBC8]" />
                  <h3 className="text-base font-medium text-white">
                    Upcoming Deadlines
                  </h3>
                </div>
                <button
                  onClick={() => setShowAddDeadline(!showAddDeadline)}
                  className="text-xs text-[#DEDBC8] hover:underline font-mono cursor-pointer"
                >
                  {showAddDeadline ? "Cancel" : "+ Add"}
                </button>
              </div>

              {/* Add Deadline Form */}
              {showAddDeadline && (
                <form
                  onSubmit={handleAddDeadline}
                  className="p-4 rounded-xl bg-black/60 border border-white/[0.08] flex flex-col gap-3"
                >
                  <input
                    type="text"
                    required
                    value={newDeadlineTitle}
                    onChange={(e) => setNewDeadlineTitle(e.target.value)}
                    placeholder="Exam / Assignment Title..."
                    className="h-9 px-3 rounded-lg bg-[#101010] border border-white/[0.08] text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8]"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      required
                      value={newDeadlineDate}
                      onChange={(e) => setNewDeadlineDate(e.target.value)}
                      className="h-9 px-2 rounded-lg bg-[#101010] border border-white/[0.08] text-xs font-mono text-white focus:outline-none focus:border-[#DEDBC8]"
                    />
                    <input
                      type="text"
                      value={newDeadlineSubject}
                      onChange={(e) => setNewDeadlineSubject(e.target.value)}
                      placeholder="GTU Code (3130702)"
                      className="h-9 px-2 rounded-lg bg-[#101010] border border-white/[0.08] text-xs font-mono text-white placeholder:text-gray-600 focus:outline-none focus:border-[#DEDBC8]"
                    />
                  </div>
                  <Button type="submit" variant="default" size="sm" className="h-8 text-xs">
                    Save Deadline
                  </Button>
                </form>
              )}

              {/* Deadlines List */}
              <div className="flex flex-col gap-2 pt-1">
                {deadlines.length > 0 ? (
                  deadlines.map((dl) => (
                    <div
                      key={dl.id}
                      onClick={() => handleToggleDeadline(dl.id)}
                      className="p-3.5 rounded-xl bg-black/40 border border-white/[0.06] hover:border-white/[0.12] transition-colors flex items-start gap-3 cursor-pointer group"
                    >
                      <CheckCircle2
                        className={`h-4 w-4 mt-0.5 shrink-0 ${
                          dl.isCompleted ? "text-[#DEDBC8]" : "text-gray-600 group-hover:text-gray-400"
                        }`}
                      />
                      <div className="flex-1 font-mono text-xs">
                        <span
                          className={
                            dl.isCompleted
                              ? "line-through text-gray-600"
                              : "text-[#E1E0CC] font-medium"
                          }
                        >
                          {dl.title}
                        </span>
                        <div className="flex items-center gap-2 text-gray-500 text-[11px] mt-0.5">
                          <span>{new Date(dl.dueDate).toLocaleDateString()}</span>
                          {dl.subjectCode && <span>&bull; GTU {dl.subjectCode}</span>}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500 font-mono py-2">
                    No upcoming deadlines logged. Click &ldquo;+ Add&rdquo; to track exams.
                  </p>
                )}
              </div>
            </Card>

            {/* Achievement Badges Grid */}
            <Card className="p-6 sm:p-7 flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Award className="h-4 w-4 text-[#DEDBC8]" />
                <h3 className="text-base font-medium text-white">
                  Unlockable Badges
                </h3>
              </div>

              <div className="flex flex-col gap-2.5">
                {badges.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-xl bg-black/40 border border-white/[0.06] flex items-center justify-between font-mono text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="h-7 w-7 rounded-lg bg-[#212121] border border-white/[0.08] flex items-center justify-center text-[#DEDBC8]">
                        <Award className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <span className="text-white font-medium block">
                          {b.name}
                        </span>
                        <span className="text-gray-500 text-[10px]">
                          {b.description}
                        </span>
                      </div>
                    </div>

                    <span className="text-[#DEDBC8] text-[11px] font-bold shrink-0 ml-2">
                      +{b.points} PTS
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
