"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { AppShell } from "@/components/layout/app-shell";
import { CodeEditor } from "@/components/dsa/code-editor";
import { TestResults, ExecutionResultData } from "@/components/dsa/test-results";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ArrowLeft,
  Sparkles,
  Terminal,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

interface ProblemDetail {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  timeLimit: number;
  memoryLimit: number;
  solutionTemplate: Record<string, string>;
  testCases: {
    id: string;
    input: string;
    expectedOutput: string;
    isHidden: boolean;
  }[];
}

export default function ProblemDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { data: session } = useSession();

  const [problem, setProblem] = React.useState<ProblemDetail | null>(null);
  const [language, setLanguage] = React.useState<string>("python");
  const [code, setCode] = React.useState<string>("");
  const [executionResult, setExecutionResult] = React.useState<ExecutionResultData | null>(null);
  const [isRunning, setIsRunning] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadProblem() {
      if (!slug) return;
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/dsa/problems/${slug}`);
        if (res.ok) {
          const data = await res.json();
          setProblem(data);
          const initialCode =
            data.solutionTemplate?.[language] ||
            data.solutionTemplate?.["python"] ||
            "";
          setCode(initialCode);
        }
      } catch (err) {
        console.error("Failed to load problem:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProblem();
  }, [slug]);

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    if (problem?.solutionTemplate?.[newLang]) {
      setCode(problem.solutionTemplate[newLang]);
    }
  };

  const handleRun = async () => {
    if (!problem) return;
    setIsRunning(true);
    setExecutionResult(null);

    try {
      const res = await fetch(`${API_URL}/dsa/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(session as any)?.token || ""}`,
        },
        body: JSON.stringify({
          problemSlug: problem.slug,
          language,
          code,
        }),
      });

      if (res.ok) {
        const result = await res.json();
        setExecutionResult(result);
      }
    } catch (err) {
      console.error("Execution failed:", err);
    } finally {
      setIsRunning(false);
    }
  };

  if (loading) {
    return (
      <AppShell>
        <div className="py-8 flex flex-col gap-6 animate-pulse">
          <div className="h-6 w-36 bg-[#101010] rounded" />
          <div className="h-[600px] bg-[#101010] rounded-2xl" />
        </div>
      </AppShell>
    );
  }

  if (!problem) {
    return (
      <AppShell>
        <div className="py-12 text-center flex flex-col items-center gap-4">
          <Terminal className="h-12 w-12 text-gray-600" />
          <h2 className="text-2xl font-medium text-white">Problem Not Found</h2>
          <Link href="/practice">
            <Button variant="default" size="sm">
              &larr; Back to Practice
            </Button>
          </Link>
        </div>
      </AppShell>
    );
  }

  const diffTag =
    problem.difficulty === "EASY"
      ? "text-[#DEDBC8] border-[#DEDBC8]/30 bg-[#DEDBC8]/5"
      : problem.difficulty === "MEDIUM"
        ? "text-amber-400 border-amber-400/30 bg-amber-400/5"
        : "text-red-400 border-red-400/30 bg-red-400/5";

  return (
    <AppShell>
      <div className="flex flex-col gap-6 py-2">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/practice"
            className="flex items-center gap-2 font-mono text-xs text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>&larr; Problem Catalog</span>
          </Link>

          {/* Language Selector Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#101010] rounded-full border border-white/[0.08]">
            {[
              { id: "python", label: "Python 3" },
              { id: "javascript", label: "JavaScript" },
              { id: "cpp", label: "C++ 20" },
            ].map((lang) => (
              <button
                key={lang.id}
                onClick={() => handleLanguageChange(lang.id)}
                className={`h-7 px-3.5 rounded-full font-mono text-xs transition-colors cursor-pointer ${
                  language === lang.id
                    ? "bg-[#DEDBC8] text-black font-medium"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        {/* Split IDE Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[700px]">
          {/* Left Pane: Problem Description */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <Card className="p-7 sm:p-8 flex-1 overflow-y-auto max-h-[750px]">
              <div className="flex items-center gap-2 mb-3">
                <span className={`px-2.5 py-0.5 rounded-full border font-mono text-[10px] uppercase ${diffTag}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-600">&bull;</span>
                <span className="font-mono text-xs text-gray-400 uppercase">
                  {problem.topic}
                </span>
              </div>

              <h1
                className="text-2xl sm:text-3xl text-white font-normal mb-4"
                style={{ fontFamily: "'Instrument Serif', serif" }}
              >
                {problem.title}
              </h1>

              {/* Description Body */}
              <div className="prose prose-invert max-w-none text-gray-300 text-xs sm:text-sm leading-relaxed whitespace-pre-line mb-6">
                {problem.description}
              </div>

              {/* Public Test Cases */}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/[0.06]">
                <span className="font-mono text-xs text-gray-500 uppercase tracking-wider">
                  Public Test Cases:
                </span>
                {problem.testCases.map((tc, idx) => (
                  <div
                    key={tc.id}
                    className="p-3.5 rounded-xl bg-black/60 border border-white/[0.06] font-mono text-xs flex flex-col gap-1.5"
                  >
                    <span className="text-gray-500 font-medium">Case {idx + 1}:</span>
                    <div className="text-gray-400">
                      <span className="text-gray-600">Input:</span> {tc.input}
                    </div>
                    <div className="text-[#DEDBC8]">
                      <span className="text-gray-600">Expected:</span> {tc.expectedOutput}
                    </div>
                  </div>
                ))}
              </div>

              {/* AI Hint Trigger */}
              <div className="mt-6 p-4 rounded-xl border border-white/[0.08] bg-[#161616] flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Sparkles className="h-4 w-4 text-[#DEDBC8]" />
                  <span>Need an optimal hint?</span>
                </div>
                <Link href={`/ai-assistant?hint=${problem.slug}`}>
                  <Button variant="secondary" size="sm" className="h-7 text-xs">
                    Ask AI Hint
                  </Button>
                </Link>
              </div>
            </Card>
          </div>

          {/* Right Pane: Code Editor + Test Execution Results */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            <div className="flex-1 min-h-[420px]">
              <CodeEditor
                language={language}
                code={code}
                onChange={(val) => setCode(val || "")}
                onRun={handleRun}
                onReset={() => {
                  if (problem.solutionTemplate?.[language]) {
                    setCode(problem.solutionTemplate[language]);
                  }
                }}
                isRunning={isRunning}
              />
            </div>

            <TestResults result={executionResult} isRunning={isRunning} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
