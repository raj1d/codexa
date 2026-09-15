"use client";

import * as React from "react";
import { CheckCircle2, XCircle, Terminal, Clock, Cpu } from "lucide-react";

export interface TestCaseResult {
  index: number;
  input: string;
  expected: string;
  actual: string;
  passed: boolean;
  isHidden: boolean;
  runtimeMs: number;
  error?: string;
}

export interface ExecutionResultData {
  status: "PASSED" | "FAILED" | "COMPILATION_ERROR" | "TIMEOUT";
  passedTestCases: number;
  totalTestCases: number;
  runtimeMs: number;
  testCaseResults: TestCaseResult[];
  terminalLog: string;
}

interface TestResultsProps {
  result: ExecutionResultData | null;
  isRunning?: boolean;
}

export function TestResults({ result, isRunning = false }: TestResultsProps) {
  const [selectedCaseIndex, setSelectedCaseIndex] = React.useState<number>(0);

  if (isRunning) {
    return (
      <div className="rounded-lg bg-bg-surface border border-[rgba(255,255,255,0.08)] p-6 font-mono text-xs text-text-muted flex items-center justify-center gap-3 min-h-[160px]">
        <div className="h-4 w-4 border-2 border-accent-phosphor border-t-transparent rounded-full animate-spin" />
        <span>Executing hidden test cases in sandbox...</span>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="rounded-lg bg-bg-surface border border-[rgba(255,255,255,0.08)] p-6 font-mono text-xs text-text-dim flex items-center justify-center gap-2 min-h-[160px]">
        <Terminal className="h-4 w-4" />
        <span>Click &ldquo;Run & Test Code&rdquo; to execute your solution against test cases.</span>
      </div>
    );
  }

  const isPassed = result.status === "PASSED";
  const activeCase = result.testCaseResults[selectedCaseIndex] || result.testCaseResults[0];

  return (
    <div className="rounded-lg bg-bg-surface border border-[rgba(255,255,255,0.08)] overflow-hidden flex flex-col">
      {/* Header Bar */}
      <div className="h-10 bg-bg-surface-raised px-4 border-b border-[rgba(255,255,255,0.08)] flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          {isPassed ? (
            <CheckCircle2 className="h-4 w-4 text-accent-phosphor" />
          ) : (
            <XCircle className="h-4 w-4 text-accent-alert" />
          )}
          <span
            className={`font-bold ${
              isPassed ? "text-accent-phosphor" : "text-accent-alert"
            }`}
          >
            {isPassed ? "ACCEPTED" : "WRONG ANSWER"}
          </span>
          <span className="text-text-dim">&bull;</span>
          <span className="text-text-muted">
            {result.passedTestCases} / {result.totalTestCases} Test Cases Passed
          </span>
        </div>

        <div className="flex items-center gap-3 text-text-dim text-[11px]">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3 text-accent-phosphor/70" />
            {result.runtimeMs} ms
          </span>
        </div>
      </div>

      {/* Test Case Selection Tabs */}
      {result.testCaseResults.length > 0 && (
        <div className="flex items-center gap-1 px-4 py-2 bg-bg-void/40 border-b border-[rgba(255,255,255,0.04)] overflow-x-auto">
          {result.testCaseResults.map((tc, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCaseIndex(idx)}
              className={`h-7 px-3 rounded font-mono text-xs flex items-center gap-1.5 transition-colors border select-none ${
                selectedCaseIndex === idx
                  ? tc.passed
                    ? "border-accent-phosphor/40 bg-accent-phosphor/10 text-accent-phosphor font-medium"
                    : "border-accent-alert/40 bg-accent-alert/10 text-accent-alert font-medium"
                  : "border-transparent text-text-dim hover:text-text-muted hover:bg-bg-surface"
              }`}
            >
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  tc.passed ? "bg-accent-phosphor" : "bg-accent-alert"
                }`}
              />
              <span>Case {idx + 1}</span>
            </button>
          ))}
        </div>
      )}

      {/* Active Test Case Details */}
      {activeCase && (
        <div className="p-4 font-mono text-xs flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <span className="text-text-dim">Input:</span>
            <div className="p-2.5 rounded bg-bg-void/80 border border-[rgba(255,255,255,0.06)] text-text-primary">
              {activeCase.input}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <span className="text-text-dim">Expected Output:</span>
              <div className="p-2.5 rounded bg-bg-void/80 border border-[rgba(255,255,255,0.06)] text-accent-phosphor">
                {activeCase.expected}
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-text-dim">Actual Output:</span>
              <div
                className={`p-2.5 rounded bg-bg-void/80 border border-[rgba(255,255,255,0.06)] ${
                  activeCase.passed ? "text-accent-phosphor" : "text-accent-alert"
                }`}
              >
                {activeCase.actual}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Raw Terminal Execution Log */}
      <div className="p-4 border-t border-[rgba(255,255,255,0.06)] bg-bg-void/60 font-mono text-xs text-text-muted">
        <span className="text-text-dim text-[11px] block mb-1">Terminal Output:</span>
        <pre className="whitespace-pre-wrap leading-relaxed text-text-primary">
          {result.terminalLog}
        </pre>
      </div>
    </div>
  );
}
